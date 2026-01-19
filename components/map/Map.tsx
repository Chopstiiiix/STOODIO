"use client";

import { useEffect, useState } from "react";
import Map, { Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";

interface MapComponentProps {
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  onLocationSelect?: (lat: number, lng: number) => void;
  markers?: Array<{
    id: string;
    latitude: number;
    longitude: number;
    title?: string;
  }>;
  interactive?: boolean;
}

export default function MapComponent({
  center = [3.3792, 6.5244], // Default: Lagos, Nigeria
  zoom = 10,
  onLocationSelect,
  markers = [],
  interactive = true,
}: MapComponentProps) {
  const [viewState, setViewState] = useState({
    longitude: center[0],
    latitude: center[1],
    zoom,
  });

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  useEffect(() => {
    setViewState({
      longitude: center[0],
      latitude: center[1],
      zoom,
    });
  }, [center, zoom]);

  const handleMapClick = (event: any) => {
    if (!interactive || !onLocationSelect) return;

    const { lngLat } = event;
    const lat = lngLat.lat;
    const lng = lngLat.lng;

    setSelectedLocation({ lat, lng });
    onLocationSelect(lat, lng);
  };

  if (!mapboxToken) {
    return (
      <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
        <p className="text-gray-500 text-sm">
          Map unavailable - Mapbox token not configured
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={mapboxToken}
        style={{ width: "100%", height: "100%" }}
        interactive={interactive}
      >
        <NavigationControl position="top-right" />

        {/* Display provided markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            longitude={marker.longitude}
            latitude={marker.latitude}
            anchor="bottom"
          >
            <div className="flex flex-col items-center">
              <MapPin className="w-8 h-8 text-red-500 fill-red-500" />
              {marker.title && (
                <div className="bg-white px-2 py-1 rounded shadow-md text-xs font-medium mt-1">
                  {marker.title}
                </div>
              )}
            </div>
          </Marker>
        ))}

        {/* Display selected location */}
        {selectedLocation && (
          <Marker
            longitude={selectedLocation.lng}
            latitude={selectedLocation.lat}
            anchor="bottom"
          >
            <MapPin className="w-8 h-8 text-blue-500 fill-blue-500" />
          </Marker>
        )}
      </Map>
    </div>
  );
}
