import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { fetchTransactions, addTransaction, updateTransaction, removeTransaction } from '../store/transactionSlice'
import { useRole } from '../hooks/useRole'
import { formatCurrency, formatDate } from '../utils/formatCurrency'
import Table from '../components/ui/Table'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import { Plus, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY = { amount: '', type: 'income', category: '', date: '', notes: '' }

export default function Transactions() {
  const dispatch = useDispatch()
  const { list, loading, meta } = useSelector(s => s.transaction)
  const { canWrite } = useRole()
  const [filters, setFilters] = useState({ type: '', category: '', date_from: '', date_to: '', page: 1, limit: 10 })
  const [modal, setModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
    dispatch(fetchTransactions(params))
  }, [filters])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = { ...form, amount: parseFloat(form.amount) }
    const action = editId ? updateTransaction({ id: editId, data: payload }) : addTransaction(payload)
    const res = await dispatch(action)
    setSaving(false)
    if (res.meta.requestStatus === 'fulfilled') {
      setModal(false); setForm(EMPTY); setErrors({}); setEditId(null)
      toast.success(editId ? 'Transaction updated' : 'Transaction added')
    } else {
      setErrors(res.payload?.errors || { general: res.payload?.message })
    }
  }

  const handleEdit = (row) => {
    setEditId(row.id)
    setForm({
      amount: row.amount,
      type: row.type,
      category: row.category,
      date: row.date.split('T')[0],
      notes: row.notes || ''
    })
    setModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this transaction?')) {
      await dispatch(removeTransaction(id))
      toast.success('Transaction deleted')
    }
  }

  const columns = [
    { key: 'date', label: 'Date', render: (v) => <span style={{ fontWeight: 500 }}>{formatDate(v)}</span> },
    { key: 'type', label: 'Type', render: (v) => (
      <span style={{
        padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.05em',
        background: v === 'income' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
        color: v === 'income' ? '#10b981' : '#ef4444',
      }}>{v}</span>
    )},
    { key: 'category', label: 'Category', render: (v) => <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{v}</span> },
    { key: 'amount', label: 'Amount', render: (v, row) => (
      <span style={{ fontWeight: 700, color: row.type === 'income' ? '#10b981' : '#ef4444' }}>
        {row.type === 'income' ? '+' : '-'}{formatCurrency(v)}
      </span>
    )},
    { key: 'notes', label: 'Notes', render: (v) => <span style={{ color: 'var(--text-muted)' }}>{v || '—'}</span> },
    ...(canWrite ? [{
      key: 'id', label: 'Action',
      render: (id, row) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="outline" size="sm" onClick={() => handleEdit(row)}>Edit</Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(id)}>Delete</Button>
        </div>
      )
    }] : []),
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: 4 }}>Transactions</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Manage your income and expenses</p>
        </div>
        {canWrite && (
          <Button onClick={() => { setEditId(null); setForm(EMPTY); setModal(true) }} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Add Transaction
          </Button>
        )}
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
        background: 'var(--bg-panel)', borderRadius: 'var(--radius-lg)', padding: 20, marginBottom: 20,
        display: 'flex', gap: 12, alignItems: 'center', border: '1px solid var(--border)', flexWrap: 'wrap',
      }}>
        <Filter size={16} style={{ color: 'var(--text-muted)' }} />
        <select className="input-field" style={{ width: 140 }} value={filters.type}
          onChange={e => setFilters({ ...filters, type: e.target.value, page: 1 })}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input className="input-field" style={{ width: 160 }} placeholder="Filter by category"
          value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value, page: 1 })} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input className="input-field" type="date" style={{ width: 140 }}
            value={filters.date_from} onChange={e => setFilters({ ...filters, date_from: e.target.value, page: 1 })} />
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>to</span>
          <input className="input-field" type="date" style={{ width: 140 }}
            value={filters.date_to} onChange={e => setFilters({ ...filters, date_to: e.target.value, page: 1 })} />
        </div>
        {(filters.type || filters.category || filters.date_from || filters.date_to) && (
          <Button variant="ghost" size="sm" onClick={() => setFilters({ type: '', category: '', date_from: '', date_to: '', page: 1, limit: 10 })}>
            <X size={14} /> Clear
          </Button>
        )}
      </motion.div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{
        background: 'var(--bg-panel)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border)',
      }}>
        <Table columns={columns} data={list} loading={loading} />
        {meta?.total_pages > 1 && (
          <div style={{ padding: '16px 20px', display: 'flex', gap: 8, justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
            <Button variant="outline" size="sm" disabled={filters.page <= 1}
              onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}><ChevronLeft size={14} /> Prev</Button>
            <span style={{ padding: '6px 14px', fontSize: 13, color: 'var(--text-secondary)' }}>
              Page {filters.page} of {meta.total_pages}
            </span>
            <Button variant="outline" size="sm" disabled={filters.page >= meta.total_pages}
              onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>Next <ChevronRight size={14} /></Button>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal open={modal} onClose={() => { setModal(false); setErrors({}); setEditId(null); setForm(EMPTY) }} title={editId ? "Edit Transaction" : "Add Transaction"}>
        {errors.general && <div style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12, padding: '8px 12px', background: 'var(--danger-bg)', borderRadius: 'var(--radius-sm)' }}>{errors.general}</div>}
        <form onSubmit={submit}>
          {[
            { label: 'Amount', key: 'amount', type: 'number' },
            { label: 'Category', key: 'category', type: 'text' },
            { label: 'Date', key: 'date', type: 'date' },
            { label: 'Notes', key: 'notes', type: 'text' },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 16 }}>
              <label className="input-label">{f.label}</label>
              <input className="input-field" type={f.type} value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
              {errors[f.key] && <span style={{ color: 'var(--danger)', fontSize: 11 }}>{errors[f.key][0]}</span>}
            </div>
          ))}
          <div style={{ marginBottom: 24 }}>
            <label className="input-label">Type</label>
            <select className="input-field" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <Button style={{ width: '100%' }} disabled={saving}>{saving ? 'Saving...' : (editId ? 'Update Transaction' : 'Add Transaction')}</Button>
        </form>
      </Modal>
    </div>
  )
}