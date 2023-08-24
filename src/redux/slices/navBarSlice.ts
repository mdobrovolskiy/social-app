import { createSlice } from '@reduxjs/toolkit'

interface navBarState {
  smallNavBar: boolean
}

const initialState = { smallNavBar: false } as navBarState

const navBarSlice = createSlice({
  name: 'navBar',
  initialState,
  reducers: {
    changeNavBarSize(state, action) {
      state.smallNavBar = action.payload
    },
  },
})

export const { changeNavBarSize } = navBarSlice.actions
export default navBarSlice.reducer
