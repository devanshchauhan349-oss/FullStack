import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await register(name, email, password, role);
        setLoading(false);
        if (success) navigate('/');
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-center mb-6">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Full Name" required className="w-full p-2 border rounded dark:bg-gray-700"
                        value={name} onChange={(e) => setName(e.target.value)} />
                    <input type="email" placeholder="Email" required className="w-full p-2 border rounded dark:bg-gray-700"
                        value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password (min 6 characters)" required className="w-full p-2 border rounded dark:bg-gray-700"
                        value={password} onChange={(e) => setPassword(e.target.value)} />
                    <select className="w-full p-2 border rounded dark:bg-gray-700" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="student">Student (Learn)</option>
                        <option value="contributor">Contributor (Share Resources)</option>
                    </select>
                    <button type="submit" disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                        {loading ? 'Creating account...' : 'Register'}
                    </button>
                </form>
                <p className="text-center mt-4">Already have an account? <Link to="/login" className="text-blue-600">Login</Link></p>
            </div>
        </div>
    );
};

export default Register;