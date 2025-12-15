import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock, FaSignInAlt, FaPlane } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../App.css';

const API_URL = 'http://localhost:8000/api';

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (token && user) {
      if (user.role === 'admin' || user.role === 'superadmin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting login with:', { username: formData.username });
      
      const response = await axios.post(API_URL + '/auth/login/', {
        username: formData.username,
        password: formData.password
      });
      
      console.log('Login successful:', response.data);
      
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast.success('Login successful! Welcome ' + response.data.user.username);
      
      const user = response.data.user;
      
      setTimeout(() => {
        if (user.role === 'admin' || user.role === 'superadmin') {
          window.location.href = '/admin';
        } else {
          window.location.href = '/dashboard';
        }
      }, 500);
      
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail;
      } else if (error.response?.data?.non_field_errors) {
        errorMessage = error.response.data.non_field_errors[0];
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid username or password.';
      }
      
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
          <h1>Welcome Back!</h1>
          <p>Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="off" className="auth-form">
          <div className="form-group">
            <label>
              <FaUser /> Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
              autoComplete="new-username"
            />
          </div>

          <div className="form-group">
            <label>
              <FaLock /> Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Signing in...' : (
              <>
                <FaSignInAlt /> Sign In
              </>
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
      </div>
    </div></div>);
}

export default Login;

