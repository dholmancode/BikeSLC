import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import L from 'leaflet';
import Controls from './Controls';

const Map = () => {
  const [geojsonData, setGeojsonData] = useState([]);
  const [layerVisibility, setLayerVisibility] = useState({});

  const position = [40.5, -111.7];
  const bounds = [
    [40.9801, -111.8896],
    [40.2338, -111.6585],
    [40.6461, -111.4977],
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
        return { color: 'brown', weight: 2, opacity: 0.7 };
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

  // Function to assign custom icons to markers
  const pointToLayer = (feature, latlng, fileName) => {
    const iconUrl = layerIcons[fileName];
    return L.marker(latlng, {
      icon: new L.Icon({
        iconUrl,
        iconSize: [25, 25], // Adjust the icon size as needed
        iconAnchor: [12, 12], // Anchor the icon at the center
      }),
    });
  };

  return (
    <div>
      <MapContainer center={position} zoom={10} style={{ height: '100vh', width: '100%' }} bounds={bounds}>
        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />

        {geojsonData.map((fileData, index) => {
          const fileName = fileData.fileName;

          return (
            layerVisibility[fileName] && (
              <GeoJSON
                key={index}
                data={fileData.data}
                style={() => getLayerStyle(fileName)} // Apply the style based on the file name
                pointToLayer={(feature, latlng) => pointToLayer(feature, latlng, fileName)} // Assign custom icons
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
