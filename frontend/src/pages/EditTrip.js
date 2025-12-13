import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import { tripAPI } from '../services/api';
import { toast } from 'react-toastify';

function EditTrip() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    destination: '',
    description: '',
    start_date: '',
    end_date: '',
    budget: '',
    status: 'planning',
    travelers_count: 1,
    notes: ''
  });

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const response = await tripAPI.getById(id);
      const trip = response.data;
      setFormData({
        title: trip.title,
        destination: trip.destination,
        description: trip.description || '',
        start_date: trip.start_date,
        end_date: trip.end_date,
        budget: trip.budget || '',
        status: trip.status,
        travelers_count: trip.travelers_count,
        notes: trip.notes || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load trip');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tripAPI.update(id, formData);
      toast.success('Trip updated successfully!');
      navigate(`/trips/${id}`);
    } catch (error) {
      console.error('Error updating trip:', error);
      toast.error('Failed to update trip');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <h1>Edit Trip</h1>
        <p>Update your trip details</p>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Trip Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Summer Vacation in Bali"
              />
            </div>

            <div className="form-group">
              <label>Destination *</label>
              <input
                type="text"
                name="destination"
                required
                value={formData.destination}
                onChange={handleChange}
                placeholder="e.g., Bali, Indonesia"
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="planning">Planning</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="start_date"
                required
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                name="end_date"
                required
                value={formData.end_date}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Budget ($)</label>
              <input
                type="number"
                name="budget"
                step="0.01"
                value={formData.budget}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label>Number of Travelers</label>
              <input
                type="number"
                name="travelers_count"
                min="1"
                value={formData.travelers_count}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your trip plans..."
                rows="4"
              />
            </div>

            <div className="form-group full-width">
              <label>Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Any additional notes..."
                rows="3"
              />
            </div>
          </div>

          <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
            <button type="submit" className="btn btn-primary">
              <FaSave /> Update Trip
            </button>
            <button 
              type="button" 
              onClick={() => navigate(`/trips/${id}`)} 
              className="btn btn-secondary"
            >
              <FaTimes /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTrip;
