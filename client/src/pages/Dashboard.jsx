import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { getSummary, getCategories, getMonthlyTrends, getRecentActivity } from '../api/analytics.api'
import { formatCurrency, formatDate } from '../utils/formatCurrency'
import MonthlyLineChart from '../components/charts/LineChart'
import CategoryPieChart from '../components/charts/PieChart'
import MonthlyBarChart  from '../components/charts/BarChart'
import {
  TrendingUp, TrendingDown, Wallet, Activity,
  ArrowUpRight, ArrowDownRight, Clock, Zap,
  BarChart3, PieChart as PieIcon, LineChart as LineIcon, RefreshCw,
} from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

/* ── Animated Counter ── */
const AnimatedNumber = ({ value, prefix = '', suffix = '' }) => {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const num = typeof value === 'number' ? value : 0
    const duration = 1200
    const steps = 40
    const increment = num / steps
    let current = 0
    let step = 0
    const timer = setInterval(() => {
      step++
      current += increment
      if (step >= steps) { current = num; clearInterval(timer) }
      setDisplay(current)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [value])

  return <span>{prefix}{typeof value === 'number' && value >= 1000 ? formatCurrency(display) : Math.round(display).toLocaleString()}{suffix}</span>
}

/* ── Mini Sparkline (SVG) ── */
const Sparkline = ({ data = [], color = '#6366f1', height = 32 }) => {
  if (data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 80
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = height - ((v - min) / range) * (height - 4) - 2
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={w} height={height} style={{ opacity: 0.7 }}>
      <polyline
        points={points} fill="none" stroke={color}
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  )
}

/* ── KPI Summary Card ── */
const SummaryCard = ({ label, value, icon: Icon, color, bg, index, sparkData, change }) => (
  <motion.div
    initial={{ opacity: 0, y: 24, scale: 0.96 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay: index * 0.08, type: 'spring', stiffness: 200, damping: 20 }}
    whileHover={{ y: -4, boxShadow: `0 8px 30px rgba(0,0,0,0.3)` }}
    className="card"
    id={`kpi-card-${index}`}
    style={{ padding: 22, position: 'relative' }}
  >
    {/* Top accent gradient bar */}
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: 2,
      background: `linear-gradient(90deg, ${color}, transparent)`,
    }} />

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={{
          width: 42, height: 42, borderRadius: 'var(--radius-md)',
          background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 14,
        }}>
          <Icon size={20} style={{ color }} />
        </div>
        <p style={{ color: 'var(--text-dim)', fontSize: 12, fontWeight: 500, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {label}
        </p>
        <p style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em', lineHeight: 1 }}>
          <AnimatedNumber value={typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value} prefix={typeof value === 'string' ? '' : ''} />
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
        {sparkData && <Sparkline data={sparkData} color={color} />}
        {change !== undefined && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 3,
            color: change >= 0 ? '#10b981' : '#ef4444',
            fontSize: 12, fontWeight: 600,
          }}>
            {change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
    </div>
  </motion.div>
)

/* ── Chart Panel ── */
const ChartPanel = ({ title, icon: Icon, children, delay = 0, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, type: 'spring', stiffness: 200, damping: 22 }}
    className="card"
    style={{ padding: 24 }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {Icon && (
          <div style={{
            width: 32, height: 32, borderRadius: 'var(--radius-sm)',
            background: 'rgba(99,102,241,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon size={16} style={{ color: 'var(--brand-primary-light)' }} />
          </div>
        )}
        <h3 style={{ fontSize: 15, fontWeight: 600 }}>{title}</h3>
      </div>
      {action}
    </div>
    {children}
  </motion.div>
)

/* ── Skeleton ── */
const Skeleton = ({ w = '100%', h = 16, r = 'var(--radius-sm)' }) => (
  <div className="skeleton" style={{ width: w, height: h, borderRadius: r }} />
)

/* ── Dashboard ── */
export default function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [categories, setCategories] = useState([])
  const [trends, setTrends] = useState([])
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadData = async () => {
    try {
      const [s, c, t, r] = await Promise.allSettled([
        getSummary(), getCategories(), getMonthlyTrends(), getRecentActivity(6),
      ])
      if (s.status === 'fulfilled') setSummary(s.value.data.data)
      if (c.status === 'fulfilled') setCategories(c.value.data.data)
      if (t.status === 'fulfilled') setTrends(t.value.data.data)
      if (r.status === 'fulfilled') setRecent(r.value.data.data)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    loadData()
  }

  const incomeSparkData = useMemo(() =>
    trends.length ? [...trends].reverse().map(t => t.income || 0) : [10,15,12,18,22,16],
  [trends])
  const expenseSparkData = useMemo(() =>
    trends.length ? [...trends].reverse().map(t => t.expense || 0) : [8,10,14,11,16,13],
  [trends])

  return (
    <div>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2 style={{ fontSize: 28 }}>
            Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
            Here's what's happening with your finances today.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRefresh}
          id="refresh-dashboard-btn"
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', borderRadius: 'var(--radius-md)',
            background: 'var(--bg-panel)', border: '1px solid var(--border)',
            color: 'var(--text-secondary)', fontSize: 13, fontWeight: 500,
            marginTop: 4,
          }}
        >
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          Refresh
        </motion.button>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <div className="grid-stats">
          {[0,1,2,3].map(i => (
            <div key={i} className="card" style={{ padding: 22 }}>
              <Skeleton w={42} h={42} r="var(--radius-md)" />
              <div style={{ marginTop: 14 }}><Skeleton w="50%" h={12} /></div>
              <div style={{ marginTop: 8 }}><Skeleton w="70%" h={28} /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid-stats">
          <SummaryCard
            index={0} label="Total Income"
            value={summary?.total_income || 0}
            icon={TrendingUp} color="#10b981" bg="rgba(16,185,129,0.1)"
            sparkData={incomeSparkData} change={12.5}
          />
          <SummaryCard
            index={1} label="Total Expense"
            value={summary?.total_expense || 0}
            icon={TrendingDown} color="#ef4444" bg="rgba(239,68,68,0.1)"
            sparkData={expenseSparkData} change={-3.2}
          />
          <SummaryCard
            index={2} label="Net Balance"
            value={summary?.net_balance || 0}
            icon={Wallet} color="#6366f1" bg="rgba(99,102,241,0.1)"
            change={8.7}
          />
          <SummaryCard
            index={3} label="Transactions"
            value={summary?.total_transactions || 0}
            icon={Activity} color="#f59e0b" bg="rgba(245,158,11,0.1)"
            change={5.1}
          />
        </div>
      )}

      {/* Charts Grid — Row 1 */}
      <div className="grid-charts">
        <ChartPanel title="Revenue Trends" icon={LineIcon} delay={0.3}>
          {loading ? <Skeleton h={280} /> : <MonthlyLineChart data={trends} />}
        </ChartPanel>
        <ChartPanel title="Income vs Expense" icon={BarChart3} delay={0.4}>
          {loading ? <Skeleton h={280} /> : <MonthlyBarChart data={trends} />}
        </ChartPanel>
      </div>

      {/* Charts Grid — Row 2 */}
      <div className="grid-charts">
        <ChartPanel title="Category Breakdown" icon={PieIcon} delay={0.5}>
          {loading ? <Skeleton h={280} /> : <CategoryPieChart data={categories} />}
        </ChartPanel>

        {/* Recent Activity */}
        <ChartPanel
          title="Recent Activity"
          icon={Clock}
          delay={0.6}
          action={
            <span className="badge badge-brand" style={{ fontSize: 10 }}>
              {recent.length} entries
            </span>
          }
        >
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[0,1,2,3].map(i => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Skeleton w={36} h={36} r="var(--radius-sm)" />
                  <div style={{ flex: 1 }}>
                    <Skeleton w="60%" h={12} />
                    <div style={{ marginTop: 6 }}><Skeleton w="40%" h={10} /></div>
                  </div>
                  <Skeleton w={60} h={14} />
                </div>
              ))}
            </div>
          ) : recent.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <Zap size={32} style={{ color: 'var(--text-dim)', marginBottom: 8 }} />
              <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>No recent activity</p>
            </div>
          ) : (
            <div>
              {recent.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + i * 0.06 }}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: i < recent.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: 'var(--radius-sm)',
                      background: r.type === 'income' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {r.type === 'income'
                        ? <ArrowUpRight size={16} style={{ color: '#10b981' }} />
                        : <ArrowDownRight size={16} style={{ color: '#ef4444' }} />
                      }
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, textTransform: 'capitalize', fontSize: 13, display: 'block', lineHeight: 1.3 }}>
                        {r.category}
                      </span>
                      <span style={{ color: 'var(--text-dim)', fontSize: 11 }}>
                        {formatDate(r.date)}
                      </span>
                    </div>
                  </div>
                  <span style={{
                    fontWeight: 700, fontSize: 14,
                    color: r.type === 'income' ? '#10b981' : '#ef4444',
                    fontFamily: 'var(--font-heading)',
                  }}>
                    {r.type === 'income' ? '+' : '-'}{formatCurrency(r.amount)}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </ChartPanel>
      </div>
    </div>
  )
}