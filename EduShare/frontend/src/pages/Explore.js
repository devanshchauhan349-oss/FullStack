import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Explore = () => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ subject: '', type: '', search: '' });
    const [subjects] = useState(['Mathematics', 'Physics', 'Computer Science', 'Engineering', 'Biology', 'Chemistry']);
    const [types] = useState(['pdf', 'video', 'notes', 'link']);

    useEffect(() => {
        fetchResources();
    }, [filters]);

    const fetchResources = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.subject) params.append('subject', filters.subject);
            if (filters.type) params.append('type', filters.type);
            
            const url = `http://localhost:5000/api/resources?${params.toString()}`;
            console.log('Fetching:', url); // Debug log
            
            const res = await axios.get(url);
            console.log('Response:', res.data); // Debug log
            
            if (res.data.success === false) {
                setError(res.data.message);
            } else {
                setResources(res.data.resources || []);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setError(error.response?.data?.message || 'Failed to load resources');
            toast.error('Failed to load resources');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to download');
            return;
        }
        try {
            await axios.post(`http://localhost:5000/api/resources/${id}/download`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Download started');
            fetchResources(); // Refresh to update download count
        } catch (error) {
            toast.error('Download failed');
        }
    };

    const getTypeIcon = (type) => {
        switch(type) {
            case 'pdf': return '📄';
            case 'video': return '🎥';
            case 'notes': return '📝';
            default: return '🔗';
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="text-2xl">Loading resources...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <div className="text-2xl text-red-600">⚠️ Error: {error}</div>
                    <button 
                        onClick={fetchResources}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">🔍 Explore Educational Resources</h1>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search resources..."
                        className="p-2 border rounded dark:bg-gray-700"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    />
                    <select 
                        className="p-2 border rounded dark:bg-gray-700" 
                        value={filters.subject}
                        onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                    >
                        <option value="">All Subjects</option>
                        {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select 
                        className="p-2 border rounded dark:bg-gray-700" 
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    >
                        <option value="">All Types</option>
                        {types.map(t => <option key={t} value={t}>{t.toUpperCase()}</option>)}
                    </select>
                    <button 
                        onClick={() => setFilters({ subject: '', type: '', search: '' })}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Resources Grid */}
            {resources.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold mb-2">No resources found</h3>
                    <p className="text-gray-500">Try adjusting your filters or check back later</p>
                    {localStorage.getItem('token') && (
                        <Link to="/upload" className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded">
                            Upload First Resource
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    <div className="mb-4 text-gray-600">
                        Found {resources.length} resource(s)
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {resources.map((resource) => (
                            <div key={resource._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all resource-card">
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{getTypeIcon(resource.type)}</span>
                                            <span className="text-sm text-gray-500">{resource.type.toUpperCase()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            👁️ {resource.views || 0}
                                            ⬇️ {resource.downloads || 0}
                                        </div>
                                    </div>
                                    
                                    <Link to={`/resource/${resource._id}`}>
                                        <h3 className="text-xl font-semibold mb-2 hover:text-blue-600 line-clamp-2">
                                            {resource.title}
                                        </h3>
                                    </Link>
                                    
                                    <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                                        {resource.description}
                                    </p>
                                    
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">
                                            {resource.subject}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            ⭐ <span>{resource.avgRating?.toFixed(1) || '0'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-sm text-gray-500">
                                            By {resource.uploadedBy?.name || 'Unknown'}
                                        </span>
                                        <button
                                            onClick={() => handleDownload(resource._id)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            ⬇️ Download
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Explore;