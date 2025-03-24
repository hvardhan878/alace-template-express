import React, { useState, useEffect } from 'react';

// Simple interface for database status
interface DbStatus {
  dbConnected: boolean;
  serverTime: string;
}

function App() {
  // Only keep status state
  const [status, setStatus] = useState<DbStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Only fetch status from API
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);
        
        const response = await fetch('/api/status');
        const data = await response.json();
        
        setStatus(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching status:', err);
        setError('Failed to connect to server');
        setLoading(false);
      }
    };
    
    fetchStatus();
    
    // Poll for updates every 5 seconds
    const intervalId = setInterval(fetchStatus, 5000);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading server status...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh', 
        color: 'red' 
      }}>
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ textAlign: 'center' }}>Database Connection Status</h1>
      
      {/* Connection Status Card */}
      <div style={{ 
        padding: '20px',
        margin: '20px 0',
        background: status?.dbConnected ? '#e6ffe6' : '#ffebeb',
        border: `1px solid ${status?.dbConnected ? '#00cc00' : '#ff8080'}`,
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          marginBottom: '10px' 
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            background: status?.dbConnected ? '#00cc00' : '#ff0000',
            marginRight: '10px'
          }}></div>
          <h2 style={{ margin: 0 }}>Status: {status?.dbConnected ? 'Connected' : 'Disconnected'}</h2>
        </div>
        
        <div style={{ marginTop: '15px' }}>
          <strong>Last checked:</strong> {status?.serverTime}
        </div>
        
        <div style={{ 
          marginTop: '20px',
          fontSize: '14px',
          fontStyle: 'italic',
          color: status?.dbConnected ? 'green' : 'red'
        }}>
          {status?.dbConnected 
            ? 'Database connection is active'
            : 'Database connection failed'}
        </div>
      </div>
    </div>
  );
}

export default App;