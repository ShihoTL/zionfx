import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { useNavigate, useParams, Outlet } from 'react-router-dom';

// import CourseDetails from '@/components/courses/course-details';
import { CreateCourseModal } from '@/components/course/create-course-modal';
import { selectCourses } from '@/store/selectors/coursesSelectors';

export interface Course {
  id: string;
  title: string;
  description: string;
  visibility: 'everyone' | 'private';
  createdAt?: string;
  updatedAt?: string;
  thumbnail?: string;
  videos?: number;
  views?: number;
}

const CoursesPage = () => {
  const coursesInStore = useSelector(selectCourses);

  const user = useSelector((state: RootState) => state.user);
  
  const navigate = useNavigate();
  const { courseId } = useParams();
  
  const [search, setSearch] = useState('');
  const [courses, setCourses] = useState<Course[]>(coursesInStore);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  
  useEffect(() => {
    if (!courses.length || !user) return;

    if (user.role === 'admin') {
      setFilteredCourses(
        coursesInStore
          .filter(course =>
            course.title.toLowerCase().includes(search.toLowerCase())
          )
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      );
    } else if (user.role === 'student') {
      setFilteredCourses(
        coursesInStore.filter(course => {
          const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
          const hasAccess = user.subscriptions
            ? true
            : course.visibility === 'everyone';
          return matchesSearch && hasAccess;
        })
      );
    }
  }, [coursesInStore, search, user]);
  
  useEffect(() => {
    document.body.style.overflow = 'unset';
  }, [courseId]);

  return (
    <div className="relative flex justify-between h-full w-full">
      <div className="h-full w-full p-4 space-y-8">
        <div className="flex gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-full w-full bg-black/10 dark:bg-white/10 border-gray-600"
          />
          {/* Create Course Button */}
          {user?.role === 'admin' && (
            <CreateCourseModal 
              endpoint="courseThumbnail"
            />
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              onClick={() => navigate(`/courses/c/${course.id}`)}
              className="group cursor-pointer rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-[#1f1f1f]"
            >
              <div className="relative w-full aspect-video overflow-hidden">
                <img
                  src={course.thumbnail || '/images/thumbnail.png'}
                  alt={course.title}
                  className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4 flex flex-col justify-between space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                  {course.title}
                </h3>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <p className="line-clamp-2">{course.description ? course.description : "No description"}</p>
                </div>
              </div>
            </div>
          ))}
          {filteredCourses.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center mt-8">
              No courses found.
            </p>
          )}
        </div>
      </div>

      {/* Course Details Modal */}
      <Outlet />
    </div>
  );
};

export default CoursesPage;