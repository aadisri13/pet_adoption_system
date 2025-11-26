import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const employee = localStorage.getItem('employee');

  if (!isLoggedIn || !employee) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

