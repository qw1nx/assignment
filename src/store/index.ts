// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
// Import your slice reducers here

export const store = configureStore({
  reducer: {
    // add your reducers here
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch