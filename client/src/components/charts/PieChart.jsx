import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#2563eb','#16a34a','#dc2626','#d97706','#7c3aed','#0891b2']

export default function CategoryPieChart({ data = [] }) {
  const pieData = data.map(d => ({ name: `${d.category} (${d.type})`, value: d.total }))
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
          {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
      </PieChart>
    </ResponsiveContainer>
  )
}