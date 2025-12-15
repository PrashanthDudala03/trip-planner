import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlane, FaCalendar, FaMapMarkerAlt, FaPlus, FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { getUserData } from '../utils/RouteGuards';
import '../App.css';

const API_URL = 'http://localhost:8000/api';

function TripList() {
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const { isAnyAdmin } = getUserData();

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    filterTrips();
  }, [trips, searchTerm, statusFilter]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    };
  };

  const fetchTrips = async () => {
    try {
      const response = await axios.get(API_URL + '/trips/', getAuthHeaders());
      const tripsData = response.data.results || response.data;
      setTrips(Array.isArray(tripsData) ? tripsData : []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast.error('Failed to load trips');
      setTrips([]);
      setLoading(false);
    }
  };

  const filterTrips = () => {
    let filtered = trips;

    if (searchTerm) {
      filtered = filtered.filter(trip =>
        trip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.destination?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(trip => trip.status === statusFilter);
    }

    setFilteredTrips(filtered);
  };

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaPlane />
              {isAnyAdmin ? 'All Trips' : 'My Trips'}
            </h1>
          <p>{isAnyAdmin ? 'Manage all user trips' : 'Your travel adventures'}</p>
        </div>
        {!isAnyAdmin && (
          <Link to="/create" className="btn btn-primary">
            <FaPlus /> New Trip
          </Link>
        )}
      </div>

      <div className="card" style={{marginBottom: '2rem'}}>
        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
          <div style={{flex: 1, minWidth: '250px', position: 'relative'}}>
            <FaSearch style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#6b7280'
            }} />
            <input
              type="text"
              placeholder="Search trips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                border: '2px solid #e5e7eb',
                borderRadius: '10px'
              }}
            />
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
            <FaFilter style={{color: '#6b7280'}} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                minWidth: '150px'
              }}
            >
              <option value="all">All Status</option>
              <option value="planning">Planning</option>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {filteredTrips.length === 0 ? (
        <div className="card" style={{textAlign: 'center', padding: '3rem'}}>
          <FaPlane style={{fontSize: '4rem', color: '#d1d5db', marginBottom: '1rem'}} />
          <h3 style={{color: '#6b7280', marginBottom: '0.5rem'}}>
            {trips.length === 0 ? 'No trips yet' : 'No trips found'}
          </h3>
          <p style={{color: '#9ca3af', marginBottom: '1.5rem'}}>
            {trips.length === 0 
              ? isAnyAdmin 
                ? 'Users haven\'t created any trips yet'
                : 'Start planning your first adventure!'
              : 'Try adjusting your search or filters'
            }
          </p>
          {!isAnyAdmin && trips.length === 0 && (
            <Link to="/create" className="btn btn-primary">
              <FaPlus /> Create Your First Trip
            </Link>
          )}
        </div>
      ) : (
        <div className="trips-grid">
          {filteredTrips.map((trip) => (
            <Link
              key={trip.id}
              to={'/trips/' + trip.id}
              className="trip-card"
              style={{textDecoration: 'none'}}
            >
              {trip.image && (
                <div className="trip-card-image">
                  <img src={trip.image} alt={trip.title} />
                </div>
              )}
              <div className="trip-card-content">
                <div style={{marginBottom: '0.75rem'}}>
                  <h3 style={{marginBottom: '0.5rem'}}>{trip.title}</h3>
                  {isAnyAdmin && trip.user && (
                    <p style={{fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.5rem'}}>
                      By: {trip.user.username}
                    </p>
                  )}
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.9rem'}}>
                    <FaMapMarkerAlt />
                    <span>{trip.destination}</span>
                  </div>
                </div>

                <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', fontSize: '0.85rem', marginBottom: '0.75rem'}}>
                  <FaCalendar />
                  <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                </div>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <span className={'status-badge status-' + trip.status}>
                    {trip.status}
                  </span>
                  {trip.budget && (
                    <span style={{fontWeight: '600', color: '#667eea'}}>
                      
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default TripList;
