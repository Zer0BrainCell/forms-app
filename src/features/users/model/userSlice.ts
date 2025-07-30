import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { usersApi } from '../api/userApi'
import type { User } from '../../../entities/User'

interface UsersState {
  users: User[]
  loading: boolean
  error: string | null
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, thunkAPI) => {
  try {
    return await usersApi.getUsers()
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Ошибка загрузки')
  }
})
export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id: string, thunkAPI) => {
    try {
      await usersApi.deleteUser(id)
      return id
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || 'Ошибка удаления')
    }
  }
)

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter
        (user => user.id !== action.payload)
})
  },
})

export default userSlice.reducer