import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  token: string | null
  user: any | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const getInitialToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

const initialState: AuthState = {
  token: getInitialToken(),
  user: null,
  isAuthenticated: !!getInitialToken(),
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; user: any }>) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.token = action.payload.token
      state.user = action.payload.user
      state.error = null
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      }
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.isAuthenticated = false
      state.token = null
      state.user = null
      state.error = action.payload
    },
    registerStart: (state) => {
      state.isLoading = true
      state.error = null
    },
    registerSuccess: (state, action: PayloadAction<{ token: string; user: any }>) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.token = action.payload.token
      state.user = action.payload.user
      state.error = null
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      }
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
    },
    registerStepComplete: (state) => {
      state.isLoading = false
      state.error = null
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.token = null
      state.user = null
      state.error = null
      
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
    },
    clearError: (state) => {
      state.error = null
      state.isLoading = false
    },
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        const userStr = localStorage.getItem('user')
        
        if (token) {
          state.token = token
          state.isAuthenticated = true
          
          if (userStr) {
            try {
              state.user = JSON.parse(userStr)
            } catch (e) {
              console.error('Failed to parse user from localStorage', e)
            }
          }
        }
      }
    },
  },
})

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  registerStepComplete,
  logout,
  clearError,
  initializeAuth,
} = authSlice.actions

export default authSlice.reducer