import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaMapMarkerAlt, 
  FaCalendar, FaDollarSign, FaUsers, FaChartPie, FaClipboardList,
  FaClock, FaStar, FaReceipt
} from 'react-icons/fa';
import { tripAPI, activityAPI, expenseAPI, checklistAPI } from '../services/api';
import { toast } from 'react-toastify';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

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
      const [tripRes, activitiesRes, expensesRes, checklistRes, statsRes] = await Promise.all([
        tripAPI.getById(id),
        tripAPI.getActivities(id),
        expenseAPI.getAll(id),
        checklistAPI.getAll(id),
        tripAPI.getStatistics(id)
      ]);
      
      setTrip(tripRes.data);
      setActivities(activitiesRes.data);
      setExpenses(expensesRes.data);
      setChecklist(checklistRes.data);
      setStatistics(statsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching trip details:', error);
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
      toast.success('Checklist item added!');
      setNewChecklistItem({ item: '', category: 'general', priority: 0 });
      setShowChecklistForm(false);
      fetchTripDetails();
    } catch (error) {
      toast.error('Failed to add checklist item');
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
    if (window.confirm('Are you sure you want to delete this trip?')) {
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

  const COLORS = ['#667eea', '#764ba2', '#f59e0b', '#10b981', '#ef4444', '#3b82f6'];

  return (
    <div className="container animate-fade-in">
      <div className="card" style={{marginBottom: '2rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
          <div>
            <h1>{trip.title}</h1>
            <span className={`status-badge status-${trip.status}`}>{trip.status}</span>
          </div>
          <div style={{display: 'flex', gap: '0.5rem'}}>
            <button className="btn btn-secondary"><FaEdit /> Edit</button>
            <button onClick={handleDeleteTrip} className="btn btn-danger"><FaTrash /> Delete</button>
          </div>
        </div>
      </div>

      <div className="stats-grid" style={{marginBottom: '2rem'}}>
        <div className="stat-card">
          <div className="stat-icon primary"><FaClipboardList /></div>
          <div className="stat-content">
            <h3>{statistics?.total_activities || 0}</h3>
            <p>Total Activities</p>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
        <button className={`tab ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>Activities</button>
        <button className={`tab ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => setActiveTab('expenses')}>Expenses</button>
        <button className={`tab ${activeTab === 'checklist' ? 'active' : ''}`} onClick={() => setActiveTab('checklist')}>Checklist</button>
      </div>

      {activeTab === 'overview' && (
        <div className="card"><h2>Overview content here</h2></div>
      )}
    </div>
  );
}

export default TripDetail;
