import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AdminPanel = () => {
    const [resources, setResources] = useState([]);
    const [stats, setStats] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const [resourcesRes, statsRes] = await Promise.all([
                axios.get('http://localhost:5000/api/admin/resources', {
                    headers: { Authorization: `Bearer ${token}` }
                }),
                axios.get('http://localhost:5000/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                })
            ]);
            setResources(resourcesRes.data);
            setStats(statsRes.data);
        } catch (error) {
            toast.error('Failed to load data');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Delete this resource?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/admin/resource/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResources(resources.filter(r => r._id !== id));
                toast.success('Resource deleted');
            } catch (error) {
                toast.error('Delete failed');
            }
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-gray-500">Total Resources</h3>
                    <p className="text-3xl font-bold">{stats.totalResources || 0}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-gray-500">Total Users</h3>
                    <p className="text-3xl font-bold">{stats.totalUsers || 0}</p>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
                    <h3 className="text-gray-500">Total Downloads</h3>
                    <p className="text-3xl font-bold">{stats.totalDownloads || 0}</p>
                </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <h2 className="text-xl font-bold p-6 border-b">All Resources</h2>
                <div className="divide-y">
                    {resources.map(resource => (
                        <div key={resource._id} className="p-4 flex justify-between items-center">
                            <div>
                                <h3 className="font-semibold">{resource.title}</h3>
                                <p className="text-sm text-gray-500">By {resource.uploadedBy?.name} • {resource.type} • {resource.subject}</p>
                            </div>
                            <button onClick={() => handleDelete(resource._id)} className="text-red-600 hover:text-red-800">
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminPanel;