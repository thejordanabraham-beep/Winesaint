import { useCallback, useMemo, useRef, useState } from 'react';

/**
 * Via Negativa checkbox state manager.
 *
 * Everything is checked by default. Users UNCHECK to hide.
 * When a parent is unchecked, all descendants are implicitly hidden.
 * When a parent is re-checked, previous child selections are restored.
 *
 * State per country:
 *   uncheckedIds: Set<string>  — IDs the user has explicitly unchecked
 *   savedState: Map<string, Set<string>> — saved child unchecked state when parent is unchecked
 */
export function useCheckboxTree() {
  const [state, setState] = useState({});
  // Use ref for saved states to avoid unnecessary re-renders
  const savedStatesRef = useRef({});

  const getCountryState = useCallback((countryId) => {
    return state[countryId] || { uncheckedIds: new Set() };
  }, [state]);

  /**
   * Check if a node is effectively checked (visible).
   * A node is unchecked if it or any of its ancestors is in uncheckedIds.
   */
  const isChecked = useCallback((countryId, nodeId, nodeMap) => {
    const { uncheckedIds } = getCountryState(countryId);
    if (uncheckedIds.size === 0) return true;

    // Check self
    if (uncheckedIds.has(nodeId)) return false;

    // Walk up ancestors
    let current = nodeMap?.get(nodeId);
    while (current?.parentId) {
      if (uncheckedIds.has(current.parentId)) return false;
      current = nodeMap.get(current.parentId);
    }
    return true;
  }, [getCountryState]);

  /**
   * Uncheck a node — hides it and all descendants.
   * Saves descendant unchecked state for memory on re-check.
   */
  const uncheckNode = useCallback((countryId, nodeId, getDescendantIds) => {
    setState(prev => {
      const countryState = prev[countryId] || { uncheckedIds: new Set() };
      const newUnchecked = new Set(countryState.uncheckedIds);

      // Save current descendant unchecked state before unchecking parent
      if (getDescendantIds) {
        const descendantIds = getDescendantIds(nodeId);
        const descendantUnchecked = new Set();
        for (const did of descendantIds) {
          if (newUnchecked.has(did)) {
            descendantUnchecked.add(did);
          }
        }
        if (!savedStatesRef.current[countryId]) {
          savedStatesRef.current[countryId] = new Map();
        }
        savedStatesRef.current[countryId].set(nodeId, descendantUnchecked);
      }

      newUnchecked.add(nodeId);

      return {
        ...prev,
        [countryId]: { uncheckedIds: newUnchecked },
      };
    });
  }, []);

  /**
   * Re-check a node — restores previous child selections.
   */
  const recheckNode = useCallback((countryId, nodeId) => {
    setState(prev => {
      const countryState = prev[countryId] || { uncheckedIds: new Set() };
      const newUnchecked = new Set(countryState.uncheckedIds);

      newUnchecked.delete(nodeId);

      // Restore saved descendant state
      const saved = savedStatesRef.current[countryId]?.get(nodeId);
      if (saved) {
        for (const did of saved) {
          newUnchecked.add(did);
        }
        savedStatesRef.current[countryId].delete(nodeId);
      }

      return {
        ...prev,
        [countryId]: { uncheckedIds: newUnchecked },
      };
    });
  }, []);

  /**
   * Toggle a node's checked state.
   */
  const toggleNode = useCallback((countryId, nodeId, nodeMap, getDescendantIdsFn) => {
    const { uncheckedIds } = getCountryState(countryId);
    if (uncheckedIds.has(nodeId)) {
      recheckNode(countryId, nodeId);
    } else {
      uncheckNode(countryId, nodeId, getDescendantIdsFn);
    }
  }, [getCountryState, recheckNode, uncheckNode]);

  /**
   * Initialize country state (called when country is toggled on).
   * Everything starts checked (empty uncheckedIds = via negativa).
   */
  const initCountry = useCallback((countryId) => {
    setState(prev => ({
      ...prev,
      [countryId]: prev[countryId] || { uncheckedIds: new Set() },
    }));
  }, []);

  /**
   * Get the unchecked IDs set for a country.
   */
  const getUncheckedIds = useCallback((countryId) => {
    return state[countryId]?.uncheckedIds || new Set();
  }, [state]);

  // Stable reference — only changes when state changes
  return useMemo(() => ({
    isChecked,
    toggleNode,
    uncheckNode,
    recheckNode,
    initCountry,
    getUncheckedIds,
    getCountryState,
    // Expose raw state for dependency tracking in useEffect
    _state: state,
  }), [state, isChecked, toggleNode, uncheckNode, recheckNode, initCountry, getUncheckedIds, getCountryState]);
}
