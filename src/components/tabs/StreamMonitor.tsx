// components/StreamMonitor.js
import React, { useState, useEffect } from 'react';
import WaikaneStreamHeight from '../WaikaneStreamHeight';
import WaikaneStreamGraph from '../WaikaneStreamGraph';
import WaiaholeStreamHeight from '../WaiaholeStreamHeight';
import WaiaholeStreamGraph from '../WaiaholeStreamGraph';

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

  const [loading, setLoading] = useState(true);
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

  useEffect(() => {
    const fetchStreamData = async () => {
      try {
        setLoading(true);
        const [waikaneRes, waiaholeRes] = await Promise.all([
          fetch('http://localhost:5000/api/waikane_stream'),
          fetch('http://localhost:5000/api/waiahole_stream')
        ]);
        const [waikaneData, waiaholeData] = await Promise.all([
          waikaneRes.json(),
          waiaholeRes.json()
        ]);

        // Helper to get latest valid reading
        const getLatest = (data: any[]) => {
          const now = new Date();
          return data
            .filter((d: any) => d.ft != null && d.DateTime)
            .map((d: any) => ({
              time: new Date(d.DateTime),
              value: d.ft
            }))
            .filter((d: any) => d.time <= now)
            .sort((a: any, b: any) => b.time - a.time)[0];
        };

        const waikaneLatest = getLatest(waikaneData);
        const waiaholeLatest = getLatest(waiaholeData);

        // Status logic (adjust thresholds as needed)
        const getStatus = (height: number, isWaikane: boolean): StreamStatus => {
          if (isWaikane) {
            if (height > 10.8) return 'danger';
            if (height > 7) return 'warning';
            return 'safe';
          } else {
            if (height > 16.4) return 'danger';
            if (height > 12) return 'warning';
            return 'safe';
          }
        };

        setStreamData({
          waikane: {
            height: waikaneLatest ? waikaneLatest.value : 0,
            flow: waikaneLatest ? waikaneLatest.value * 15 : 0,
            status: waikaneLatest ? getStatus(waikaneLatest.value, true) : 'safe',
            lastReading: waikaneLatest ? waikaneLatest.time : null
          },
          waihole: {
            height: waiaholeLatest ? waiaholeLatest.value : 0,
            flow: waiaholeLatest ? waiaholeLatest.value * 12 : 0,
            status: waiaholeLatest ? getStatus(waiaholeLatest.value, false) : 'safe',
            lastReading: waiaholeLatest ? waiaholeLatest.time : null
          }
        });

        // Show emergency banner if either stream is high
        const emergencyBanner = document.getElementById('emergencyBanner');
        if (emergencyBanner) {
          if ((waikaneLatest && waikaneLatest.value > 10) || (waiaholeLatest && waiaholeLatest.value > 12)) {
            emergencyBanner.style.display = 'block';
          } else {
            emergencyBanner.style.display = 'none';
          }
        }
      } catch (err) {
        console.error('Failed to fetch stream data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStreamData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'danger': return '🚨';
      case 'warning': return '⚠️';
      default: return '✅';
    }
  };

  const getStatusText = (status: string, isWaikane: boolean) => {
    if (status === 'danger') return 'HIGH WATER - AVOID AREA';
    if (status === 'warning') return 'Elevated levels - Use caution';
    return 'Normal levels';
  };

  const formatTime = (date: Date | null) => {
    if (!date) return '--';
    return date.toLocaleString('en-US', {
      timeZone: 'Pacific/Honolulu',
      timeStyle: 'short'
    });
  };

  const LoadingSkeleton = () => (
    <div className="data-grid">
      <div className="data-item">
        <div className="data-value loading-skeleton">--</div>
        <div className="data-label">Current Height</div>
      </div>
      <div className="data-item">
        <div className="data-value loading-skeleton">--</div>
        <div className="data-label">Last Reading</div>
      </div>
      <div className="data-item">
        <div className="data-value loading-skeleton">--</div>
        <div className="data-label">Status</div>
      </div>
    </div>
  );

  return (
    <div className="stream-monitor">
      {/* Waikāne Stream Monitor */}
      <div className="component-card">
        <div className="card-header">
          <div className="card-icon">🏞️</div>
          <div className="card-title">Waikāne Stream Monitor</div>
          {loading && <div className="loading-badge">Loading...</div>}
        </div>
        
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="data-grid">
            <div className="data-item">
              <div className="data-value">
                {streamData.waikane.height.toFixed(2)} ft
              </div>
              <div className="data-label">Current Height</div>
            </div>
            
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
        )}
        
        {!loading && (
          <div className={`status-indicator status-${streamData.waikane.status}`}>
            {getStatusIcon(streamData.waikane.status)} {getStatusText(streamData.waikane.status, true)}
          </div>
        )}
        
        {/* Live Chart Components - Side by Side */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
          <WaikaneStreamHeight />
          <WaikaneStreamGraph />
        </div>
      </div>

      {/* Waiahōle Stream Monitor */}
      <div className="component-card">
        <div className="card-header">
          <div className="card-icon">🌊</div>
          <div className="card-title">Waiahōle Stream Monitor</div>
          {loading && <div className="loading-badge">Loading...</div>}
        </div>
        
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <div className="data-grid">
            <div className="data-item">
              <div className="data-value">
                {streamData.waihole.height.toFixed(2)} ft
              </div>
              <div className="data-label">Current Height</div>
            </div>
            
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
        )}
        
        {!loading && (
          <div className={`status-indicator status-${streamData.waihole.status}`}>
            {getStatusIcon(streamData.waihole.status)} {getStatusText(streamData.waihole.status, false)}
          </div>
        )}
        
        {/* Live Chart Components - Side by Side */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
          <WaiaholeStreamHeight />
          <WaiaholeStreamGraph />
        </div>
      </div>

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