import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

// API Base URL - Uses environment variable for production, localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const styles = {
  container: { maxWidth: '1200px', margin: '0 auto', padding: '20px' },
  nav: { background: '#3b82f6', color: 'white', padding: '15px 20px', display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' },
  navLink: { color: 'white', textDecoration: 'none', padding: '8px 15px', borderRadius: '5px', transition: 'background 0.3s' },
  card: { background: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' },
  button: { background: '#3b82f6', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' },
  buttonDanger: { background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' },
  buttonSuccess: { background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' },
  input: { width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' },
  select: { width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' },
  textarea: { width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px', minHeight: '100px' }
};

function Navbar({ user, onLogout }) {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.navLink}>🏠 Home</Link>
      <Link to="/explore" style={styles.navLink}>🔍 Explore</Link>
      <Link to="/upload" style={{...styles.navLink, background: '#10b981'}}>📤 Upload</Link>
      {user ? (
        <>
          <Link to="/dashboard" style={styles.navLink}>📊 Dashboard</Link>
          {user.role === 'admin' && (
            <Link to="/admin" style={styles.navLink}>⚙️ Admin</Link>
          )}
          <span style={{ marginLeft: 'auto' }}>👋 {user.name}</span>
          <button onClick={onLogout} style={{ ...styles.buttonDanger, padding: '5px 15px' }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ ...styles.navLink, marginLeft: 'auto' }}>🔐 Login</Link>
          <Link to="/register" style={styles.navLink}>📝 Register</Link>
        </>
      )}
    </nav>
  );
}

function Home() {
  return (
    <div style={styles.container}>
      <div style={{ textAlign: 'center', padding: '60px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '10px', color: 'white' }}>
        <h1 style={{ fontSize: '48px' }}>📚 EduShare</h1>
        <p style={{ fontSize: '20px', marginBottom: '30px' }}>Share Knowledge, Inspire Learning</p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <Link to="/explore"><button style={styles.button}>🔍 Explore Resources</button></Link>
          <Link to="/upload"><button style={{...styles.button, background: '#10b981'}}>📤 Upload Resource</button></Link>
        </div>
      </div>
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <h2>Welcome to EduShare</h2>
        <p>The platform for collecting and sharing educational resources</p>
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('✅ Login successful! Redirecting...');
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 1000);
      } else {
        setMessage(`❌ ${data.message || 'Login failed'}`);
      }
    } catch (error) {
      setMessage('❌ Cannot connect to server. Make sure backend is running');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        <div style={styles.card}>
          <h2>🔐 Login to EduShare</h2>
          <form onSubmit={handleSubmit}>
            <input type="email" placeholder="Email" style={styles.input} value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" style={styles.input} value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" disabled={loading} style={{ ...styles.button, width: '100%', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          {message && <p style={{ marginTop: '10px', textAlign: 'center' }}>{message}</p>}
          <p style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center' }}>
            <strong>Demo Accounts:</strong><br />
            Admin: admin@edushare.com / 123456<br />
            Contributor: contributor@test.com / 123456
          </p>
        </div>
      </div>
    </div>
  );
}

function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setMessage('✅ Registration successful!');
        setTimeout(() => navigate('/'), 1000);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      setMessage('❌ Registration failed');
    }
  };

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        <div style={styles.card}>
          <h2>📝 Create Account</h2>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Full Name" style={styles.input} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input type="email" placeholder="Email" style={styles.input} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            <input type="password" placeholder="Password (min 6 chars)" style={styles.input} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            <select style={styles.select} value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              <option value="student">Student (Learn)</option>
              <option value="contributor">Contributor (Share Resources)</option>
            </select>
            <button type="submit" style={{ ...styles.button, width: '100%' }}>Register</button>
          </form>
          {message && <p style={{ marginTop: '10px', textAlign: 'center' }}>{message}</p>}
        </div>
      </div>
    </div>
  );
}

function Explore() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', subject: 'all', type: 'all' });
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchResources();
    fetchSubjects();
  }, [filters]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_URL}/api/resources?${params}`);
      const data = await res.json();
      setResources(data.resources || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch(`${API_URL}/api/subjects`);
      const data = await res.json();
      setSubjects(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDownload = async (resourceId, resourceType, fileUrl, externalLink, title) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('❌ Please login to download resources');
      return;
    }
    
    try {
      const registerRes = await fetch(`${API_URL}/api/resources/${resourceId}/download`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await registerRes.json();
      
      if (data.success) {
        if (resourceType === 'link' && externalLink) {
          window.open(externalLink, '_blank');
          alert('✅ Opening external link in new tab!');
        } else if (fileUrl) {
          const downloadUrl = `${API_URL}/api/download/${resourceId}`;
          const fileResponse = await fetch(downloadUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (fileResponse.ok) {
            const blob = await fileResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title || 'resource'}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            alert('✅ Download started!');
          } else {
            alert('❌ File not found on server');
          }
        }
        fetchResources();
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('❌ Download failed');
    }
  };

  const getTypeIcon = (type) => {
    const icons = { pdf: '📄', video: '🎥', notes: '📝', link: '🔗' };
    return icons[type] || '📄';
  };

  if (loading) return <div style={styles.container}>Loading resources...</div>;

  return (
    <div style={styles.container}>
      <h1>🔍 Explore Educational Resources</h1>
      
      <div style={{ background: '#f3f4f6', padding: '15px', borderRadius: '8px', marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input type="text" placeholder="Search..." style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '5px', flex: 1 }} 
          value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
        <select style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} 
          value={filters.subject} onChange={e => setFilters({ ...filters, subject: e.target.value })}>
          <option value="all">All Subjects</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }} 
          value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}>
          <option value="all">All Types</option>
          <option value="pdf">PDF</option>
          <option value="video">Video</option>
          <option value="notes">Notes</option>
          <option value="link">Link</option>
        </select>
        <button onClick={() => setFilters({ search: '', subject: 'all', type: 'all' })} style={styles.button}>Clear</button>
      </div>
      
      {resources.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>No resources found.</p>
          <Link to="/upload"><button style={{...styles.button, background: '#10b981'}}>📤 Upload a Resource</button></Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {resources.map(r => (
            <div key={r.id} style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '24px' }}>{getTypeIcon(r.type)}</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>{r.type.toUpperCase()}</span>
              </div>
              <Link to={`/resource/${r.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <h3 style={{ margin: '10px 0' }}>{r.title}</h3>
              </Link>
              <p style={{ color: '#6b7280', fontSize: '14px' }}>{r.description?.substring(0, 100)}...</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                <span style={{ background: '#e5e7eb', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{r.subject}</span>
                {r.tags?.slice(0, 2).map(t => <span key={t} style={{ background: '#e5e7eb', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{t}</span>)}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px', fontSize: '14px', color: '#6b7280' }}>
                <span>⭐ {r.avgRating?.toFixed(1) || '0'}</span>
                <span>👁️ {r.views}</span>
                <span>⬇️ {r.downloads}</span>
              </div>
              <button onClick={() => handleDownload(r.id, r.type, r.fileUrl, r.externalLink, r.title)} 
                style={{ ...styles.button, width: '100%', marginTop: '15px' }}>
                ⬇️ Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceDetail() {
  const { id } = useParams();
  const [resource, setResource] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    fetchResource();
  }, [id]);

  const fetchResource = async () => {
    try {
      const res = await fetch(`${API_URL}/api/resources/${id}`);
      const data = await res.json();
      setResource(data);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmitReview = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to review');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/reviews/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ rating, comment })
      });
      if (res.ok) {
        setMessage('✅ Review submitted!');
        fetchResource();
        setComment('');
        setRating(5);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('❌ Failed to submit review');
      }
    } catch (error) {
      setMessage('❌ Failed to submit review');
    }
  };

  const handleDownload = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('❌ Please login to download');
      return;
    }
    
    try {
      const registerRes = await fetch(`${API_URL}/api/resources/${resource.id}/download`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await registerRes.json();
      
      if (data.success) {
        if (resource.type === 'link' && resource.externalLink) {
          window.open(resource.externalLink, '_blank');
          alert('✅ Opening external link!');
        } else if (resource.fileUrl) {
          const downloadUrl = `${API_URL}/api/download/${resource.id}`;
          const fileResponse = await fetch(downloadUrl, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          if (fileResponse.ok) {
            const blob = await fileResponse.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${resource.title}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            alert('✅ Download started!');
          } else {
            alert('❌ File not found');
          }
        }
        fetchResource();
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('❌ Download failed');
    }
  };

  if (!resource) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      <Link to="/explore">← Back to Explore</Link>
      <div style={styles.card}>
        <h1>{resource.title}</h1>
        <p>By {resource.uploaderName} | {resource.subject} | {resource.type.toUpperCase()}</p>
        <p>{resource.description}</p>
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px', padding: '20px', background: '#f3f4f6', borderRadius: '8px' }}>
          <div>⭐ {resource.avgRating?.toFixed(1) || '0'}</div>
          <div>👁️ {resource.views}</div>
          <div>⬇️ {resource.downloads}</div>
        </div>
        <button onClick={handleDownload} style={{ ...styles.button, marginTop: '20px', width: '100%' }}>📥 Download Resource</button>
      </div>
      
      <div style={styles.card}>
        <h3>Reviews & Ratings</h3>
        {message && <p style={{ color: 'green', marginBottom: '10px' }}>{message}</p>}
        {user && (
          <div style={{ marginBottom: '20px', padding: '15px', background: '#f9fafb', borderRadius: '8px' }}>
            <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} onClick={() => setRating(s)} style={{ fontSize: '24px', cursor: 'pointer', color: s <= rating ? '#fbbf24' : '#d1d5db' }}>★</span>
              ))}
            </div>
            <textarea value={comment} onChange={e => setComment(e.target.value)} placeholder="Write your review..." style={styles.textarea} />
            <button onClick={handleSubmitReview} style={styles.buttonSuccess}>Submit Review</button>
          </div>
        )}
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map(r => (
            <div key={r.id} style={{ borderBottom: '1px solid #e5e7eb', padding: '10px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ display: 'flex', gap: '2px' }}>{[...Array(5)].map((_, i) => <span key={i} style={{ color: i < r.rating ? '#fbbf24' : '#d1d5db' }}>★</span>)}</div>
                <strong>{r.userName}</strong>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <p style={{ marginTop: '5px' }}>{r.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Dashboard() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyResources();
  }, []);

  const fetchMyResources = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/resources/my-resources`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setResources(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`${API_URL}/api/resources/${id}`, { 
        method: 'DELETE', 
        headers: { 'Authorization': `Bearer ${token}` } 
      });
      fetchMyResources();
      alert('Resource deleted');
    } catch (error) {
      alert('Delete failed');
    }
  };

  const totalDownloads = resources.reduce((s, r) => s + r.downloads, 0);
  const totalViews = resources.reduce((s, r) => s + r.views, 0);

  if (loading) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1>📊 My Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={styles.card}><h3>My Resources</h3><div style={{ fontSize: '32px' }}>{resources.length}</div></div>
        <div style={styles.card}><h3>Total Downloads</h3><div style={{ fontSize: '32px' }}>{totalDownloads}</div></div>
        <div style={styles.card}><h3>Total Views</h3><div style={{ fontSize: '32px' }}>{totalViews}</div></div>
      </div>
      <Link to="/upload"><button style={{...styles.button, background: '#10b981'}}>+ Upload New Resource</button></Link>
      {resources.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '40px' }}>You haven't uploaded any resources yet.</p>
      ) : (
        resources.map(r => (
          <div key={r.id} style={{ ...styles.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{r.title}</strong><br />
              <small>{r.type} | {r.subject} | 👁️ {r.views} | ⬇️ {r.downloads}</small>
            </div>
            <button onClick={() => handleDelete(r.id)} style={styles.buttonDanger}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

function UploadResource() {
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'pdf', subject: '', topic: '', tags: '', courseYear: '1st', externalLink: ''
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const subjects = ['Computer Science', 'Mathematics', 'Physics', 'Engineering', 'Biology', 'Chemistry', 'Economics', 'History', 'English', 'Art'];

  if (!token) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '60px', background: '#fef3c7', borderRadius: '10px' }}>
          <h2>🔒 Login Required</h2>
          <p>You need to be logged in to upload resources.</p>
          <Link to="/login"><button style={styles.button}>Go to Login</button></Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('subject', formData.subject);
    formDataToSend.append('topic', formData.topic);
    formDataToSend.append('tags', formData.tags);
    formDataToSend.append('courseYear', formData.courseYear);
    
    if (formData.type === 'link') {
      formDataToSend.append('externalLink', formData.externalLink);
    }
    
    if (file && formData.type !== 'link') {
      formDataToSend.append('file', file);
    }
    
    try {
      const response = await fetch(`${API_URL}/api/resources`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formDataToSend
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ Resource uploaded successfully!');
        setTimeout(() => {
          navigate('/explore');
        }, 2000);
      } else {
        setMessage(`❌ Upload failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage(`❌ Upload failed: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>📤 Share Educational Resource</h1>
      <p>Logged in as: <strong>{user?.name}</strong> ({user?.role})</p>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <form onSubmit={handleSubmit} style={styles.card}>
          <div>
            <label><strong>Title *</strong></label>
            <input type="text" placeholder="Enter resource title" style={styles.input} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          </div>
          
          <div>
            <label><strong>Description *</strong></label>
            <textarea placeholder="Describe your resource" rows="4" style={styles.textarea} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required />
          </div>
          
          <div>
            <label><strong>Resource Type *</strong></label>
            <select style={styles.select} value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
              <option value="pdf">📄 PDF Document</option>
              <option value="video">🎥 Video</option>
              <option value="notes">📝 Notes</option>
              <option value="link">🔗 External Link</option>
            </select>
          </div>
          
          {formData.type === 'link' ? (
            <div>
              <label><strong>External Link URL *</strong></label>
              <input type="url" placeholder="https://example.com/resource" style={styles.input} value={formData.externalLink} onChange={e => setFormData({...formData, externalLink: e.target.value})} required />
              <small>Example: YouTube video, online article, documentation</small>
            </div>
          ) : (
            <div>
              <label><strong>Upload File</strong></label>
              <input type="file" accept=".pdf,.mp4,.jpg,.png,.txt,.doc,.docx" style={styles.input} onChange={e => setFile(e.target.files[0])} required />
              <small>Supported: PDF, MP4, JPG, PNG, DOC, TXT (Max 50MB)</small>
            </div>
          )}
          
          <div>
            <label><strong>Subject *</strong></label>
            <select style={styles.select} value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required>
              <option value="">Select a subject</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div>
            <label><strong>Topic *</strong></label>
            <input type="text" placeholder="e.g., JavaScript, Calculus, Algorithms" style={styles.input} value={formData.topic} onChange={e => setFormData({...formData, topic: e.target.value})} required />
          </div>
          
          <div>
            <label><strong>Tags (comma separated)</strong></label>
            <input type="text" placeholder="e.g., programming, tutorial, beginner" style={styles.input} value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} />
            <small>Helps others find your resource</small>
          </div>
          
          <div>
            <label><strong>Course Year</strong></label>
            <select style={styles.select} value={formData.courseYear} onChange={e => setFormData({...formData, courseYear: e.target.value})}>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>
          
          {message && (
            <div style={{
              padding: '12px',
              marginTop: '15px',
              borderRadius: '8px',
              background: message.includes('✅') ? '#d1fae5' : '#fee2e2',
              color: message.includes('✅') ? '#065f46' : '#991b1b',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}
          
          <button type="submit" disabled={submitting} style={{ ...styles.button, width: '100%', marginTop: '20px', padding: '12px', fontSize: '16px', background: '#10b981', opacity: submitting ? 0.6 : 1 }}>
            {submitting ? 'Uploading...' : '📤 Upload Resource'}
          </button>
        </form>
      </div>
    </div>
  );
}

function AdminPanel() {
  const [resources, setResources] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const [resourcesRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/resources`, { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch(`${API_URL}/api/admin/stats`, { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      setResources(await resourcesRes.json());
      setStats(await statsRes.json());
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return;
    const token = localStorage.getItem('token');
    await fetch(`${API_URL}/api/admin/resources/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
    fetchData();
  };

  if (loading) return <div style={styles.container}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h1>⚙️ Admin Panel</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div style={styles.card}><h3>Total Resources</h3><div style={{ fontSize: '32px' }}>{stats.totalResources || 0}</div></div>
        <div style={styles.card}><h3>Total Users</h3><div style={{ fontSize: '32px' }}>{stats.totalUsers || 0}</div></div>
        <div style={styles.card}><h3>Total Downloads</h3><div style={{ fontSize: '32px' }}>{stats.totalDownloads || 0}</div></div>
      </div>
      <h2>All Resources ({resources.length})</h2>
      {resources.map(r => (
        <div key={r.id} style={{ ...styles.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>{r.title}</strong><br />
            <small>By {r.uploaderName} | {r.subject} | Downloads: {r.downloads}</small>
          </div>
          <button onClick={() => handleDelete(r.id)} style={styles.buttonDanger}>Delete</button>
        </div>
      ))}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/resource/:id" element={<ResourceDetail />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<UploadResource />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;