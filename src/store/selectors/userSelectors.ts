// selectors/userSelectors.ts
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Basic selector to get the user slice from the state
const selectUserData = (state: RootState) => state.user;

// Memoized selector for user profile data
export const selectUser = createSelector(
  [selectUserData],
  (user) => {
    if (!user) return null;
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
    };
  }
);

// Memoized selector to check if user is authenticated
export const selectIsAuthenticated = createSelector(
  [selectUserData],
  (user) => !!user?.id
);

// Memoized selector for user role
export const selectUserRole = createSelector(
  [selectUserData],
  (user) => user?.role || null
);

// Memoized selector for mentorship subscription details
export const selectMentorshipSubscription = createSelector(
  [selectUserData],
  (user) => {
    if (!user?.subscriptions?.mentorship) return null;
    return {
      plan: user.subscriptions.mentorship.plan,
      startDate: user.subscriptions.mentorship.start_date,
      endDate: user.subscriptions.mentorship.end_date,
      status: user.subscriptions.mentorship.status,
    };
  }
);

// Memoized selector to check if mentorship subscription is active
export const selectIsMentorshipActive = createSelector(
  [selectMentorshipSubscription],
  (mentorship) => mentorship?.status === 'active'
);

// Memoized selector for signals subscription details
export const selectSignalsSubscription = createSelector(
  [selectUserData],
  (user) => {
    if (!user?.subscriptions?.signals) return null;
    return {
      plan: user.subscriptions.signals.plan,
      startDate: user.subscriptions.signals.start_date,
      endDate: user.subscriptions.signals.end_date,
      status: user.subscriptions.signals.status,
    };
  }
);

// Memoized selector to check if signals subscription is active
export const selectIsSignalsActive = createSelector(
  [selectSignalsSubscription],
  (signals) => signals?.status === 'active'
);