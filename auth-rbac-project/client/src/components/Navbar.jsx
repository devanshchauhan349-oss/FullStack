import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav>
      <h2>Secure Auth + RBAC</h2>
      
      <div className="nav-links">
        {user ? (
          <>
            <span>
              Welcome, <strong>{user.username}</strong>
              <span className={`role-badge ${user.role === 'admin' ? 'admin-badge' : 'user-badge'}`}>
                {user.role.toUpperCase()}
              </span>
            </span>

            <Link to="/dashboard">Dashboard</Link>
            
            {user.role === 'admin' && (
              <Link to="/admin">Admin Panel</Link>
            )}

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;