import React from 'react';

function FullLabel({ label }) {
  return (
    <div
      style={{
        backgroundColor: label.color,
        borderRadius: '3px',
        padding: '0.5rem',
      }}
    >
      {label.name}
    </div>
  );
}

export default FullLabel;
