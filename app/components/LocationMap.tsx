"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import L from "leaflet";

// Fix Leaflet Default Icon Issue
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function LocationMarker({ position, text }: { position: [number, number]; text: string }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(position, map.getZoom());
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}>
            <Popup>{text}</Popup>
        </Marker>
    );
}

export default function LocationMap({
    userLat,
    userLng,
    shopLat,
    shopLng,
}: {
    userLat?: number;
    userLng?: number;
    shopLat?: number;
    shopLng?: number;
}) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return <div className="h-48 w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">Loading Map...</div>;

    const center: [number, number] = shopLat && shopLng ? [shopLat, shopLng] : [userLat || 12.9716, userLng || 77.5946];

    return (
        <div className="h-full w-full rounded-lg overflow-hidden z-0">
            <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {userLat && userLng && <LocationMarker position={[userLat, userLng]} text="You are here" />}
                {shopLat && shopLng && <Marker position={[shopLat, shopLng]}><Popup>Shop Location</Popup></Marker>}
            </MapContainer>
        </div>
    );
}
