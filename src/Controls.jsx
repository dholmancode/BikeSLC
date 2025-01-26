import React, { useState } from 'react';

const geojsonTitleMapping = {
  'POI.geojson': 'Points of Interest',
  'Historic_Sites.geojson': 'Historic Sites',
  'Art.geojson': 'Public Art',
  'Bench.geojson': 'Benches',
  'Bike_Rack.geojson': 'Bike Racks',
  'Protective_Bike_Lane.geojson': 'Protective Bike Lane',
  'Sweeping_Bike_Lane.geojson': 'Sweeping Bike Lane',
  'On_Road_Bike_Way.geojson': 'On-Road Bike Way',
  'OSM.geojson': 'Popular Cycling Routes',
  'SLCParks.geojson': 'Salt Lake City Parks',
  'Historic_Preservation.geojson': 'Historic Preservation Areas',
};

const geojsonIconMapping = {
  'POI.geojson': '/icons/POI.png',
  'Historic_Sites.geojson': '/icons/HistoricSite.png',
  'Art.geojson': '/icons/PublicArt.png',
  'Bench.geojson': '/icons/Bench.png',
  'Bike_Rack.geojson': '/icons/BikeRack.png',
  'Protective_Bike_Lane.geojson': '/icons/BikeRoute.png',
  'Sweeping_Bike_Lane.geojson': '/icons/BikeRoute.png',
  'On_Road_Bike_Way.geojson': '/icons/BikeRoute.png',
  'OSM.geojson': '/icons/OSM.png',
  'SLCParks.geojson': '/icons/Park.png',
  'Historic_Preservation.geojson': '/icons/Preservation.png',
};

const dashColorMapping = {
  // Bike Routes
  'Protective_Bike_Lane.geojson': 'green',
  'Sweeping_Bike_Lane.geojson': 'purple',
  'On_Road_Bike_Way.geojson': 'yellow',
  'OSM.geojson': 'blue',

  // Areas (Adding custom colors for each area)
  'SLCParks.geojson': 'green', // Color for Salt Lake City Parks
  'Historic_Preservation.geojson': 'orange', // Color for Historic Preservation Areas
};

const CategorySection = ({ title, files, type, handleCheckboxChange, activeLayers }) => {
  return (
    <div className="category">
      <h4>{title}</h4>
      {files.reverse().map((file) => {
        const fileName = file?.file?.split('/').pop();
        const geojsonTitle = geojsonTitleMapping[fileName] || fileName;
        const icon = geojsonIconMapping[fileName];
        const dashColor = dashColorMapping[fileName] || 'black'; // Default to black if no color found

        return (
          <div key={fileName} className="control-item">
            <input
              type="checkbox"
              id={fileName}
              checked={activeLayers[fileName] || false}
              onChange={() => handleCheckboxChange(fileName)}
            />
            <label htmlFor={fileName}>
              {type === 'bikeRoute' && (
                <span style={{ marginRight: '8px', color: dashColor }}><strong>----</strong></span>
              )}
              {type === 'area' && (
                <span
                  style={{
                    display: 'inline-block',
                    width: '20px',
                    height: '20px',
                    marginRight: '8px',
                    backgroundColor: dashColor, // Apply custom color for areas
                  }}
                ></span>
              )}
              {type === 'destination' && icon && (
                <img src={icon} alt={geojsonTitle} style={{ width: '30px', marginRight: '8px' }} />
              )}
              {geojsonTitle}
            </label>
          </div>
        );
      })}
    </div>
  );
};

const Controls = ({ geojsonFiles = [], handleLayerToggle }) => {
  const [activeLayers, setActiveLayers] = useState({});

  const handleCheckboxChange = (fileName) => {
    setActiveLayers((prevActiveLayers) => {
      const newActiveLayers = { ...prevActiveLayers, [fileName]: !prevActiveLayers[fileName] };
      handleLayerToggle(fileName, newActiveLayers[fileName]);
      return newActiveLayers;
    });
  };

  if (!geojsonFiles || geojsonFiles.length === 0) {
    return <div>No GeoJSON files available.</div>;
  }

  const bikeRoutes = geojsonFiles.filter(file =>
    file?.file?.includes('OSM.geojson') ||
    file?.file?.includes('Sweeping_Bike_Lane') ||
    file?.file?.includes('Protective_Bike_Lane') ||
    file?.file?.includes('On_Road_Bike_Way')
  );

  const areas = geojsonFiles.filter(file =>
    file?.file?.includes('SLCParks') ||
    file?.file?.includes('Historic_Preservation')
  );

  const destinations = geojsonFiles.filter(file =>
    file?.file?.includes('POI') ||
    file?.file?.includes('Historic_Sites') ||
    file?.file?.includes('Art') ||
    file?.file?.includes('Bench') ||
    file?.file?.includes('Bike_Rack')
  );

  return (
    <div className="controls">
      <h3>Map Controls</h3>
      <CategorySection
        title="Bike Routes"
        files={bikeRoutes}
        type="bikeRoute"
        handleCheckboxChange={handleCheckboxChange}
        activeLayers={activeLayers}
      />
      <CategorySection
        title="Areas"
        files={areas}
        type="area"
        handleCheckboxChange={handleCheckboxChange}
        activeLayers={activeLayers}
      />
      <CategorySection
        title="Destinations"
        files={destinations}
        type="destination"
        handleCheckboxChange={handleCheckboxChange}
        activeLayers={activeLayers}
      />
    </div>
  );
};

export default Controls;
