import { NavLink, useLocation } from 'react-router-dom'
import { useRole } from '../../hooks/useRole'
import { LayoutDashboard, CreditCard, Users, Settings, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function Sidebar() {
  const { isAdmin, canAnalyze } = useRole()
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  const links = [
    { to: '/',             label: 'Dashboard',    icon: LayoutDashboard, show: canAnalyze },
    { to: '/transactions', label: 'Transactions', icon: CreditCard,      show: true },
    { to: '/users',        label: 'Users',        icon: Users,           show: isAdmin },
    { to: '/settings',     label: 'Settings',     icon: Settings,        show: true },
  ]

  const sidebarWidth = collapsed ? 'var(--sidebar-collapsed-w)' : 'var(--sidebar-w)'

  return (
    <aside
      id="app-sidebar"
      style={{
        width: sidebarWidth,
        minHeight: '100vh',
        background: 'var(--bg-panel)',
        borderRight: '1px solid var(--border)',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width var(--transition-normal)',
        zIndex: 200,
        overflow: 'hidden',
      }}
    >
      {/* Brand Header */}
      <div style={{
        height: 'var(--nav-h)',
        display: 'flex',
        alignItems: 'center',
        padding: collapsed ? '0 20px' : '0 20px',
        borderBottom: '1px solid var(--border)',
        gap: 12,
        justifyContent: collapsed ? 'center' : 'flex-start',
      }}>
        <motion.div
          whileHover={{ rotate: 8, scale: 1.05 }}
          style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'var(--brand-gradient)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 24px rgba(99, 102, 241, 0.35)',
            flexShrink: 0,
          }}
        >
          <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, lineHeight: 1 }}>Z</span>
        </motion.div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              <span style={{
                fontWeight: 700, fontSize: 20, color: 'var(--text-primary)',
                fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em',
              }}>
                FinancePro
              </span>
              <span style={{
                display: 'block', fontSize: 10, color: 'var(--text-dim)',
                fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase',
                marginTop: -2,
              }}>
                Finance Platform
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div style={{ padding: collapsed ? '20px 12px' : '20px 14px', flex: 1 }}>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{
                fontSize: 11, fontWeight: 600, color: 'var(--text-dim)',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                paddingLeft: 12, marginBottom: 12,
              }}
            >
              Navigation
            </motion.div>
          )}
        </AnimatePresence>

        {links.filter(l => l.show).map(link => {
          const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to))
          const isExactDash = link.to === '/' && location.pathname === '/'

          const active = link.to === '/' ? isExactDash : isActive

          return (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}>
              <motion.div
                whileHover={{ x: collapsed ? 0 : 2 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: collapsed ? '12px 0' : '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: 4,
                  color: active ? '#fff' : 'var(--text-muted)',
                  background: active
                    ? 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))'
                    : 'transparent',
                  fontWeight: active ? 600 : 500,
                  fontSize: 13.5,
                  transition: 'all var(--transition-fast)',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  boxShadow: active ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none',
                  position: 'relative',
                  gap: 14,
                }}
              >
                <link.icon size={20} style={{ opacity: active ? 1 : 0.6, flexShrink: 0 }} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      {link.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </NavLink>
          )
        })}
      </div>

      {/* Collapse Toggle */}
      <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)' }}>
        <motion.button
          whileHover={{ background: 'var(--bg-panel-hover)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCollapsed(!collapsed)}
          id="sidebar-collapse-btn"
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: 'var(--radius-md)',
            background: 'transparent',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 12,
            fontWeight: 500,
            transition: 'all var(--transition-fast)',
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /> <span>Collapse</span></>}
        </motion.button>
      </div>

      {/* Upgrade CTA */}
      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ padding: '0 14px 16px', overflow: 'hidden' }}
          >
            <div style={{
              background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(14,165,233,0.08))',
              padding: 16, borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(99,102,241,0.15)',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: -20, right: -20,
                width: 60, height: 60, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.2), transparent)',
              }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Sparkles size={14} style={{ color: 'var(--brand-primary-light)' }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                  Pro Version
                </span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 12, lineHeight: 1.5 }}>
                Unlock advanced analytics, API access & more.
              </p>
              <button style={{
                width: '100%', padding: '7px 0',
                background: 'var(--brand-gradient)',
                color: '#fff', borderRadius: 'var(--radius-sm)',
                fontSize: 12, fontWeight: 600,
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
                transition: 'all var(--transition-fast)',
              }}>
                Upgrade Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  )
}