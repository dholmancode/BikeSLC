import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import L from 'leaflet';
import Controls from './Controls';

const Map = () => {
  const [geojsonData, setGeojsonData] = useState([]);
  const [layerVisibility, setLayerVisibility] = useState({});

  const position = [40.7400, -111.8870]; // Center slightly further south of Salt Lake City
  const bounds = [
    [40.8000, -111.9500], // Upper-left corner of the bounding box
    [40.6500, -112.7500], // Lower-right corner of the bounding box
  ];

  const geojsonFiles = [
    { file: '/Data/OSM.geojson' },
    { file: '/Data/Protective_Bike_Lane.geojson' },
    { file: '/Data/Sweeping_Bike_Lane.geojson' },
    { file: '/Data/On_Road_Bike_Way.geojson' },
    { file: '/Data/SLCParks.geojson' },
    { file: '/Data/Historic_Preservation.geojson' },
    { file: '/Data/POI.geojson' },
    { file: '/Data/Historic_Sites.geojson' },
    { file: '/Data/Art.geojson' },
    { file: '/Data/Bench.geojson' },
    { file: '/Data/Bike_Rack.geojson' },
  ];

  const layerIcons = {
    'Art.geojson': '/icons/PublicArt.png',
    'Bench.geojson': '/icons/Bench.png',
    'Historic_Sites.geojson': '/icons/HistoricSite.png',
    'Bike_Rack.geojson': '/icons/BikeRack.png',
    'POI.geojson': '/icons/POI.png',
  };

  useEffect(() => {
    Promise.all(
      geojsonFiles.map((item) =>
        fetch(item.file)
          .then((response) => response.json())
          .then((data) => ({
            data,
            fileName: item.file.split('/').pop(),
          }))
          .catch((err) => console.error(`Error loading ${item.file}:`, err))
      )
    ).then((files) => {
      setGeojsonData(files);
    });
  }, []);

  const getLayerStyle = (fileName) => {
    switch (fileName) {
      case 'OSM.geojson':
        return { color: 'blue', weight: 3, opacity: 0.9 };
      case 'Protective_Bike_Lane.geojson':
        return { color: 'green', weight: 3, opacity: 0.9 };
      case 'Sweeping_Bike_Lane.geojson':
        return { color: 'purple', weight: 3, opacity: 0.9 };
      case 'On_Road_Bike_Way.geojson':
        return { color: 'yellow', weight: 3, opacity: 0.9 };
      case 'SLCParks.geojson':
        return { color: 'forestgreen', weight: 2, opacity: 0.7 };
      case 'Historic_Preservation.geojson':
        return { color: 'orange', weight: 2, opacity: 0.7 };
      default:
        return { color: 'black', weight: 2, opacity: 0.7 };
    }
  };

  const handleLayerToggle = (fileName, isVisible) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [fileName]: isVisible,
    }));
  };

  // Function to assign custom icons to markers and bind popups with specific info
  const pointToLayer = (feature, latlng, fileName) => {
    const iconUrl = layerIcons[fileName];
    const marker = L.marker(latlng, {
      icon: new L.Icon({
        iconUrl,
        iconSize: [25, 25], // Adjust the icon size as needed
        iconAnchor: [12, 12], // Anchor the icon at the center
      }),
    });

    // Create popup content based on the layer
    let popupContent = '';
    switch (fileName) {
      case 'POI.geojson':
        popupContent = `
          <strong>Name:</strong> ${feature.properties.POI_NAME || 'No name available'}<br>
          <strong>Category:</strong> ${feature.properties.POI_CATEGO || 'No category available'}
        `;
        break;
      case 'Historic_Sites.geojson':
        popupContent = `
          <strong>Name:</strong> ${feature.properties.NAME || 'No name available'}<br>
          <img src="${feature.properties.PIC_URL || ''}" alt="" style="width:100px; height:auto;">
        `;
        break;
      case 'Art.geojson':
        popupContent = `
          <strong>Title:</strong> ${feature.properties.PA_TITLE || 'No title available'}<br>
          <strong>Artist:</strong> ${feature.properties.PA_ARTIST || 'No artist available'}<br>
          <strong>Year:</strong> ${feature.properties.PA_YEAR || 'No year available'}<br>
          <img src="${feature.properties.image_link}" alt="Art" width="100" />
        `;
        break;
      case 'Bench.geojson':
        popupContent = `
          <strong>Color:</strong> ${feature.properties.BenchColor || 'No color available'}<br>
          <strong>Material:</strong> ${feature.properties.Material || 'No material available'}
        `;
        break;
      case 'Bike_Rack.geojson':
        popupContent = `<strong>Rack Type:</strong> ${feature.properties.Rack_Type || 'No type available'}`;
        break;
      case 'Protective_Bike_Lane.geojson':
      case 'Sweeping_Bike_Lane.geojson':
      case 'On_Road_Bike_Way.geojson':
      case 'OSM.geojson':
      case 'SLCParks.geojson':
        popupContent = `
          <strong>Name:</strong> ${feature.properties.Name || 'No name available'}<br>
        `;
        break;
      case 'Historic_Preservation.geojson':
        popupContent = `
          <strong>Name:</strong> ${feature.properties.District || 'No name available'}<br>
        `;
        break;
      default:
        popupContent = 'No data available';
    }

    marker.bindPopup(popupContent); // Bind the dynamic popup content

    return marker;
  };

  return (
    <div>
      <MapContainer center={position} zoom={12} style={{ height: '100vh', width: '100%' }} bounds={bounds}>
        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />

        {geojsonData.map((fileData, index) => {
          const fileName = fileData.fileName;

          return (
            layerVisibility[fileName] && (
              <GeoJSON
                key={index}
                data={fileData.data}
                style={() => getLayerStyle(fileName)} // Apply the style based on the file name
                pointToLayer={(feature, latlng) => pointToLayer(feature, latlng, fileName)} // Assign custom icons and popups
              />
            )
          );
        })}
      </MapContainer>

      <Controls geojsonFiles={geojsonFiles} handleLayerToggle={handleLayerToggle} />
    </div>
  );
};

export default Map;
