import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { monthLabel } from '../../utils/dateHelpers'

export default function MonthlyBarChart({ data = [] }) {
  const formatted = [...data].reverse().map(d => ({ ...d, month: monthLabel(d.month) }))
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={formatted}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="month" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
        <Legend />
        <Bar dataKey="income"  fill="#16a34a" radius={[4,4,0,0]} />
        <Bar dataKey="expense" fill="#dc2626" radius={[4,4,0,0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}