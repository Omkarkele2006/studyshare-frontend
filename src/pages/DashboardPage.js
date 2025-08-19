import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

// --- ICONS ---
const DownloadIcon = () => (
  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
);

const MenuIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
);

const DashboardPage = () => {
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for mobile sidebar
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        const res = await API.get('/api/notes', config);
        setNotes(res.data);
      } catch (err) {
        console.error('Error fetching notes:', err);
        if (err.response && err.response.status === 401) {
          handleLogout();
        }
      }
    };
    fetchNotes();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDownload = async (noteId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { 'x-auth-token': token },
        responseType: 'blob',
      };
      const res = await API.get(`/api/notes/download/${noteId}`, config);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
      alert('Download failed. Please try again.');
    }
  };

  const filteredNotes = Array.isArray(notes)
    ? notes.filter(note =>
        note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex">
      {/* --- Sidebar --- */}
      {/* On medium screens and up (md:), it's always visible. On smaller screens, its visibility is controlled by 'isSidebarOpen' state. */}
      <aside className={`bg-white shadow-md fixed md:relative z-10 w-64 h-full transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6">
          <h1 className="text-3xl font-bold text-blue-600">StudyShare</h1>
        </div>
        <nav className="mt-6 p-2">
          <a href="/dashboard" className="block py-2.5 px-4 bg-blue-100 text-blue-600 font-semibold rounded-lg">
            Dashboard
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
      <main className="flex-1 p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          {/* Hamburger Menu Button - only visible on small screens (md:hidden) */}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-gray-600">
            <MenuIcon />
          </button>
          <h2 className="text-xl md:text-3xl font-semibold text-gray-800">Available Notes</h2>
        </div>
        
        {/* Search Bar */}
        <div className="mb-8">
            <input
                type="text"
                placeholder="Search by title or subject..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* --- Notes Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div key={note._id} className="bg-white shadow-lg rounded-xl p-6 flex flex-col justify-between transition-transform hover:scale-105">
                <div>
                  <span className="inline-block bg-blue-100 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
                    {note.subject}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{note.title}</h3>
                  <p className="text-sm text-gray-500">Year: {note.year}</p>
                </div>
                <button
                  onClick={() => handleDownload(note._id, note.fileName)}
                  className="mt-4 w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <DownloadIcon />
                  Download
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full">No notes found matching your search.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
