import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Course {
  id: string;
  title: string;
  description: string;
  visibility: 'everyone' | 'private';
  created_at?: string;
  thumbnail?: string;
}

interface CourseState {
  courses: Course[];
}

const initialState: CourseState = {
  courses: [],
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.courses = action.payload;
    },
    addCourse: (state, action: PayloadAction<Course>) => {
      state.courses.push(action.payload);
    },
    updateCourse: (state, action: PayloadAction<Course>) => {
      const index = state.courses.findIndex(course => course.id === action.payload.id);
      if (index !== -1) {
        state.courses[index] = action.payload;
      }
    },
    removeCourse: (state, action: PayloadAction<string>) => {
      state.courses = state.courses.filter(course => course.id !== action.payload);
    },
  },
});

export const { setCourses, addCourse, updateCourse, removeCourse } = courseSlice.actions;
export default courseSlice.reducer;