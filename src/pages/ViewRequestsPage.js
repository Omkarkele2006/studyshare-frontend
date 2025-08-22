import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const ViewRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            const res = await API.get('/api/requests', config);
            setRequests(res.data);
        } catch (err) {
            toast.error('Could not fetch note requests.');
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
                <nav className="mt-6 p-2 space-y-2">
                    <a href="/admin" className="block py-2.5 px-4 text-gray-600 hover:bg-purple-50 rounded-lg">
                        Manage Notes
                    </a>
                    <a href="/admin/users" className="block py-2.5 px-4 text-gray-600 hover:bg-purple-50 rounded-lg">
                        Manage Users
                    </a>
                    <a href="/admin/requests" className="block py-2.5 px-4 bg-purple-100 text-purple-600 font-semibold rounded-lg">
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
                <div className="bg-white shadow-xl rounded-2xl p-8">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Student Note Requests</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By (Email)</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {requests.map((request) => (
                                    <tr key={request._id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.subject}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.topic}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{request.requestedBy?.email || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(request.createdAt).toLocaleDateString()}</td>
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

export default ViewRequestsPage;
