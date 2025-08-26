
import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

// The API key would typically be stored in environment variables
// This is just for demo purposes - needs to be replaced with a valid key
const googleMapsApiKey = "";

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem'
};

const lomePosition = {
  lat: 6.1319,
  lng: 1.2228
};

const Map: React.FC = () => {
  const [loadError, setLoadError] = useState<boolean>(false);

  const handleError = () => {
    console.log("Google Maps failed to load correctly");
    setLoadError(true);
  };

  if (loadError || !googleMapsApiKey) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-xl">
        <div className="text-center p-8">
          <MapPin size={48} className="mx-auto mb-4 text-primary" />
          <h3 className="text-xl font-medium mb-2">Bureau du Sénateur LM</h3>
          <p className="text-gray-600">123 Avenue de l'Indépendance, Lomé, Togo</p>
          <p className="text-sm text-gray-500 mt-4">
            Coordonnées: 6.1319° N, 1.2228° E
          </p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={googleMapsApiKey}
      onError={handleError}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={lomePosition}
        zoom={14}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        <Marker position={lomePosition} title="Bureau du Sénateur LM" />
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
