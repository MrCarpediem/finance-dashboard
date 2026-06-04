import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Bell, Shield, Palette, Save } from 'lucide-react'
import Button from '../components/ui/Button'
import { useSelector } from 'react-redux'

export default function Settings() {
  const { user } = useSelector(s => s.auth)
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-heading)', marginBottom: 4 }}>Settings</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Manage your account preferences</p>
      </div>

      <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
        {/* Sidebar */}
        <div style={{ width: 220, display: 'flex', flexDirection: 'column', gap: 8, flexShrink: 0 }}>
          {tabs.map(t => {
            const Icon = t.icon
            const active = activeTab === t.id
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px', borderRadius: 'var(--radius-md)',
                  background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
                  color: active ? 'var(--brand-primary)' : 'var(--text-secondary)',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  fontWeight: active ? 600 : 500, fontSize: 14,
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={18} /> {t.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            flex: 1, minWidth: 300, background: 'var(--bg-panel)', borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border)', padding: 32,
          }}
        >
          {activeTab === 'profile' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Profile Information</h3>
              <div style={{ display: 'grid', gap: 20, maxWidth: 480 }}>
                <div>
                  <label className="input-label">Full Name</label>
                  <input className="input-field" defaultValue={user?.name || ''} />
                </div>
                <div>
                  <label className="input-label">Email Address</label>
                  <input className="input-field" defaultValue={user?.email || ''} disabled style={{ opacity: 0.6 }} />
                </div>
                <div>
                  <label className="input-label">Role</label>
                  <input className="input-field" defaultValue={user?.role || ''} disabled style={{ opacity: 0.6 }} />
                </div>
                <div style={{ marginTop: 12 }}>
                  <Button style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Save size={16} /> Save Changes
                  </Button>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'profile' && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              <div style={{ marginBottom: 16 }}>
                 <Palette size={48} style={{ opacity: 0.2 }} />
              </div>
              <p>This section is under construction.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
