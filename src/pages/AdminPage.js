import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// --- (Keep all the existing Icon and Modal components) ---
const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
);
const StatsIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
);
const CloseIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
);
const StatsModal = ({ note, downloads, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">Download Stats for "{note.title}"</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800"><CloseIcon /></button>
                </div>
                {downloads.length > 0 ? (
                    <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
                        {downloads.map(download => (
                            <li key={download._id} className="py-3">
                                <p className="text-sm font-medium text-gray-900">Email: {download.user.email}</p>
                                <p className="text-sm text-gray-500">PRN: {download.user.prn}</p>
                                <p className="text-xs text-gray-400">Time: {new Date(download.createdAt).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                ) : ( <p className="text-gray-500">This note has not been downloaded yet.</p> )}
            </div>
        </div>
    );
};

const AdminPage = () => {
  // ... (Keep all the existing state and functions: formData, file, notes, modal state, fetchNotes, handlers, etc.)
    const [formData, setFormData] = useState({ title: '', subject: '', year: '' });
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [notes, setNotes] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);
    const [downloadStats, setDownloadStats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => { fetchNotes(); }, []);

    const fetchNotes = async () => {
        try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'x-auth-token': token } };
        const res = await API.get('/api/notes', config);
        setNotes(res.data);
        } catch (err) {
        toast.error('Could not fetch notes.');
        }
    };

    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onFileChange = (e) => setFile(e.target.files[0]);

    const onUploadSubmit = async (e) => {
        e.preventDefault();
        if (!file) return toast.error('Please select a file.');
        
        setIsLoading(true);
        const toastId = toast.loading('Uploading file...');
        
        const uploadData = new FormData();
        uploadData.append('title', formData.title);
        uploadData.append('subject', formData.subject);
        uploadData.append('year', formData.year);
        uploadData.append('noteFile', file);

        try {
        const token = localStorage.getItem('token');
        const config = { headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token } };
        await API.post('/api/notes/upload', uploadData, config);
        
        toast.success('File uploaded successfully!', { id: toastId });
        setFormData({ title: '', subject: '', year: '' });
        setFile(null);
        e.target.reset();
        fetchNotes();
        } catch (err) {
        const errorMsg = err.response?.data?.msg || 'Upload failed.';
        toast.error(errorMsg, { id: toastId });
        } finally {
        setIsLoading(false);
        }
    };

    const handleDelete = (noteId) => {
        toast((t) => (
        <div className="flex flex-col items-center">
            <p className="font-semibold">Are you sure?</p>
            <div className="mt-4">
            <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={async () => {
                toast.dismiss(t.id);
                const deleteToastId = toast.loading('Deleting note...');
                try {
                    const token = localStorage.getItem('token');
                    const config = { headers: { 'x-auth-token': token } };
                    await API.delete(`/api/notes/${noteId}`, config);
                    toast.success('Note deleted!', { id: deleteToastId });
                    fetchNotes();
                } catch (err) {
                    toast.error('Could not delete note.', { id: deleteToastId });
                }
                }}
            >
                Delete
            </button>
            <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={() => toast.dismiss(t.id)}
            >
                Cancel
            </button>
            </div>
        </div>
        ), { duration: 6000 });
    };

    const handleViewStats = async (note) => {
        setSelectedNote(note);
        setIsModalOpen(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await API.get(`/api/notes/${note._id}/downloads`, config);
            setDownloadStats(res.data);
        } catch (error) {
            toast.error('Could not fetch download stats.');
            setIsModalOpen(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex-shrink-0">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-purple-600">StudyShare</h1>
          <span className="text-sm font-semibold text-gray-500">Admin Panel</span>
        </div>
        {/* --- THIS IS THE CHANGE --- */}
        <nav className="mt-6 p-2 space-y-2">
          <a href="/admin" className="block py-2.5 px-4 bg-purple-100 text-purple-600 font-semibold rounded-lg">
            Manage Notes
          </a>
          <a href="/admin/users" className="block py-2.5 px-4 text-gray-600 hover:bg-purple-50 rounded-lg">
            Manage Users
          </a>
          <a href="/admin/requests" className="block py-2.5 px-4 text-gray-600 hover:bg-purple-50 rounded-lg">
            View Requests
          </a>
        </nav>
        <div className="absolute bottom-0 p-4 w-64">
           <button onClick={handleLogout} className="w-full text-left py-2.5 px-4 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors">
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-x-auto">
        {/* ... (The rest of the main content JSX remains the same) ... */}
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload New Note</h2>
          <form onSubmit={onUploadSubmit} className="space-y-6">
             <div><label htmlFor="title" className="block text-sm font-medium text-gray-600">Title</label><input id="title" type="text" name="title" value={formData.title} onChange={onChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
            <div><label htmlFor="subject" className="block text-sm font-medium text-gray-600">Subject</label><input id="subject" type="text" name="subject" value={formData.subject} onChange={onChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
            <div><label htmlFor="year" className="block text-sm font-medium text-gray-600">Year</label><input id="year" type="text" name="year" value={formData.year} onChange={onChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" /></div>
            <div><label htmlFor="noteFile" className="block text-sm font-medium text-gray-600">File</label><input id="noteFile" type="file" name="noteFile" onChange={onFileChange} required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200" /></div>
            <div><button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:bg-purple-300">{isLoading ? 'Uploading...' : 'Upload Note'}</button></div>
          </form>
        </div>
        <div className="bg-white shadow-xl rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Manage Existing Notes</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {notes.map((note) => (
                            <tr key={note._id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{note.title}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{note.subject}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{note.year}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-4">
                                    <button onClick={() => handleViewStats(note)} className="text-blue-600 hover:text-blue-900 flex items-center">
                                        <StatsIcon />
                                        <span className="ml-1">Stats</span>
                                    </button>
                                    <button onClick={() => handleDelete(note._id)} className="text-red-600 hover:text-red-900 flex items-center">
                                        <TrashIcon />
                                        <span className="ml-1">Delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      </main>
      {isModalOpen && <StatsModal note={selectedNote} downloads={downloadStats} onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default AdminPage;
