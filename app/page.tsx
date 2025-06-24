"use client";
import React, { useState } from 'react';
import FloodRisk from '../src/components/tabs/FloodRisk';
import TideConditions from '../src/components/tabs/TideConditions';
import WaveMonitor from '../src/components/tabs/WaveMonitor';
import WeatherData from '../src/components/tabs/WeatherData';
import StreamMonitor from '../src/components/tabs/StreamMonitor';

const TABS = [
  { label: 'Stream Monitor', component: <StreamMonitor /> },
  { label: 'Flood Risk', component: <FloodRisk /> },
  { label: 'Tide Conditions', component: <TideConditions /> },
  { label: 'Wave Monitor', component: <WaveMonitor /> },
  { label: 'Weather Data', component: <WeatherData /> },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <header style={{ padding: '2rem 0 1rem 0', textAlign: 'center' }}>
        <h1 style={{
          fontFamily: "'Poppins', sans-serif",
          fontWeight: 700,
          fontSize: '2.5rem',
          color: '#fff',
          textShadow: '0 2px 8px rgba(30,60,114,0.4)'
        }}>
          Windward Flooding Tracker
        </h1>
      </header>
      <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid #ccc', marginBottom: 24, justifyContent: 'center' }}>
        {TABS.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            className={`tab-button${activeTab === idx ? " active" : ""}`}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === idx ? '3px solid #87ceeb' : 'none',
              fontWeight: activeTab === idx ? 'bold' : 'normal',
              fontSize: '1.1rem',
              padding: '12px 20px',
              cursor: 'pointer',
              color: activeTab === idx ? '#87ceeb' : '#fff',
              outline: 'none',
              transition: 'color 0.2s, border-bottom 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div>
        {TABS[activeTab].component}
      </div>
    </div>
  );
}