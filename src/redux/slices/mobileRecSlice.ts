import { createSlice } from '@reduxjs/toolkit'

interface recState {
  mobileRecOpened: boolean
}

const initialState = { mobileRecOpened: false } as recState

const mobileRecSlice = createSlice({
  name: 'mobileRec',
  initialState,
  reducers: {
    handleMobileRec(state, action) {
      state.mobileRecOpened = action.payload
    },
  },
})

export const { handleMobileRec } = mobileRecSlice.actions
export default mobileRecSlice.reducer
