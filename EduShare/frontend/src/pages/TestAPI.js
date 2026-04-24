import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TestAPI = () => {
    const [status, setStatus] = useState('Testing...');
    const [resources, setResources] = useState([]);

    useEffect(() => {
        testConnection();
    }, []);

    const testConnection = async () => {
        try {
            // Test basic connection
            const testRes = await axios.get('http://localhost:5000/api/test');
            setStatus(`✅ Backend connected: ${testRes.data.message}`);
            
            // Test resources endpoint
            const resourcesRes = await axios.get('http://localhost:5000/api/resources');
            setResources(resourcesRes.data.resources || []);
        } catch (error) {
            setStatus(`❌ Connection failed: ${error.message}`);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded mb-4">
                <strong>Status:</strong> {status}
            </div>
            <div>
                <strong>Resources Found:</strong> {resources.length}
                {resources.length > 0 && (
                    <ul className="mt-4 space-y-2">
                        {resources.map(r => (
                            <li key={r._id} className="border p-2 rounded">
                                {r.title} - {r.subject}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TestAPI;