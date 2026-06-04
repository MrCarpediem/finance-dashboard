import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { monthLabel } from '../../utils/dateHelpers'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null
  return (
    <div style={{
      background: 'rgba(17, 24, 39, 0.95)',
      backdropFilter: 'blur(8px)',
      border: '1px solid var(--border-strong)',
      borderRadius: 'var(--radius-md)',
      padding: '12px 16px',
      fontSize: 12,
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    }}>
      <p style={{ fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)', fontSize: 13 }}>{label}</p>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color }} />
          <span style={{ color: 'var(--text-secondary)', textTransform: 'capitalize' }}>{p.name}:</span>
          <span style={{ color: p.color, fontWeight: 600, fontFamily: 'var(--font-heading)' }}>₹{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function MonthlyLineChart({ data = [] }) {
  const formatted = [...data].reverse().map(d => ({ ...d, month: monthLabel(d.month) }))
  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={formatted}>
        <defs>
          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
            <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} dy={8} />
        <YAxis tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} dx={-8} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="income"  stroke="#10b981" strokeWidth={2.5} fill="url(#incomeGrad)" dot={false} activeDot={{ r: 5, fill: '#10b981', stroke: '#0a0e1a', strokeWidth: 2 }} />
        <Area type="monotone" dataKey="expense" stroke="#ef4444" strokeWidth={2.5} fill="url(#expenseGrad)" dot={false} activeDot={{ r: 5, fill: '#ef4444', stroke: '#0a0e1a', strokeWidth: 2 }} />
        <Area type="monotone" dataKey="net"     stroke="#6366f1" strokeWidth={2.5} fill="url(#netGrad)" dot={false} activeDot={{ r: 5, fill: '#6366f1', stroke: '#0a0e1a', strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}