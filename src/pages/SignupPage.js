import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'; // <-- 1. Import toast

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    prn: '',
    password: '',
  });
  // We no longer need the 'message' state
  const navigate = useNavigate();

  const { email, prn, password } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    // A loading toast shows a spinner while the request is happening
    const toastId = toast.loading('Creating your account...');

    try {
      const API_URL = 'https://studyshare-backend-xo81.onrender.com/api/auth/signup';
      const res = await axios.post(API_URL, formData);
      
      // Update the toast to show success
      toast.success(res.data.msg, { id: toastId });

      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      const errorMsg = err.response ? err.response.data.msg : 'An error occurred. Please try again.';
      // Update the toast to show an error
      toast.error(errorMsg, { id: toastId });
      console.error(err.response ? err.response.data : err.message);
    }
  };

  // The JSX is the same, but we can remove the {message && ...} line
  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
          StudyShare
        </h1>
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Create Your Account
          </h2>
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email Address</label>
              <input id="email" type="email" name="email" value={email} onChange={onChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label htmlFor="prn" className="block text-sm font-medium text-gray-600">PRN (Student ID)</label>
              <input id="prn" type="text" name="prn" value={prn} onChange={onChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
              <input id="password" type="password" name="password" value={password} onChange={onChange} minLength="6" required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                Create Account
              </button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
