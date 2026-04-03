import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, loading, error, initialized } = useSelector((s) => s.auth)
  return {
    user, loading, error, initialized,
    logout: () => dispatch(logout()),
  }
}