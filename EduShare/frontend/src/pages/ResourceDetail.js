import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const ResourceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resource, setResource] = useState(null);
    const [review, setReview] = useState({ rating: 5, comment: '' });
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetchResource();
    }, [id]);

    const fetchResource = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/resources/${id}`);
            setResource(res.data);
            setReviews(res.data.reviews || []);
        } catch (error) {
            toast.error('Resource not found');
            navigate('/explore');
        }
    };

    const handleDownload = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to download');
            return;
        }
        try {
            await axios.post(`http://localhost:5000/api/resources/${id}/download`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (resource?.fileUrl) {
                window.open(`http://localhost:5000${resource.fileUrl}`, '_blank');
            } else if (resource?.externalLink) {
                window.open(resource.externalLink, '_blank');
            }
            toast.success('Download started');
        } catch (error) {
            toast.error('Download failed');
        }
    };

    const handleReview = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Please login to review');
            return;
        }
        try {
            await axios.post(`http://localhost:5000/api/reviews/${id}`, review, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Review submitted');
            fetchResource();
            setReview({ rating: 5, comment: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Review failed');
        }
    };

    if (!resource) return <div className="text-center py-12">Loading...</div>;

    const getTypeIcon = () => {
        switch(resource.type) {
            case 'pdf': return '📄';
            case 'video': return '🎥';
            case 'notes': return '📝';
            default: return '🔗';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-blue-600 mb-4">
                ← Back
            </button>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{getTypeIcon()}</span>
                    <h1 className="text-3xl font-bold">{resource.title}</h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{resource.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-100 dark:bg-blue-900 px-3 py-1 rounded">📚 {resource.subject}</span>
                    <span className="bg-green-100 dark:bg-green-900 px-3 py-1 rounded">🏷️ {resource.type.toUpperCase()}</span>
                    <span className="bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded">📅 Year {resource.courseYear}</span>
                </div>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm">
                        <span>👁️ {resource.views} views</span>
                        <span>⬇️ {resource.downloads} downloads</span>
                        <span>⭐ {resource.avgRating?.toFixed(1) || '0'} rating</span>
                    </div>
                    <button onClick={handleDownload} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        ⬇️ Download
                    </button>
                </div>
            </div>
            
            {/* Reviews */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">📝 Reviews & Ratings</h2>
                
                {localStorage.getItem('token') && (
                    <div className="border-b pb-4 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="font-semibold">Your Rating:</span>
                            {[1,2,3,4,5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setReview({...review, rating: star})}
                                    className="text-2xl focus:outline-none"
                                >
                                    {star <= review.rating ? '⭐' : '☆'}
                                </button>
                            ))}
                        </div>
                        <textarea
                            rows="3"
                            placeholder="Write your review..."
                            className="w-full p-2 border rounded dark:bg-gray-700 mb-2"
                            value={review.comment}
                            onChange={(e) => setReview({...review, comment: e.target.value})}
                        />
                        <button onClick={handleReview} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                            Submit Review
                        </button>
                    </div>
                )}
                
                {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map(r => (
                        <div key={r._id} className="border-b py-3">
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i}>{i < r.rating ? '⭐' : '☆'}</span>
                                    ))}
                                </div>
                                <span className="font-semibold">👤 {r.user?.name}</span>
                            </div>
                            <p className="mt-1">{r.comment}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleDateString()}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ResourceDetail;