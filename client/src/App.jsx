import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import { fetchMe, setInitialized } from './store/authSlice'
import Navbar from './components/layout/Navbar'
import Sidebar from './components/layout/Sidebar'
import ProtectedRoute from './components/layout/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Users from './pages/Users'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-app)' }}>
      <Sidebar />
      <div style={{ marginLeft: 'var(--sidebar-w)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1, padding: 32, overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      dispatch(fetchMe())
    } else {
      dispatch(setInitialized())
    }
  }, [])

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-panel)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontSize: 13,
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute roles={['ADMIN', 'ANALYST']}>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/transactions" element={
            <ProtectedRoute>
              <Layout><Transactions /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout><Users /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Layout><Settings /></Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}