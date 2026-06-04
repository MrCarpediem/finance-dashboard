import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#6366f1','#10b981','#ef4444','#f59e0b','#8b5cf6','#0ea5e9','#f43f5e','#14b8a6']

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.[0]) return null
  const d = payload[0]
  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: 13,
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', gap: 10
    }}>
      <div style={{ width: 12, height: 12, borderRadius: '50%', background: d.payload.fill, flexShrink: 0 }} />
      <div>
        <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{d.name}</p>
        <p style={{ color: 'var(--text-secondary)' }}>₹{d.value?.toLocaleString()}</p>
      </div>
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
          cx="50%" cy="50%" innerRadius={70} outerRadius={100}
          paddingAngle={5} stroke="none"
        >
          {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} style={{ outline: 'none' }} />)}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}