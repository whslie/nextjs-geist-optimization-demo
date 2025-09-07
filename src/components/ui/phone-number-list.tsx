"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PhoneLocation {
  id: string;
  phoneNumber: string;
  location: string;
  lat: number;
  lng: number;
  timestamp: string;
}

interface PhoneNumberListProps {
  phoneLocations: PhoneLocation[];
  onDelete: (id: string) => void;
  onLocate: (location: PhoneLocation) => void;
}

const PhoneNumberList: React.FC<PhoneNumberListProps> = ({ 
  phoneLocations, 
  onDelete, 
  onLocate 
}) => {
  const formatPhoneNumber = (phone: string) => {
    // Format phone number for better display
    if (phone.startsWith('+62')) {
      return phone;
    } else if (phone.startsWith('62')) {
      return `+${phone}`;
    } else if (phone.startsWith('0')) {
      return `+62${phone.substring(1)}`;
    }
    return phone;
  };

  const getTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Baru saja';
    if (diffInMinutes < 60) return `${diffInMinutes} menit yang lalu`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} jam yang lalu`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} hari yang lalu`;
    
    return time.toLocaleDateString('id-ID');
  };

  if (phoneLocations.length === 0) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Nomor Tersimpan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">Belum ada nomor telepon yang disimpan</p>
            <p className="text-xs mt-1">Tambahkan nomor pertama Anda!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center justify-between">
          Nomor Tersimpan
          <Badge variant="secondary" className="text-xs">
            {phoneLocations.length} nomor
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {phoneLocations.map((phoneLocation) => (
            <div
              key={phoneLocation.id}
              className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    {formatPhoneNumber(phoneLocation.phoneNumber)}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    📍 {phoneLocation.location}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {getTimeAgo(phoneLocation.timestamp)}
                  </p>
                </div>
                <div className="flex flex-col gap-1 ml-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onLocate(phoneLocation)}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    Lihat
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(phoneLocation.id)}
                    className="text-xs px-2 py-1 h-auto"
                  >
                    Hapus
                  </Button>
                </div>
              </div>
              
              <div className="mt-2 text-xs text-gray-500 bg-gray-100 rounded px-2 py-1">
                Koordinat: {phoneLocation.lat.toFixed(4)}, {phoneLocation.lng.toFixed(4)}
              </div>
            </div>
          ))}
        </div>
        
        {phoneLocations.length > 0 && (
          <div className="mt-4 pt-3 border-t text-xs text-gray-500 text-center">
            Total {phoneLocations.length} nomor telepon terlacak
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PhoneNumberList;
