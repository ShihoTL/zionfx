import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/userSlice'
import courseReducer from './slices/courseSlice'
import videoReducer from './slices/videoSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    courses: courseReducer,
    videos: videoReducer,
    
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch