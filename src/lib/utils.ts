import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getVideoDuration(videoUrl: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video")

    video.preload = "metadata"
    video.src = videoUrl

    video.onloadedmetadata = () => {
      resolve(video.duration)
    }

    video.onerror = () => {
      reject(new Error("Failed to load video metadata"))
    }
  })
}

/**
 * Calculates user's progress across multiple courses by comparing completed videos to total videos.
 * Returns percentage progress for each course and overall.
 */
export const getUserVideoProgress = async (
  userId: string,
  courseIds: string[]
): Promise<{
  totalCourses: number
  overallProgress: number // %
  courses: Record<
    string,
    { total: number; completed: number; progress: number }
  >
}> => {
  const result: Record<
    string,
    { total: number; completed: number; progress: number }
  > = {}
  let totalVideos = 0
  let totalCompleted = 0

  for (const courseId of courseIds) {
    // Get all videos for this course
    const videosQuery = query(
      collection(db, "videos"),
      where("courseId", "==", courseId)
    )
    const videosSnap = await getDocs(videosQuery)
    const videoDocs = videosSnap.docs

    const courseVideoIds = videoDocs.map((doc) => doc.id)
    const totalCourseVideos = courseVideoIds.length
    if (totalCourseVideos === 0) continue

    // Get all completed progress for this user in the course
    const completedQuery = query(
      collection(db, "progress"),
      where("userId", "==", userId),
      where("courseId", "==", courseId),
      where("completed", "==", true)
    )
    const completedSnap = await getDocs(completedQuery)
    const completedCount = completedSnap.docs.length

    const courseProgress = Math.min(
      100,
      Math.round((completedCount / totalCourseVideos) * 100)
    )

    result[courseId] = {
      total: totalCourseVideos,
      completed: completedCount,
      progress: courseProgress
    }

    totalVideos += totalCourseVideos
    totalCompleted += completedCount
  }

  const overallProgress =
    totalVideos === 0
      ? 0
      : Math.min(100, Math.round((totalCompleted / totalVideos) * 100))

  return {
    totalCourses: courseIds.length,
    overallProgress,
    courses: result
  }
}