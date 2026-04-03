import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { monthLabel } from '../../utils/dateHelpers'

export default function MonthlyLineChart({ data = [] }) {
  const formatted = [...data].reverse().map(d => ({ ...d, month: monthLabel(d.month) }))
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
        <Legend />
        <Line type="monotone" dataKey="income"  stroke="#16a34a" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="expense" stroke="#dc2626" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="net"     stroke="#2563eb" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}