import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#6366f1','#10b981','#ef4444','#f59e0b','#8b5cf6','#0ea5e9','#f43f5e','#14b8a6']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.[0]) return null
  const d = payload[0]
  return (
    <div style={{
      background: 'var(--bg-panel)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-sm)', padding: '10px 14px', fontSize: 12,
    }}>
      <p style={{ fontWeight: 600, color: d.payload.fill, marginBottom: 2 }}>{d.name}</p>
      <p style={{ color: 'var(--text-secondary)' }}>₹{d.value?.toLocaleString()}</p>
    </div>
  )
}

export default function CategoryPieChart({ data = [] }) {
  const pieData = data.map(d => ({ name: `${d.category} (${d.type})`, value: d.total }))
  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={pieData} dataKey="value" nameKey="name"
          cx="50%" cy="50%" innerRadius={60} outerRadius={100}
          paddingAngle={3} strokeWidth={0}
        >
          {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}