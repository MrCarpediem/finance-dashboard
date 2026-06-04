import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-app)', color: 'var(--text-primary)',
      textAlign: 'center', padding: 20, position: 'relative', overflow: 'hidden'
    }}>
      {/* Decorative blurs */}
      <div style={{
        position: 'absolute', width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,102,241,0.1), transparent)',
        top: '20%', left: '30%', filter: 'blur(40px)', pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <h1 style={{
          fontSize: 'clamp(100px, 15vw, 160px)', fontWeight: 900,
          background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 16, lineHeight: 1, letterSpacing: '-0.05em'
        }}>404</h1>
        <h2 style={{ fontSize: 28, fontWeight: 600, marginBottom: 16 }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 40, maxWidth: 400, marginInline: 'auto', lineHeight: 1.6 }}>
          Oops! The page you are looking for doesn't exist, has been moved, or is temporarily unavailable.
        </p>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark))',
          color: '#fff', padding: '12px 28px', borderRadius: 'var(--radius-md)',
          textDecoration: 'none', fontWeight: 600,
          boxShadow: '0 10px 25px rgba(99, 102, 241, 0.3)',
          transition: 'transform 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseOut={e => e.currentTarget.style.transform = 'none'}
        >
          <Home size={18} /> Back to Dashboard
        </Link>
      </motion.div>
    </div>
  )
}
