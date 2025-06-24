import React from "react";

export default function FloodRisk() {
  const emergencyContacts = [
    {
      name: "Honolulu Emergency Services",
      number: "911",
      description: "For immediate emergency response",
    },
    {
      name: "Windward Police Station",
      number: "(808) 723-8650",
      description: "Kāne'ohe Police Department",
    },
    {
      name: "Flood Control Hotline",
      number: "(808) 723-8488",
      description: "Report flooding issues",
    },
    {
      name: "Board of Water Supply",
      number: "(808) 748-5000",
      description: "Water emergency & main breaks",
    },
    {
      name: "Hawaiian Electric",
      number: "(808) 548-7961",
      description: "Power outages & emergencies",
    },
  ];

  return (
    <div>
      {/* Flood Risk Assessment Section */}
      <div className="component-card">
        <div className="card-header">
          <div className="card-icon">⚠️</div>
          <div className="card-title">Flood Risk Assessment</div>
        </div>
        <div className="data-grid">
          <div className="data-item">
            <div className="data-value">Low</div>
            <div className="data-label">Current Risk Level</div>
          </div>
        </div>
      </div>

      {/* Emergency Contacts Section */}
      <div className="component-card">
        <div className="card-header">
          <div className="card-icon">🚨</div>
          <div className="card-title">Emergency Contacts</div>
        </div>
        <div className="contacts-grid">
          {emergencyContacts.map((contact, index) => (
            <div key={index} className="contact-item">
              <div className="contact-name">{contact.name}</div>
              <a href={`tel:${contact.number}`} className="contact-number">
                {contact.number}
              </a>
              <div className="contact-description">{contact.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}