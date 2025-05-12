import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Tabs, Tab, Box } from "@mui/material";
import { BookOpen, Zap, Award, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import statCard from "/images/statcard.png";
import statCard2 from "/images/statcard2.png";
import { Link, useNavigate } from 'react-router-dom';

import { getUserVideoProgress } from "@/lib/utils";
import { getRecentlyWatchedVideos } from "@/hooks/useProgress";
import VideoCard from "@/components/course/VideoCard";
import Loader from "@/components/Loader";

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};


export interface Course {
  id: string;
  title: string;
  description: string;
  visibility: "everyone" | "private";
  createdAt?: string;
  updatedAt?: string;
  thumbnail?: string;
  videos?: number;
  views?: number;
}

export default function StudentDashboard() {
  const [tabIndex, setTabIndex] = useState(0);
  const [freeCourses, setFreeCourses] = useState<Course[]>([]);
  const [premiumCourses, setPremiumCourses] = useState<Course[]>([]);
  const [hasValidSubscription, setHasValidSubscription] = useState(false);
  const [totalCoursesToGo, setTotalCoursesToGo] = useState(0);
  const [completedCourseCount, setCompletedCourseCount] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [recentVideos, setRecentVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const user = useSelector((state: RootState) => state.user);
  const coursesInStore = useSelector((state: RootState) => state.courses);
  const navigate = useNavigate();


  const navigateToSubscriptions = () => {
    navigate('/subscriptions');
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  // Check if user has a valid subscription
  useEffect(() => {
    const checkSubscription = () => {
      if (
        user?.subscriptions?.mentorship &&
        (user.subscriptions.mentorship.plan === "personal" ||
          user.subscriptions.mentorship.plan === "grouped") &&
        user.subscriptions.mentorship.status === "active"
      ) {
        setHasValidSubscription(true);
      } else {
        setHasValidSubscription(false);
      }
    };

    checkSubscription();
  }, [user]);

  // Fetch courses based on visibility and user subscription
  useEffect(() => {
    const filteredFreeCourses = coursesInStore.courses.filter(
      (course) => course.visibility === "everyone",
    );
    const filteredPremiumCourses = coursesInStore.courses.filter(
      (course) => course.visibility === "private",
    );
    setFreeCourses(filteredFreeCourses);
    setPremiumCourses(filteredPremiumCourses);

    if (hasValidSubscription) {
      setTotalCoursesToGo(
        filteredFreeCourses.length + filteredPremiumCourses.length,
      );
    } else {
      setTotalCoursesToGo(filteredFreeCourses.length);
    }
  }, [coursesInStore, hasValidSubscription]);

  useEffect(() => {
    const fetchCompletedCourses = async () => {
      const eligibleCourses = hasValidSubscription
        ? coursesInStore.courses
        : coursesInStore.courses.filter((c) => c.visibility === "everyone");

      const progress = await getUserVideoProgress(user?.id, eligibleCourses.map((c) => c.id));

      // Count how many courses have 100% progress
      const completedCount = Object.values(progress.courses).filter(c => c.progress === 100).length;

      setCompletedCourseCount(completedCount);
      setProgressPercentage(progress.overallProgress);
    };

    if (user?.id && coursesInStore.courses.length > 0) {
      fetchCompletedCourses();
    }
  }, [user?.id, coursesInStore.courses, hasValidSubscription]);

  // Fetch recently watched videos    
  useEffect(() => {
    const loadRecentlyWatched = async () => {
      setLoading(true);
      const videos = await getRecentlyWatchedVideos(user?.id);
      setRecentVideos(videos);
      setLoading(false);
    };

    if (user?.id) {
      loadRecentlyWatched();
    }
  }, [user?.id]);
  
  // Function to render course card
  const renderCourseCard = (course, index) => (
    <motion.div
      key={course.id}
      whileTap={{ scale: 0.95 }}
      className="p-2 card text-white rounded-xl cursor-pointer px-2 shadow-md 
                 lg:transition-transform lg:hover:scale-105"
    >
      <Link 
        to={`/courses/c/${course.id}`} 
        className="flex flex-col h-full"
      >
        {/* Thumbnail */}
        <div className="w-full h-32 bg-gray-300 rounded-lg mb-3 flex items-center justify-center">
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center">
              <span className="text-yellow-500 text-2xl font-bold mr-2">
                {index + 1}
              </span>
              <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded uppercase">
                COURSE
              </span>
            </div>
            <h4 className="font-medium mt-1 text-foreground">{course.title}</h4>
            <div className="flex items-center mt-2 gap-2">
              <div className="h-6 w-6 rounded-lg bg-gray-500">
                <img
                  src="/images/thumbnail.png"
                  alt="ZionFX"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <p className="text-xs text-black dark:text-gray-400 mt-1">
                Uploaded By ZionFX
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );

  return (
    <div className="w-full select-none">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex flex-col gap-4 px-2 sm:px-6">
          {/* Desktop Layout - Progress Section at top - ONLY visible on large screens */}
          <div className="hidden lg:block w-full mt-10 lg:px-20">
              <div
                className="card rounded-3xl shadow-lg overflow-hidden py-4 bg-cover bg-center dark:hidden"
                style={{ backgroundImage: `url(${statCard2})` }}
              >
              <div className="flex items-center justify-between p-4 px-10 rounded-3xl">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold text-yellow-500">Hello,</h2>
                  <h3 className="text-2xl font-bold text-foreground">
                    {user?.username?.charAt(0).toUpperCase() +
                      user.username.slice(1)}
                  </h3>
                  <p className="text-sm dark:text-gray-300 text-gray-700">
                    Welcome back to your learning!
                  </p>
                </div>

                <div className="border-l border-l-4 border-gray-700 dark:border-gray-200 pl-6 ml-6 h-[15vh] flex flex-col justify-center">
                  <p className="text-center mb-4 font-semibold">
                    CURRENT PROGRESS
                  </p>

                  <div className="flex items-center justify-start">
                    <div className="text-center px-8">
                      <p className="text-3xl font-bold text-foreground">{progressPercentage}%</p>
                      <p className="text-xs dark:text-gray-300 text-gray-700">
                        completed
                      </p>
                    </div>
                    <div className="text-center px-8 border-l border-gray-700 dark:border-gray-200">
                      <p className="text-3xl font-bold text-foreground">{completedCourseCount.toLocaleString()}</p>
                      <p className="text-xs dark:text-gray-300 text-gray-700">
                        Courses done
                      </p>
                    </div>
                    <div className="text-center px-8 border-l border-gray-700 dark:border-gray-200">
                      <p className="text-3xl font-bold text-foreground">
                        {totalCoursesToGo}
                      </p>
                      <p className="text-xs text-yellow-600">Total Courses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
                className="card rounded-3xl shadow-lg overflow-hidden py-4 bg-cover bg-center hidden dark:block"
                style={{ backgroundImage: `url(${statCard})` }}
              >
              <div className="flex items-center justify-between p-4 px-10 rounded-3xl">
                <div className="flex flex-col gap-2">
                  <h2 className="text-2xl font-bold text-yellow-500">Hello,</h2>
                  <h3 className="text-2xl font-bold text-foreground">
                    {user?.username?.charAt(0).toUpperCase() +
                      user.username.slice(1)}
                  </h3>
                  <p className="text-sm dark:text-gray-300 text-gray-700">
                    Welcome back to your learning!
                  </p>
                </div>

                <div className="border-l border-l-4 border-gray-700 dark:border-gray-200 pl-6 ml-6 h-[15vh] flex flex-col justify-center">
                  <p className="text-center mb-4 font-semibold">
                    CURRENT PROGRESS
                  </p>

                  <div className="flex items-center justify-start">
                    <div className="text-center px-8">
                      <p className="text-3xl font-bold text-foreground">{progressPercentage}%</p>
                      <p className="text-xs dark:text-gray-300 text-gray-700">
                        completed
                      </p>
                    </div>
                    <div className="text-center px-8 border-l border-gray-700 dark:border-gray-200">
                      <p className="text-3xl font-bold text-foreground">{completedCourseCount.toLocaleString()}</p>
                      <p className="text-xs dark:text-gray-300 text-gray-700">
                        Courses done
                      </p>
                    </div>
                    <div className="text-center px-8 border-l border-gray-700 dark:border-gray-200">
                      <p className="text-3xl font-bold text-foreground">
                        {totalCoursesToGo}
                      </p>
                      <p className="text-xs text-yellow-400">Total Courses</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main Content Area */}
            <div className="md:flex-1 order-2 md:order-1">
              <Box className="mt-2 md:px-20">
                <Tabs
                  value={tabIndex}
                  onChange={handleTabChange}
                  scrollButtons="auto"
                  textColor="inherit"
                  TabIndicatorProps={{ style: { backgroundColor: "#FFD700" } }}
                  sx={{
                    "& .MuiTab-root": {
                      color: "#888",
                      fontSize: { xs: "0.6rem", md: "1rem" },
                      textTransform: "none",
                      padding: { xs: "8px 12px", md: "12px 20px" },
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: { xs: "1px", md: "6px" },
                    },
                    "& .Mui-selected": {
                      color: "#FFD700",
                    },
                    "& .MuiTabs-flexContainer": {
                      gap: 1,
                    },
                  }}
                >
                  <Tab
                    icon={<BookOpen className="h-4 w-4" />}
                    label="Overview"
                    iconPosition="start"
                  />
                  <Tab
                    icon={<Zap className="h-4 w-4" />}
                    label="Free Courses"
                    iconPosition="start"
                  />
                  <Tab
                    icon={<Award className="h-4 w-4" />}
                    label="Premium"
                    iconPosition="start"
                  />
                </Tabs>

                {/* Tab Content Container with consistent height */}
                <Box
                  sx={{ padding: { xs: 2, lg: 3 } }}
                  className="text-black dark:text-white lg:px-0"
                >
                  {/* Tab 0: Overview with visual card styles */}
                  {tabIndex === 0 && (
                    <div>
                      <h3 className="font-semibold text-lg text-foreground mb-4">
                        Your Learning Path
                      </h3>
                      <p className="text-[12px] md:text-sm text-gray-600 dark:text-gray-300 py-2">
                        Continue where you left off:
                      </p>
                      <div className="">
                        {/* Mobile layout kept as is */}
                        <div className="space-y-3 mb-4 lg:hidden">
                          {loading ? (
                            <div className="h-full min-h-[10rem] w-full flex-center flex-col">
                              <Loader />
                            </div>
                          ) : recentVideos.map((vid: any) => (
                            <VideoCard
                              key={vid.id}
                              video={vid}
                              onSelect={() => navigate(`/courses/v/${vid.id}`)}
                              formatDuration={formatDuration}
                            />
                          ))}
                        </div>

                        {/* Desktop enhanced grid layout */}
                        <div className="hidden lg:grid lg:grid-cols-2 2xl:grid-cols-3 gap-6">
                          {freeCourses.map((course: any) => (
                            <Link
                              to={`/courses/c/${course.id}`}
                              key={course.id}
                              className="p-4 card border dark:border-zinc-700 rounded-xl cursor-pointer hover:scale-[1.01] transition-all shadow-sm"
                            >
                              <div className="flex flex-col gap-3">
                                <img
                                  src={course.thumbnail}
                                  alt={course.title}
                                  className="w-full h-40 object-cover rounded-md"
                                />
                                <div className="flex flex-col">
                                  <h4 className="text-lg font-bold text-foreground">
                                    {course.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground">
                                    Uploaded by ZionFX
                                  </p>
                                  <div className="flex justify-between items-center mt-3">
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      Estimated Time: 45 mins
                                    </div>
                                    <div className="bg-yellow-500 text-black text-xs px-3 py-1 rounded-full">
                                      {course.level || "BEGINNER"}
                                    </div>
                                  </div>
                                  <div className="mt-3 flex justify-between">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                      <div
                                        className="bg-yellow-500 h-2.5 rounded-full"
                                        style={{ width: "25%" }}
                                      ></div>
                                    </div>
                                    <span className="ml-2 text-xs font-medium text-foreground">
                                      25%
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tab 1: Free Courses */}
                  {tabIndex === 1 && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-lg text-foreground">
                          All free courses
                        </h3>
                        <button className="bg-yellow-500 text-black text-sm font-bold px-4 py-1 rounded-full">
                          {freeCourses.length} Courses
                        </button>
                      </div>

                      {/* Mobile layout */}
                      <div className="space-y-3 mb-4 lg:hidden">
                        {freeCourses.map((course: any, index) =>
                          renderCourseCard(course, index),
                        )}
                      </div>

                      {/* Desktop enhanced grid layout */}
                      <div className="hidden md:grid md:grid-cols-2 gap-6">
                        {freeCourses.map((course: any, index) => (
                          <Link
                            key={course.id}
                            to={`/courses/c/${course.id}`}
                            className="p-4 card text-foreground rounded-xl cursor-pointer shadow-md transition-transform hover:scale-105"
                          >
                            <div className="flex flex-col h-full">
                              {/* Thumbnail */}
                              <div className="w-full h-40 bg-gray-300 rounded-lg mb-3">
                                <img
                                  src={course.thumbnail}
                                  alt={course.title}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>

                              <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                  <span className="text-yellow-500 text-2xl font-bold mr-2">
                                    {index + 1}
                                  </span>
                                  <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded uppercase">
                                    BEGINNER
                                  </span>
                                </div>
                              </div>

                              <h4 className="font-medium mt-2 text-foreground text-lg">
                                {course.title}
                              </h4>
                              <div className="flex items-center mt-auto pt-4 gap-2">
                                <div className="h-6 w-6 rounded-lg bg-gray-500">
                                  <img
                                    src="/images/thumbnail.png"
                                    alt="ZionFX"
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                </div>
                                <p className="text-xs text-black dark:text-gray-400">
                                  Uploaded By ZionFX
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Premium */}
                  {tabIndex === 2 && (
                    <div className="space-y-4">
                      {hasValidSubscription ? (
                        <>
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-lg text-foreground">
                              Premium Courses
                            </h3>
                            <button className="bg-yellow-500 text-black text-sm font-bold px-4 py-1 rounded-full">
                              {premiumCourses.length} Courses
                            </button>
                          </div>

                          {/* Mobile layout */}
                          <div className="space-y-3 mb-4 lg:hidden">
                            {premiumCourses.map((course: any, index) =>
                              renderCourseCard(course, index),
                            )}
                          </div>

                          {/* Desktop enhanced grid layout */}
                          <div className="hidden md:grid md:grid-cols-2 gap-6">
                            {premiumCourses.map((course: any, index) => (
                              <Link
                                key={course.id}
                                to={`/courses/c/${course.id}`}
                                className="p-4 card text-foreground rounded-xl cursor-pointer shadow-md transition-transform hover:scale-105 relative"
                              >
                                <div className="flex flex-col h-full">
                                  {/* Thumbnail */}
                                  <div className="w-full h-40 bg-gray-300 rounded-lg mb-3">
                                    <img
                                      src={course.thumbnail}
                                      alt={course.title}
                                      className="w-full h-full object-cover rounded-lg"
                                    />
                                  </div>

                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                      <span className="text-yellow-500 text-2xl font-bold mr-2">
                                        {index + 1}
                                      </span>
                                      <span className="bg-yellow-500 text-black text-xs px-2 py-1 rounded uppercase">
                                       ADVANCED
                                      </span>
                                    </div>
                                  </div>

                                  <h4 className="font-medium mt-2 text-foreground text-lg">
                                    {course.title}
                                  </h4>
                                  
                                  <div className="flex items-center mt-auto pt-4 gap-2">
                                    <div className="h-6 w-6 rounded-lg bg-gray-500">
                                      <img
                                        src="/images/thumbnail.png"
                                        alt="ZionFX"
                                        className="w-full h-full object-cover rounded-lg"
                                      />
                                    </div>
                                    <p className="text-xs text-black dark:text-gray-400">
                                      Uploaded By ZionFX
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="text-center space-y-4 py-10">
                          <img
                            src="/icons/invader.svg"
                            alt="Empty"
                            width={100}
                            height={100}
                            className="mx-auto"
                          />
                          <h3 className="font-semibold text-sm md:text-lg text-foreground">
                            You can't access Premium Courses Yet
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            Subscribe to Access Premium Content
                          </p>
                          <button className="px-4 py-4 bg-yellow-500 hover:bg-yellow-600 text-foreground rounded-xl text-sm font-bold mt-2"  onClick={navigateToSubscriptions}>
                            Upgrade to Premium
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                </Box>
              </Box>
            </div>

            {/* Only visible on mobile */}
            <div className="order-1 lg:order-2 lg:hidden lg:w-80 lg:flex-shrink-0">
              <div className="lg:sticky lg:top-4 lg:self-start">
                <div className="p-6 space-y-6 card rounded-2xl shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold tracking-tight text-black dark:text-yellow-500">
                        Hello,{" "}
                        <span className="text-foreground">
                          {user?.username?.charAt(0).toUpperCase() +
                            user.username.slice(1)}
                        </span>
                      </h2>
                      <p className="text-foreground font-medium text-[12px]">
                        Welcome Back!
                      </p>
                    </div>
                  </div>
                  <hr className="h-[2px] bg-gray-700 dark:bg-gray-200" />
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-semibold text-foreground uppercase">
                        CURRENT PROGRESS
                      </h3>
                    </div>
                    <div className="flex justify-between text-center text-foreground">
                      <div>
                        <p className="text-xl font-bold text-foreground">{progressPercentage}%</p>
                        <p className="text-xs text-foreground">Completed</p>
                      </div>
                      <div className="border-l border-gray-700 dark:border-gray-200"></div>
                      <div>
                        <p className="text-xl font-bold text-foreground">{completedCourseCount.toLocaleString()}</p>
                        <p className="text-xs text-foreground">Course{completedCourseCount > 1 && 's'} done</p>
                      </div>
                      <div className="border-l border-gray-700 dark:border-gray-200"></div>
                      <div>
                        <p className="text-xl font-bold text-foreground">
                          {totalCoursesToGo}
                        </p>
                        <p className="text-xs text-red-500 dark:text-yellow-400">
                          Total Courses
                        </p>
                      </div>
                    </div>
                  </div>
                  {!hasValidSubscription && (
                    <div className="flex justify-center items-center">
                      <div className="bg-background h-30 w-full rounded-tl-xl rounded-tr-xl rounded-bl-xl flex flex-col justify-end px-4 py-3">
                        <div className="flex flex-row justify-between">
                          <img
                            src="/images/thumbnail.png"
                            alt="ZionFX"
                            className="w-10 h-10 object-cover rounded-lg mb-2"
                          />
                          <div className="bg-gray-500/40 w-10 h-10 rounded-full flex items-center justify-center"  onClick={navigateToSubscriptions}>
                            <ArrowRight className="w-6 h-6 text-yellow-500" />
                          </div>
                        </div>
                        <h1 className="text-md font-bold text-foreground">
                          Upgrade your account!
                        </h1>
                        <p className="text-xs text-foreground">
                          Unlock all courses and live sessions
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
