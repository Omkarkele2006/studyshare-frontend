import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';

const RequestNotePage = () => {
    const [formData, setFormData] = useState({
        subject: '',
        topic: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { subject, topic } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const toastId = toast.loading('Submitting your request...');

        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            await API.post('/api/requests', formData, config);
            
            toast.success('Request submitted successfully!', { id: toastId });
            navigate('/dashboard'); // Go back to the dashboard after success
        } catch (err) {
            const errorMsg = err.response?.data?.msg || 'Could not submit request.';
            toast.error(errorMsg, { id: toastId });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 font-sans flex justify-center items-center p-4">
            <div className="w-full max-w-lg">
                <div className="bg-white shadow-xl rounded-2xl p-8">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-2">
                        Request a Note
                    </h2>
                    <p className="text-center text-sm text-gray-500 mb-6">
                        Can't find what you're looking for? Let us know!
                    </p>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-600">
                                Subject
                            </label>
                            <input
                                id="subject"
                                type="text"
                                name="subject"
                                value={subject}
                                onChange={onChange}
                                required
                                placeholder="e.g., Data Structures"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-gray-600">
                                Topic / Assignment Name
                            </label>
                            <input
                                id="topic"
                                type="text"
                                name="topic"
                                value={topic}
                                onChange={onChange}
                                required
                                placeholder="e.g., Assignment 3 - Binary Search Trees"
                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="flex items-center justify-end space-x-4 pt-2">
                            <Link to="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-gray-800">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="inline-flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                            >
                                {isLoading ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RequestNotePage;
