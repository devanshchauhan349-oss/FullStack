import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UploadTest = () => {
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
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const subjects = ['Computer Science', 'Mathematics', 'Physics', 'Engineering', 'Biology', 'Chemistry', 'Economics', 'History'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('❌ Please login first');
      setLoading(false);
      return;
    }
    
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
      const response = await fetch('http://localhost:5000/api/resources', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });
      
      const data = await response.json();
      console.log('Response:', data);
      
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
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <div style={{ background: 'white', padding: '30px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        <h1 style={{ marginBottom: '20px' }}>📤 Upload New Resource</h1>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label><strong>Title *</strong></label>
            <input
              type="text"
              placeholder="Enter resource title"
              style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label><strong>Description *</strong></label>
            <textarea
              placeholder="Describe your resource"
              rows="4"
              style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label><strong>Resource Type *</strong></label>
            <select
              style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value})}
            >
              <option value="pdf">📄 PDF Document</option>
              <option value="video">🎥 Video</option>
              <option value="notes">📝 Notes</option>
              <option value="link">🔗 External Link</option>
            </select>
          </div>
          
          {formData.type === 'link' ? (
            <div>
              <label><strong>External Link URL *</strong></label>
              <input
                type="url"
                placeholder="https://example.com/resource"
                style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
                value={formData.externalLink}
                onChange={(e) => setFormData({...formData, externalLink: e.target.value})}
                required={formData.type === 'link'}
              />
            </div>
          ) : (
            <div>
              <label><strong>Upload File</strong></label>
              <input
                type="file"
                accept=".pdf,.mp4,.jpg,.png,.txt"
                style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
                onChange={(e) => setFile(e.target.files[0])}
                required={formData.type !== 'link'}
              />
              <small>Supported: PDF, MP4, JPG, PNG (Max 50MB)</small>
            </div>
          )}
          
          <div>
            <label><strong>Subject *</strong></label>
            <select
              style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
            >
              <option value="">Select a subject</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          
          <div>
            <label><strong>Topic *</strong></label>
            <input
              type="text"
              placeholder="e.g., JavaScript, Calculus, Algorithms"
              style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
              value={formData.topic}
              onChange={(e) => setFormData({...formData, topic: e.target.value})}
              required
            />
          </div>
          
          <div>
            <label><strong>Tags (comma separated)</strong></label>
            <input
              type="text"
              placeholder="e.g., programming, tutorial, beginner"
              style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
            />
          </div>
          
          <div>
            <label><strong>Course Year</strong></label>
            <select
              style={{ width: '100%', padding: '10px', margin: '10px 0', border: '1px solid #ddd', borderRadius: '5px' }}
              value={formData.courseYear}
              onChange={(e) => setFormData({...formData, courseYear: e.target.value})}
            >
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
          </div>
          
          {message && (
            <div style={{
              padding: '10px',
              marginTop: '15px',
              borderRadius: '5px',
              background: message.includes('✅') ? '#d4edda' : '#f8d7da',
              color: message.includes('✅') ? '#155724' : '#721c24',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              marginTop: '20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? 'Uploading...' : '📤 Upload Resource'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadTest;