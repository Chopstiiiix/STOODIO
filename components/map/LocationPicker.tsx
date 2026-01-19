"use client";

import { useState } from "react";
import MapComponent from "./Map";
import { Search } from "lucide-react";

interface LocationPickerProps {
  value?: { lat: number; lng: number; address?: string };
  onChange: (location: { lat: number; lng: number; address?: string }) => void;
}

export default function LocationPicker({
  value,
  onChange,
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Use Mapbox Geocoding API to search for locations
      const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          searchQuery
        )}.json?access_token=${mapboxToken}&limit=1`
      );

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const address = data.features[0].place_name;

        onChange({ lat, lng, address });
      }
    } catch (error) {
      console.error("Error searching location:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    onChange({ lat, lng, address: value?.address });
  };

  const center: [number, number] = value
    ? [value.lng, value.lat]
    : [3.3792, 6.5244];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search for a location..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={isSearching}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          <Search className="w-4 h-4" />
          {isSearching ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Selected Location */}
      {value?.address && (
        <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
          <strong>Selected:</strong> {value.address}
        </div>
      )}

      {/* Map */}
      <div className="w-full h-96 border border-gray-300 rounded-lg overflow-hidden">
        <MapComponent
          center={center}
          zoom={12}
          onLocationSelect={handleLocationSelect}
          markers={
            value
              ? [
                  {
                    id: "selected",
                    latitude: value.lat,
                    longitude: value.lng,
                    title: "Selected Location",
                  },
                ]
              : []
          }
        />
      </div>

      <p className="text-xs text-gray-500">
        Click on the map to select a location or use the search bar above
      </p>
    </div>
  );
}
