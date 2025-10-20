// ПОЛНЫЙ КОД authSlice.ts - просто замените весь файл

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
  token: string | null
  user: any | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  successMessage: string | null
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
  successMessage: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true
      state.error = null
      state.successMessage = null
      console.log('🔄 Auth: loginStart')
    },
    loginSuccess: (state, action: PayloadAction<{ token: string; user: any }>) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.token = action.payload.token
      state.user = action.payload.user
      state.error = null
      state.successMessage = null

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      }
      console.log('✅ Auth: loginSuccess', {
        hasToken: !!action.payload.token,
        hasUser: !!action.payload.user
      })
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.isAuthenticated = false
      state.token = null
      state.user = null
      state.error = action.payload
      state.successMessage = null
      console.log('❌ Auth: loginFailure', action.payload)
    },
    registerStart: (state) => {
      state.isLoading = true
      state.error = null
      state.successMessage = null
      console.log('🔄 Auth: registerStart')
    },
    registerSuccess: (state, action: PayloadAction<{ token: string | null; user: any }>) => {
      state.isLoading = false
      state.user = action.payload.user
      state.error = null
      state.successMessage = null

      if (action.payload.token) {
        state.isAuthenticated = true
        state.token = action.payload.token

        if (typeof window !== 'undefined') {
          localStorage.setItem('token', action.payload.token)
          localStorage.setItem('user', JSON.stringify(action.payload.user))
        }
        console.log('✅ Auth: registerSuccess (с токеном)', {
          hasToken: true,
          hasUser: !!action.payload.user
        })
      } else {
        console.log('✅ Auth: registerSuccess (без токена)', {
          hasToken: false,
          hasUser: !!action.payload.user
        })
      }
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false
      state.error = action.payload
      state.successMessage = null
      console.log('❌ Auth: registerFailure', action.payload)
    },
    registerStepComplete: (state) => {
      state.isLoading = false
      state.error = null
      console.log('✅ Auth: registerStepComplete')
    },
    setSuccessMessage: (state, action: PayloadAction<string>) => {
      state.successMessage = action.payload
      state.error = null
      state.isLoading = false
      console.log('✅ Auth: setSuccessMessage', action.payload)
    },
    clearMessages: (state) => {
      state.error = null
      state.successMessage = null
      console.log('🧹 Auth: clearMessages')
    },
    clearError: (state) => {
      state.error = null
      state.successMessage = null
      state.isLoading = false
      console.log('🧹 Auth: clearError')
    },
    logout: (state) => {
      state.isAuthenticated = false
      state.token = null
      state.user = null
      state.error = null
      state.successMessage = null

      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
      }
      console.log('👋 Auth: logout')
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
              console.log('🔄 Auth: initializeAuth (с токеном и user)')
            } catch (e) {
              console.error('❌ Failed to parse user from localStorage', e)
            }
          } else {
            console.log('🔄 Auth: initializeAuth (с токеном, без user)')
          }
        } else {
          console.log('🔄 Auth: initializeAuth (без токена)')
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
  setSuccessMessage,  
  clearMessages,      
  clearError,
  logout,
  initializeAuth,
} = authSlice.actions

export default authSlice.reducer