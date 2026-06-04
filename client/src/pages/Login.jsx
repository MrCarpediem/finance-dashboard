import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { loginUser } from '../store/authSlice'
import { useAuth } from '../hooks/useAuth'
import { Lock, Mail, ArrowRight, Shield } from 'lucide-react'

export default function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useAuth()
  const [email, setEmail] = useState('admin@finance.com')
  const [password, setPassword] = useState('')

  const handle = async (e) => {
    e.preventDefault()
    const res = await dispatch(loginUser({ email, password }))
    if (res.meta.requestStatus === 'fulfilled') navigate('/transactions')
  }

  return (
    <div className="auth-bg" style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, position: 'relative', overflow: 'hidden',
    }}>
      {/* Background decorations */}
      <div style={{
        position: 'absolute', width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.15), transparent)',
        top: -200, right: -200, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,165,233,0.1), transparent)',
        bottom: -100, left: -100, pointerEvents: 'none',
      }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          padding: 44, borderRadius: 24, width: 440,
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          border: '1px solid rgba(255,255,255,0.06)',
          position: 'relative', zIndex: 1,
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)',
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 20 }}>F</span>
          </div>
          <span style={{
            fontWeight: 700, fontSize: 24, color: '#fff',
            fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em',
          }}>
            FinancePro
          </span>
        </div>

        <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 14, lineHeight: 1.6 }}>
          Enterprise Finance Platform — Sign in to continue
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: 'var(--danger-bg)', color: 'var(--danger)',
              padding: '10px 14px', borderRadius: 'var(--radius-sm)',
              marginBottom: 16, fontSize: 13, border: '1px solid rgba(239,68,68,0.3)',
            }}
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handle}>
          <div style={{ marginBottom: 20 }}>
            <label className="input-label">
              <Mail size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Email Address
            </label>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="you@company.com"
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label className="input-label">
              <Lock size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Password
            </label>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px', borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))',
              color: '#fff', fontSize: 15, fontWeight: 600, border: 'none',
              cursor: loading ? 'wait' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)',
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                Authenticating...
              </>
            ) : (
              <>Sign In <ArrowRight size={18} /></>
            )}
          </motion.button>
        </form>

        {/* Demo credentials */}
        <div style={{
          marginTop: 24, padding: 16,
          background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <Shield size={14} style={{ color: 'var(--brand-primary)' }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)' }}>Demo Credentials</span>
          </div>
          <div style={{ display: 'grid', gap: 4, fontSize: 12, color: 'var(--text-muted)' }}>
            <span><b style={{ color: '#f87171' }}>Admin:</b> admin@finance.com</span>
            <span><b style={{ color: '#a78bfa' }}>Analyst:</b> analyst@finance.com</span>
            <span><b style={{ color: '#34d399' }}>Viewer:</b> viewer@finance.com</span>
            <span style={{ marginTop: 4 }}><b style={{ color: 'var(--text-secondary)' }}>Password:</b> Admin@123</span>
          </div>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--brand-primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}