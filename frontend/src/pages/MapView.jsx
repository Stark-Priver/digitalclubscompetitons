import React from 'react';
import { Box, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { couriersData } from '../data/mockData';

const MapView = () => {
  const defaultPosition = [51.505, -0.09]; // Default map center

  return (
    <Box sx={{ height: 'calc(100vh - 64px)' }}>
      <Typography variant="h4" gutterBottom sx={{ p: 2 }}>
        Live Courier Map
      </Typography>
      <MapContainer center={defaultPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {couriersData.map((courier) => (
          <Marker key={courier.id} position={courier.position}>
            <Popup>
              <Typography variant="h6">{courier.name}</Typography>
              <Typography>Deliveries: {courier.deliveries}</Typography>
              <Typography>Rating: {courier.rating}</Typography>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default MapView;
