import { useAuth } from '../../hooks/useAuth'
import { useRole } from '../../hooks/useRole'
import Button from '../ui/Button'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { role } = useRole()

  const roleColor = { ADMIN: '#dc2626', ANALYST: '#7c3aed', VIEWER: '#16a34a' }

  return (
    <nav style={{
      height: 56, background: '#fff', borderBottom: '1px solid #e2e8f0',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', position: 'sticky', top: 0, zIndex: 100
    }}>
      <span style={{ fontWeight: 700, fontSize: 16, color: '#2563eb' }}>Finance Dashboard</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ color: '#64748b' }}>{user?.name}</span>
        <span style={{
          padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
          background: roleColor[role] + '18', color: roleColor[role]
        }}>{role}</span>
        <Button variant="ghost" size="sm" onClick={logout}>Logout</Button>
      </div>
    </nav>
  )
}