import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast'; // <-- 1. Import toast

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  // We no longer need the 'message' state

  const onSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Sending reset link...');

    try {
      const res = await API.post('/api/auth/forgot-password', { email });
      toast.success(res.data.msg, { id: toastId }); // <-- 2. Show success toast
    } catch (err) {
      const errorMsg = err.response ? err.response.data.msg : 'An error occurred. Please try again.';
      toast.error(errorMsg, { id: toastId }); // <-- 3. Show error toast
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          StudyShare
        </h1>
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Forgot Your Password?
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6">
            No problem. Enter your email address below and we'll send you a link to reset it.
          </p>
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Send Reset Link
              </button>
            </div>
          </form>
          {/* We can remove the old message paragraph */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Remembered your password?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
