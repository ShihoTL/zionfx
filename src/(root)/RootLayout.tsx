'use client';

import { useUser, SignedIn } from '@clerk/clerk-react';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import { setUser } from '@/store/slices/userSlice';
import { Sidebar } from '@/components/sidebar';
import Loader from '@/components/Loader';
import { useGetUser } from '@/hooks/useGetUser';
import { useFetchCourses } from '@/hooks/useFetchCourses';
import { useFetchVideos } from '@/hooks/useFetchVideos';
import { RootState } from '@/store/store';
import { setCourses } from '@/store/slices/courseSlice';
import { setVideos } from '@/store/slices/videoSlice';

export default function RootLayout() {
  const { user, isLoaded } = useUser();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const parsedUser = useMemo(
    () =>
      isLoaded && user
        ? {
            id: user.id,
            username: user.username ?? 'unknown',
            fullName: user.fullName ?? 'No Name',
            email: user.emailAddresses[0]?.emailAddress ?? '',
            imageUrl: user.imageUrl ?? '',
          }
        : null,
    [isLoaded, user]
  );

  const { user: dbUser, loading: userLoading } = useGetUser(parsedUser) || { user: null, loading: true };
  const fetchedCourses = useFetchCourses();
  const fetchedVideos = useFetchVideos();
  const userInStore = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const dbCourses = fetchedCourses.courses;
    const dbVideos = fetchedVideos.videos;

    if (!fetchedVideos.loading && dbVideos) {
      dispatch(setVideos(fetchedVideos.videos));
    }

    if (!fetchedCourses.loading && dbCourses) {
      dispatch(setCourses(fetchedCourses.courses));
    }
  }, [dispatch, fetchedCourses.loading, fetchedCourses.courses, fetchedVideos.loading, fetchedVideos.videos]);

  useEffect(() => {
    if (!isLoaded || userLoading || !dbUser?.id) return;

    const newUser = {
      id: dbUser.id,
      username: dbUser.username || '',
      email: dbUser.email || '',
      role: dbUser.role || 'student',
      created_at:
        dbUser.created_at && !isNaN(new Date(dbUser.created_at).getTime())
          ? new Date(dbUser.created_at).toISOString()
          : '',
      updated_at:
        dbUser.updated_at && !isNaN(new Date(dbUser.updated_at).getTime())
          ? new Date(dbUser.updated_at).toISOString()
          : '',
      subscriptions: dbUser.subscriptions || undefined,
    };

    // Only dispatch if user data has changed
    if (!userInStore || JSON.stringify(userInStore) !== JSON.stringify(newUser)) {
      if (process.env.NODE_ENV === 'development') {
        console.log('Dispatching setUser:', newUser);
      }
      dispatch(setUser(newUser));
    }
  }, [dbUser, isLoaded, userLoading, dispatch]);

  useEffect(() => {
    if (isLoaded && !user) navigate('/sign-in');
  }, [isLoaded, user, navigate]);

  const isUserReady = isLoaded && !userLoading && userInStore !== null;
  if (!isUserReady) {
    return (
      <div className="h-[100dvh] w-full flex-center bg-background">
        <Loader />
      </div>
    );
  }

  return (
    <SignedIn>
      <div className="h-full min-h-[100dvh] bg-background text-foreground relative">
        <Sidebar />
        <main className="md:pl-72 pt-14 md:pt-0">
          <Outlet />
        </main>
      </div>
    </SignedIn>
  );
}