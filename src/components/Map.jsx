import React from "react";
import 'leaflet/dist/leaflet.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { MAJOR_DATA_SAMPLE } from "../constants";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import Info from "../components/Info";

const Map = () => {
    return (
        <div className="leaflet-container"> 
            <MapContainer center={[36.778259, -119.417931]} zoom={6} scrollWheelZoom={true}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {MAJOR_DATA_SAMPLE.map((item,index) => {
                return (
                    <Marker position={[item.lat, item.lon]} key={index*40+7}
                        eventHandlers={{
                        mouseover: (event) => event.target.openPopup(),
                      }}>
                        <Popup>
                            {item.campus} <br /> {item.city}
                        </Popup>
                    </Marker>
                );
            })}
            </MapContainer>
        </div>
    );
  };
    
  export default Map;