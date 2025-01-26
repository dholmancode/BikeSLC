import React, { useState } from 'react';

// Mapping of GeoJSON file names to more readable titles
const geojsonTitleMapping = {
  'POI.geojson': 'Points of Interest',
  'Historic_Sites.geojson': 'Historic Sites',
  'Art.geojson': 'Public Art',
  'Bench.geojson': 'Benches',
  'Bike_Rack.geojson': 'Bike Racks',
  'Protective_Bike_Lane.geojson': 'Protective Bike Lane',
  'Sweeping_Bike_Lane.geojson': 'Sweeping Bike Lane',
  'On_Road_Bike_Way.geojson': 'On-Road Bike Way',
  'OSM.geojson': 'OpenStreetMap',
  'SLCParks.geojson': 'Salt Lake City Parks',
  'Historic_Preservation.geojson': 'Historic Preservation Areas',
};

// Icons mapping for the respective GeoJSON files
const geojsonIconMapping = {
  'POI.geojson': '/icons/POI.png',
  'Historic_Sites.geojson': '/icons/HistoricSite.png',
  'Art.geojson': '/icons/PublicArt.png',
  'Bench.geojson': '/icons/Bench.png',
  'Bike_Rack.geojson': '/icons/BikeRack.png',
};

const Controls = ({ geojsonFiles = [], handleLayerToggle }) => { // Default value for geojsonFiles
  const [activeLayers, setActiveLayers] = useState({});

  const handleCheckboxChange = (fileName) => {
    setActiveLayers((prevActiveLayers) => {
      const newActiveLayers = { ...prevActiveLayers, [fileName]: !prevActiveLayers[fileName] };
      handleLayerToggle(fileName, newActiveLayers[fileName]);
      return newActiveLayers;
    });
  };

  if (!geojsonFiles || geojsonFiles.length === 0) {
    return <div>No GeoJSON files available.</div>; // Return an error or a message if the geojsonFiles are empty or undefined
  }

  return (
    <div className="controls">
      <h3>Map Controls</h3>
      {/* Reverse the order of geojsonFiles */}
      {geojsonFiles.reverse().map((file) => {
        const fileName = file.split('/').pop();
        const title = geojsonTitleMapping[fileName] || fileName;
        const icon = geojsonIconMapping[fileName];

        return (
          <div key={fileName} className="control-item">
            <input
              type="checkbox"
              id={fileName}
              checked={activeLayers[fileName] || false}
              onChange={() => handleCheckboxChange(fileName)}
            />
            <label htmlFor={fileName}>
              {icon && <img src={icon} alt={title} style={{ width: '20px', marginRight: '8px' }} />}
              {title}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default Controls;
