"use client";

import React, { useEffect, useRef, useState } from 'react';

interface PhoneLocation {
  id: string;
  phoneNumber: string;
  location: string;
  lat: number;
  lng: number;
  timestamp: string;
}

interface MapProps {
  phoneLocations: PhoneLocation[];
  onLocationClick?: (location: PhoneLocation) => void;
}

const Map: React.FC<MapProps> = ({ phoneLocations, onLocationClick }) => {
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const initializeMap = async () => {
      try {
        // Dynamic import of Leaflet
        const L = (await import('leaflet')).default;

        // Fix for default markers in Leaflet with Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        // Initialize map only once
        if (!mapRef.current) {
          mapRef.current = L.map('map').setView([-6.2088, 106.8456], 10); // Jakarta coordinates as default

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
          }).addTo(mapRef.current);

          setIsLoaded(true);
        }

        // Clear existing markers
        markersRef.current.forEach(marker => {
          mapRef.current?.removeLayer(marker);
        });
        markersRef.current = [];

        // Add new markers
        phoneLocations.forEach((location) => {
          if (mapRef.current) {
            const marker = L.marker([location.lat, location.lng])
              .addTo(mapRef.current)
              .bindPopup(`
                <div class="p-2">
                  <h3 class="font-bold text-sm">${location.phoneNumber}</h3>
                  <p class="text-xs text-gray-600">${location.location}</p>
                  <p class="text-xs text-gray-500">${new Date(location.timestamp).toLocaleString()}</p>
                </div>
              `);

            marker.on('click', () => {
              if (onLocationClick) {
                onLocationClick(location);
              }
            });

            markersRef.current.push(marker);
          }
        });

        // Fit map to show all markers if there are any
        if (phoneLocations.length > 0 && mapRef.current) {
          const group = new L.FeatureGroup(markersRef.current);
          mapRef.current.fitBounds(group.getBounds().pad(0.1));
        }
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    return () => {
      // Cleanup function
      if (mapRef.current) {
        markersRef.current.forEach(marker => {
          mapRef.current?.removeLayer(marker);
        });
      }
    };
  }, [phoneLocations, onLocationClick]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div 
        id="map" 
        className="w-full h-[500px] rounded-lg border border-gray-200 shadow-sm"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Memuat peta...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
