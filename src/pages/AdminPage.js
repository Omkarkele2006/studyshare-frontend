import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// --- A simple Trash Can Icon for the delete button ---
const TrashIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
);

const AdminPage = () => {
  // State for the upload form
  const [formData, setFormData] = useState({ title: '', subject: '', year: '' });
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // State for managing notes
  const [notes, setNotes] = useState([]);
  
  const navigate = useNavigate();

  // --- Fetch all notes when the component loads ---
  useEffect(() => {
    fetchNotes();
  }, []);

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

  // --- Handlers for the upload form ---
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
      fetchNotes(); // Refresh the notes list after uploading
    } catch (err) {
      const errorMsg = err.response?.data?.msg || 'Upload failed.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  // --- Handler for deleting a note ---
  const handleDelete = (noteId) => {
    // We use a custom toast with buttons for confirmation
    toast((t) => (
      <div className="flex flex-col items-center">
        <p className="font-semibold">Are you sure you want to delete this note?</p>
        <div className="mt-4">
          <button
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mr-2"
            onClick={async () => {
              toast.dismiss(t.id); // Close the confirmation toast
              const deleteToastId = toast.loading('Deleting note...');
              try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                await API.delete(`/api/notes/${noteId}`, config);
                toast.success('Note deleted successfully!', { id: deleteToastId });
                fetchNotes(); // Refresh the list
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
    ), { duration: 6000 }); // The toast will stay longer to give time to decide
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
        <nav className="mt-6 p-2">
          <a href="/admin" className="block py-2.5 px-4 bg-purple-100 text-purple-600 font-semibold rounded-lg">
            Manage Notes
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
        {/* Upload Section */}
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload New Note</h2>
          <form onSubmit={onUploadSubmit} className="space-y-6">
            {/* ... form inputs ... */}
             <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-600">Title</label>
              <input id="title" type="text" name="title" value={formData.title} onChange={onChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-600">Subject</label>
              <input id="subject" type="text" name="subject" value={formData.subject} onChange={onChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-600">Year</label>
              <input id="year" type="text" name="year" value={formData.year} onChange={onChange} required className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label htmlFor="noteFile" className="block text-sm font-medium text-gray-600">File</label>
              <input id="noteFile" type="file" name="noteFile" onChange={onFileChange} required className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200" />
            </div>
            <div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors disabled:bg-purple-300">
                {isLoading ? 'Uploading...' : 'Upload Note'}
              </button>
            </div>
          </form>
        </div>

        {/* Manage Notes Section */}
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
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
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
    </div>
  );
};

export default AdminPage;
