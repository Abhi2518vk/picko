"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { SafeStorage } from "@/lib/storage";
import { locationSchema, safeValidate } from "@/lib/validation";

// Location Context Types
type Location = {
  lat: number;
  lng: number;
  address: string;
};

type LocationContextType = {
  location: Location;
  setLocation: (loc: Location) => void;
  detectLocation: () => void;
  manualLocation: (address: string, lat?: number, lng?: number) => void;
  loading: boolean;
};

const DEFAULT_LOCATION: Location = { 
  lat: 12.9716, 
  lng: 77.5946, 
  address: "MG Road, Bangalore" 
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Location Provider Component
export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocationState] = useState<Location>(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);

  // Load location from localStorage on mount
  useEffect(() => {
    const savedLocation = SafeStorage.getJSON<Location>("location");
    if (savedLocation) {
      const validation = safeValidate(locationSchema, savedLocation);
      if (validation.success) {
        setLocationState(savedLocation);
      } else {
        console.error("Invalid saved location:", validation.errors);
      }
    }
    setLoading(false);
  }, []);

  const setLocation = (loc: Location) => {
    const validation = safeValidate(locationSchema, loc);
    if (!validation.success) {
      console.error("Invalid location:", validation.errors);
      return;
    }
    
    setLocationState(loc);
    SafeStorage.setJSON("location", loc);
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation: Location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            address: `${position.coords.latitude.toFixed(2)}, ${position.coords.longitude.toFixed(2)}`,
          };
          
          const validation = safeValidate(locationSchema, newLocation);
          if (validation.success) {
            setLocation(newLocation);
          } else {
            console.error("Invalid detected location:", validation.errors);
            alert("Unable to detect valid location. Please enter manually.");
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error detecting location", error);
          alert("Unable to detect location. Please enter manually.");
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert("Geolocation is not supported by your browser. Please enter location manually.");
    }
  };

  const manualLocation = (address: string, lat?: number, lng?: number) => {
    const newLocation: Location = {
      lat: lat || DEFAULT_LOCATION.lat,
      lng: lng || DEFAULT_LOCATION.lng,
      address: address,
    };
    
    const validation = safeValidate(locationSchema, newLocation);
    if (validation.success) {
      setLocation(newLocation);
    } else {
      console.error("Invalid manual location:", validation.errors);
      alert("Invalid location data. Please check your input.");
    }
  };

  return (
    <LocationContext.Provider value={{ 
      location, 
      setLocation, 
      detectLocation, 
      manualLocation,
      loading 
    }}>
      {children}
    </LocationContext.Provider>
  );
}

// Location Hook
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) throw new Error("useLocation must be used within LocationProvider");
  return context;
};