import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css'; // Import the CSS file for custom styles
import L from 'leaflet';
import Controls from './Controls';

const Map = () => {
  const [geojsonData, setGeojsonData] = useState([]);
  const [layerVisibility, setLayerVisibility] = useState({}); // Track layer visibility

  const position = [40.5, -111.7];
  const bounds = [
    [40.9801, -111.8896],
    [40.2338, -111.6585],
    [40.6461, -111.4977],
  ];

  const geojsonFiles = [
    '/Data/Protective_Bike_Lane.geojson',
    '/Data/Sweeping_Bike_Lane.geojson',
    '/Data/On_Road_Bike_Way.geojson',
    '/Data/OSM.geojson',
    '/Data/SLCParks.geojson',
    '/Data/Historic_Preservation.geojson',
    '/Data/POI.geojson',
    '/Data/Historic_Sites.geojson',
    '/Data/Art.geojson',
    '/Data/Bench.geojson',
    '/Data/Bike_Rack.geojson',
  ];

  useEffect(() => {
    const iconMappings = {
      'POI.geojson': '/icons/POI.png',
      'Historic_Sites.geojson': '/icons/HistoricSite.png',
      'Art.geojson': '/icons/PublicArt.png',
      'Bench.geojson': '/icons/Bench.png',
      'Bike_Rack.geojson': '/icons/BikeRack.png',
    };

    Promise.all(
      geojsonFiles.map((file) =>
        fetch(file)
          .then((response) => response.json())
          .then((data) => {
            const fileName = file.split('/').pop(); // Extract file name
            return { data, fileName };
          })
          .catch((err) => console.error(`Error loading ${file}:`, err))
      )
    ).then((files) => {
      const dataWithIcons = files.map(({ data, fileName }) => ({
        data,
        icon: iconMappings[fileName] || '/icons/default.png',
      }));
      setGeojsonData(dataWithIcons);
    });
  }, []);

  const pointToLayer = (feature, latlng, iconUrl) => {
    return L.marker(latlng, {
      icon: new L.Icon({
        iconUrl,
        iconSize: [25, 25],
        iconAnchor: [12, 12],
      }),
    });
  };

  const onEachFeature = (feature, layer) => {
    layer.bindPopup(feature.properties?.name || 'No name');
  };

  // Function to handle the toggling of the layer visibility
  const handleLayerToggle = (fileName, isVisible) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [fileName]: isVisible,
    }));
  };

  return (
    <div>
      <MapContainer center={position} zoom={10} style={{ height: '100vh', width: '100%' }} bounds={bounds}>
        <TileLayer url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png" />

        {geojsonData.map((fileData, index) => {
          const fileName = geojsonFiles[index].split('/').pop();
          return (
            layerVisibility[fileName] && (
              <GeoJSON
                key={index}
                data={fileData.data}
                pointToLayer={(feature, latlng) => pointToLayer(feature, latlng, fileData.icon)}
                onEachFeature={onEachFeature}
                className={`geojson-layer-${index}`} // Dynamically assign class based on index
              />
            )
          );
        })}
      </MapContainer>

      {/* Pass geojsonFiles and handleLayerToggle function to Controls component */}
      <Controls geojsonFiles={geojsonFiles} handleLayerToggle={handleLayerToggle} />
    </div>
  );
};

export default Map;
