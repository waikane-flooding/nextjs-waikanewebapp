import React, { useState, useEffect } from 'react';

const TideConditions = () => {
  // Initialize with current date for nextHigh and nextLow
  const [tideData, setTideData] = useState({
    currentHeight: 0,
    direction: 'rising',
    nextHigh: new Date(),
    nextLow: new Date(),
    status: 'normal'
  });

  useEffect(() => {
    const generateTideData = () => {
      const now = new Date();
      
      // Generate realistic tide data (Hawaiian tides typically range 0-3 feet)
      const currentHeight = Math.sin(now.getTime() / 1000000) * 1.5 + 2;
      const direction = Math.cos(now.getTime() / 1000000) > 0 ? 'rising' : 'falling';
      
      // Calculate next high/low times (simplified)
      const nextHigh = new Date(now.getTime() + (6 * 60 * 60 * 1000)); // 6 hours from now
      const nextLow = new Date(now.getTime() + (12 * 60 * 60 * 1000)); // 12 hours from now
      
      const status = currentHeight > 2.5 ? 'high' : currentHeight < 0.5 ? 'low' : 'normal';
      
      setTideData({
        currentHeight,
        direction,
        nextHigh,
        nextLow,
        status
      });
    };

    generateTideData();
    const interval = setInterval(generateTideData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date | null) => {
    // Add null check
    if (!date) return 'N/A';
    
    try {
      return date.toLocaleString('en-US', {
        timeZone: 'Pacific/Honolulu',
        timeStyle: 'short'
      });
    } catch (error) {
      console.error('Error formatting time:', error);
      return 'N/A';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'high': return '🌊';
      case 'low': return '🏖️';
      default: return '🌊';
    }
  };

  return (
    <div className="tide-conditions">
      <div className="component-card">
        <div className="card-header">
          <div className="card-icon">🌊</div>
          <div className="card-title">Current Tide Conditions - Kāne'ohe Bay</div>
        </div>
        
        <div className="data-grid">
          <div className="data-item">
            <div className="data-value">
              {tideData.currentHeight.toFixed(1)} ft
            </div>
            <div className="data-label">Current Height</div>
          </div>
          
          <div className="data-item">
            <div className="data-value">
              {tideData.direction}
            </div>
            <div className="data-label">Tide Direction</div>
          </div>
          
          <div className="data-item">
            <div className="data-value">
              {formatTime(tideData.nextHigh)}
            </div>
            <div className="data-label">Next High Tide</div>
          </div>
          
          <div className="data-item">
            <div className="data-value">
              {formatTime(tideData.nextLow)}
            </div>
            <div className="data-label">Next Low Tide</div>
          </div>
        </div>
        
        <div className={`status-indicator status-${tideData.status === 'high' ? 'warning' : 'safe'}`}>
          {getStatusIcon(tideData.status)} Tide Status: {tideData.status.toUpperCase()}
        </div>
        
        <div className="chart-placeholder">
          📊 24-Hour Tide Chart - Kāne'ohe Bay Station
          <br />
          <small>NOAA tide gauge data visualization</small>
        </div>
      </div>
    </div>
  );
};

export default TideConditions;