// src/App.js
import React from 'react';
import Map from './Map';
import Controls from './Controls'; // Import Controls component

function App() {
  return (
    <div className="App">
      <div className="map-container">
        <Map />
      </div>
      <Controls /> {/* Render Controls */}
    </div>
  );
}

export default App;
