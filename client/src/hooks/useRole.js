import { useAuth } from './useAuth'

export const useRole = () => {
  const { user } = useAuth()
  const role = user?.role || ''
  return {
    role,
    isAdmin:   role === 'ADMIN',
    isAnalyst: role === 'ANALYST',
    isViewer:  role === 'VIEWER',
    canWrite:  role === 'ADMIN',
    canAnalyze: role === 'ADMIN' || role === 'ANALYST',
  }
}