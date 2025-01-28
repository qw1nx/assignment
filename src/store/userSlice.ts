import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import axios from 'axios'

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  avatar: string
  name?: string
  job?: string
  createdAt?: string
}

interface UsersState {
  users: User[]
  page: number
  totalPages: number
  loading: boolean
  error: string | null
}

const initialState: UsersState = {
  users: [],
  page: 1,
  totalPages: 1,
  loading: false,
  error: null
}

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (page: number) => {
    const response = await axios.get('https://reqres.in/api/users', {
      params: { page }
    })
    return response.data
  }
)

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (userId: number) => {
    await axios.delete(`https://reqres.in/api/users/${userId}`)
    return userId
  }
)

export const addUser = createAsyncThunk(
  'users/addUser',
  async ({ name, job }: { name: string; job: string }) => {
    const response = await axios.post('https://reqres.in/api/users', { name, job })
    return response.data
  }
)

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload.data
        state.totalPages = action.payload.total_pages
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false
        state.error = 'Failed to fetch users'
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload)
      })
      // Add User
      .addCase(addUser.fulfilled, (state, action) => {
        const newUser = action.payload
        const formattedUser: User = {
          id: Number(newUser.id),
          first_name: newUser.name,
          last_name: '',
          email: '',
          avatar: '',
          name: newUser.name,
          job: newUser.job,
          createdAt: newUser.createdAt
        }
        state.users.unshift(formattedUser)
      })
  }
})

export const { setPage } = userSlice.actions

export default userSlice.reducer