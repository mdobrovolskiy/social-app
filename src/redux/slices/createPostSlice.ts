import { createSlice } from '@reduxjs/toolkit'

interface IcreatePostSlice {
  createPostOpened: boolean
}

const initialState = { createPostOpened: false } as IcreatePostSlice

const createPostSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    handlePostOpened(state, action) {
      state.createPostOpened = action.payload
    },
  },
})

export const { handlePostOpened } = createPostSlice.actions
export default createPostSlice.reducer
