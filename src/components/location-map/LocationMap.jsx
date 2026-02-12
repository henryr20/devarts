import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import './LocationMap.css';

// Fix for default marker icon in Leaflet with bundlers
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const LocationMap = () => {
    // Las Palmas de Gran Canaria coordinates
    const position = [28.1281, -15.4301];

    return (
        <div className="location-section">
            <div className="map-wrapper">
                <MapContainer
                    key={JSON.stringify(position)}
                    center={position}
                    zoom={14}
                    scrollWheelZoom={false}
                    className="leaflet-container"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />
                    <Marker position={position}>
                        <Popup className="custom-popup">
                            DevArts HQ <br /> Las Palmas de Gran Canaria
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
            <div className="location-info-bar">
                <p><strong>Location:</strong> Las Palmas de Gran Canaria, Gran Canaria, Spain</p>
            </div>
        </div>
    );
};

export default LocationMap;
