import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../api/transactions.api'

export const fetchTransactions = createAsyncThunk('transaction/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await getTransactions(params)
    return data
  } catch (err) {
    return rejectWithValue(err.response?.data?.message)
  }
})

export const addTransaction = createAsyncThunk('transaction/add', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await createTransaction(payload)
    return data.data
  } catch (err) {
    return rejectWithValue(err.response?.data)
  }
})

export const removeTransaction = createAsyncThunk('transaction/remove', async (id, { rejectWithValue }) => {
  try {
    await deleteTransaction(id)
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
     .addCase(removeTransaction.fulfilled, (s, a) => { s.list = s.list.filter(t => t.id !== a.payload) })
  },
})

export default txSlice.reducer