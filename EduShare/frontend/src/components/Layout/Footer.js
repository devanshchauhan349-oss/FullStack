import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner mt-16 transition-colors duration-200">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">EduShare</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Empowering education through collaborative resource sharing.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Home</Link></li>
              <li><Link to="/explore" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Explore</Link></li>
              <li><Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><Link to="/upload" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Share Resource</Link></li>
              <li><Link to="/dashboard" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">My Dashboard</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-white mb-3">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © 2024 EduShare. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;