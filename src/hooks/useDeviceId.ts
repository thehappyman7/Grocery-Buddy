import { useState, useEffect } from 'react';

// Generate or retrieve a unique device ID for sync purposes
export const useDeviceId = () => {
  const [deviceId, setDeviceId] = useState<string>('');

  useEffect(() => {
    let id = localStorage.getItem('auragrocer_device_id');
    
    if (!id) {
      // Generate a unique device ID
      id = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('auragrocer_device_id', id);
    }
    
    setDeviceId(id);
  }, []);

  return deviceId;
};