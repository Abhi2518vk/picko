"use client";

import { useEffect, useMemo, useCallback, ReactNode } from "react";

// Performance optimization utilities
export function usePerformanceOptimization() {
  useEffect(() => {
    // Disable console logs in production
    if (process.env.NODE_ENV === "production") {
      console.log = () => {};
      console.warn = () => {};
      console.info = () => {};
    }

    // Monitor performance
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.duration > 100) {
          console.warn(`Slow performance detected: ${entry.name} took ${entry.duration.toFixed(2)}ms`);
        }
      });
    });

    observer.observe({ entryTypes: ["measure", "longtask"] });

    return () => observer.disconnect();
  }, []);
}

// Debounced function
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      const timeoutId = setTimeout(() => {
        callback(...args);
      }, delay);

      return () => clearTimeout(timeoutId);
    },
    [callback, delay]
  );

  return debouncedCallback;
}

// Throttled function
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): (...args: Parameters<T>) => void {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      if (now - lastRun.current >= limit) {
        callback(...args);
        lastRun.current = now;
      }
    },
    [callback, limit]
  );
}

// Virtualized list for large datasets
export function VirtualizedList<T>({
  items,
  renderItem,
  itemHeight = 60,
  overscan = 5,
  containerHeight = 400,
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  itemHeight?: number;
  overscan?: number;
  containerHeight?: number;
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  );

  const visibleItems = useMemo(
    () => items.slice(startIndex, endIndex + 1),
    [items, startIndex, endIndex]
  );

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      setScrollTop(containerRef.current.scrollTop);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ height: `${containerHeight}px`, overflowY: "auto" }}
      onScroll={handleScroll}
    >
      <div style={{ height: `${totalHeight}px`, position: "relative" }}>
        {visibleItems.map((item, index) => {
          const actualIndex = startIndex + index;
          return (
            <div
              key={actualIndex}
              style={{
                position: "absolute",
                top: `${actualIndex * itemHeight}px`,
                height: `${itemHeight}px`,
                width: "100%",
              }}
            >
              {renderItem(item, actualIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Image lazy loading
export function LazyImage({
  src,
  alt,
  className,
  width,
  height,
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3C/svg%3E",
}: {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  placeholder?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError(true);

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
      <img
        src={isLoaded && !error ? src : placeholder}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          isLoaded && !error ? "opacity-100" : "opacity-0"
        }`}
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

// Memoized component with deep comparison
export function DeepMemo<T extends object>(Component: React.ComponentType<T>) {
  return React.memo(Component, (prevProps, nextProps) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps);
  });
}

// Performance monitoring hook
export function useRenderTime(componentName: string) {
  const startTime = useMemo(() => performance.now(), []);

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;

    if (renderTime > 50) {
      console.warn(`Slow render in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  }, [componentName, startTime]);
}

// Import React hooks
import { useState, useRef } from "react";
import React from "react";