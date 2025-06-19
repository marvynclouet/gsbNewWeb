import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {

  return (
    <div>
      <Outlet />
    </div>
  );
};

export default PrivateRoute; 

// const token = localStorage.getItem('token');

// if (!token) {
//   return <Navigate to="/login" replace />;
// }