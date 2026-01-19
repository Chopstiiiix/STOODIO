"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import qs from "query-string";

export default function AdvancedSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    location: searchParams?.get("location") || "",
    category: searchParams?.get("category") || "",
    minPrice: searchParams?.get("minPrice") || "",
    maxPrice: searchParams?.get("maxPrice") || "",
    guests: searchParams?.get("guests") || "",
    rooms: searchParams?.get("rooms") || "",
    bathrooms: searchParams?.get("bathrooms") || "",
  });

  const handleSearch = () => {
    const query: any = {};

    if (filters.location) query.location = filters.location;
    if (filters.category) query.category = filters.category;
    if (filters.minPrice) query.minPrice = filters.minPrice;
    if (filters.maxPrice) query.maxPrice = filters.maxPrice;
    if (filters.guests) query.guests = filters.guests;
    if (filters.rooms) query.rooms = filters.rooms;
    if (filters.bathrooms) query.bathrooms = filters.bathrooms;

    const url = qs.stringifyUrl(
      {
        url: "/search",
        query,
      },
      { skipNull: true }
    );

    router.push(url);
    setIsOpen(false);
  };

  const handleClear = () => {
    setFilters({
      location: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      guests: "",
      rooms: "",
      bathrooms: "",
    });
    router.push("/");
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="relative">
      {/* Search Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded-full hover:shadow-md transition"
      >
        <Search className="w-4 h-4" />
        <span className="text-sm font-medium">Search</span>
        {hasActiveFilters && (
          <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
        )}
        <SlidersHorizontal className="w-4 h-4" />
      </button>

      {/* Advanced Search Modal */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <div className="absolute top-full right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Advanced Search</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters({ ...filters, location: e.target.value })
                  }
                  placeholder="e.g., Lagos, Abuja"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    setFilters({ ...filters, category: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="Music">Music Studio</option>
                  <option value="Podcast">Podcast Studio</option>
                  <option value="Photo">Photo Studio</option>
                  <option value="Make up">Makeup Studio</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Price (₦)
                  </label>
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, minPrice: e.target.value })
                    }
                    placeholder="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Price (₦)
                  </label>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters({ ...filters, maxPrice: e.target.value })
                    }
                    placeholder="Any"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Guests, Rooms, Bathrooms */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guests
                  </label>
                  <input
                    type="number"
                    value={filters.guests}
                    onChange={(e) =>
                      setFilters({ ...filters, guests: e.target.value })
                    }
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rooms
                  </label>
                  <input
                    type="number"
                    value={filters.rooms}
                    onChange={(e) =>
                      setFilters({ ...filters, rooms: e.target.value })
                    }
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Baths
                  </label>
                  <input
                    type="number"
                    value={filters.bathrooms}
                    onChange={(e) =>
                      setFilters({ ...filters, bathrooms: e.target.value })
                    }
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleClear}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Clear
              </button>
              <button
                onClick={handleSearch}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Search
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
