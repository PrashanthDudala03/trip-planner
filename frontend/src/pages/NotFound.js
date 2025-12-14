import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';
import '../App.css';

function NotFound() {
  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in" style={{textAlign: 'center'}}>
        <FaExclamationTriangle style={{fontSize: '5rem', color: '#ef4444', marginBottom: '1rem'}} />
        <h1 style={{fontSize: '3rem', marginBottom: '0.5rem'}}>404</h1>
        <h2 style={{marginBottom: '1rem'}}>Page Not Found</h2>
        <p style={{color: '#6b7280', marginBottom: '2rem'}}>
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn btn-primary">
          <FaHome /> Go Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
