import api from './axiosInstance'

export const getSummary        = () => api.get('/analytics/summary')
export const getCategories     = () => api.get('/analytics/categories')
export const getRecentActivity = (limit = 5) => api.get('/analytics/recent', { params: { limit } })
export const getMonthlyTrends  = () => api.get('/analytics/trends/monthly')
export const getWeeklyTrends   = () => api.get('/analytics/trends/weekly')