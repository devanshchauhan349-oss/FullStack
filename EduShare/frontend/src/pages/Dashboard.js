import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUserAndResources();
    }, []);

    const fetchUserAndResources = async () => {
        try {
            const token = localStorage.getItem('token');
            const [userRes, resourcesRes] = await Promise.all([
                axios.get('http://localhost:5000/api/auth/me', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5000/api/resources/my-resources', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setUser(userRes.data);
            setResources(resourcesRes.data);
        } catch (error) {
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resource?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/resources/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResources(resources.filter(r => r._id !== id));
                toast.success('Resource deleted');
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">📊 My Dashboard</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back, {user?.name}! 👋</p>
                </div>
                <Link to="/upload" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                    + Upload New Resource
                </Link>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                    <div className="text-3xl mb-2">📚</div>
                    <div className="text-2xl font-bold">{resources.length}</div>
                    <div className="text-gray-600">Total Resources</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                    <div className="text-3xl mb-2">⬇️</div>
                    <div className="text-2xl font-bold">{resources.reduce((sum, r) => sum + r.downloads, 0)}</div>
                    <div className="text-gray-600">Total Downloads</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                    <div className="text-3xl mb-2">👁️</div>
                    <div className="text-2xl font-bold">{resources.reduce((sum, r) => sum + r.views, 0)}</div>
                    <div className="text-gray-600">Total Views</div>
                </div>
            </div>
            
            {/* My Resources */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <h2 className="text-xl font-bold p-6 border-b">My Uploaded Resources</h2>
                {resources.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">You haven't uploaded any resources yet</p>
                        <Link to="/upload" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                            Upload Your First Resource
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y">
                        {resources.map(resource => (
                            <div key={resource._id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xl">
                                            {resource.type === 'pdf' ? '📄' : resource.type === 'video' ? '🎥' : '📝'}
                                        </span>
                                        <h3 className="font-semibold">{resource.title}</h3>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {resource.subject} • {resource.type.toUpperCase()} • 📅 {new Date(resource.createdAt).toLocaleDateString()}
                                    </p>
                                    <div className="flex gap-4 text-sm mt-1">
                                        <span>👁️ {resource.views} views</span>
                                        <span>⬇️ {resource.downloads} downloads</span>
                                        <span>⭐ {resource.avgRating?.toFixed(1) || '0'}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link to={`/resource/${resource._id}`} className="text-blue-600 hover:text-blue-800">
                                        View
                                    </Link>
                                    <button onClick={() => handleDelete(resource._id)} className="text-red-600 hover:text-red-800">
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;