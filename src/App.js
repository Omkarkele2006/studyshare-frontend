import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import OtpVerificationPage from './pages/OtpVerificationPage';
import UserManagementPage from './pages/UserManagementPage';
import RequestNotePage from './pages/RequestNotePage';
import ViewRequestsPage from './pages/ViewRequestsPage'; // <-- 1. Import
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verify-otp" element={<OtpVerificationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            {/* Student Routes */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/request-note" element={<RequestNotePage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/requests" element={<ViewRequestsPage />} /> {/* <-- 2. Add route */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
