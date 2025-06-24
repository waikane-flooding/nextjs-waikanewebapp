"use client";
import React, { useState } from 'react';
import FloodRisk from '../src/components/tabs/FloodRisk';
import TideConditions from '../src/components/tabs/TideConditions';
import WaveMonitor from '../src/components/tabs/WaveMonitor';
import WeatherData from '../src/components/tabs/WeatherData';
import StreamMonitor from '../src/components/tabs/StreamMonitor';

const TABS = [
  { label: 'Flood Risk', component: <FloodRisk /> },
  { label: 'Tide Conditions', component: <TideConditions /> },
  { label: 'Wave Monitor', component: <WaveMonitor /> },
  { label: 'Weather Data', component: <WeatherData /> },
  { label: 'Stream Monitor', component: <StreamMonitor /> },
];

export default function Page() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid #ccc', marginBottom: 24 }}>
        {TABS.map((tab, idx) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(idx)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === idx ? '3px solid #0070f3' : 'none',
              fontWeight: activeTab === idx ? 'bold' : 'normal',
              fontSize: '1.1rem',
              padding: '12px 20px',
              cursor: 'pointer',
              color: activeTab === idx ? '#0070f3' : '#333',
              outline: 'none',
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