import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { login as loginApi, getMe } from '../api/auth.api'

export const loginUser = createAsyncThunk('auth/login', async (creds, { rejectWithValue }) => {
  try {
    const { data } = await loginApi(creds)
    localStorage.setItem('accessToken', data.data.accessToken)
    localStorage.setItem('refreshToken', data.data.refreshToken)
    return data.data.user
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed')
  }
})

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await getMe()
    return data.data
  } catch (err) {
    localStorage.clear()
    return rejectWithValue(err.response?.data?.message)
  }
})

export const setInitialized = () => ({ type: 'auth/setInitialized' })

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, loading: false, error: null, initialized: false },
  reducers: {
    logout(state) {
      state.user = null
      state.initialized = true
      localStorage.clear()
    },
  },
  extraReducers: (b) => {
    b.addCase(loginUser.pending,   (s) => { s.loading = true; s.error = null })
     .addCase(loginUser.fulfilled, (s, a) => { s.loading = false; s.user = a.payload; s.initialized = true })
     .addCase(loginUser.rejected,  (s, a) => { s.loading = false; s.error = a.payload; s.initialized = true })
     .addCase(fetchMe.fulfilled,   (s, a) => { s.user = a.payload; s.initialized = true })
     .addCase(fetchMe.rejected,    (s) => { s.user = null; s.initialized = true })
     .addCase('auth/setInitialized', (s) => { s.initialized = true })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer