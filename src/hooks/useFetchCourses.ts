import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Course {
  id: string;
  title: string;
  description: string;
  visibility: 'everyone' | 'private';
  created_at?: string;
  thumbnail?: string;
}

export function useFetchCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError(null);

      try {
        const snapshot = await getDocs(collection(db, 'courses'));

        const fetchedCourses: Course[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            description: data.description,
            visibility: data.visibility,
            thumbnail: data.thumbnail || '',
            created_at: data.created_at?.toDate().toISOString(),
          };
        });

        setCourses(fetchedCourses);
      } catch (err: any) {
        console.error('Error fetching courses:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading, error };
}