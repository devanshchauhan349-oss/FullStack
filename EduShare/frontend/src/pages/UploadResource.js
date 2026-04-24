import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const UploadResource = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'pdf',
        subject: '',
        topic: '',
        tags: '',
        courseYear: '1st',
        externalLink: ''
    });
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key]) data.append(key, formData[key]);
        });
        if (file) data.append('file', file);
        
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/resources', data, {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
            });
            toast.success('Resource uploaded successfully!');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Share Educational Resource</h1>
            
            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <div className="space-y-4">
                    <input type="text" placeholder="Title *" required className="w-full p-2 border rounded dark:bg-gray-700"
                        value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                    
                    <textarea placeholder="Description *" required rows="4" className="w-full p-2 border rounded dark:bg-gray-700"
                        value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                    
                    <select className="w-full p-2 border rounded dark:bg-gray-700"
                        value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                        <option value="pdf">PDF Document</option>
                        <option value="video">Video</option>
                        <option value="notes">Notes</option>
                        <option value="link">External Link</option>
                    </select>
                    
                    {formData.type === 'link' ? (
                        <input type="url" placeholder="External Link URL" className="w-full p-2 border rounded dark:bg-gray-700"
                            value={formData.externalLink} onChange={(e) => setFormData({...formData, externalLink: e.target.value})} />
                    ) : (
                        <input type="file" accept=".pdf,.mp4,.jpg,.png" className="w-full p-2 border rounded dark:bg-gray-700"
                            onChange={(e) => setFile(e.target.files[0])} />
                    )}
                    
                    <input type="text" placeholder="Subject *" required className="w-full p-2 border rounded dark:bg-gray-700"
                        value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                    
                    <input type="text" placeholder="Topic *" required className="w-full p-2 border rounded dark:bg-gray-700"
                        value={formData.topic} onChange={(e) => setFormData({...formData, topic: e.target.value})} />
                    
                    <input type="text" placeholder="Tags (comma separated)" className="w-full p-2 border rounded dark:bg-gray-700"
                        value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} />
                    
                    <select className="w-full p-2 border rounded dark:bg-gray-700"
                        value={formData.courseYear} onChange={(e) => setFormData({...formData, courseYear: e.target.value})}>
                        <option value="1st">1st Year</option>
                        <option value="2nd">2nd Year</option>
                        <option value="3rd">3rd Year</option>
                        <option value="4th">4th Year</option>
                    </select>
                    
                    <button type="submit" disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        {loading ? 'Uploading...' : 'Upload Resource'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UploadResource;