import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as api from '../api/transactions.api'

export const fetchTransactions = createAsyncThunk('transaction/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.getTransactions(params)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const addTransaction = createAsyncThunk('transaction/add', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.createTransaction(payload)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const updateTransaction = createAsyncThunk('transaction/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const { data: res } = await api.updateTransaction(id, data)
    return res.data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const removeTransaction = createAsyncThunk('transaction/remove', async (id, { rejectWithValue }) => {
  try {
    await api.deleteTransaction(id)
    return id
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

const txSlice = createSlice({
  name: 'transaction',
  initialState: { list: [], meta: {}, loading: false, error: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchTransactions.pending,   (s) => { s.loading = true })
     .addCase(fetchTransactions.fulfilled, (s, a) => { s.loading = false; s.list = a.payload.data; s.meta = a.payload.meta })
     .addCase(fetchTransactions.rejected,  (s, a) => { s.loading = false; s.error = a.payload })
     .addCase(addTransaction.fulfilled,    (s, a) => { s.list.unshift(a.payload) })
     .addCase(updateTransaction.fulfilled, (s, a) => {
        const index = s.list.findIndex(t => t.id === a.payload.id)
        if (index !== -1) s.list[index] = a.payload
     })
     .addCase(removeTransaction.fulfilled, (s, a) => { s.list = s.list.filter(t => t.id !== a.payload) })
  },
})

export default txSlice.reducer