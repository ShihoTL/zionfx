import { useState, useEffect, useMemo } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

type UserProps = {
  id: string;
  username: string;
  fullName: string;
  email: string;
  imageUrl: string;
};

export const useGetUser = (user: UserProps | null) => {
  const [dbUser, setDbUser] = useState<any | null>(null); // Replace `any` with your User type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no user or no user.id, return early with null user
    if (!user || !user.id) {
      setDbUser(null);
      setLoading(false);
      return;
    }

    const fetchOrCreateUser = async () => {
      try {
        setLoading(true);
        const ref = doc(db, 'users', user.id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
          const newUser = {
            id: user.id,
            username: user.username,
            full_name: user.fullName,
            email: user.email,
            profile_picture: user.imageUrl,
            role: 'student',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          await setDoc(ref, newUser);
          setDbUser(newUser);
        } else {
          const userData = { id: snapshot.id, ...snapshot.data() };
          setDbUser((prevUser) => {
            // Only update if data has changed
            if (JSON.stringify(prevUser) !== JSON.stringify(userData)) {
              return userData;
            }
            return prevUser;
          });
        }
      } catch (error) {
        console.error('Error fetching/creating user:', error);
        setDbUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrCreateUser();
  }, [user?.id]); // Depend only on user.id

  // Always return an object
  return useMemo(() => ({ user: dbUser, loading }), [dbUser, loading]);
};