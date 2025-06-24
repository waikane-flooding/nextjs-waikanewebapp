// components/StreamMonitor.js
import React, { useState, useEffect } from 'react';

const StreamMonitor = () => {
  type StreamStatus = 'safe' | 'warning' | 'danger';
  type StreamData = {
    height: number;
    flow: number;
    status: StreamStatus;
    lastReading: Date | null;
  };
  type Streams = {
    waikane: StreamData;
    waihole: StreamData;
  };

  const [streamData, setStreamData] = useState<Streams>({
    waikane: {
      height: 0,
      flow: 0,
      status: 'safe',
      lastReading: null
    },
    waihole: {
      height: 0,
      flow: 0,
      status: 'safe',
      lastReading: null
    }
  });

  // Mock data generation for demonstration
  useEffect(() => {
    const generateMockData = () => {
      const now = new Date();
      
      // Base heights (typical normal conditions)
      const baseWaikane = 3.5;  // Normal range 2.0-6.0 ft
      const baseWaihole = 2.5;  // Normal range 1.5-5.0 ft
      
      // Add variation using time-based sine wave + random component
      const waikaneHeight = baseWaikane + 
        (Math.sin(now.getTime() / 3600000) * 1.5) + // hourly variation
        (Math.random() * 0.5); // small random fluctuation
    
      const waiholeHeight = baseWaihole + 
        (Math.sin(now.getTime() / 3600000) * 1.0) + // hourly variation
        (Math.random() * 0.3); // small random fluctuation

      // Ensure heights stay positive
      const finalWaikaneHeight = Math.max(2.0, waikaneHeight);
      const finalWaiholeHeight = Math.max(1.5, waiholeHeight);
    
      // Determine status based on height
      const getStatus = (height: number, isWaikane: boolean): StreamStatus => {
        const floodStage = isWaikane ? 10.0 : 8.0;
        const warningStage = isWaikane ? 7.0 : 6.0;
      
        if (height > floodStage) return 'danger';
        if (height > warningStage) return 'warning';
        return 'safe';
      };

      setStreamData({
        waikane: {
          height: finalWaikaneHeight,
          flow: finalWaikaneHeight * 15,
          status: getStatus(finalWaikaneHeight, true),
          lastReading: now
        },
        waihole: {
          height: finalWaiholeHeight,
          flow: finalWaiholeHeight * 12,
          status: getStatus(finalWaiholeHeight, false),
          lastReading: now
        }
      });

      // Show emergency banner if either stream is high
      const emergencyBanner = document.getElementById('emergencyBanner');
      if (emergencyBanner) {
        if (waikaneHeight > 10 || waiholeHeight > 10) {
          emergencyBanner.style.display = 'block';
        } else {
          emergencyBanner.style.display = 'none';
        }
      }
    };

    // Initial load
    generateMockData();
    
    // Update more frequently (every 10 seconds)
    const interval = setInterval(generateMockData, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'danger': return '🚨';
      case 'warning': return '⚠️';
      default: return '✅';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'danger': return 'HIGH WATER - AVOID AREA';
      case 'warning': return 'Elevated levels - Use caution';
      default: return 'Normal levels';
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '--';
    return date.toLocaleString('en-US', {
      timeZone: 'Pacific/Honolulu',
      timeStyle: 'short'
    });
  };

  return (
    <div className="stream-monitor">
      {/* Waikāne Stream Monitor */}
      <div className="component-card">
        <div className="card-header">
          <div className="card-icon">🏞️</div>
          <div className="card-title">Waikāne Stream Monitor</div>
        </div>
        
        <div className="data-grid">
          <div className="data-item">
            <div className="data-value">
              {streamData.waikane.height.toFixed(1)} ft
            </div>
            <div className="data-label">Current Height</div>
          </div>
          
          {/* Commenting out Flow Rate
          <div className="data-item">
            <div className="data-value">
              {streamData.waikane.flow.toFixed(0)} cfs
            </div>
            <div className="data-label">Flow Rate</div>
          </div>
          */}
          
          <div className="data-item">
            <div className="data-value">
              {formatTime(streamData.waikane.lastReading)}
            </div>
            <div className="data-label">Last Reading</div>
          </div>
          
          <div className="data-item">
            <div className="data-value">
              {getStatusIcon(streamData.waikane.status)}
            </div>
            <div className="data-label">Status</div>
          </div>
        </div>
        
        <div className={`status-indicator status-${streamData.waikane.status}`}>
          {getStatusIcon(streamData.waikane.status)} {getStatusText(streamData.waikane.status)}
        </div>
        
        {/* Live Chart Placeholder */}
        <div className="chart-placeholder">
          📊 Waikāne Stream Height Chart (24 hours)
          <br />
          <small>Real-time USGS gauge data visualization</small>
        </div>
      </div>

      {/* Waiahōle Stream Monitor */}
      <div className="component-card">
        <div className="card-header">
          <div className="card-icon">🌊</div>
          <div className="card-title">Waiahōle Stream Monitor</div>
        </div>
        
        <div className="data-grid">
          <div className="data-item">
            <div className="data-value">
              {streamData.waihole.height.toFixed(1)} ft
            </div>
            <div className="data-label">Current Height</div>
          </div>
          
          {/* Commenting out Flow Rate
          <div className="data-item">
            <div className="data-value">
              {streamData.waihole.flow.toFixed(0)} cfs
            </div>
            <div className="data-label">Flow Rate</div>
          </div>
          */}
          
          <div className="data-item">
            <div className="data-value">
              {formatTime(streamData.waihole.lastReading)}
            </div>
            <div className="data-label">Last Reading</div>
          </div>
          
          <div className="data-item">
            <div className="data-value">
              {getStatusIcon(streamData.waihole.status)}
            </div>
            <div className="data-label">Status</div>
          </div>
        </div>
        
        <div className={`status-indicator status-${streamData.waihole.status}`}>
          {getStatusIcon(streamData.waihole.status)} {getStatusText(streamData.waihole.status)}
        </div>
        
        {/* Live Chart Placeholder */}
        <div className="chart-placeholder">
          📊 Waiahōle Stream Height Chart (24 hours)
          <br />
          <small>Real-time USGS gauge data visualization</small>
        </div>
      </div>

      {/* Commenting out Combined Overview 
      <div className="component-card">
        <div className="card-header">
          <div className="card-icon">📊</div>
          <div className="card-title">Stream Comparison Overview</div>
        </div>
        
        <div className="comparison-grid">
          <div className="comparison-item">
            <h4>🏞️ Waikāne Stream</h4>
            <div className="comparison-stats">
              <span className="stat">Height: {streamData.waikane.height.toFixed(1)} ft</span>
              <span className="stat">Flow: {streamData.waikane.flow.toFixed(0)} cfs</span>
              <span className={`stat status-${streamData.waikane.status}`}>
                {getStatusIcon(streamData.waikane.status)} {streamData.waikane.status.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="comparison-item">
            <h4>🌊 Waihōle Stream</h4>
            <div className="comparison-stats">
              <span className="stat">Height: {streamData.waihole.height.toFixed(1)} ft</span>
              <span className="stat">Flow: {streamData.waihole.flow.toFixed(0)} cfs</span>
              <span className={`stat status-${streamData.waihole.status}`}>
                {getStatusIcon(streamData.waihole.status)} {streamData.waihole.status.toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>
      */}

      {/* Stream Information */}
      <div className="component-card">
        <div className="card-header">
          <div className="card-icon">ℹ️</div>
          <div className="card-title">Stream Information</div>
        </div>
        
        <div className="info-grid">
          <div className="info-section">
            <h4>🏞️ Waikāne Stream</h4>
            <ul className="info-list">
              <li><strong>Location:</strong> Waikāne Valley, Ko'olau Range</li>
              <li><strong>Length:</strong> ~8 miles</li>
              <li><strong>Drainage Area:</strong> 14.2 square miles</li>
              <li><strong>Flood Stage:</strong> 10.0 ft</li>
              <li><strong>Normal Range:</strong> 2.0 - 6.0 ft</li>
            </ul>
          </div>
          
          <div className="info-section">
            <h4>🌊 Waihōle Stream</h4>
            <ul className="info-list">
              <li><strong>Location:</strong> Waihōle Valley, Ko'olau Range</li>
              <li><strong>Length:</strong> ~6 miles</li>
              <li><strong>Drainage Area:</strong> 10.8 square miles</li>
              <li><strong>Flood Stage:</strong> 8.0 ft</li>
              <li><strong>Normal Range:</strong> 1.5 - 5.0 ft</li>
            </ul>
          </div>
        </div>
        
        <div className="alert-info">
          <i className="fas fa-info-circle"></i>
          <div>
            <strong>Safety Notice:</strong> These streams can rise rapidly during heavy rainfall. 
            Never attempt to cross flooded streams. When in doubt, turn around and find an alternate route.
          </div>
        </div>
      </div>

      {/* Map Display */}
      <div className="component-card">
        <div className="card-header">
          <div className="card-icon">🗺️</div>
          <div className="card-title">Stream Locations</div>
        </div>
        
        <div className="map-container">
          <iframe 
            title="Waikāne and Waihōle Stream Locations Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14773.041683737447!2d-157.87485659649657!3d21.485297546812695!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7c006b1aaaaaaaab%3A0x5075650e68390e4a!2sWaiahole%20Stream!5e0!3m2!1sen!2sus!4v1687641234567!5m2!1sen!2sus"
            width="100%" 
            height="450" 
            style={{ border: 0, borderRadius: '8px' }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>

    </div>
  );
};

export default StreamMonitor;