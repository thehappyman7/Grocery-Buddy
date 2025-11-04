import { useState, useEffect } from 'react';

export interface GeolocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  error?: string;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [loading, setLoading] = useState(false);

  const detectLocation = async () => {
    if (!navigator.geolocation) {
      setLocation({ 
        latitude: 0, 
        longitude: 0, 
        error: 'Geolocation not supported' 
      });
      return;
    }

    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          setLocation({
            latitude,
            longitude,
            city: data.address?.city || data.address?.town || data.address?.village,
            country: data.address?.country
          });
        } catch (error) {
          setLocation({
            latitude,
            longitude,
            error: 'Could not fetch location details'
          });
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        setLocation({ 
          latitude: 0, 
          longitude: 0, 
          error: 'Location permission denied' 
        });
        setLoading(false);
      }
    );
  };

  return { location, loading, detectLocation };
};
