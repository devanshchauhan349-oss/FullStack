import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
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

    const fetchAdminData = async () => {
      try {
        const res = await axios.get('/api/admin', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Access denied or server error');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [token, navigate]);

  if (loading) return <div className="main-container"><div className="card"><h2>Loading Admin Panel...</h2></div></div>;

  if (error) {
    return (
      <div className="main-container">
        <div className="card" style={{ borderLeft: '5px solid #ef4444' }}>
          <h2>Access Denied</h2>
          <p style={{ color: '#ef4444' }}>{error}</p>
          <button onClick={() => navigate('/dashboard')} style={{ marginTop: '15px', padding: '10px 20px' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="card">
        <h2>🔐 Admin Panel</h2>
        <p className="status-success">Admin Only - RBAC Protected Successfully</p>
        
        <div style={{ margin: '25px 0', padding: '20px', background: '#fef3c7', borderRadius: '10px' }}>
          <p><strong>Message:</strong> {data?.message}</p>
        </div>

        <p style={{ marginTop: '20px' }}>
          This page demonstrates Role-Based Access Control.<br />
          Normal users will be blocked from accessing this route.
        </p>
      </div>
    </div>
  );
};

export default AdminPanel;