import { NavLink } from 'react-router-dom'
import { useRole } from '../../hooks/useRole'

export default function Sidebar() {
  const { isAdmin, canAnalyze } = useRole()

  const links = [
    { to: '/',             label: '📊 Dashboard',    show: canAnalyze },
    { to: '/transactions', label: '💳 Transactions',  show: true },
    { to: '/users',        label: '👥 Users',         show: isAdmin },
  ]

  return (
    <aside style={{
      width: 220, minHeight: '100vh', background: '#1e293b',
      padding: '24px 0', position: 'fixed', top: 56, left: 0
    }}>
      {links.filter(l => l.show).map(link => (
        <NavLink key={link.to} to={link.to} end={link.to === '/'} style={({ isActive }) => ({
          display: 'block', padding: '11px 24px', fontSize: 14,
          color: isActive ? '#fff' : '#94a3b8',
          background: isActive ? '#2563eb' : 'transparent',
          borderLeft: isActive ? '3px solid #60a5fa' : '3px solid transparent',
          transition: 'all .15s',
        })}>
          {link.label}
        </NavLink>
      ))}
    </aside>
  )
}