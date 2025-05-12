import { useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  Timestamp,
  getDoc,
  doc,
} from "firebase/firestore";

export interface CreateVideoInput {
  title: string;
  description: string;
  thumbnail?: string | null;
  videoUrl?: string | null;
  courseId?: string;
  duration?: number;
}

export interface Video extends CreateVideoInput {
  id: string;
  created_at: string;
  updated_at: string;
}

export const useCreateVideo = () => {
  const createVideo = useCallback(async (video: CreateVideoInput): Promise<Video | null> => {
    try {
      const now = Timestamp.now();

      const docRef = await addDoc(collection(db, "videos"), {
        title: video.title,
        description: video.description,
        thumbnail: video.thumbnail || "",
        videoUrl: video.videoUrl || "",
        courseId: video.courseId || "",
        duration: video.duration || 0,
        created_at: now,
        updated_at: now,
      });

      const savedDoc = await getDoc(doc(db, "videos", docRef.id));
      if (!savedDoc.exists()) return null;

      const data = savedDoc.data();

      return {
        id: savedDoc.id,
        ...data,
        created_at: data.created_at.toDate().toISOString(),
        updated_at: data.updated_at.toDate().toISOString(),
      } as Video;
    } catch (error) {
      console.error("Error creating video:", error);
      return null;
    }
  }, []);

  return { createVideo };
};