import { motion } from 'framer-motion'

const variantStyles = {
  primary: {
    background: 'var(--brand-primary)',
    color: '#fff',
    border: 'none',
  },
  danger: {
    background: 'var(--danger-bg)',
    color: 'var(--danger)',
    border: '1px solid rgba(239,68,68,0.3)',
  },
  outline: {
    background: 'transparent',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--text-muted)',
    border: 'none',
  },
  success: {
    background: 'var(--success-bg)',
    color: 'var(--success)',
    border: '1px solid rgba(16,185,129,0.3)',
  },
}

export default function Button({ children, variant = 'primary', size = 'md', style, disabled, ...props }) {
  const pad = size === 'sm' ? '6px 14px' : size === 'lg' ? '12px 28px' : '9px 20px'
  const fontSize = size === 'sm' ? '12px' : size === 'lg' ? '15px' : '13px'

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, opacity: 0.9 } : undefined}
      whileTap={!disabled ? { scale: 0.97 } : undefined}
      disabled={disabled}
      style={{
        padding: pad, fontSize, borderRadius: 'var(--radius-sm)',
        fontWeight: 600, letterSpacing: '0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all var(--transition-fast)',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        ...variantStyles[variant],
        ...style,
      }}
      {...props}
    >
      {children}
    </motion.button>
  )
}