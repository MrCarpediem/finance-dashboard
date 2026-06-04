import { useAuth } from '../../hooks/useAuth'
import { useRole } from '../../hooks/useRole'
import { LogOut, Bell, Search, Moon, Sun, Command } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { role } = useRole()
  const [searchFocused, setSearchFocused] = useState(false)

  const roleConfig = {
    ADMIN:   { bg: 'rgba(239,68,68,0.12)', color: '#f87171', label: 'Admin' },
    ANALYST: { bg: 'rgba(139,92,246,0.12)', color: '#a78bfa', label: 'Analyst' },
    VIEWER:  { bg: 'rgba(16,185,129,0.12)', color: '#34d399', label: 'Viewer' },
  }
  const rc = roleConfig[role] || roleConfig.VIEWER

  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 18 ? 'Good Afternoon' : 'Good Evening'

  return (
    <nav
      id="app-navbar"
      style={{
        height: 'var(--nav-h)',
        background: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 28px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Left: Search */}
      <motion.div
        animate={{
          width: searchFocused ? 380 : 300,
          borderColor: searchFocused ? 'var(--brand-primary)' : 'var(--border)',
          boxShadow: searchFocused ? '0 0 0 3px rgba(99, 102, 241, 0.1)' : '0 0 0 0px transparent',
        }}
        transition={{ duration: 0.2 }}
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'var(--bg-input)',
          borderRadius: 'var(--radius-md)',
          padding: '8px 14px',
          border: '1px solid var(--border)',
        }}
      >
        <Search size={15} style={{ color: searchFocused ? 'var(--brand-primary)' : 'var(--text-dim)', transition: 'color 0.2s' }} />
        <input
          id="global-search"
          placeholder="Search transactions, users..."
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          style={{
            background: 'none', border: 'none', color: 'var(--text-primary)',
            fontSize: 13, width: '100%', outline: 'none',
          }}
        />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 3,
          padding: '2px 6px', borderRadius: 'var(--radius-xs)',
          border: '1px solid var(--border)', flexShrink: 0,
        }}>
          <Command size={10} style={{ color: 'var(--text-dim)' }} />
          <span style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>K</span>
        </div>
      </motion.div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Greeting text - hidden on small screens */}
        <span style={{ fontSize: 13, color: 'var(--text-dim)', fontWeight: 400, marginRight: 4 }}>
          {greeting}
        </span>

        {/* Notification bell */}
        <motion.button
          id="notifications-btn"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: 'var(--bg-input)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            position: 'relative', border: '1px solid var(--border)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <Bell size={17} style={{ color: 'var(--text-secondary)' }} />
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 7, height: 7, background: 'var(--brand-accent)',
            borderRadius: '50%', border: '2px solid var(--bg-panel)',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
        </motion.button>

        <div style={{ width: 1, height: 24, background: 'var(--border)' }} />

        {/* User Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 'var(--radius-md)',
            background: 'var(--brand-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14, color: '#fff',
            boxShadow: '0 2px 10px rgba(99, 102, 241, 0.3)',
          }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
              {user?.name || 'User'}
            </div>
            <span className="badge" style={{
              background: rc.bg, color: rc.color,
              padding: '1px 7px', fontSize: 9,
            }}>
              {rc.label}
            </span>
          </div>
        </div>

        {/* Logout */}
        <motion.button
          id="logout-btn"
          whileHover={{ scale: 1.08, background: 'rgba(239,68,68,0.15)' }}
          whileTap={{ scale: 0.92 }}
          onClick={logout}
          title="Sign out"
          style={{
            width: 36, height: 36, borderRadius: 'var(--radius-md)',
            background: 'rgba(239,68,68,0.08)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(239,68,68,0.15)',
            transition: 'all var(--transition-fast)',
          }}
        >
          <LogOut size={15} style={{ color: '#f87171' }} />
        </motion.button>
      </div>
    </nav>
  )
}