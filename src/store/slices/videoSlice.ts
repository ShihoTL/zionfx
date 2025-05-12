// slices/videoSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Video {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  views: number;
  created_at: string;
}

interface VideoState {
  videos: Video[];
}

const initialState: VideoState = {
  videos: [],
};

const videoSlice = createSlice({
  name: 'videos',
  initialState,
  reducers: {
    setVideos: (state, action: PayloadAction<Video[]>) => {
      state.videos = action.payload;
    },
    addVideo: (state, action: PayloadAction<Video>) => {
      state.videos.push(action.payload);
    },
    updateVideo: (state, action: PayloadAction<Video>) => {
      const index = state.videos.findIndex((video) => video.id === action.payload.id);
      if (index !== -1) {
        state.videos[index] = action.payload;
      }
    },
    removeVideo: (state, action: PayloadAction<string>) => {
      state.videos = state.videos.filter((video) => video.id !== action.payload);
    },
  },
});

export const { setVideos, addVideo, updateVideo, removeVideo } = videoSlice.actions;
export default videoSlice.reducer;