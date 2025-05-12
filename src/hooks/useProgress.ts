import { useEffect, useState, useRef } from "react";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  increment,
} from "firebase/firestore";

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  courseId: string;
  videoUrl?: string;
  duration?: number;
}

interface ProgressData {
  userId: string;
  videoId?: string;
  courseId: string;
  lastWatchedAt: number;
  duration: number;
  completed: boolean;
  updatedAt: any;
}

export const useProgress = (
  userId: string,
  videoId: string | null,
  courseId: string,
  videoRef: React.RefObject<HTMLVideoElement> | null,
  videos: Video[],
  fetchCompletedCount = false,
  progressKey?: number
) => {
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [completedCount, setCompletedCount] = useState<number>(0);
  const [completedLoading, setCompletedLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<number>(0);

  const progressId = userId && videoId ? `${userId}_${videoId}` : null;
  const progressDataRef = useRef<ProgressData | null>(null);

  useEffect(() => {
    if (!userId) setError("User ID is missing");
    if (!videoId) setError("Video ID is missing");
  }, [userId, videoId]);

  useEffect(() => {
    if (!progressId || !videoRef?.current) return;

    const fetchProgress = async () => {
      try {
        setProgressLoaded(false);
        const progressDocRef = doc(db, "progress", progressId);
        const progressDoc = await getDoc(progressDocRef);

        if (!progressDoc.exists()) {
          const videoDocRef = doc(db, "videos", videoId!);
          await updateDoc(videoDocRef, { views: increment(1) });

          await setDoc(
            progressDocRef,
            {
              userId,
              videoId,
              courseId,
              lastWatchedAt: 0,
              duration: 0,
              completed: false,
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
          progressDataRef.current = {
            userId,
            videoId,
            courseId,
            lastWatchedAt: 0,
            duration: 0,
            completed: false,
            updatedAt: null,
          };
        } else {
          const data = progressDoc.data() as ProgressData;
          progressDataRef.current = data;

          if (data.lastWatchedAt && videoRef.current) {
            videoRef.current.currentTime = data.lastWatchedAt;
            setLastSavedTime(data.lastWatchedAt);
          }
        }
        setProgressLoaded(true);
      } catch (err) {
        console.error("[Load Progress] Error:", err);
        setError("Failed to load video progress");
        setProgressLoaded(true);
      }
    };

    const videoEl = videoRef.current;
    const handleMetadata = () => fetchProgress();

    videoEl?.addEventListener("loadedmetadata", handleMetadata);

    return () => {
      videoEl?.removeEventListener("loadedmetadata", handleMetadata);
    };
  }, [progressId, videoRef, progressKey]);

  useEffect(() => {
    if (!fetchCompletedCount || !userId || !courseId || !videos.length) {
      setCompletedLoading(false);
      return;
    }

    const fetchCompletedVideos = async () => {
      try {
        setCompletedLoading(true);
        const videoIds = videos.map((v) => v.id);
        const batchSize = 10;
        let totalCompleted = 0;

        for (let i = 0; i < videoIds.length; i += batchSize) {
          const batch = videoIds.slice(i, i + batchSize);

          const progressQuery = query(
            collection(db, "progress"),
            where("userId", "==", userId),
            where("courseId", "==", courseId),
            where("videoId", "in", batch),
            where("completed", "==", true)
          );

          const querySnapshot = await getDocs(progressQuery);
          totalCompleted += querySnapshot.docs.length;
        }

        setCompletedCount(totalCompleted);
      } catch (err) {
        console.error("[Progress] Error fetching completed videos:", err);
        setError("Failed to fetch completed videos");
      } finally {
        setCompletedLoading(false);
      }
    };

    fetchCompletedVideos();
  }, [fetchCompletedCount, userId, courseId, videos]);

  const saveProgressIfNeeded = async () => {
    const current = videoRef?.current;

    if (!current || !current.duration || current.duration === Infinity || !progressId) {
      console.warn("Skipping save: invalid videoRef or progressId", {
        current,
        progressId,
      });
      return;
    }

    const currentTime = current.currentTime;
    const newProgress = Math.max(currentTime, lastSavedTime);

    if (newProgress > lastSavedTime) {
      try {
        console.log("[Saving Progress]", {
          currentTime,
          newProgress,
          duration: current.duration,
        });

        await setDoc(
          doc(db, "progress", progressId),
          {
            userId,
            videoId,
            courseId,
            lastWatchedAt: newProgress,
            duration: current.duration,
            completed: newProgress >= current.duration * 0.95,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        setLastSavedTime(newProgress);
      } catch (err) {
        console.error("[Save Progress] Error:", err);
        setError("Failed to save video progress");
      }
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      saveProgressIfNeeded();
    }, 15000);
    return () => clearInterval(interval);
  }, [lastSavedTime, videoRef]);

  useEffect(() => {
    const handlePauseOrUnload = () => {
      saveProgressIfNeeded();
    };

    const videoEl = videoRef?.current;
    videoEl?.addEventListener("pause", handlePauseOrUnload);
    window.addEventListener("beforeunload", handlePauseOrUnload);

    return () => {
      videoEl?.removeEventListener("pause", handlePauseOrUnload);
      window.removeEventListener("beforeunload", handlePauseOrUnload);
    };
  }, [lastSavedTime]);

  return {
    progressLoaded,
    progressError: error,
    completedCount,
    completedLoading,
    saveProgressIfNeeded,
  };
};

// Utility function to get recently watched videos
export const getRecentlyWatchedVideos = async (
  userId: string,
  limit: number = 10
): Promise<Video[]> => {
  try {
    const progressQuery = query(
      collection(db, "progress"),
      where("userId", "==", userId)
    );

    const querySnapshot = await getDocs(progressQuery);
    const progressDocs = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => {
        const aTime = a.updatedAt?.seconds ?? 0;
        const bTime = b.updatedAt?.seconds ?? 0;
        return bTime - aTime;
      })
      .slice(0, limit);

    const videoIds = progressDocs.map((p: any) => p.videoId);

    if (videoIds.length === 0) return [];

    const videos: Video[] = [];
    for (const id of videoIds) {
      const videoSnap = await getDoc(doc(db, "videos", id));
      if (videoSnap.exists()) {
        videos.push({ id, ...(videoSnap.data() as Video) });
      }
    }

    return videos;
  } catch (err) {
    console.error("[Get Recently Watched] Error:", err);
    return [];
  }
};