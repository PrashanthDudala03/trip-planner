import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import { tripAPI } from '../services/api';
import { toast } from 'react-toastify';

function CreateTrip() {
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await tripAPI.create(formData);
      toast.success('Trip created successfully!');
      navigate(`/trips/${response.data.id}`);
    } catch (error) {
      console.error('Error creating trip:', error);
      toast.error('Failed to create trip. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <h1>Create New Trip</h1>
        <p>Plan your next adventure</p>
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
              <FaSave /> Create Trip
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/trips')} 
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

export default CreateTrip;
