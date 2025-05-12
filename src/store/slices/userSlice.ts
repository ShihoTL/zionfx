import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'student';
  created_at: string;
  updated_at: string;
  subscriptions?: {
    mentorship?: {
      plan: 'grouped' | 'one_on_one';
      start_date: string;
      end_date: string;
      status: 'active' | 'expired' | 'cancelled';
    };
    signals?: {
      plan: 'basic';
      start_date: string;
      end_date: string;
      status: 'active' | 'expired' | 'cancelled';
    };
  };
}

const initialState: User | null = null;

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      if (state === null) {
        return action.payload;
      }
      const { id, username, email } = action.payload;
      if (state.id === id && state.username === username && state.email === email) {
        return state; // Skip if critical fields are unchanged
      }
      return action.payload;
    },
    updateUserField: (state, action: PayloadAction<Partial<User>>) => {
      if (state) {
        return { ...state, ...action.payload };
      }
      return state;
    },
    clearUser: () => null,
  },
});

export const { setUser, updateUserField, clearUser } = userSlice.actions;
export default userSlice.reducer;