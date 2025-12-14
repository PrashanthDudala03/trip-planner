import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaUserPlus, FaPlane } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../App.css';

const API_URL = 'http://localhost:8000/api';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password2) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(API_URL + '/auth/register/', formData);
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success('Account created successfully!');
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
      
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.username?.[0] || 
                          error.response?.data?.email?.[0] || 
                          'Registration failed. Please try again.';
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (<div className="auth-page"><div className="auth-container">
      <div className="auth-card animate-fade-in">
        <div className="auth-header">
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            color: 'white'
          }}>
            <FaPlane />
          </div>
          <h1>Create Account</h1>
          <p>Start your journey with us today</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid">
            <div className="form-group">
              <label>
                <FaUser /> Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
                autoComplete="username"
              />
            </div>

            <div className="form-group">
              <label>
                <FaEnvelope /> Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="John"
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Doe"
              />
            </div>
          </div>

          <div className="form-group">
            <label>
              <FaPhone /> Phone (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>
                <FaLock /> Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Min. 6 characters"
                autoComplete="new-password"
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label>
                <FaLock /> Confirm Password *
              </label>
              <input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
                placeholder="Re-enter password"
                autoComplete="new-password"
                minLength={6}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Creating Account...' : (
              <>
                <FaUserPlus /> Create Account
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
    </div></div>);
}

export default Signup;

