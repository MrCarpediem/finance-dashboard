import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Mail, ArrowRight, User } from 'lucide-react'
import toast from 'react-hot-toast'
import { register } from '../api/auth.api'

export default function Register() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handle = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setLoading(true)
    setError(null)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      toast.success('Registration successful! Please sign in.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
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
        top: -200, left: -200, pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(14,165,233,0.1), transparent)',
        bottom: -100, right: -100, pointerEvents: 'none',
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
          Create a new account to get started
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
              <User size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Full Name
            </label>
            <input
              className="input-field"
              type="text"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
              placeholder="John Doe"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="input-label">
              <Mail size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Email Address
            </label>
            <input
              className="input-field"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              placeholder="you@company.com"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="input-label">
              <Lock size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Password
            </label>
            <input
              className="input-field"
              type="password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              placeholder="••••••••"
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label className="input-label">
              <Lock size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Confirm Password
            </label>
            <input
              className="input-field"
              type="password"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
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
                Creating Account...
              </>
            ) : (
              <>Sign Up <ArrowRight size={18} /></>
            )}
          </motion.button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--brand-primary)', fontWeight: 600, textDecoration: 'none' }}>
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
