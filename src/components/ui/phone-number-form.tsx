"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PhoneLocation {
  id: string;
  phoneNumber: string;
  location: string;
  lat: number;
  lng: number;
  timestamp: string;
}

interface PhoneNumberFormProps {
  onSave: (phoneLocation: PhoneLocation) => void;
}

// Mock coordinates for different cities in Indonesia
const mockCoordinates: { [key: string]: { lat: number; lng: number } } = {
  'jakarta': { lat: -6.2088, lng: 106.8456 },
  'surabaya': { lat: -7.2575, lng: 112.7521 },
  'bandung': { lat: -6.9175, lng: 107.6191 },
  'medan': { lat: 3.5952, lng: 98.6722 },
  'semarang': { lat: -6.9667, lng: 110.4167 },
  'makassar': { lat: -5.1477, lng: 119.4327 },
  'palembang': { lat: -2.9761, lng: 104.7754 },
  'tangerang': { lat: -6.1783, lng: 106.6319 },
  'depok': { lat: -6.4025, lng: 106.7942 },
  'bekasi': { lat: -6.2383, lng: 106.9756 },
};

const PhoneNumberForm: React.FC<PhoneNumberFormProps> = ({ onSave }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const generateRandomCoordinates = (baseLocation?: string) => {
    if (baseLocation) {
      const normalizedLocation = baseLocation.toLowerCase();
      const cityCoords = mockCoordinates[normalizedLocation];
      if (cityCoords) {
        // Add small random offset to simulate different locations within the city
        return {
          lat: cityCoords.lat + (Math.random() - 0.5) * 0.1,
          lng: cityCoords.lng + (Math.random() - 0.5) * 0.1,
        };
      }
    }
    
    // Default to Jakarta area with random offset
    return {
      lat: -6.2088 + (Math.random() - 0.5) * 0.5,
      lng: 106.8456 + (Math.random() - 0.5) * 0.5,
    };
  };

  const validatePhoneNumber = (phone: string) => {
    // Basic Indonesian phone number validation
    const phoneRegex = /^(\+62|62|0)[0-9]{8,13}$/;
    return phoneRegex.test(phone.replace(/\s|-/g, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim() || !location.trim()) {
      alert('Mohon isi semua field yang diperlukan');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      alert('Format nomor telepon tidak valid. Gunakan format Indonesia (+62, 62, atau 0)');
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const coordinates = generateRandomCoordinates(location);
      
      const newPhoneLocation: PhoneLocation = {
        id: Date.now().toString(),
        phoneNumber: phoneNumber.trim(),
        location: location.trim(),
        lat: coordinates.lat,
        lng: coordinates.lng,
        timestamp: new Date().toISOString(),
      };

      onSave(newPhoneLocation);
      setPhoneNumber('');
      setLocation('');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Tambah Nomor Telepon</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Nomor Telepon</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Contoh: +62812345678 atau 08123456789"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Lokasi</Label>
            <Input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Jakarta, Surabaya, Bandung"
              required
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Menyimpan...' : 'Simpan Nomor'}
          </Button>
        </form>
        
        <div className="mt-4 text-xs text-gray-500">
          <p>Tips: Masukkan nama kota untuk lokasi yang lebih akurat</p>
          <p>Contoh kota: Jakarta, Surabaya, Bandung, Medan, Semarang</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhoneNumberForm;
