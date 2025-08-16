import React, { useState } from 'react';
import { User, Settings, BarChart3, Bell, Search, Calendar, Activity, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  // Mock user data and logout function for demo purposes
  const user = {
    username: "johndoe",
    email: "john.doe@example.com",
    id: "12345"
  };
  
  const logout = () => {
    console.log("Logout clicked");
    // In a real app, this would handle logout logic
  };
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications] = useState([
    { id: 1, message: "Welcome to your dashboard!", time: "2 min ago", read: false },
    { id: 2, message: "Your profile is 90% complete", time: "1 hour ago", read: false },
    { id: 3, message: "New feature available: Analytics", time: "2 hours ago", read: true }
  ]);

  const handleLogout = () => {
    logout();
  };

  const stats = [
    { title: "Total Projects", value: "12", change: "+2", icon: BarChart3 },
    { title: "Active Tasks", value: "28", change: "+5", icon: Activity },
    { title: "Completed", value: "156", change: "+12", icon: TrendingUp },
    { title: "This Month", value: "89%", change: "+8%", icon: Calendar }
  ];

  const recentActivities = [
    { action: "Created new project", time: "5 minutes ago", type: "create" },
    { action: "Updated user settings", time: "1 hour ago", type: "update" },
    { action: "Completed task #127", time: "3 hours ago", type: "complete" },
    { action: "Joined team meeting", time: "1 day ago", type: "meeting" }
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Dashboard</h1>
          <div style={styles.searchBar}>
            <Search size={18} style={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Search..." 
              style={styles.searchInput}
            />
          </div>
        </div>
        
        <div style={styles.headerRight}>
          <div style={styles.notificationIcon}>
            <Bell size={20} />
            {notifications.filter(n => !n.read).length > 0 && (
              <span style={styles.notificationBadge}>
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </div>
          
          {user && (
            <div style={styles.userSection}>
              <div style={styles.userAvatar}>
                <User size={20} />
              </div>
              <span style={styles.username}>{user.username}</span>
            </div>
          )}
          
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav style={styles.nav}>
        {['overview', 'analytics', 'settings', 'profile'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.navButton,
              ...(activeTab === tab ? styles.navButtonActive : {})
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main style={styles.main}>
        {activeTab === 'overview' && (
          <div style={styles.overview}>
            {/* Stats Cards */}
            <div style={styles.statsGrid}>
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} style={styles.statCard}>
                    <div style={styles.statHeader}>
                      <IconComponent size={24} style={styles.statIcon} />
                      <span style={styles.statChange}>{stat.change}</span>
                    </div>
                    <h3 style={styles.statValue}>{stat.value}</h3>
                    <p style={styles.statTitle}>{stat.title}</p>
                  </div>
                );
              })}
            </div>

            {/* Two Column Layout */}
            <div style={styles.twoColumn}>
              {/* Recent Activity */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Recent Activity</h3>
                <div style={styles.activityList}>
                  {recentActivities.map((activity, index) => (
                    <div key={index} style={styles.activityItem}>
                      <div style={{
                        ...styles.activityDot,
                        backgroundColor: activity.type === 'create' ? '#8b5cf6' : 
                                       activity.type === 'complete' ? '#10b981' : 
                                       activity.type === 'update' ? '#f59e0b' : '#6366f1'
                      }}></div>
                      <div>
                        <p style={styles.activityAction}>{activity.action}</p>
                        <span style={styles.activityTime}>{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div style={styles.card}>
                <h3 style={styles.cardTitle}>Notifications</h3>
                <div style={styles.notificationList}>
                  {notifications.map(notification => (
                    <div key={notification.id} style={{
                      ...styles.notificationItem,
                      opacity: notification.read ? 0.7 : 1
                    }}>
                      <div style={{
                        ...styles.notificationDot,
                        backgroundColor: notification.read ? '#6b7280' : '#8b5cf6'
                      }}></div>
                      <div style={styles.notificationContent}>
                        <p style={styles.notificationMessage}>{notification.message}</p>
                        <span style={styles.notificationTime}>{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && user && (
          <div style={styles.profileSection}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>User Profile</h3>
              <div style={styles.profileInfo}>
                <div style={styles.profileAvatar}>
                  <User size={40} />
                </div>
                <div style={styles.profileDetails}>
                  <div style={styles.profileField}>
                    <label style={styles.profileLabel}>Username:</label>
                    <span style={styles.profileValue}>{user.username}</span>
                  </div>
                  <div style={styles.profileField}>
                    <label style={styles.profileLabel}>Email:</label>
                    <span style={styles.profileValue}>{user.email}</span>
                  </div>
                  <div style={styles.profileField}>
                    <label style={styles.profileLabel}>User ID:</label>
                    <span style={styles.profileValue}>{user.id}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Analytics Dashboard</h3>
            <p style={styles.comingSoon}>Advanced analytics coming soon...</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div style={styles.card}>
            <h3 style={styles.cardTitle}>Settings</h3>
            <div style={styles.settingsGrid}>
              <div style={styles.settingItem}>
                <Settings size={20} style={styles.settingIcon} />
                <span>Account Settings</span>
              </div>
              <div style={styles.settingItem}>
                <Bell size={20} style={styles.settingIcon} />
                <span>Notification Preferences</span>
              </div>
              <div style={styles.settingItem}>
                <User size={20} style={styles.settingIcon} />
                <span>Privacy Settings</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#000000',
    color: '#ffffff',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
  },
  
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 30px',
    backgroundColor: '#111111',
    borderBottom: '1px solid #2a1065',
    boxShadow: '0 2px 10px rgba(139, 92, 246, 0.1)'
  },
  
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px'
  },
  
  title: {
    fontSize: '28px',
    fontWeight: '700',
    margin: 0,
    background: 'linear-gradient(135deg, #8b5cf6, #a855f7)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  
  searchBar: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: '#9ca3af',
    zIndex: 1
  },
  
  searchInput: {
    padding: '10px 12px 10px 40px',
    backgroundColor: '#1f1f1f',
    border: '1px solid #374151',
    borderRadius: '8px',
    color: '#ffffff',
    fontSize: '14px',
    width: '300px',
    outline: 'none',
    transition: 'all 0.3s ease',
    '&:focus': {
      borderColor: '#8b5cf6',
      boxShadow: '0 0 0 3px rgba(139, 92, 246, 0.1)'
    }
  },
  
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  
  notificationIcon: {
    position: 'relative',
    padding: '8px',
    cursor: 'pointer',
    color: '#9ca3af',
    transition: 'color 0.3s ease',
    '&:hover': {
      color: '#8b5cf6'
    }
  },
  
  notificationBadge: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    backgroundColor: '#8b5cf6',
    color: '#ffffff',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600'
  },
  
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 12px',
    backgroundColor: '#1f1f1f',
    borderRadius: '8px',
    border: '1px solid #374151'
  },
  
  userAvatar: {
    width: '32px',
    height: '32px',
    backgroundColor: '#8b5cf6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff'
  },
  
  username: {
    fontWeight: '500',
    color: '#ffffff'
  },
  
  logoutBtn: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    border: '1px solid #8b5cf6',
    borderRadius: '8px',
    color: '#8b5cf6',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#8b5cf6',
      color: '#ffffff'
    }
  },
  
  nav: {
    display: 'flex',
    padding: '0 30px',
    backgroundColor: '#111111',
    borderBottom: '1px solid #2a1065'
  },
  
  navButton: {
    padding: '15px 25px',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#9ca3af',
    fontWeight: '500',
    cursor: 'pointer',
    borderBottom: '2px solid transparent',
    transition: 'all 0.3s ease',
    '&:hover': {
      color: '#8b5cf6'
    }
  },
  
  navButtonActive: {
    color: '#8b5cf6',
    borderBottom: '2px solid #8b5cf6'
  },
  
  main: {
    padding: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  
  overview: {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  },
  
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px'
  },
  
  statCard: {
    backgroundColor: '#111111',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #2a1065',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 10px 25px rgba(139, 92, 246, 0.15)'
    }
  },
  
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  
  statIcon: {
    color: '#8b5cf6'
  },
  
  statChange: {
    color: '#10b981',
    fontSize: '14px',
    fontWeight: '600'
  },
  
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '10px 0 5px 0',
    color: '#ffffff'
  },
  
  statTitle: {
    color: '#9ca3af',
    fontSize: '14px',
    margin: 0
  },
  
  twoColumn: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px'
  },
  
  card: {
    backgroundColor: '#111111',
    padding: '25px',
    borderRadius: '12px',
    border: '1px solid #2a1065'
  },
  
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    margin: '0 0 20px 0',
    color: '#ffffff'
  },
  
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#1f1f1f',
    borderRadius: '8px',
    border: '1px solid #374151'
  },
  
  activityDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0
  },
  
  activityAction: {
    margin: '0 0 4px 0',
    color: '#ffffff',
    fontWeight: '500'
  },
  
  activityTime: {
    fontSize: '12px',
    color: '#9ca3af'
  },
  
  notificationList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  
  notificationItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#1f1f1f',
    borderRadius: '8px',
    border: '1px solid #374151'
  },
  
  notificationDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    marginTop: '6px',
    flexShrink: 0
  },
  
  notificationContent: {
    flex: 1
  },
  
  notificationMessage: {
    margin: '0 0 4px 0',
    color: '#ffffff',
    fontSize: '14px'
  },
  
  notificationTime: {
    fontSize: '12px',
    color: '#9ca3af'
  },
  
  profileSection: {
    maxWidth: '600px'
  },
  
  profileInfo: {
    display: 'flex',
    gap: '20px',
    alignItems: 'flex-start'
  },
  
  profileAvatar: {
    width: '80px',
    height: '80px',
    backgroundColor: '#8b5cf6',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff'
  },
  
  profileDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  
  profileField: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px'
  },
  
  profileLabel: {
    fontSize: '14px',
    color: '#9ca3af',
    fontWeight: '500'
  },
  
  profileValue: {
    fontSize: '16px',
    color: '#ffffff',
    fontWeight: '500'
  },
  
  comingSoon: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '16px',
    padding: '40px 0'
  },
  
  settingsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  
  settingItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '15px',
    backgroundColor: '#1f1f1f',
    borderRadius: '8px',
    border: '1px solid #374151',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: '#262626',
      borderColor: '#8b5cf6'
    }
  },
  
  settingIcon: {
    color: '#8b5cf6'
  }
};

export default Dashboard;