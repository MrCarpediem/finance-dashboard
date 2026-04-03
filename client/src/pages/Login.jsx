import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../store/authSlice'
import { useAuth } from '../hooks/useAuth'

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

  const inp = {
    width: '100%', padding: '10px 14px', borderRadius: 8,
    border: '1px solid #e2e8f0', fontSize: 14, marginTop: 6
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
      <div style={{ background: '#fff', padding: 40, borderRadius: 16, width: 380, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
        <h2 style={{ marginBottom: 8, fontSize: 22, fontWeight: 700 }}>Finance Dashboard</h2>
        <p style={{ color: '#64748b', marginBottom: 28, fontSize: 13 }}>Sign in to your account</p>

        {error && (
          <div style={{ background: '#fef2f2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
            {error}
          </div>
        )}

        <form onSubmit={handle}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Email</label>
            <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Password</label>
            <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '10px', borderRadius: 8,
            background: '#2563eb', color: '#fff', fontSize: 14,
            fontWeight: 500, border: 'none', cursor: 'pointer'
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ marginTop: 20, padding: 14, background: '#f8fafc', borderRadius: 8, fontSize: 12, color: '#64748b' }}>
          <div><b>Admin:</b> admin@finance.com</div>
          <div><b>Analyst:</b> analyst@finance.com</div>
          <div><b>Viewer:</b> viewer@finance.com</div>
          <div style={{ marginTop: 4 }}><b>Password:</b> Admin@123</div>
        </div>
      </div>
    </div>
  )
}