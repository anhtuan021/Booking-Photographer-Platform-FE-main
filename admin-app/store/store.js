import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'

export function createStore(preloadedState) {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState,
  })
}

// for convenience export a default store (used only in client provider)
export default createStore()
