import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [stats, setStats] = useState({
    totalResources: 0,
    totalUsers: 0,
    totalDownloads: 0,
    activeToday: 0
  });
  const [recentResources, setRecentResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Featured testimonials
  const testimonials = [
    { name: "John Doe", role: "Computer Science Student", text: "EduShare has transformed how I study! The resources are amazing.", rating: 5, avatar: "👨‍🎓" },
    { name: "Sarah Johnson", role: "Math Teacher", text: "I love sharing my notes and helping students learn better.", rating: 5, avatar: "👩‍🏫" },
    { name: "Mike Chen", role: "Software Engineer", text: "Found the best coding resources here. Highly recommended!", rating: 5, avatar: "👨‍💻" },
    { name: "Emily Brown", role: "Physics Student", text: "The video lectures saved me during exam preparation!", rating: 5, avatar: "👩‍🔬" }
  ];

  // Popular subjects
  const popularSubjects = [
    { name: "Computer Science", icon: "💻", color: "#3b82f6", count: 245 },
    { name: "Mathematics", icon: "📐", color: "#10b981", count: 189 },
    { name: "Physics", icon: "⚡", color: "#ef4444", count: 156 },
    { name: "Engineering", icon: "🔧", color: "#f59e0b", count: 134 },
    { name: "Biology", icon: "🧬", color: "#8b5cf6", count: 98 },
    { name: "Chemistry", icon: "🧪", color: "#ec4899", count: 87 }
  ];

  useEffect(() => {
    fetchStats();
    fetchRecentResources();
    
    // Auto-rotate featured content
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Track mouse movement for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/resources');
      const data = await res.json();
      setStats({
        totalResources: data.total || 0,
        totalUsers: 1247,
        totalDownloads: 8942,
        activeToday: 342
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Fallback stats
      setStats({
        totalResources: 156,
        totalUsers: 1247,
        totalDownloads: 8942,
        activeToday: 342
      });
    }
  };

  const fetchRecentResources = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/resources');
      const data = await res.json();
      setRecentResources(data.resources?.slice(0, 6) || []);
    } catch (error) {
      console.error('Error fetching recent resources:', error);
    } finally {
      setLoading(false);
    }
  };

  // Animated counter for stats
  const AnimatedCounter = ({ target, suffix = "" }) => {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
      let start = 0;
      const duration = 2000;
      const increment = target / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      
      return () => clearInterval(timer);
    }, [target]);
    
    return <span>{count.toLocaleString()}{suffix}</span>;
  };

  // Parallax style for hero section
  const heroStyle = {
    transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
    transition: 'transform 0.1s ease-out'
  };

  const floatingStyle = {
    animation: 'float 3s ease-in-out infinite'
  };

  // Add animation keyframes
  const animationStyles = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    .stat-card:hover {
      transform: translateY(-5px);
      transition: all 0.3s ease;
    }
    .feature-card {
      animation: slideIn 0.6s ease-out;
    }
    .hover-scale {
      transition: transform 0.3s ease;
    }
    .hover-scale:hover {
      transform: scale(1.05);
    }
  `;

  return (
    <div>
      <style>{animationStyles}</style>
      
      {/* Hero Section with Parallax */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background shapes */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '300px',
          height: '300px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 8s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '200px',
          height: '200px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite reverse'
        }} />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={floatingStyle}>
            <h1 style={{
              fontSize: '64px',
              marginBottom: '20px',
              animation: 'slideIn 0.5s ease-out'
            }}>
              📚 EduShare
            </h1>
          </div>
          <p style={{
            fontSize: '24px',
            marginBottom: '30px',
            opacity: 0.95,
            animation: 'slideIn 0.7s ease-out'
          }}>
            Share Knowledge, Inspire Learning
          </p>
          <div style={{
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'slideIn 0.9s ease-out'
          }}>
            <Link to="/explore">
              <button style={{
                background: 'white',
                color: '#667eea',
                border: 'none',
                padding: '15px 40px',
                fontSize: '18px',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}>
                🔍 Explore Resources →
              </button>
            </Link>
            <Link to="/upload">
              <button style={{
                background: 'transparent',
                color: 'white',
                border: '2px solid white',
                padding: '15px 40px',
                fontSize: '18px',
                borderRadius: '50px',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'white';
                e.target.style.color = '#667eea';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = 'white';
              }}>
                📤 Share Resource
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Live Statistics Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '60px'
        }}>
          {[
            { icon: "📚", label: "Total Resources", value: stats.totalResources, suffix: "", color: "#3b82f6" },
            { icon: "👥", label: "Active Users", value: stats.totalUsers, suffix: "+", color: "#10b981" },
            { icon: "⬇️", label: "Total Downloads", value: stats.totalDownloads, suffix: "+", color: "#f59e0b" },
            { icon: "🟢", label: "Active Today", value: stats.activeToday, suffix: "", color: "#ef4444" }
          ].map((stat, idx) => (
            <div key={idx} className="stat-card" style={{
              background: 'white',
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>{stat.icon}</div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: stat.color }}>
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ color: '#6b7280', marginTop: '10px' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section with Interactive Cards */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '40px' }}>
          Why Choose EduShare?
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px'
        }}>
          {[
            { icon: '📚', title: 'Rich Resources', desc: 'Access thousands of PDFs, video lectures, notes, and study materials', color: '#3b82f6', delay: '0s' },
            { icon: '👥', title: 'Active Community', desc: 'Join a community of 1000+ learners and educators sharing knowledge', color: '#10b981', delay: '0.1s' },
            { icon: '📤', title: 'Easy Sharing', desc: 'Share your educational content and help others learn', color: '#f59e0b', delay: '0.2s' },
            { icon: '⭐', title: 'Quality Assured', desc: 'Content moderated and rated by the community', color: '#ef4444', delay: '0.3s' }
          ].map((feature, idx) => (
            <div
              key={idx}
              className="feature-card hover-scale"
              style={{
                textAlign: 'center',
                padding: '30px',
                background: 'white',
                borderRadius: '15px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                animation: `slideIn 0.5s ${feature.delay} ease-out both`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 20px 30px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
              }}
            >
              <div style={{
                fontSize: '64px',
                marginBottom: '20px',
                display: 'inline-block',
                animation: 'float 3s ease-in-out infinite'
              }}>
                {feature.icon}
              </div>
              <h3 style={{ fontSize: '24px', marginBottom: '15px', color: feature.color }}>{feature.title}</h3>
              <p style={{ color: '#6b7280', lineHeight: '1.6' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Subjects Section */}
      <div style={{ background: '#f9fafb', padding: '60px 20px', marginTop: '40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '36px', marginBottom: '40px' }}>
            🔥 Popular Subjects
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            {popularSubjects.map((subject, idx) => (
              <Link to={`/explore?subject=${subject.name}`} key={idx} style={{ textDecoration: 'none' }}>
                <div
                  className="hover-scale"
                  style={{
                    background: 'white',
                    padding: '25px',
                    borderRadius: '15px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    border: `2px solid ${subject.color}20`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.borderColor = subject.color;
                    e.currentTarget.style.boxShadow = `0 10px 20px ${subject.color}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = `${subject.color}20`;
                  }}
                >
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>{subject.icon}</div>
                  <h3 style={{ fontSize: '18px', marginBottom: '5px', color: subject.color }}>{subject.name}</h3>
                  <p style={{ fontSize: '14px', color: '#6b7280' }}>{subject.count} resources</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Resources Preview */}
      {recentResources.length > 0 && (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <h2 style={{ fontSize: '32px' }}>📖 Recently Added</h2>
            <Link to="/explore">
              <button style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                padding: '10px 25px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}>
                View All →
              </button>
            </Link>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {recentResources.map((resource, idx) => (
              <div
                key={resource.id}
                className="hover-scale"
                style={{
                  background: 'white',
                  borderRadius: '10px',
                  padding: '20px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '24px' }}>
                    {resource.type === 'pdf' ? '📄' : resource.type === 'video' ? '🎥' : '📝'}
                  </span>
                  <span style={{ fontSize: '12px', color: '#6b7280' }}>{resource.type.toUpperCase()}</span>
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{resource.title}</h3>
                <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px' }}>
                  {resource.description?.substring(0, 80)}...
                </p>
                <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: '#6b7280' }}>
                  <span>⭐ {resource.avgRating?.toFixed(1) || '0'}</span>
                  <span>👁️ {resource.views}</span>
                  <span>⬇️ {resource.downloads}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonials Section */}
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '60px 20px', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '36px', marginBottom: '20px' }}>❤️ What Our Users Say</h2>
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '40px',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{ fontSize: '80px', marginBottom: '20px' }}>{testimonials[featuredIndex].avatar}</div>
            <div style={{ fontSize: '20px', marginBottom: '20px', fontStyle: 'italic' }}>
              "{testimonials[featuredIndex].text}"
            </div>
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{testimonials[featuredIndex].name}</div>
              <div style={{ opacity: 0.9 }}>{testimonials[featuredIndex].role}</div>
              <div style={{ marginTop: '10px' }}>
                {'★'.repeat(testimonials[featuredIndex].rating)}{'☆'.repeat(5 - testimonials[featuredIndex].rating)}
              </div>
            </div>
          </div>
          
          {/* Dots indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setFeaturedIndex(idx)}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: idx === featuredIndex ? 'white' : 'rgba(255,255,255,0.5)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div style={{ maxWidth: '900px', margin: '60px auto', textAlign: 'center', padding: '40px 20px' }}>
        <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>Ready to Start Learning?</h2>
        <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '30px' }}>
          Join thousands of students and educators already using EduShare
        </p>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register">
            <button style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '15px 40px',
              fontSize: '16px',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
              Get Started Free →
            </button>
          </Link>
          <Link to="/explore">
            <button style={{
              background: 'transparent',
              color: '#3b82f6',
              border: '2px solid #3b82f6',
              padding: '15px 40px',
              fontSize: '16px',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#3b82f6';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#3b82f6';
            }}>
              Browse Resources
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;