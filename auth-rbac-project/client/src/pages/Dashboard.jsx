import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { token, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [token, navigate]);

  if (loading) return <div className="main-container"><div className="card"><h2>Loading...</h2></div></div>;

  if (error) {
    return (
      <div className="main-container">
        <div className="card" style={{ borderLeft: '5px solid #ef4444' }}>
          <h2>Error</h2>
          <p style={{ color: '#ef4444' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="card">
        <h2>👋 Welcome to Dashboard, {user?.username}</h2>
        <p className="status-success">✅ Protected Route - Accessible by User & Admin</p>
        
        <div style={{ margin: '25px 0', padding: '20px', background: '#f8fafc', borderRadius: '10px' }}>
          <p><strong>Server Message:</strong> {data?.message}</p>
          <p><strong>Your Role:</strong> 
            <span className={`role-badge ${user?.role === 'admin' ? 'admin-badge' : 'user-badge'}`}>
              {user?.role?.toUpperCase()}
            </span>
          </p>
        </div>

        <div style={{ marginTop: '30px' }}>
          <h3>Role-Based Access Control Demo</h3>
          <p style={{ marginTop: '10px', lineHeight: '1.6' }}>
            This page is visible to both roles.<br />
            Only <strong>Admin</strong> can access the Admin Panel.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;