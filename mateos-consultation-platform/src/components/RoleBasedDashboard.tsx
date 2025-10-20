import { useAuth } from '@/contexts/AuthContext';
import { useSetPageTitle } from '@/hooks/useSetPageTitle';
import {
    AdminDashboard,
    ParentDashboard,
    StudentDashboard,
    TeacherDashboard
} from './dashboards';

export const RoleBasedDashboard: React.FC = () => {
  const { user } = useAuth();

  // Setăm titlul în funcție de rol
  const getDashboardTitle = (role: string) => {
    switch (role) {
      case 'Parent':
        return 'Dashboard Părinte';
      case 'Student':
        return 'Dashboard Student';
      case 'Teacher':
        return 'Dashboard Profesor';
      case 'Administrator':
        return 'Dashboard Admin';
      default:
        return 'Dashboard';
    }
  };

  useSetPageTitle(user ? getDashboardTitle(user.role) : 'Dashboard');

  if (!user) {
    return <div>Loading...</div>;
  }

  switch (user.role) {
    case 'Parent':
      return <ParentDashboard />;
    case 'Student':
      return <StudentDashboard />;
    case 'Teacher':
      return <TeacherDashboard />;
    case 'Administrator':
      return <AdminDashboard />;
    default:
      return <div>Unknown role: {user.role}</div>;
  }
};