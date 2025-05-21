// LoadingBar.jsx
import React from 'react';

const LoadingBar = ({ progress, currentStep, url }) => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Analyzing: <a href={url} target="_blank" rel="noopener noreferrer">{url}</a></h2>
      <div style={{ margin: '20px 0', width: '80%', margin: 'auto', backgroundColor: '#e0e0e0', borderRadius: '10px' }}>
        <div
          style={{
            width: `${progress}%`,
            height: '20px',
            backgroundColor: '#3b5998',
            borderRadius: '10px',
            transition: 'width 0.3s ease-in-out'
          }}
        ></div>
      </div>
      <p>{currentStep}</p>
    </div>
  );
};

export default LoadingBar;
