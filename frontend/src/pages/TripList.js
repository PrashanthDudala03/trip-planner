import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendar, FaDollarSign, FaListAlt, FaSearch, FaFilter } from 'react-icons/fa';
import { tripAPI } from '../services/api';
import { toast } from 'react-toastify';

function TripList() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await tripAPI.getAll();
      setTrips(response.data.results || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast.error('Failed to load trips');
      setLoading(false);
    }
  };

  const filteredTrips = trips.filter(trip => {
    const matchesFilter = filter === 'all' || trip.status === filter;
    const matchesSearch = trip.title.toLowerCase().includes(search.toLowerCase()) || 
                         trip.destination.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <h1>My Trips</h1>
        <p>Manage and view all your travel plans</p>
      </div>

      <div className="card" style={{marginBottom: '2rem'}}>
        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center'}}>
          <div style={{flex: 1, minWidth: '250px'}}>
            <div style={{position: 'relative'}}>
              <FaSearch style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)'}} />
              <input
                type="text"
                placeholder="Search trips..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.9rem 1rem 0.9rem 2.5rem',
                  border: '2px solid var(--border)',
                  borderRadius: '10px',
                  fontSize: '1rem'
                }}
              />
            </div>
          </div>
          <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
            <button 
              className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`btn ${filter === 'upcoming' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </button>
            <button 
              className={`btn ${filter === 'ongoing' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('ongoing')}
            >
              Ongoing
            </button>
            <button 
              className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {filteredTrips.length === 0 ? (
        <div className="card" style={{textAlign: 'center', padding: '4rem 2rem'}}>
          <FaListAlt style={{fontSize: '4rem', color: 'var(--gray)', marginBottom: '1rem'}} />
          <h3>No trips found</h3>
          <p style={{color: 'var(--gray)', marginBottom: '2rem'}}>
            {search || filter !== 'all' ? 'Try adjusting your filters' : 'Start planning your first adventure!'}
          </p>
          {!search && filter === 'all' && (
            <Link to="/create" className="btn btn-primary">Create Your First Trip</Link>
          )}
        </div>
      ) : (
        <div className="trip-grid">
          {filteredTrips.map(trip => (
            <Link key={trip.id} to={`/trips/${trip.id}`} style={{textDecoration: 'none'}}>
              <div className="trip-card">
                {trip.image ? (
                  <img src={trip.image} alt={trip.title} className="trip-card-image" />
                ) : (
                  <div className="trip-card-image" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <FaMapMarkerAlt style={{fontSize: '3rem', color: 'white'}} />
                  </div>
                )}
                <div className="trip-card-content">
                  <div className="trip-card-header">
                    <h3>{trip.title}</h3>
                    <span className={`status-badge status-${trip.status}`}>
                      {trip.status}
                    </span>
                  </div>
                  <div className="trip-info">
                    <div className="info-item">
                      <FaMapMarkerAlt />
                      <span>{trip.destination}</span>
                    </div>
                    <div className="info-item">
                      <FaCalendar />
                      <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                    </div>
                    {trip.budget && (
                      <div className="info-item">
                        <FaDollarSign />
                        <span>Budget: ${parseFloat(trip.budget).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="info-item">
                      <FaListAlt />
                      <span>{trip.activities_count || 0} activities</span>
                    </div>
                  </div>
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
