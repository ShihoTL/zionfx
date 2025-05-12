import { useSelector } from 'react-redux';
import { RootState } from '@/store/store'

import AdminDashboard from '@/components/dashboard/AdminDashboard';
import StudentDashboard from '@/components/dashboard/StudentDashboard';

const Dashboard = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <div className="w-full h-full">
      {user?.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />}
    </div>
  )
}

export default Dashboard;