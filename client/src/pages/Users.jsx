import { useEffect, useState } from 'react'
import api from '../api/axiosInstance'
import { formatDate } from '../utils/formatCurrency'
import Table  from '../components/ui/Table'
import Button from '../components/ui/Button'

export default function Users() {
  const [users,   setUsers]   = useState([])
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

  const roleColor = { ADMIN: '#dc2626', ANALYST: '#7c3aed', VIEWER: '#16a34a' }

  const columns = [
    { key: 'name',      label: 'Name' },
    { key: 'email',     label: 'Email', render: (v) => <span style={{ color: '#64748b' }}>{v}</span> },
    { key: 'role',      label: 'Role',  render: (v, row) => (
      <select value={v} onChange={e => changeRole(row.id, e.target.value)}
        style={{ padding: '3px 8px', borderRadius: 6, border: '1px solid #e2e8f0',
          color: roleColor[v], fontWeight: 600, fontSize: 12 }}>
        <option value="ADMIN">ADMIN</option>
        <option value="ANALYST">ANALYST</option>
        <option value="VIEWER">VIEWER</option>
      </select>
    )},
    { key: 'status',    label: 'Status', render: (v, row) => (
      <button onClick={() => toggleStatus(row.id, v)} style={{
        padding: '3px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600, border: 'none', cursor: 'pointer',
        background: v === 'ACTIVE' ? '#dcfce7' : '#fee2e2',
        color:      v === 'ACTIVE' ? '#16a34a' : '#dc2626',
      }}>{v}</button>
    )},
    { key: 'createdAt', label: 'Joined', render: (v) => formatDate(v) },
  ]

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>User Management</h2>
      <div style={{ background: '#fff', borderRadius: 12, overflow: 'hidden' }}>
        <Table columns={columns} data={users} loading={loading} />
      </div>
    </div>
  )
}