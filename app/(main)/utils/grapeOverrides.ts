import grapesData from '@/app/data/grapes.json';
import overridesData from '@/app/data/grape-overrides.json';

interface Grape {
  id: string;
  name: string;
  berry_color: string;
  is_essential: boolean;
  [key: string]: any;
}

interface GrapesData {
  guide_type: string;
  source_file: string;
  parsed_date: string;
  total_grapes: number;
  essential_grapes: number;
  structure: any;
  grapes: Grape[];
}

interface Overrides {
  name_overrides: Record<string, string>;
  essential_overrides: Record<string, boolean>;
  _instructions?: any;
}

/**
 * Applies custom overrides to the grapes data
 * - name_overrides: Changes display names of grapes
 * - essential_overrides: Controls which grapes appear in the Essential toggle
 */
export function applyGrapeOverrides(): GrapesData {
  const data = { ...grapesData } as GrapesData;
  const overrides = overridesData as Overrides;

  // Apply overrides to each grape
  const modifiedGrapes = data.grapes.map(grape => {
    const modified = { ...grape };

    // Apply name override if exists
    if (overrides.name_overrides[grape.name]) {
      modified.name = overrides.name_overrides[grape.name];
    }

    // Apply essential status override if exists
    if (overrides.essential_overrides.hasOwnProperty(grape.id)) {
      modified.is_essential = overrides.essential_overrides[grape.id];
    }

    return modified;
  });

  // Recalculate essential_grapes count
  const essentialCount = modifiedGrapes.filter(g => g.is_essential).length;

  return {
    ...data,
    grapes: modifiedGrapes,
    essential_grapes: essentialCount,
  };
}

/**
 * Returns the raw grapes data without any overrides
 */
export function getRawGrapesData(): GrapesData {
  return grapesData as GrapesData;
}
