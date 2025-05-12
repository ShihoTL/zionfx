// selectors/courseSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Base selector
const selectCoursesData = (state: RootState) => state.courses.courses;

// Memoized selector for all course parameters
export const selectCourses = createSelector(
  [selectCoursesData],
  (courses) =>
    courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      visibility: course.visibility,
      createdAt: course.created_at || null, // Rename to camelCase, handle optional
      thumbnail: course.thumbnail || null, // Handle optional
    }))
);