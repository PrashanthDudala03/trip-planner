import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaUsers, FaPlane, FaChartLine, FaDollarSign, FaUserShield,
  FaUserTie, FaUser, FaTrash, FaToggleOn, FaToggleOff,
  FaMapMarkerAlt, FaCalendar, FaSearch
} from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../App.css';

const API_URL = 'http://localhost:8000/api';

function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [showUserForm, setShowUserForm] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    role: 'user'
  });

  useEffect(() => {
    fetchDashboardData();
    fetchUsers();
    fetchAllTrips();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token');
    return {
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      }
    };
  };

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(API_URL + '/auth/dashboard/admin/', getAuthHeaders());
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      toast.error('Failed to load dashboard data');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL + '/auth/manage/', getAuthHeaders());
      console.log('Users response:', response.data);
      
      const usersData = Array.isArray(response.data) 
        ? response.data 
        : (response.data.results || []);
      
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setUsers([]);
      setLoading(false);
    }
  };

  const fetchAllTrips = async () => {
    try {
      const response = await axios.get(API_URL + '/trips/', getAuthHeaders());
      console.log('Trips response:', response.data);
      
      const tripsData = Array.isArray(response.data)
        ? response.data
        : (response.data.results || []);
      
      setTrips(tripsData);
    } catch (error) {
      console.error('Error fetching trips:', error);
      setTrips([]);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL + '/auth/manage/', newUser, getAuthHeaders());
      toast.success('User created successfully!');
      setShowUserForm(false);
      setNewUser({ username: '', email: '', password: '', first_name: '', last_name: '', role: 'user' });
      fetchUsers();
      fetchDashboardData();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.username?.[0] || 'Failed to create user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await axios.delete(API_URL + '/auth/manage/' + userId + '/', getAuthHeaders());
      toast.success('User deleted successfully');
      fetchUsers();
      fetchDashboardData();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const handleToggleActive = async (userId) => {
    try {
      await axios.post(API_URL + '/auth/manage/' + userId + '/toggle_active/', {}, getAuthHeaders());
      toast.success('User status updated');
      fetchUsers();
    } catch (error) {
      console.error('Error toggling user:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      await axios.post(API_URL + '/auth/manage/' + userId + '/change_role/', { role: newRole }, getAuthHeaders());
      toast.success('User role updated');
      fetchUsers();
      fetchDashboardData();
    } catch (error) {
      console.error('Error changing role:', error);
      toast.error('Failed to update user role');
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(user => {
    const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = userFilter === 'all' || user.role === userFilter;
    return matchesSearch && matchesFilter;
  }) : [];

  const filteredTrips = Array.isArray(trips) ? trips.filter(trip =>
    trip.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trip.user?.username?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  if (loading) {
    return <div className="loading"><div className="loading-spinner"></div></div>;
  }

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <h1>🛡️ Admin Dashboard</h1>
        <p>System Management & Analytics</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary"><FaUsers /></div>
          <div className="stat-content">
            <h3>{dashboardData?.system_stats?.total_users || 0}</h3>
            <p>Total Users</p>
            <small style={{color: '#10b981'}}>+{dashboardData?.system_stats?.new_users_month || 0} this month</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning"><FaPlane /></div>
          <div className="stat-content">
            <h3>{dashboardData?.system_stats?.total_trips || 0}</h3>
            <p>Total Trips</p>
            <small style={{color: '#10b981'}}>+{dashboardData?.system_stats?.new_trips_month || 0} this month</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success"><FaChartLine /></div>
          <div className="stat-content">
            <h3>{dashboardData?.system_stats?.active_trips || 0}</h3>
            <p>Active Trips</p>
            <small>Currently ongoing or upcoming</small>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info"><FaDollarSign /></div>
          <div className="stat-content">
            <h3>${(dashboardData?.system_stats?.total_expenses || 0).toFixed(2)}</h3>
            <p>Total Expenses</p>
            <small>Budget: ${(dashboardData?.system_stats?.total_budget || 0).toFixed(2)}</small>
          </div>
        </div>
      </div>

      <div className="card" style={{marginBottom: '2rem'}}>
        <h3 style={{marginBottom: '1rem'}}>Users by Role</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem'}}>
          <div style={{padding: '1rem', background: '#fef3c7', borderRadius: '10px', textAlign: 'center'}}>
            <FaUserShield style={{fontSize: '2rem', color: '#f59e0b', marginBottom: '0.5rem'}} />
            <h4>{dashboardData?.users_by_role?.superadmin || 0}</h4>
            <p style={{fontSize: '0.9rem', color: '#92400e'}}>Superadmins</p>
          </div>
          <div style={{padding: '1rem', background: '#dbeafe', borderRadius: '10px', textAlign: 'center'}}>
            <FaUserTie style={{fontSize: '2rem', color: '#3b82f6', marginBottom: '0.5rem'}} />
            <h4>{dashboardData?.users_by_role?.admin || 0}</h4>
            <p style={{fontSize: '0.9rem', color: '#1e40af'}}>Admins</p>
          </div>
          <div style={{padding: '1rem', background: '#d1fae5', borderRadius: '10px', textAlign: 'center'}}>
            <FaUser style={{fontSize: '2rem', color: '#10b981', marginBottom: '0.5rem'}} />
            <h4>{dashboardData?.users_by_role?.user || 0}</h4>
            <p style={{fontSize: '0.9rem', color: '#065f46'}}>Users</p>
          </div>
        </div>
      </div>

      <div className="tabs">
        <button 
          className={'tab ' + (activeTab === 'overview' ? 'active' : '')}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={'tab ' + (activeTab === 'users' ? 'active' : '')}
          onClick={() => setActiveTab('users')}
        >
          User Management ({users.length})
        </button>
        <button 
          className={'tab ' + (activeTab === 'trips' ? 'active' : '')}
          onClick={() => setActiveTab('trips')}
        >
          All Trips ({trips.length})
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="card" style={{marginBottom: '2rem'}}>
            <h3 style={{marginBottom: '1rem'}}>Trips by Status</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem'}}>
              {dashboardData?.trips_by_status && Object.entries(dashboardData.trips_by_status).map(([status, count]) => (
                <div key={status} style={{padding: '1rem', background: '#f3f4f6', borderRadius: '10px', textAlign: 'center'}}>
                  <h4 style={{fontSize: '1.5rem', marginBottom: '0.25rem'}}>{count}</h4>
                  <p style={{fontSize: '0.85rem', color: '#6b7280', textTransform: 'capitalize'}}>{status}</p>
                </div>
              ))}
            </div>
          </div>

          {dashboardData?.top_destinations && dashboardData.top_destinations.length > 0 && (
            <div className="card" style={{marginBottom: '2rem'}}>
              <h3 style={{marginBottom: '1rem'}}>🌍 Top Destinations</h3>
              {dashboardData.top_destinations.map((dest, index) => (
                <div key={index} style={{
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '10px',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <span style={{fontSize: '1.5rem'}}>{index + 1}</span>
                    <FaMapMarkerAlt style={{color: '#667eea'}} />
                    <span style={{fontWeight: '600'}}>{dest.destination}</span>
                  </div>
                  <span style={{
                    background: '#667eea',
                    color: 'white',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem'
                  }}>
                    {dest.count} trips
                  </span>
                </div>
              ))}
            </div>
          )}

          {dashboardData?.recent_users && dashboardData.recent_users.length > 0 && (
            <div className="card">
              <h3 style={{marginBottom: '1rem'}}>👥 Recent Users</h3>
              {dashboardData.recent_users.map(user => (
                <div key={user.id} style={{
                  padding: '1rem',
                  background: '#f9fafb',
                  borderRadius: '10px',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{marginBottom: '0.25rem'}}>{user.username}</h4>
                    <p style={{fontSize: '0.85rem', color: '#6b7280'}}>{user.email}</p>
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <span className={'status-badge status-' + user.role}>{user.role}</span>
                    <p style={{fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem'}}>
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'users' && (
        <div className="card">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem'}}>
            <h3>User Management</h3>
            <button 
              className="btn btn-primary"
              onClick={() => setShowUserForm(!showUserForm)}
            >
              {showUserForm ? 'Cancel' : '+ Create User'}
            </button>
          </div>

          {showUserForm && (
            <form onSubmit={handleCreateUser} style={{
              padding: '1.5rem',
              background: '#f3f4f6',
              borderRadius: '10px',
              marginBottom: '2rem'
            }}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Username *</label>
                  <input
                    type="text"
                    required
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Password *</label>
                  <input
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Superadmin</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    value={newUser.first_name}
                    onChange={(e) => setNewUser({...newUser, first_name: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    value={newUser.last_name}
                    onChange={(e) => setNewUser({...newUser, last_name: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">Create User</button>
            </form>
          )}

          <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap'}}>
            <div style={{flex: 1, minWidth: '250px', position: 'relative'}}>
              <FaSearch style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280'}} />
              <input
                type="text"
                placeholder="Search users..."
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
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                minWidth: '150px'
              }}
            >
              <option value="all">All Roles</option>
              <option value="superadmin">Superadmin</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{background: '#f3f4f6', borderBottom: '2px solid #e5e7eb'}}>
                  <th style={{padding: '1rem', textAlign: 'left'}}>User</th>
                  <th style={{padding: '1rem', textAlign: 'left'}}>Email</th>
                  <th style={{padding: '1rem', textAlign: 'center'}}>Role</th>
                  <th style={{padding: '1rem', textAlign: 'center'}}>Trips</th>
                  <th style={{padding: '1rem', textAlign: 'center'}}>Status</th>
                  <th style={{padding: '1rem', textAlign: 'center'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                    <td style={{padding: '1rem'}}>
                      <div>
                        <div style={{fontWeight: '600'}}>{user.username}</div>
                        <div style={{fontSize: '0.85rem', color: '#6b7280'}}>
                          {user.first_name} {user.last_name}
                        </div>
                      </div>
                    </td>
                    <td style={{padding: '1rem', color: '#6b7280'}}>{user.email}</td>
                    <td style={{padding: '1rem', textAlign: 'center'}}>
                      <select
                        value={user.role}
                        onChange={(e) => handleChangeRole(user.id, e.target.value)}
                        style={{
                          padding: '0.5rem',
                          borderRadius: '5px',
                          border: '1px solid #e5e7eb',
                          background: 'white'
                        }}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    </td>
                    <td style={{padding: '1rem', textAlign: 'center', fontWeight: '600'}}>
                      {user.trips_count || 0}
                    </td>
                    <td style={{padding: '1rem', textAlign: 'center'}}>
                      <button
                        onClick={() => handleToggleActive(user.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '1.5rem',
                          color: user.is_active ? '#10b981' : '#ef4444'
                        }}
                      >
                        {user.is_active ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </td>
                    <td style={{padding: '1rem', textAlign: 'center'}}>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="btn btn-danger"
                        style={{padding: '0.5rem 1rem'}}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'trips' && (
        <div className="card">
          <div style={{marginBottom: '1.5rem'}}>
            <h3 style={{marginBottom: '1rem'}}>All Trips</h3>
            <div style={{position: 'relative'}}>
              <FaSearch style={{position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#6b7280'}} />
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
          </div>

          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{background: '#f3f4f6', borderBottom: '2px solid #e5e7eb'}}>
                  <th style={{padding: '1rem', textAlign: 'left'}}>Trip</th>
                  <th style={{padding: '1rem', textAlign: 'left'}}>User</th>
                  <th style={{padding: '1rem', textAlign: 'left'}}>Destination</th>
                  <th style={{padding: '1rem', textAlign: 'center'}}>Dates</th>
                  <th style={{padding: '1rem', textAlign: 'center'}}>Status</th>
                  <th style={{padding: '1rem', textAlign: 'right'}}>Budget</th>
                  <th style={{padding: '1rem', textAlign: 'center'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTrips.map(trip => (
                  <tr key={trip.id} style={{borderBottom: '1px solid #e5e7eb'}}>
                    <td style={{padding: '1rem'}}>
                      <div style={{fontWeight: '600'}}>{trip.title}</div>
                    </td>
                    <td style={{padding: '1rem'}}>
                      <div style={{fontSize: '0.9rem'}}>
                        {trip.user?.username || 'N/A'}
                      </div>
                    </td>
                    <td style={{padding: '1rem', color: '#6b7280'}}>
                      <FaMapMarkerAlt style={{marginRight: '0.5rem'}} />
                      {trip.destination}
                    </td>
                    <td style={{padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#6b7280'}}>
                      <FaCalendar style={{marginRight: '0.25rem'}} />
                      {new Date(trip.start_date).toLocaleDateString()}
                    </td>
                    <td style={{padding: '1rem', textAlign: 'center'}}>
                      <span className={'status-badge status-' + trip.status}>
                        {trip.status}
                      </span>
                    </td>
                    <td style={{padding: '1rem', textAlign: 'right', fontWeight: '600'}}>
                      {trip.budget ? '$' + parseFloat(trip.budget).toFixed(2) : 'N/A'}
                    </td>
                    <td style={{padding: '1rem', textAlign: 'center'}}>
                      <Link to={'/trips/' + trip.id} className="btn btn-secondary" style={{padding: '0.5rem 1rem'}}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;