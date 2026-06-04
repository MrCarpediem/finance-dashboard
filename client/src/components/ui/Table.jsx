import { motion } from 'framer-motion'

export default function Table({ columns, data, loading }) {
  if (loading) return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <div style={{
        width: 32, height: 32, border: '3px solid var(--border)',
        borderTopColor: 'var(--brand-primary)', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading data...</p>
    </div>
  )

  if (!data?.length) return (
    <div style={{ padding: 48, textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No records found.</p>
    </div>
  )

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {columns.map((col) => (
              <th key={col.key} style={{
                padding: '14px 16px', textAlign: 'left',
                color: 'var(--text-muted)', fontWeight: 600,
                fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em',
                background: 'rgba(0,0,0,0.15)',
              }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <motion.tr
              key={row.id || i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              style={{
                borderBottom: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'background var(--transition-fast)',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              onMouseLeave={e => e.currentTarget.style.background = ''}
            >
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}