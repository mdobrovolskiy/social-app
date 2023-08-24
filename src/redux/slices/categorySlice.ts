import { createSlice } from '@reduxjs/toolkit'

interface categoryState {
  category: 'following' | 'explore' | 'likes'
}

const initialState = { category: 'following' } as categoryState

const categorySlice = createSlice({
  name: 'navBar',
  initialState,
  reducers: {
    changeCategory(state, action) {
      state.category = action.payload
    },
  },
})

export const { changeCategory } = categorySlice.actions
export default categorySlice.reducer
