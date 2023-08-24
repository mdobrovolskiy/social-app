import { createSlice } from '@reduxjs/toolkit'

interface IauthSlice {
  isAuthed: boolean
  id: string
}

const initialState = { isAuthed: false, id: '' } as IauthSlice

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action) {
      state.isAuthed = action.payload.isAuthed
      state.id = action.payload.id
    },
  },
})

export const { setAuth } = authSlice.actions
export default authSlice.reducer
