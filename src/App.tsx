import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import SignInPage from "./(auth)/sign-in";
import SignUpPage from "./(auth)/sign-up";
import RootLayout from "./(root)/RootLayout";
import Home from "./(landing)/Layout";

import {
  Dashboard,
  SignalsPage,
  SubscriptionPage,
  CoursesPage,
  CourseDetails,
  Journal,
  Meetings,
  Call,
  RecordingPlayer,
  VideoModal,
} from "./(root)/pages/";

function App() {
  const location = useLocation();

  return (
    <Routes location={location}>
      {/* Public Routes */}
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />

      {/* Protected Routes */}
      <Route element={<RootLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signals" element={<SignalsPage />} />
        <Route path="/subscriptions" element={<SubscriptionPage />} />
        <Route path="/courses" element={<CoursesPage />}>
          <Route path="c/:courseId" element={<CourseDetails />} />
          <Route path="v/:videoId" element={<VideoModal />} />
        </Route>
        <Route path="/fx-journal" element={<Journal />} />
        <Route path="/meeting" element={<Meetings />}>
          <Route path=":id" element={<Call />} />
          <Route path="recording-player/:url" element={<RecordingPlayer />} />
        </Route>
      </Route>

      <Route path="/" element={<Home />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;