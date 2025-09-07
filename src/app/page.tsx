"use client";

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import PhoneNumberForm from '@/components/ui/phone-number-form';
import PhoneNumberList from '@/components/ui/phone-number-list';

// Dynamic import for Map component to avoid SSR issues
const Map = dynamic(() => import('@/components/ui/map'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
        <p className="text-sm text-gray-600">Memuat peta...</p>
      </div>
    </div>
  )
});

interface PhoneLocation {
  id: string;
  phoneNumber: string;
  location: string;
  lat: number;
  lng: number;
  timestamp: string;
}

export default function Home() {
  const [phoneLocations, setPhoneLocations] = useState<PhoneLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<PhoneLocation | null>(null);

  // Load saved phone numbers from localStorage on component mount
  useEffect(() => {
    const savedNumbers = localStorage.getItem('phoneLocations');
    if (savedNumbers) {
      try {
        const parsed = JSON.parse(savedNumbers);
        setPhoneLocations(parsed);
      } catch (error) {
        console.error('Error parsing saved phone numbers:', error);
      }
    }
  }, []);

  // Save phone numbers to localStorage whenever the list changes
  useEffect(() => {
    localStorage.setItem('phoneLocations', JSON.stringify(phoneLocations));
  }, [phoneLocations]);

  const handleSavePhoneNumber = (newPhoneLocation: PhoneLocation) => {
    setPhoneLocations(prev => [...prev, newPhoneLocation]);
    
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    successMessage.textContent = `Nomor ${newPhoneLocation.phoneNumber} berhasil disimpan!`;
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
      document.body.removeChild(successMessage);
    }, 3000);
  };

  const handleDeletePhoneNumber = (id: string) => {
    const phoneToDelete = phoneLocations.find(p => p.id === id);
    if (phoneToDelete && confirm(`Hapus nomor ${phoneToDelete.phoneNumber}?`)) {
      setPhoneLocations(prev => prev.filter(p => p.id !== id));
      
      // Show delete message
      const deleteMessage = document.createElement('div');
      deleteMessage.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
      deleteMessage.textContent = `Nomor ${phoneToDelete.phoneNumber} telah dihapus!`;
      document.body.appendChild(deleteMessage);
      
      setTimeout(() => {
        document.body.removeChild(deleteMessage);
      }, 3000);
    }
  };

  const handleLocatePhoneNumber = (location: PhoneLocation) => {
    setSelectedLocation(location);
    
    // Show locate message
    const locateMessage = document.createElement('div');
    locateMessage.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    locateMessage.textContent = `Menampilkan lokasi ${location.phoneNumber}`;
    document.body.appendChild(locateMessage);
    
    setTimeout(() => {
      document.body.removeChild(locateMessage);
    }, 3000);
  };

  const handleMapLocationClick = (location: PhoneLocation) => {
    setSelectedLocation(location);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                📱 Phone Tracker
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Pelacak Nomor Telepon - Prototype Google Maps
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">
                Total: {phoneLocations.length} nomor
              </p>
              <p className="text-xs text-gray-400">
                Menggunakan OpenStreetMap
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Form and List */}
          <div className="lg:col-span-1 space-y-6">
            {/* Phone Number Form */}
            <PhoneNumberForm onSave={handleSavePhoneNumber} />
            
            {/* Phone Number List */}
            <PhoneNumberList
              phoneLocations={phoneLocations}
              onDelete={handleDeletePhoneNumber}
              onLocate={handleLocatePhoneNumber}
            />
          </div>

          {/* Right Side - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  🗺️ Peta Lokasi
                </h2>
                {selectedLocation && (
                  <div className="text-sm text-gray-600">
                    Fokus: {selectedLocation.phoneNumber} - {selectedLocation.location}
                  </div>
                )}
              </div>
              
              <Map
                phoneLocations={phoneLocations}
                onLocationClick={handleMapLocationClick}
              />
              
              {phoneLocations.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 rounded-lg">
                  <div className="text-center">
                    <p className="text-gray-500 text-sm">
                      Tambahkan nomor telepon untuk melihat lokasi di peta
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>
              © 2024 Phone Tracker Prototype - Menggunakan OpenStreetMap & Leaflet
            </p>
            <p className="mt-1">
              Data lokasi bersifat simulasi untuk keperluan demonstrasi
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
