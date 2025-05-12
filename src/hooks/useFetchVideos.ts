import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

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

export function useFetchVideos() {
  const [videos, setVideos] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      setError(null);

      try {
        const snapshot = await getDocs(collection(db, 'videos'));

        const fetchedVideos: Video[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            courseId: data.courseId,
            title: data.title,
            description: data.description,
            videoUrl: data.videoUrl,
            thumbnail: data.thumbnail || '',
            duration: data.duration || 0,
            views: data.views || 0,
            created_at: data.created_at?.toDate().toISOString(),
          };
        });

        setVideos(fetchedVideos);
      } catch (err: any) {
        console.error('Error fetching Videos:', err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  return { videos, loading, error };
}