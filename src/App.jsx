import { useState, useEffect } from 'react'
import UserCard from './components/UserCard'
import AddUserModal from './components/AddUserModal'
import PerformanceChart from './components/PerformanceChart'
import { calculateAIRank } from './utils/aiRanking'

function App() {
  const [users, setUsers] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  // Load users from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('othersPerformanceUsers')
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers))
      } catch (e) {
        console.error('Error loading users:', e)
      }
    }
  }, [])

  // Save users to localStorage whenever users change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('othersPerformanceUsers', JSON.stringify(users))
    }
  }, [users])

  const addUser = (userData) => {
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      performanceHistory: [],
      createdAt: new Date().toISOString(),
    }
    setUsers([...users, newUser])
    setShowAddModal(false)
  }

  const updateUserPerformance = (userId, performanceData) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        const newEntry = {
          ...performanceData,
          date: new Date().toISOString(),
          id: Date.now().toString(),
        }
        return {
          ...user,
          performanceHistory: [...(user.performanceHistory || []), newEntry],
        }
      }
      return user
    }))
  }

  const deleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId))
    if (selectedUser?.id === userId) {
      setSelectedUser(null)
    }
  }

  // Calculate AI ranks for all users
  const rankedUsers = users.map(user => {
    try {
      const rank = calculateAIRank(user)
      return { ...user, rank }
    } catch (error) {
      console.error('Error calculating rank:', error)
      return { ...user, rank: { score: 0, tier: 'Unrated', insights: [] } }
    }
  }).sort((a, b) => (b.rank?.score || 0) - (a.rank?.score || 0))
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '32px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', margin: 0, marginBottom: '4px' }}>
                Others Performance
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px', margin: 0 }}>
                AI-Powered Performance Tracking & Ranking
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'white',
                color: '#764ba2',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              + Add User
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        {rankedUsers.length > 0 && (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px', 
            marginBottom: '32px' 
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '0 0 8px 0' }}>Total Users</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                {rankedUsers.length}
              </p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '0 0 8px 0' }}>Top Performer</p>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {rankedUsers[0]?.name || 'N/A'}
              </p>
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', margin: '0 0 8px 0' }}>Avg Performance</p>
              <p style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', margin: 0 }}>
                {rankedUsers.length > 0 
                  ? Math.round(rankedUsers.reduce((sum, u) => sum + (u.rank?.score || 0), 0) / rankedUsers.length)
                  : 0}
              </p>
            </div>
          </div>
        )}

        {/* User Cards Grid */}
        {rankedUsers.length === 0 ? (
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '8px' }}>
              No Users Yet
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
              Start tracking performance by adding your first user!
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                padding: '12px 24px',
                background: 'white',
                color: '#764ba2',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              Add First User
            </button>
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '24px',
            marginBottom: '32px'
          }}>
            {rankedUsers.map((user, index) => (
              <UserCard
                key={user.id}
                user={user}
                rank={index + 1}
                onUpdatePerformance={updateUserPerformance}
                onDelete={deleteUser}
                onSelect={() => setSelectedUser(user)}
                isSelected={selectedUser?.id === user.id}
              />
            ))}
          </div>
        )}

        {/* Performance Chart Modal */}
        {selectedUser && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            zIndex: 50
          }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              maxWidth: '896px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
                    {selectedUser.name}'s Performance
                  </h2>
                  <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>
                    {selectedUser.role || 'No role specified'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  style={{
                    padding: '8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '24px',
                    color: '#6b7280',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ×
                </button>
              </div>
              <PerformanceChart user={selectedUser} />
            </div>
          </div>
        )}

        {/* Add User Modal */}
        {showAddModal && (
          <AddUserModal
            onClose={() => setShowAddModal(false)}
            onAdd={addUser}
          />
        )}
      </div>
    </div>
  )
}

export default App

