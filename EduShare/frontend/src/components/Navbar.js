import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { darkMode, setDarkMode } = useTheme();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600">
                        📚 EduShare
                    </Link>

                    <div className="flex items-center gap-4">
                        <Link to="/explore" className="text-gray-700 dark:text-gray-300 hover:text-blue-600">🔍 Explore</Link>
                        
                        <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                            {darkMode ? '☀️' : '🌙'}
                        </button>

                        {user ? (
                            <div className="relative">
                                <button onClick={() => setShowMenu(!showMenu)} className="flex items-center gap-2">
                                    👤 {user.name.split(' ')[0]}
                                </button>
                                {showMenu && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2">
                                        <Link to="/dashboard" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                            📊 Dashboard
                                        </Link>
                                        {(user.role === 'contributor' || user.role === 'admin') && (
                                            <Link to="/upload" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                📤 Upload
                                            </Link>
                                        )}
                                        {user.role === 'admin' && (
                                            <Link to="/admin" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                ⚙️ Admin
                                            </Link>
                                        )}
                                        <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-red-600">
                                            🚪 Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;