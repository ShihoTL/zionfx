// selectors/videoSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Base selector
const selectVideosData = (state: RootState) => state.videos.videos;

// Memoized selector for all videos
export const selectVideos = createSelector(
  [selectVideosData],
  (videos) =>
    videos.map((video) => ({
      id: video.id,
      courseId: video.courseId,
      title: video.title,
      description: video.description,
      videoUrl: video.videoUrl,
      thumbnail: video.thumbnail,
      duration: video.duration,
      views: video.views,
      createdAt: video.created_at, // Rename to camelCase
    }))
);

// Memoized selector for videos by course ID
export const selectVideosByCourseId = (courseId: string) =>
  createSelector(
    [selectVideosData],
    (videos) =>
      videos
        .filter((video) => video.courseId === courseId)
        .map((video) => ({
          id: video.id,
          courseId: video.courseId,
          title: video.title,
          description: video.description,
          videoUrl: video.videoUrl,
          thumbnail: video.thumbnail,
          duration: video.duration,
          views: video.views,
          createdAt: video.created_at,
        }))
  );