import { useState, useCallback } from 'react';

const INITIAL_STACK = [{ level: 'world', label: 'World', filter: null }];

export function useRegionHierarchy() {
  const [navigationStack, setNavigationStack] = useState(INITIAL_STACK);

  const drillDown = useCallback((feature) => {
    setNavigationStack((prev) => [
      ...prev,
      {
        level: feature.hierarchyLevel || 'region',
        label: feature.name,
        filter: {
          country: feature.country,
          parentId: feature.id || feature.name,
        },
      },
    ]);
  }, []);

  const navigateTo = useCallback((index) => {
    setNavigationStack((prev) => prev.slice(0, index + 1));
  }, []);

  return {
    navigationStack,
    drillDown,
    navigateTo,
  };
}
