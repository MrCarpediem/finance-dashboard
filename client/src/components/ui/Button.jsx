const variants = {
  primary:  'background:#2563eb;color:#fff;',
  danger:   'background:#dc2626;color:#fff;',
  outline:  'background:#fff;color:#2563eb;border:1px solid #2563eb;',
  ghost:    'background:transparent;color:#64748b;',
}

export default function Button({ children, variant = 'primary', size = 'md', style, ...props }) {
  const pad = size === 'sm' ? '6px 12px' : '9px 18px'
  const fontSize = size === 'sm' ? '12px' : '14px'
  return (
    <button
      style={{
        padding: pad, fontSize, borderRadius: 8, fontWeight: 500,
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.6 : 1,
        transition: 'opacity .15s',
        ...Object.fromEntries(variants[variant].split(';').filter(Boolean).map(s => {
          const [k, v] = s.split(':')
          return [k.trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase()), v.trim()]
        })),
        ...style,
      }}
      {...props}
    >
      {children}
    </button>
  )
}