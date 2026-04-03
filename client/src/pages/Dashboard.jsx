import { useEffect, useState } from 'react'
import { getSummary, getCategories, getMonthlyTrends, getRecentActivity } from '../api/analytics.api'
import { formatCurrency, formatDate } from '../utils/formatCurrency'
import MonthlyLineChart from '../components/charts/LineChart'
import CategoryPieChart from '../components/charts/PieChart'
import MonthlyBarChart  from '../components/charts/BarChart'

const Card = ({ label, value, color }) => (
  <div style={{ background: '#fff', borderRadius: 12, padding: 20, flex: 1, borderTop: `4px solid ${color}` }}>
    <p style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>{label}</p>
    <p style={{ fontSize: 22, fontWeight: 700, color }}>{value}</p>
  </div>
)

export default function Dashboard() {
  const [summary,    setSummary]    = useState(null)
  const [categories, setCategories] = useState([])
  const [trends,     setTrends]     = useState([])
  const [recent,     setRecent]     = useState([])

  useEffect(() => {
    getSummary().then(r        => setSummary(r.data.data))
    getCategories().then(r     => setCategories(r.data.data))
    getMonthlyTrends().then(r  => setTrends(r.data.data))
    getRecentActivity(5).then(r => setRecent(r.data.data))
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ marginBottom: 20, fontSize: 18, fontWeight: 600 }}>Dashboard Overview</h2>

      {/* Summary Cards */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <Card label="Total Income"        value={formatCurrency(summary?.total_income  || 0)} color="#16a34a" />
        <Card label="Total Expense"       value={formatCurrency(summary?.total_expense || 0)} color="#dc2626" />
        <Card label="Net Balance"         value={formatCurrency(summary?.net_balance   || 0)} color="#2563eb" />
        <Card label="Total Transactions"  value={summary?.total_transactions || 0}             color="#d97706" />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Monthly Trends</h3>
          <MonthlyLineChart data={trends} />
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Income vs Expense</h3>
          <MonthlyBarChart data={trends} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Category Breakdown</h3>
          <CategoryPieChart data={categories} />
        </div>
        <div style={{ background: '#fff', borderRadius: 12, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 16 }}>Recent Activity</h3>
          {recent.map(r => (
            <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{r.category}</span>
                <span style={{ color: '#64748b', fontSize: 12, marginLeft: 8 }}>{formatDate(r.date)}</span>
              </div>
              <span style={{ fontWeight: 600, color: r.type === 'income' ? '#16a34a' : '#dc2626' }}>
                {r.type === 'income' ? '+' : '-'}{formatCurrency(r.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}