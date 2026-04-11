"use client";

import { createContext, useContext, useState, useMemo, useCallback, ReactNode, memo } from "react";

// Optimized context pattern
export function createOptimizedContext<T>() {
  const Context = createContext<T | undefined>(undefined);

  const Provider = ({ value, children }: { value: T; children: ReactNode }) => {
    const memoizedValue = useMemo(() => value, [JSON.stringify(value)]);
    
    return (
      <Context.Provider value={memoizedValue}>
        {children}
      </Context.Provider>
    );
  };

  const useOptimizedContext = () => {
    const context = useContext(Context);
    if (!context) {
      throw new Error("useOptimizedContext must be used within its Provider");
    }
    return context;
  };

  return [Provider, useOptimizedContext] as const;
}

// Memoized component wrapper
export function memoized<T extends object>(Component: React.ComponentType<T>) {
  return memo(Component, (prevProps, nextProps) => {
    // Deep comparison for objects
    if (typeof prevProps === 'object' && typeof nextProps === 'object') {
      const prevKeys = Object.keys(prevProps);
      const nextKeys = Object.keys(nextProps);
      
      if (prevKeys.length !== nextKeys.length) return false;
      
      for (const key of prevKeys) {
        if (prevProps[key as keyof T] !== nextProps[key as keyof T]) {
          return false;
        }
      }
      return true;
    }
    
    return prevProps === nextProps;
  });
}

// Selective re-render hook
export function useSelectiveState<T>(initialState: T) {
  const [state, setState] = useState(initialState);
  
  const selectiveSetState = useCallback((updater: Partial<T> | ((prev: T) => Partial<T>)) => {
    setState(prev => {
      const newPartial = typeof updater === 'function' ? updater(prev) : updater;
      
      // Check if any value actually changed
      const hasChanges = Object.keys(newPartial).some(
        key => prev[key as keyof T] !== newPartial[key as keyof T]
      );
      
      if (!hasChanges) return prev;
      
      return { ...prev, ...newPartial };
    });
  }, []);
  
  return [state, selectiveSetState] as const;
}

// Optimized list rendering
export function OptimizedList<T>({
  items,
  renderItem,
  keyExtractor,
  emptyComponent,
  limit = 50,
}: {
  items: T[];
  renderItem: (item: T, index: number) => ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyComponent?: ReactNode;
  limit?: number;
}) {
  const memoizedItems = useMemo(() => items.slice(0, limit), [items, limit]);
  const memoizedRenderItem = useCallback(renderItem, []);
  
  if (memoizedItems.length === 0) {
    return <>{emptyComponent || null}</>;
  }
  
  return (
    <>
      {memoizedItems.map((item, index) => (
        <MemoizedItem
          key={keyExtractor(item)}
          item={item}
          index={index}
          renderItem={memoizedRenderItem}
        />
      ))}
    </>
  );
}

const MemoizedItem = memo(function MemoizedItem<T>({
  item,
  index,
  renderItem,
}: {
  item: T;
  index: number;
  renderItem: (item: T, index: number) => ReactNode;
}) {
  return <>{renderItem(item, index)}</>;
}) as <T>(props: {
  item: T;
  index: number;
  renderItem: (item: T, index: number) => ReactNode;
}) => React.JSX.Element;

// Performance monitoring hook
export function usePerformanceMonitor(componentName: string) {
  const startTime = useMemo(() => performance.now(), []);
  
  useMemo(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > 16) { // More than 60fps frame budget
      console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  }, [componentName, startTime]);
}

// Context splitting helper
export function splitContext<T extends Record<string, any>>(
  contextValue: T,
  splitKeys: (keyof T)[][]
): T[] {
  return splitKeys.map(keys => {
    const splitValue = {} as Partial<T>;
    keys.forEach(key => {
      splitValue[key] = contextValue[key];
    });
    return splitValue as T;
  });
}