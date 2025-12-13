import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaMapMarkerAlt, 
  FaCalendar, FaDollarSign, FaUsers, FaChartPie, FaClipboardList,
  FaClock
} from 'react-icons/fa';
import { tripAPI, activityAPI, expenseAPI, checklistAPI } from '../services/api';
import { toast } from 'react-toastify';

function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [activities, setActivities] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showChecklistForm, setShowChecklistForm] = useState(false);
  
  const [newActivity, setNewActivity] = useState({
    name: '', description: '', category: 'other', date: '', 
    time: '', location: '', cost: '', notes: ''
  });
  
  const [newExpense, setNewExpense] = useState({
    description: '', amount: '', category: 'other', date: '', notes: ''
  });
  
  const [newChecklistItem, setNewChecklistItem] = useState({
    item: '', category: 'general', priority: 0
  });

  useEffect(() => {
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      const [tripRes, statsRes] = await Promise.all([
        tripAPI.getById(id),
        tripAPI.getStatistics(id)
      ]);
      
      setTrip(tripRes.data);
      setActivities(tripRes.data.activities || []);
      setExpenses(tripRes.data.expenses || []);
      setChecklist(tripRes.data.checklist_items || []);
      setStatistics(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load trip details');
      setLoading(false);
    }
  };

  const handleAddActivity = async (e) => {
    e.preventDefault();
    try {
      await activityAPI.create({ ...newActivity, trip: id });
      toast.success('Activity added!');
      setNewActivity({ name: '', description: '', category: 'other', date: '', time: '', location: '', cost: '', notes: '' });
      setShowActivityForm(false);
      fetchTripDetails();
    } catch (error) {
      toast.error('Failed to add activity');
    }
  };

  const handleToggleActivity = async (activityId) => {
    try {
      await activityAPI.toggleComplete(activityId);
      fetchTripDetails();
    } catch (error) {
      toast.error('Failed to update activity');
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (window.confirm('Delete this activity?')) {
      try {
        await activityAPI.delete(activityId);
        toast.success('Activity deleted');
        fetchTripDetails();
      } catch (error) {
        toast.error('Failed to delete activity');
      }
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      await expenseAPI.create({ ...newExpense, trip: id });
      toast.success('Expense added!');
      setNewExpense({ description: '', amount: '', category: 'other', date: '', notes: '' });
      setShowExpenseForm(false);
      fetchTripDetails();
    } catch (error) {
      toast.error('Failed to add expense');
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await expenseAPI.delete(expenseId);
        toast.success('Expense deleted');
        fetchTripDetails();
      } catch (error) {
        toast.error('Failed to delete expense');
      }
    }
  };

  const handleAddChecklistItem = async (e) => {
    e.preventDefault();
    try {
      await checklistAPI.create({ ...newChecklistItem, trip: id });
      toast.success('Item added!');
      setNewChecklistItem({ item: '', category: 'general', priority: 0 });
      setShowChecklistForm(false);
      fetchTripDetails();
    } catch (error) {
      toast.error('Failed to add item');
    }
  };

  const handleToggleChecklist = async (itemId) => {
    try {
      await checklistAPI.toggle(itemId);
      fetchTripDetails();
    } catch (error) {
      toast.error('Failed to update checklist');
    }
  };

  const handleDeleteChecklist = async (itemId) => {
    if (window.confirm('Delete this item?')) {
      try {
        await checklistAPI.delete(itemId);
        toast.success('Item deleted');
        fetchTripDetails();
      } catch (error) {
        toast.error('Failed to delete item');
      }
    }
  };

  const handleDeleteTrip = async () => {
    if (window.confirm('Delete this trip? This cannot be undone.')) {
      try {
        await tripAPI.delete(id);
        toast.success('Trip deleted');
        navigate('/trips');
      } catch (error) {
        toast.error('Failed to delete trip');
      }
    }
  };

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div></div>;
  }

  if (!trip) {
    return (
      <div className="container">
        <div className="card" style={{textAlign: 'center', padding: '4rem'}}>
          <h2>Trip not found</h2>
          <button onClick={() => navigate('/trips')} className="btn btn-primary">Back to Trips</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <div className="card">
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '1rem'}}>
          <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem'}}>
              <h1>{trip.title}</h1>
              <span className={`status-badge status-${trip.status}`}>{trip.status}</span>
            </div>
            <div className="info-item">
              <FaMapMarkerAlt />
              <span>{trip.destination}</span>
            </div>
            <div className="info-item">
              <FaCalendar />
              <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
            </div>
            <div className="info-item">
              <FaUsers />
              <span>{trip.travelers_count} traveler(s)</span>
            </div>
          </div>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <button className="btn btn-secondary" onClick={() => navigate(`/trips/${id}/edit`)}>
              <FaEdit /> Edit
            </button>
            <button onClick={handleDeleteTrip} className="btn btn-danger">
              <FaTrash /> Delete
            </button>
          </div>
        </div>
        {trip.description && <p style={{marginTop: '1.5rem', color: '#6b7280'}}>{trip.description}</p>}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary"><FaClipboardList /></div>
          <div className="stat-content">
            <h3>{statistics?.total_activities || 0}</h3>
            <p>Total Activities</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon primary"><FaCheck /></div>
          <div className="stat-content">
            <h3>{statistics?.completed_activities || 0}</h3>
            <p>Completed</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon primary"><FaDollarSign /></div>
          <div className="stat-content">
            <h3>${parseFloat(statistics?.total_expenses || 0).toFixed(2)}</h3>
            <p>Total Expenses</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon primary"><FaChartPie /></div>
          <div className="stat-content">
            <h3>{trip.budget ? `$${parseFloat(trip.budget_remaining || 0).toFixed(2)}` : 'N/A'}</h3>
            <p>Budget Remaining</p>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          Overview
        </button>
        <button className={`tab ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>
          Activities ({activities.length})
        </button>
        <button className={`tab ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => setActiveTab('expenses')}>
          Expenses ({expenses.length})
        </button>
        <button className={`tab ${activeTab === 'checklist' ? 'active' : ''}`} onClick={() => setActiveTab('checklist')}>
          Checklist ({checklist.filter(i => !i.completed).length})
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="card">
          <h2>Overview</h2>
          {trip.notes && (
            <div style={{marginTop: '1rem', padding: '1rem', background: '#f3f4f6', borderRadius: '10px'}}>
              <h3>Notes</h3>
              <p>{trip.notes}</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'activities' && (
        <div className="card">
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
            <h2>Activities</h2>
            <button onClick={() => setShowActivityForm(!showActivityForm)} className="btn btn-primary">
              {showActivityForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add Activity</>}
            </button>
          </div>

          {showActivityForm && (
            <form onSubmit={handleAddActivity} style={{marginBottom: '2rem', padding: '1.5rem', background: '#f3f4f6', borderRadius: '10px'}}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Activity Name *</label>
                  <input type="text" required value={newActivity.name} onChange={(e) => setNewActivity({...newActivity, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={newActivity.category} onChange={(e) => setNewActivity({...newActivity, category: e.target.value})}>
                    <option value="sightseeing">Sightseeing</option>
                    <option value="food">Food & Dining</option>
                    <option value="adventure">Adventure</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input type="date" required value={newActivity.date} onChange={(e) => setNewActivity({...newActivity, date: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input type="time" value={newActivity.time} onChange={(e) => setNewActivity({...newActivity, time: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                <FaPlus /> Add Activity
              </button>
            </form>
          )}

          <div>
            {activities.length === 0 ? (
              <p style={{textAlign: 'center', color: '#6b7280', padding: '2rem'}}>No activities yet</p>
            ) : (
              activities.map(activity => (
                <div key={activity.id} style={{padding: '1rem', background: '#f9fafb', borderRadius: '10px', marginBottom: '1rem'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                      <input 
                        type="checkbox" 
                        checked={activity.completed} 
                        onChange={() => handleToggleActivity(activity.id)}
                        style={{width: '20px', height: '20px', cursor: 'pointer'}}
                      />
                      <h4 style={{textDecoration: activity.completed ? 'line-through' : 'none'}}>{activity.name}</h4>
                    </div>
                    <button onClick={() => handleDeleteActivity(activity.id)} className="btn btn-danger" style={{padding: '0.5rem'}}>
                      <FaTrash />
                    </button>
                  </div>
                  <div style={{marginTop: '0.5rem', marginLeft: '2.5rem', color: '#6b7280'}}>
                    <span><FaCalendar /> {new Date(activity.date).toLocaleDateString()}</span>
                    {activity.time && <span style={{marginLeft: '1rem'}}><FaClock /> {activity.time}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="card">
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
            <h2>Expenses</h2>
            <button onClick={() => setShowExpenseForm(!showExpenseForm)} className="btn btn-primary">
              {showExpenseForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add Expense</>}
            </button>
          </div>

          {showExpenseForm && (
            <form onSubmit={handleAddExpense} style={{marginBottom: '2rem', padding: '1.5rem', background: '#f3f4f6', borderRadius: '10px'}}>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label>Description *</label>
                  <input type="text" required value={newExpense.description} onChange={(e) => setNewExpense({...newExpense, description: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Amount *</label>
                  <input type="number" step="0.01" required value={newExpense.amount} onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select value={newExpense.category} onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}>
                    <option value="food">Food & Drinks</option>
                    <option value="transport">Transport</option>
                    <option value="accommodation">Accommodation</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Date *</label>
                  <input type="date" required value={newExpense.date} onChange={(e) => setNewExpense({...newExpense, date: e.target.value})} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                <FaPlus /> Add Expense
              </button>
            </form>
          )}

          <div>
            {expenses.length === 0 ? (
              <p style={{textAlign: 'center', color: '#6b7280', padding: '2rem'}}>No expenses yet</p>
            ) : (
              expenses.map(expense => (
                <div key={expense.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: '#f9fafb', borderRadius: '10px', marginBottom: '1rem'}}>
                  <div>
                    <h4>{expense.description}</h4>
                    <p style={{color: '#6b7280', fontSize: '0.9rem'}}>{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                    <span style={{fontSize: '1.2rem', fontWeight: 'bold', color: '#667eea'}}>
                      ${parseFloat(expense.amount).toFixed(2)}
                    </span>
                    <button onClick={() => handleDeleteExpense(expense.id)} className="btn btn-danger" style={{padding: '0.5rem'}}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'checklist' && (
        <div className="card">
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem'}}>
            <h2>Checklist</h2>
            <button onClick={() => setShowChecklistForm(!showChecklistForm)} className="btn btn-primary">
              {showChecklistForm ? <><FaTimes /> Cancel</> : <><FaPlus /> Add Item</>}
            </button>
          </div>

          {showChecklistForm && (
            <form onSubmit={handleAddChecklistItem} style={{marginBottom: '2rem', padding: '1.5rem', background: '#f3f4f6', borderRadius: '10px'}}>
              <div className="form-group">
                <label>Item *</label>
                <input type="text" required value={newChecklistItem.item} onChange={(e) => setNewChecklistItem({...newChecklistItem, item: e.target.value})} />
              </div>
              <button type="submit" className="btn btn-primary">
                <FaPlus /> Add Item
              </button>
            </form>
          )}

          <div>
            {checklist.length === 0 ? (
              <p style={{textAlign: 'center', color: '#6b7280', padding: '2rem'}}>No items yet</p>
            ) : (
              checklist.map(item => (
                <div key={item.id} style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f9fafb', borderRadius: '10px', marginBottom: '1rem'}}>
                  <input 
                    type="checkbox" 
                    checked={item.completed} 
                    onChange={() => handleToggleChecklist(item.id)}
                    style={{width: '20px', height: '20px', cursor: 'pointer'}}
                  />
                  <span style={{flex: 1, textDecoration: item.completed ? 'line-through' : 'none'}}>{item.item}</span>
                  <button onClick={() => handleDeleteChecklist(item.id)} className="btn btn-danger" style={{padding: '0.5rem'}}>
                    <FaTrash />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TripDetail;
