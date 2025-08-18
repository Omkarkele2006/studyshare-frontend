import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Check if the token exists in localStorage
  const token = localStorage.getItem('token');

  // If token exists, render the child components (the protected page).
  // Otherwise, navigate to the login page.
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;