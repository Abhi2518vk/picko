"use client";

import { ComponentType, ReactNode, Suspense, lazy, useState, useEffect } from "react";

interface DynamicImportProps {
  componentName: string;
  fallback?: ReactNode;
  [key: string]: any;
}

// Component registry
const COMPONENT_REGISTRY: Record<string, () => Promise<{ default: ComponentType<any> }>> = {
  "LeafletMap": () => import("react-leaflet").then(module => ({ 
    default: module.MapContainer as ComponentType<any> 
  })),
  "TileLayer": () => import("react-leaflet").then(module => ({ 
    default: module.TileLayer as ComponentType<any> 
  })),
  "Marker": () => import("react-leaflet").then(module => ({ 
    default: module.Marker as ComponentType<any> 
  })),
  "Popup": () => import("react-leaflet").then(module => ({ 
    default: module.Popup as ComponentType<any> 
  })),
  "MotionDiv": () => import("framer-motion").then(module => ({ 
    default: module.motion.div as ComponentType<any> 
  })),
  "MotionButton": () => import("framer-motion").then(module => ({ 
    default: module.motion.button as ComponentType<any> 
  })),
  "AnimatePresence": () => import("framer-motion").then(module => ({ 
    default: module.AnimatePresence as ComponentType<any> 
  })),
};

// Default fallback component
const DefaultFallback = () => (
  <div className="flex items-center justify-center p-4">
    <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
  </div>
);

export function DynamicImport({ 
  componentName, 
  fallback = <DefaultFallback />, 
  ...props 
}: DynamicImportProps) {
  const [Component, setComponent] = useState<ComponentType<any> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadComponent = async () => {
      try {
        if (COMPONENT_REGISTRY[componentName]) {
          const module = await COMPONENT_REGISTRY[componentName]();
          setComponent(() => module.default);
        } else {
          throw new Error(`Component "${componentName}" not found in registry`);
        }
      } catch (err) {
        console.error(`Failed to load component "${componentName}":`, err);
        setError(`Failed to load ${componentName}`);
      }
    };

    loadComponent();
  }, [componentName]);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 text-sm">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!Component) {
    return <>{fallback}</>;
  }

  return <Component {...props} />;
}

// Higher-order component for lazy loading
export function withDynamicImport<T extends object>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(importFn);

  return function DynamicWrapper(props: T) {
    return (
      <Suspense fallback={fallback || <DefaultFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Pre-configured dynamic imports
export const DynamicLeafletMap = withDynamicImport<any>(
  () => import("react-leaflet").then(module => ({ 
    default: module.MapContainer as ComponentType<any> 
  }))
);

export const DynamicTileLayer = withDynamicImport<any>(
  () => import("react-leaflet").then(module => ({ 
    default: module.TileLayer as ComponentType<any> 
  }))
);

export const DynamicMarker = withDynamicImport<any>(
  () => import("react-leaflet").then(module => ({ 
    default: module.Marker as ComponentType<any> 
  }))
);

export const DynamicMotionDiv = withDynamicImport<any>(
  () => import("framer-motion").then(module => ({ 
    default: module.motion.div as ComponentType<any> 
  }))
);

export const DynamicMotionButton = withDynamicImport<any>(
  () => import("framer-motion").then(module => ({ 
    default: module.motion.button as ComponentType<any> 
  }))
);

// Hook for dynamic import
export function useDynamicImport<T>(importFn: () => Promise<T>) {
  const [module, setModule] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    importFn()
      .then(setModule)
      .catch(err => {
        console.error("Dynamic import failed:", err);
        setError("Failed to load module");
      })
      .finally(() => setLoading(false));
  }, [importFn]);

  return { module, loading, error };
}