import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { monthLabel } from '../../utils/dateHelpers'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null
  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.9)', backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 'var(--radius-md)', padding: '12px 16px', fontSize: 13,
      boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
    }}>
      <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ color: 'var(--text-secondary)' }}>{p.name}:</span>
          <span style={{ color: p.color, fontWeight: 600 }}>₹{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function MonthlyBarChart({ data = [] }) {
  const formatted = [...data].reverse().map(d => ({ ...d, month: monthLabel(d.month) }))
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={formatted} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={1}/>
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.6}/>
          </linearGradient>
          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={1}/>
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.6}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} dy={10} />
        <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} dx={-10} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Legend wrapperStyle={{ fontSize: 12, color: '#94a3b8', paddingTop: 20 }} iconType="circle" />
        <Bar dataKey="income" fill="url(#colorIncome)" radius={[6,6,0,0]} barSize={12} />
        <Bar dataKey="expense" fill="url(#colorExpense)" radius={[6,6,0,0]} barSize={12} />
      </BarChart>
    </ResponsiveContainer>
  )
}