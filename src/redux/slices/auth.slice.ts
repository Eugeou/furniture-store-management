import { StoreToken } from '@/types/entities/auth-entity'
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { GetMe } from '@/services/auth-service'
import { UserProps } from '@/types/entities/auth-entity'

type AuthState = {
  token: StoreToken
  user: UserProps | null
  loading?: boolean
}
const initialState: AuthState = {
  token: {
    AccessToken: '',
    RefreshToken: ''
  },
  user: null
}
//Generated pending, fulfilled and rejected action type automatically
export const getUser = createAsyncThunk('user/getUser', async (_param: string | undefined, { rejectWithValue }) => {
  try {
    return await GetMe()
  } catch (error) {
    return rejectWithValue(error) 
    //error?.response?.data?.message || error.message
  }
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<AuthState['token']>) => {
      state.token = action.payload
      if (action.payload) {
        localStorage.setItem('accessToken', action.payload.AccessToken)
        localStorage.setItem('refreshToken', action.payload.RefreshToken)
      }
    },
    logout: (state) => {
      state.token = {
        AccessToken: '',
        RefreshToken: ''
      }
      state.user = null
      localStorage.clear()
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(getUser.fulfilled, (state, action: PayloadAction<UserProps>) => {
      state.user = action.payload
    })
    builder.addCase(getUser.rejected, (state) => {
      state.loading = false
      state.user = null
    })
  }
})

export const selectAuth = (state: RootState) => state.auth

export const { logout, setToken } = authSlice.actions

export default authSlice.reducer
