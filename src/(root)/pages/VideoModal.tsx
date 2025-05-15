import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ListVideo,
  CheckCircle,
} from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import VideoCard from "@/components/course/VideoCard";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { selectUser } from '@/store/selectors/userSelectors';
import { selectVideos } from '@/store/selectors/videosSelectors'

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

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatDurationWithLabel = (seconds: number): { formatted: string; label: string } => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  if (hrs > 0) return { formatted: `${hrs}`, label: hrs === 1 ? "Hour" : "Hours" };
  if (mins > 0) return { formatted: `${mins}`, label: mins === 1 ? "Minute" : "Minutes" };
  if (secs > 0) return { formatted: `${secs}`, label: secs === 1 ? "Second" : "Seconds" };
  return { formatted: "0", label: "Second" };
};

const formatAsD_M_YY = (createdAt: string | Date | { toDate: () => Date }) => {
  const date =
    typeof createdAt === "object" && "toDate" in createdAt
      ? createdAt.toDate()
      : new Date(createdAt);
  return `${date.getDate()}/${date.getMonth() + 1}/${String(date.getFullYear()).slice(-2)}`;
};


const VideoModal = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { videoId } = useParams();
  const navigate = useNavigate();
  
  const user = useSelector(selectUser);
  
  const videosInstore = useSelector(selectVideos);

  const video = videosInstore.find((v) => v.id === videoId)
  const [videos, setVideos] = useState<Video[]>(videosInstore.filter((v) => v.courseId === video?.courseId))


  const [userId, setUserId] = useState<string>(user?.id)
  const [maxProgressTime, setMaxProgressTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCourseListOpen, setIsCourseListOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<Video>(video || ({} as Video));
  const [progressKey, setProgressKey] = useState(0);

  const { progressLoaded, progressError, saveProgressIfNeeded } = useProgress(
    userId,
    currentVideo.id,
    currentVideo.courseId,
    videoRef,
    videos,
    false,
    progressKey
  );

  useEffect(() => {
    if (video && !currentVideo?.id) {
      setCurrentVideo(video);
    }
  }, [video, currentVideo?.id]);

  useEffect(() => {
    if (!currentVideo.videoUrl) setError("Video URL is missing");
    else if (progressError) setError(progressError);
    else setError(null);
  }, [progressError]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const switchVideo = useCallback(
    async (newVideo: Video) => {
      if (newVideo.id === currentVideo.id) return;
      if (videoRef.current) {
        await saveProgressIfNeeded();
        videoRef.current.pause();
      }
      setCurrentVideo(newVideo);
      setMaxProgressTime(0);
      setDuration(0);
      setProgressKey((prev) => prev + 1);
      navigate(`/courses/v/${newVideo.id}`);
    },
    [saveProgressIfNeeded, navigate]
  );

  const currentIndex = videos.findIndex((v) => v.id === currentVideo.id);
  const nextVideo = currentIndex < videos.length - 1 ? videos[currentIndex + 1] : null;
  const isCurrentVideoCompleted = duration > 0 && maxProgressTime >= duration * 0.95;

  const ddmmyy = useMemo(() => formatAsD_M_YY(currentVideo.created_at || new Date()), [
    currentVideo.created_at,
  ]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed md:absolute top-0 left-0 h-full w-full bg-light-1 dark:bg-black inset-0 z-[999] flex items-start justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-[100dvh] dw-full bg-background rounded-lg flex flex-col lg:flex-row relative overflow-y-auto pb-[8rem]">
          {/* Video Player */}
          <div className="sticky top-0 w-full max-w-[700px] aspect-video z-50">
            <div className="w-full aspect-video overflow-hidden relative">
              {error ? (
                <div className="w-full h-full flex items-center justify-center text-red-500 p-4 text-center">
                  {error}
                </div>
              ) : (
                <video
                  key={currentVideo.id}
                  ref={videoRef}
                  controls
                  controlsList="nodownload"
                  className="w-full h-full bg-[#1e1e1e]/20 dark:bg-[#EDEDED]/10"
                  poster={currentVideo.thumbnail}
                  autoPlay={progressLoaded}
                  onLoadedMetadata={(e) => {
                    const target = e.target as HTMLVideoElement;
                    setDuration(target.duration);
                  }}
                  onTimeUpdate={(e) => {
                    const target = e.target as HTMLVideoElement;
                    setMaxProgressTime((prev) => Math.max(prev, target.currentTime));
                  }}
                >
                  <source src={currentVideo.videoUrl || ""} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>

            <button
              onClick={() => {
                navigate(`/courses/c/${currentVideo.courseId}`);
                videoRef.current = null;
              }}
              className="absolute top-3 left-3 hover:bg-black/20 p-2 rounded-full"
              aria-label="Close video modal"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
          </div>

          {/* Sidebar Info */}
          <div className="relative h-full w-full">
            <div className="px-4 py-2 space-y-6 overflow-y-auto">
              <h2 className="text-xl font-bold">{currentVideo.title}</h2>

              <div className="flex items-center justify-around py-4">
                <StatBlock title="Views" value={currentVideo.views || 0} />
                <StatBlock {...formatDurationWithLabel(currentVideo.duration ?? 0)} />
                <StatBlock title="Uploaded" value={ddmmyy} />
              </div>

              <div className="card p-2 rounded-lg">
                <p className="line-clamp-4">{currentVideo.description || "No description available"}</p>
              </div>

              {/* Progress */}
              <div className="space-y-2 my-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Your Progress</h2>
                  {progressLoaded && isCurrentVideoCompleted && (
                    <div className="flex items-center text-green-500 text-sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Completed
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Track how much of this video you've watched. Progress is saved automatically.
                </p>

                {!progressLoaded ? (
                  <div className="w-full h-2 bg-muted animate-pulse rounded-full" />
                ) : (
                  <div className="w-full h-2 bg-black/20 dark:bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isCurrentVideoCompleted ? "bg-yellow-500" : "bg-black dark:bg-white"
                      }`}
                      style={{
                        width: `${
                          duration > 0
                            ? Math.min((maxProgressTime / duration) * 100, 100)
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Course List Toggle */}
            <AnimatePresence>
              {isCourseListOpen ? (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "100%" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="absolute top-0 left-0 bg-background shadow-md w-full h-full md:min-h-[100dvh] p-4"
                >
                  <div className="flex items-center justify-between pb-4">
                    <div className="w-full flex flex-col">
                      <div className="w-full flex items-center space-x-2">
                        <h2 className="truncate text-xl font-bold">
                          {currentVideo.title.length > 10
                            ? currentVideo.title.slice(0, 27) + "..."
                            : currentVideo.title}
                        </h2>
                        •
                        <p className="text-sm text-muted-foreground">
                          {currentIndex + 1}/{videos.length}
                        </p>
                      </div>
                      <p className="text-sm text-muted-foreground">Zion FX</p>
                    </div>
                    <button onClick={() => setIsCourseListOpen(false)} className="mb-5 ml-1">
                      <ChevronDown className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    {videos.map((vid) => (
                      <VideoCard
                        key={vid.id}
                        video={vid}
                        onSelect={() => switchVideo(vid)}
                        formatDuration={formatDuration}
                      />
                    ))}
                  </div>
                </motion.div>
              ) : (
                <div className="fixed md:absolute bottom-0 p-4 w-full">
                  <div
                    onClick={() => setIsCourseListOpen(true)}
                    className="p-4 rounded-lg flex items-center justify-between w-full card bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <ListVideo className="h-5 w-5" />
                      <div className="text-left">
                        <p className="text-sm line-clamp-1 font-medium">
                          {currentIndex + 1 === videos.length
                            ? "End of Course"
                            : `Next: ${nextVideo?.title}`}
                        </p>
                        
                        <div className="w-full flex text-black/40 dark:text-white/40 items-center space-x-2">
                          <p className="text-sm text-muted-foreground ">
                              {currentVideo.title.length > 10
                              ? currentVideo.title.slice(0, 27) + "..."
                              : currentVideo.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {currentIndex + 1}/{videos.length}
                          </p>
                        </div>
                      </div>
                    </div>
                    <ChevronUp className="h-5 w-5" />
                  </div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const StatBlock = ({ title, value, formatted, label }: { title?: string; value?: string | number; formatted?: string; label?: string }) => (
  <div className="flex flex-col items-center">
    <h2 className="text-lg md:text-xl font-black">{value || formatted}</h2>
    <p className="text-[10px] md:text-[13px] text-muted-foreground">{title || label}</p>
  </div>
);

export default VideoModal;