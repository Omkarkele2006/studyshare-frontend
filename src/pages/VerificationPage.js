import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api/axios'; // Use our central API client

const VerificationPage = () => {
  const [message, setMessage] = useState('Verifying your email, please wait...');
  const { token } = useParams(); // Gets the token from the URL

  useEffect(() => {
    const verifyEmail = async () => {
      if (token) {
        try {
          const res = await API.get(`/api/auth/verify-email/${token}`);
          setMessage(res.data.msg);
        } catch (err) {
          const errorMsg = err.response ? err.response.data.msg : 'Verification failed. Please try again.';
          setMessage(errorMsg);
        }
      } else {
        setMessage('No verification token found.');
      }
    };

    verifyEmail();
  }, [token]); // Run this effect whenever the token changes

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          StudyShare
        </h1>
        <div className="bg-white shadow-xl rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Email Verification
          </h2>
          <p className="text-gray-600">{message}</p>
          <Link to="/login">
            <button className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
              Proceed to Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
