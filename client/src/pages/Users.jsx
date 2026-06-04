import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../api/axiosInstance'
import { formatDate } from '../utils/formatCurrency'
import Table from '../components/ui/Table'
import { Users as UsersIcon, ShieldCheck } from 'lucide-react'

export default function Users() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get('/users').then(r => { setUsers(r.data.data); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  const toggleStatus = async (id, status) => {
    await api.patch(`/users/${id}/status`, { status: status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })
    load()
  }

  const changeRole = async (id, role) => {
    await api.patch(`/users/${id}/role`, { role })
    load()
  }

  const roleConfig = {
    ADMIN:   { bg: 'rgba(239,68,68,0.12)', color: '#f87171' },
    ANALYST: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa' },
    VIEWER:  { bg: 'rgba(16,185,129,0.12)', color: '#34d399' },
  }

  const columns = [
    { key: 'name', label: 'Name', render: (v) => <span style={{ fontWeight: 600 }}>{v}</span> },
    { key: 'email', label: 'Email', render: (v) => <span style={{ color: 'var(--text-muted)' }}>{v}</span> },
    { key: 'role', label: 'Role', render: (v, row) => (
      <select value={v} onChange={e => changeRole(row.id, e.target.value)}
        style={{
          padding: '4px 10px', borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border)', background: roleConfig[v]?.bg || 'transparent',
          color: roleConfig[v]?.color || 'var(--text-secondary)',
          fontWeight: 700, fontSize: 11, cursor: 'pointer', textTransform: 'uppercase',
        }}>
        <option value="ADMIN">ADMIN</option>
        <option value="ANALYST">ANALYST</option>
        <option value="VIEWER">VIEWER</option>
      </select>
    )},
    { key: 'status', label: 'Status', render: (v, row) => (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => toggleStatus(row.id, v)}
        style={{
          padding: '4px 14px', borderRadius: 'var(--radius-full)', fontSize: 11, fontWeight: 700,
          border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.05em',
          background: v === 'ACTIVE' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
          color: v === 'ACTIVE' ? '#10b981' : '#ef4444',
        }}
      >{v}</motion.button>
    )},
    { key: 'createdAt', label: 'Joined', render: (v) => <span style={{ color: 'var(--text-muted)' }}>{formatDate(v)}</span> },
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 'var(--radius-md)',
          background: 'rgba(99,102,241,0.12)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <ShieldCheck size={22} style={{ color: '#6366f1' }} />
        </div>
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: 2 }}>User Management</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Manage roles and access control</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'var(--bg-panel)', borderRadius: 'var(--radius-lg)',
          overflow: 'hidden', border: '1px solid var(--border)',
        }}
      >
        <Table columns={columns} data={users} loading={loading} />
      </motion.div>
    </div>
  )
}