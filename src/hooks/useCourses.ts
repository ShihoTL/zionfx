import { useCallback } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export type CourseVisibility = "everyone" | "private";

export interface CreateCourseInput {
  title: string;
  description: string;
  visibility: CourseVisibility;
  thumbnail?: string;
  views?: number;
}

export interface Course extends CreateCourseInput {
  id: string;
  created_at: string;
  updated_at: string;
}

export const useCourses = () => {
  const createCourse = useCallback(async (course: CreateCourseInput): Promise<Course | null> => {
    try {
      const docRef = await addDoc(collection(db, "courses"), {
        ...course,
        thumbnail: course.thumbnail || "",
        views: course.views || 0,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      });

      const savedDoc = await getDoc(doc(db, "courses", docRef.id));
      if (!savedDoc.exists()) return null;

      const data = savedDoc.data();

      return {
        id: savedDoc.id,
        ...data,
        created_at: data.created_at.toDate().toISOString(),
        updated_at: data.updated_at.toDate().toISOString(),
      } as Course;
    } catch (error) {
      console.error("Error creating course:", error);
      return null;
    }
  }, []);

  const editCourse = useCallback(
    async (id: string, updates: Partial<CreateCourseInput>): Promise<boolean> => {
      try {
        await updateDoc(doc(db, "courses", id), {
          ...updates,
          updated_at: Timestamp.now(),
        });
        return true;
      } catch (error) {
        console.error("Error editing course:", error);
        return false;
      }
    },
    []
  );

  const deleteCourse = useCallback(async (id: string): Promise<boolean> => {
    try {
      // Query the videos collection for videos with matching courseId
      const videosQuery = query(
        collection(db, "videos"),
        where("courseId", "==", id)
      );
      const videoDocs = await getDocs(videosQuery);

      // Delete all matching video documents
      const deleteVideoPromises = videoDocs.docs.map((videoDoc) =>
        deleteDoc(doc(db, "videos", videoDoc.id))
      );
      await Promise.all(deleteVideoPromises);

      // Delete the course document
      await deleteDoc(doc(db, "courses", id));
      return true;
    } catch (error) {
      console.error("Error deleting course and associated videos:", error);
      return false;
    }
  }, []);

  return {
    createCourse,
    editCourse,
    deleteCourse,
  };
};