import React from 'react';

export default function Timeline({ steps }) {
  return (
    <div className="timeline">
      {steps.map((step, idx) => (
        <div className="timeline-item" key={idx}>
          <div className="timeline-number">{idx + 1}</div>
          <div className="timeline-content">
            <h4>{step.title}</h4>
            <p>{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
} 