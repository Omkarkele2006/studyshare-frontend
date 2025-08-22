import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const OtpVerificationPage = () => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the email passed from the signup page
  const email = location.state?.email;

  // Redirect if the email is not available (e.g., user navigates directly)
  if (!email) {
    navigate('/signup');
    return null; // Render nothing while redirecting
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Verifying OTP...');

    try {
      const res = await API.post('/api/auth/verify-otp', { email, otp });
      toast.success(res.data.msg, { id: toastId });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response ? err.response.data.msg : 'An error occurred.';
      toast.error(errorMsg, { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          StudyShare
        </h1>
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            Check Your Email
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            We've sent a 6-digit verification code to <strong>{email}</strong>.
          </p>
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-600">
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength="6"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm text-center tracking-[1em] text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Verify Account
              </button>
            </div>
          </form>
           <p className="mt-6 text-center text-sm text-gray-600">
            Didn't receive the code?{' '}
            <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-500">
              Sign up again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerificationPage;
