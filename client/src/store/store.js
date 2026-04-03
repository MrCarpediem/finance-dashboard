import { configureStore } from '@reduxjs/toolkit'
import authReducer        from './authSlice'
import transactionReducer from './transactionSlice'

export default configureStore({
  reducer: {
    auth:        authReducer,
    transaction: transactionReducer,
  },
})