import { configureStore } from '@reduxjs/toolkit'
import navBarSlice from './slices/navBarSlice'
import authSlice from './slices/authSlice'
import userSlice from './slices/userSlice'
import createPostSlice from './slices/createPostSlice'
import categorySlice from './slices/categorySlice'
import mobileRecSlice from './slices/mobileRecSlice'

export const store = configureStore({
  reducer: {
    navBarSlice,
    authSlice,
    userSlice,
    createPostSlice,
    categorySlice,
    mobileRecSlice,
  },
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
