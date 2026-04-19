import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="unauthorized-container">
      <div style={{ fontSize: '6rem', marginBottom: '10px' }}>🚫</div>
      <h1>403 - Access Denied</h1>
      <h2>You don't have permission to access this page</h2>
      
      <div style={{ 
        margin: '30px 0', 
        padding: '25px', 
        background: 'white', 
        borderRadius: '12px',
        maxWidth: '500px',
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: '0 5px 15px rgba(0,0,0,0.08)'
      }}>
        <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '20px' }}>
          This page is restricted to <strong>Admin users only</strong>.<br />
          Please login with an account that has Admin privileges.
        </p>
        
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard" className="back-btn">
            ← Back to Dashboard
          </Link>
          
          <Link 
            to="/login" 
            style={{
              background: '#64748b',
              color: 'white',
              padding: '14px 28px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: '500'
            }}
          >
            Login with Another Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;