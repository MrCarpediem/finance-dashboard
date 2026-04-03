import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTransactions, addTransaction, removeTransaction } from '../store/transactionSlice'
import { useRole } from '../hooks/useRole'
import { formatCurrency, formatDate } from '../utils/formatCurrency'
import Table  from '../components/ui/Table'
import Button from '../components/ui/Button'
import Modal  from '../components/ui/Modal'

const EMPTY = { amount: '', type: 'income', category: '', date: '', notes: '' }

export default function Transactions() {
  const dispatch = useDispatch()
  const { list, loading, meta } = useSelector(s => s.transaction)
  const { canWrite } = useRole()

  const [filters, setFilters] = useState({ type: '', category: '', page: 1, limit: 10 })
  const [modal,   setModal]   = useState(false)
  const [form,    setForm]    = useState(EMPTY)
  const [errors,  setErrors]  = useState({})
  const [saving,  setSaving]  = useState(false)

  useEffect(() => {
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
    dispatch(fetchTransactions(params))
  }, [filters])

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const res = await dispatch(addTransaction({ ...form, amount: parseFloat(form.amount) }))
    setSaving(false)
    if (res.meta.requestStatus === 'fulfilled') { setModal(false); setForm(EMPTY); setErrors({}) }
    else setErrors(res.payload?.errors || { general: res.payload?.message })
  }

  const handleDelete = async (id) => {
    if (window.confirm('Delete this transaction?')) dispatch(removeTransaction(id))
  }

  const inp = { width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 13, marginTop: 4 }

  const columns = [
    { key: 'date',     label: 'Date',     render: (v) => formatDate(v) },
    { key: 'type',     label: 'Type',     render: (v) => (
      <span style={{ padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
        background: v === 'income' ? '#dcfce7' : '#fee2e2',
        color:      v === 'income' ? '#16a34a' : '#dc2626' }}>{v}</span>
    )},
    { key: 'category', label: 'Category', render: (v) => <span style={{ textTransform: 'capitalize' }}>{v}</span> },
    { key: 'amount',   label: 'Amount',   render: (v, row) => (
      <span style={{ fontWeight: 600, color: row.type === 'income' ? '#16a34a' : '#dc2626' }}>
        {row.type === 'income' ? '+' : '-'}{formatCurrency(v)}
      </span>
    )},
    { key: 'notes',    label: 'Notes',    render: (v) => v || '—' },
    ...(canWrite ? [{
      key: 'id', label: 'Action',
      render: (id) => <Button variant="danger" size="sm" onClick={() => handleDelete(id)}>Delete</Button>
    }] : []),
  ]

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>Transactions</h2>
        {canWrite && <Button onClick={() => setModal(true)}>+ Add Transaction</Button>}
      </div>

      {/* Filters */}
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <select style={inp} value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value, page: 1 })}>
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input style={inp} placeholder="Filter by category" value={filters.category}
          onChange={e => setFilters({ ...filters, category: e.target.value, page: 1 })} />
        <Button variant="outline" size="sm" onClick={() => setFilters({ type: '', category: '', page: 1, limit: 10 })}>
          Clear
        </Button>
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
        <Table columns={columns} data={list} loading={loading} />
        {meta?.total_pages > 1 && (
          <div style={{ padding: '12px 16px', display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <Button variant="outline" size="sm" disabled={filters.page <= 1}
              onClick={() => setFilters(f => ({ ...f, page: f.page - 1 }))}>Prev</Button>
            <span style={{ padding: '6px 12px', fontSize: 13 }}>Page {filters.page} of {meta.total_pages}</span>
            <Button variant="outline" size="sm" disabled={filters.page >= meta.total_pages}
              onClick={() => setFilters(f => ({ ...f, page: f.page + 1 }))}>Next</Button>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal open={modal} onClose={() => { setModal(false); setErrors({}) }} title="Add Transaction">
        {errors.general && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 12 }}>{errors.general}</div>}
        <form onSubmit={submit}>
          {[
            { label: 'Amount',   key: 'amount',   type: 'number' },
            { label: 'Category', key: 'category', type: 'text'   },
            { label: 'Date',     key: 'date',     type: 'date'   },
            { label: 'Notes',    key: 'notes',    type: 'text'   },
          ].map(f => (
            <div key={f.key} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 500 }}>{f.label}</label>
              <input style={inp} type={f.type} value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
              {errors[f.key] && <span style={{ color: '#dc2626', fontSize: 11 }}>{errors[f.key][0]}</span>}
            </div>
          ))}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Type</label>
            <select style={inp} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <Button style={{ width: '100%' }} disabled={saving}>{saving ? 'Saving...' : 'Add Transaction'}</Button>
        </form>
      </Modal>
    </div>
  )
}