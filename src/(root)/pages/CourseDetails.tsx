"use client";

import { useMemo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash, Ellipsis, ChevronLeft, Play } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useLocation, Outlet, useNavigate } from "react-router-dom";

import VideoCard from "@/components/course/VideoCard";
import { EditCourseModal } from "@/components/course/edit-course-modal";
import { VideoUploadModal } from "@/components/video-upload-modal";
import { useToast } from "@/components/toast-context";

import { useProgress } from "@/hooks/useProgress";
import { useCourses } from "@/hooks/useCourses";
import { addVideo } from "@/store/slices/videoSlice"; // Make sure this exists

import { selectCourses } from "@/store/selectors/coursesSelectors";
import { selectVideos } from "@/store/selectors/videosSelectors";
import { selectUser } from "@/store/selectors/userSelectors";

interface Course {
  id: string;
  title: string;
  description: string;
  visibility: 'everyone' | 'private';
  created_at?: string;
  thumbnail?: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  courseId: string;
  videoUrl?: string;
  duration?: number;
  views?: number;
  created_at?: string;
}

const defaultCourse: Course = {
  id: '', // Add a default ID
  title: '', // Example default value
  description: '',
  visibility: 'private', // Example default value (modify as needed)
  created_at: '',
  thumbnail: '',
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const ConfirmationModal = ({
  onConfirm,
  onCancel,
  message,
}: {
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
}) => (
  <AnimatePresence>
    <motion.div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="card rounded-2xl p-6 shadow-xl w-[90%] max-w-sm space-y-6"
      >
        <h2 className="text-lg font-semibold text-center text-foreground">{message}</h2>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-300 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700">
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const DropdownMenu = ({ course, onClose }: { course: Course; onClose: () => void }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const dispatch = useDispatch();
  
  const { deleteCourse } = useCourses();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    await deleteCourse(course.id);
    dispatch({ type: "courses/removeCourse", payload: course.id }); // Ensure reducer exists
    setShowConfirm(false);
    onClose();
    navigate("/courses");
    addToast({
      title: "Course Deleted",
      description: `The course "${course.title}" has been deleted.`,
      variant: "success",
    })
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.2 }}
        className="absolute top-[110%] z-50 right-0 mt-2 w-40 card rounded-md shadow-lg"
      >
        <ul className="text-sm text-foreground">
          <li><EditCourseModal course={course} endpoint="courseThumbnail" /></li>
          <li
            className="px-4 py-2 cursor-pointer flex gap-2 items-center"
            onClick={() => setShowConfirm(true)}
          >
            <Trash className="h-5 w-5" /> Delete Course
          </li>
        </ul>
      </motion.div>

      {showConfirm && (
        <ConfirmationModal
          message={`Are you sure you want to delete "${course.title}"?`}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
};

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const user = useSelector((selectUser));
  const userId = user?.id;
  
  const coursesInStore = useSelector(selectCourses);
  
  const videosInstore = useSelector(selectVideos);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [course, setCourse] = useState<Course>(defaultCourse);
  const [videos, setVideos] = useState<Video[]>(videosInstore.filter((v) => v.courseId === courseId))
  
  const { completedCount, completedLoading } = useProgress(
    userId,
    null,
    course.id,
    null,
    videos,
    true
  );

  useEffect(() => {
    if (courseId) {
      const course = coursesInStore.find((c) => c.id === courseId);

      setCourse(course || defaultCourse);
      setVideos(videosInstore.filter((v) => v.courseId === courseId));
    }
  }, [courseId, coursesInStore, videosInstore]);
  
  const totalDuration = useMemo(() => {
    const totalSeconds = videos.reduce((acc, v) => acc + (v.duration || 0), 0);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (!hours && !minutes) return "0 hours";
    return [
      hours > 0 ? `${hours} hour${hours === 1 ? "" : "s"}` : "",
      minutes > 0 ? `${minutes} minute${minutes === 1 ? "" : "s"}` : "",
    ]
      .filter(Boolean)
      .join(" ");
  }, [videos]);

  return (
    <AnimatePresence>
      {course && (
        <motion.div
          className="fixed h-[100dvh] md:static z-50 w-full sm:w-[550px] bg-background left-0 top-0"
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="min-h-[100dvh] max-h-[100dvh] overflow-y-auto">
            <div className="w-full px-4 pt-4 flex justify-between items-center mb-4 z-10">
              <button onClick={() => navigate('/courses')}>
                <ChevronLeft className="h-5 w-5" />
              </button>
              {user.role === "admin" && (
                <div className="relative flex items-center gap-4">
                  <button
                    className="text-foreground/70 hover:text-foreground"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                  >
                    <Ellipsis className="h-5 w-5 rotate-90" />
                  </button>
                  <AnimatePresence>
                    {dropdownOpen && (
                      <DropdownMenu onClose={() => setDropdownOpen(false)} course={course} />
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            <div className="relative px-4 max-w-lg w-full">
              <div className="aspect-video rounded-xl bg-[#1e1e1e] border border-white/30 shadow-sm overflow-hidden my-4">
                <img
                  src={course.thumbnail || "/images/thumbnail.png"}
                  alt={course.title}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="text-foreground/70 text-[14px] space-y-2">
                <h1 className="text-2xl text-foreground font-bold">{course.title}</h1>
                <p>Course • {videos.length.toLocaleString()} Lessons • {totalDuration}</p>
                <p>
                  {completedLoading ? "Loading..." : completedCount} of {videos.length} lessons complete
                </p>
                <p className="line-clamp-3">{course.description}</p>
              </div>

              <div className="flex gap-2 justify-between items-center mt-4">
                {user?.role === "admin" ? (
                  <VideoUploadModal
                    endpoint="video"
                    courseId={course.id}
                    onChange={(video) => {
                      if (video) {
                        dispatch(addVideo({
                          id: video.id,
                          title: video.title,
                          description: video.description,
                          thumbnail: video.thumbnail,
                          courseId: course.id,
                          videoUrl: video.videoUrl,
                          duration: video.duration || 0,
                          views: 0,
                          created_at: new Date().toISOString(),
                        }));
                      }
                    }}
                  />
                ) : (
                  <button
                    className="flex items-center justify-center gap-2 w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 font-bold rounded-full"
                    onClick={() => {
                      if (videos.length > 0) {
                        navigate(`/courses/v/${videos[0].id}`);
                      }
                    }}
                  >
                    <Play className="h-5 w-5 fill-black" /> Play All
                  </button>
                )}
              </div>

              {/* Background Blur */}
              <div className="absolute left-0 bottom-0 w-full h-full inset-0 bg-white/30 dark:bg-black/30 blur-xl z-[-1]" />
              <div className="overflow-hidden h-full w-full absolute top-0 left-0 inset-0 bg-white/30 dark:bg-black/30 blur-2xl z-[-10]">
                <img
                  src={course.thumbnail || "/images/thumbnail.png"}
                  alt={course.title}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="p-4 space-y-4 bg-gradient-to-t from-background to-transparent">
              {videos.length === 0 ? (
                <p>No videos available.</p>
              ) : (
                videos.map((video) => (
                  <VideoCard
                    key={video.id}
                    video={video}
                    onSelect={() =>
                      navigate(`/courses/v/${video.id}`, {
                        state: { background: location },
                      })
                    }
                    formatDuration={formatDuration}
                  />
                ))
              )}
            </div>
          </div>

          
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CourseDetails;