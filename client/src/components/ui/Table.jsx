export default function Table({ columns, data, loading }) {
  if (loading) return <p style={{ padding: 24, color: '#64748b' }}>Loading...</p>
  if (!data?.length) return <p style={{ padding: 24, color: '#64748b' }}>No records found.</p>

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
            {columns.map((col) => (
              <th key={col.key} style={{ padding: '10px 14px', textAlign: 'left', color: '#64748b', fontWeight: 600 }}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} style={{ borderBottom: '1px solid #f1f5f9' }}
              onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
              onMouseLeave={e => e.currentTarget.style.background = ''}>
              {columns.map((col) => (
                <td key={col.key} style={{ padding: '10px 14px' }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}