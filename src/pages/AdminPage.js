import React, { useState } from 'react';
import axios from 'axios'; // We will use the default axios for this test
import { useNavigate } from 'react-router-dom';

const AdminPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    year: '',
  });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const { title, subject, year } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }
    setIsLoading(true);
    setMessage('');

    const uploadData = new FormData();
    uploadData.append('title', title);
    uploadData.append('subject', subject);
    uploadData.append('year', year);
    uploadData.append('noteFile', file);

    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token,
        },
      };

      // --- THIS IS THE HARDCODED FIX ---
      // We are putting the full URL directly here to bypass any build issues.
      const API_URL = 'https://studyshare-backend-xo81.onrender.com/api/notes/upload';
      
      await axios.post(API_URL, uploadData, config);
      
      setMessage('File uploaded successfully!');
      setFormData({ title: '', subject: '', year: '' });
      setFile(null);
      e.target.reset();

    } catch (err) {
      console.error(err.response ? err.response.data : err.message);
      setMessage(err.response ? err.response.data.msg : 'Upload failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ... the rest of your styled return() function remains the same
  return (
    <div className="min-h-screen bg-slate-100 font-sans flex">
      {/* --- Admin Sidebar --- */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-purple-600">StudyShare</h1>
          <span className="text-sm font-semibold text-gray-500">Admin Panel</span>
        </div>
        <nav className="mt-6">
          <a href="/admin" className="block py-2.5 px-4 bg-purple-100 text-purple-600 font-semibold rounded-lg">
            Upload Notes
          </a>
        </nav>
        <div className="absolute bottom-0 p-4 w-64">
           <button
            onClick={handleLogout}
            className="w-full text-left py-2.5 px-4 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <main className="flex-1 p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-8">Upload New Note</h2>
        
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl mx-auto">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-600">Title</label>
              <input id="title" type="text" name="title" value={title} onChange={onChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-600">Subject</label>
              <input id="subject" type="text" name="subject" value={subject} onChange={onChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-600">Year</label>
              <input id="year" type="text" name="year" value={year} onChange={onChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label htmlFor="noteFile" className="block text-sm font-medium text-gray-600">File (PDF, DOCX, etc.)</label>
              <input id="noteFile" type="file" name="noteFile" onChange={onFileChange} required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200" />
            </div>
            
            {message && <p className="text-sm text-center text-gray-600">{message}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:bg-purple-300"
              >
                {isLoading ? 'Uploading...' : 'Upload Note'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
