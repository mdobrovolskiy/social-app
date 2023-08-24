import { createSlice } from '@reduxjs/toolkit'
import { IUserData } from '../../types'
const initialState = {} as IUserData

const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
  },
})

export const { setUser } = userSlice.actions
export default userSlice.reducer
