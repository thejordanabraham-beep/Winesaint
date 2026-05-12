/**
 * Topic tag inference from file path.
 *
 * Hierarchical kebab-case, geography-first.
 *
 *   level-1/module-01-wine-basics.md
 *     → ['foundations', 'foundations-wine-basics']
 *
 *   level-1/module-03-old-world-regions.md
 *     → ['foundations', 'foundations-old-world-regions']
 *
 *   mastery/france/02-bordeaux-left-bank.md
 *     → ['france', 'france-bordeaux', 'france-bordeaux-left-bank']
 *
 *   mastery/france/10-champagne-terroir-vinification.md
 *     → ['france', 'france-champagne']
 *
 *   mastery/wine-program-management/13-service-standards-tableside-excellence.md
 *     → ['wine-program-management', 'wine-program-management-service-standards']
 */

import path from 'path'

const FRANCE_SUBREGIONS: Record<string, string[]> = {
  bordeaux: ['france', 'france-bordeaux'],
  burgundy: ['france', 'france-burgundy'],
  chablis: ['france', 'france-burgundy', 'france-burgundy-chablis'],
  'cote-de-nuits': ['france', 'france-burgundy', 'france-burgundy-cote-de-nuits'],
  'cote-de-beaune': ['france', 'france-burgundy', 'france-burgundy-cote-de-beaune'],
  'chalonnaise-maconnais': ['france', 'france-burgundy', 'france-burgundy-chalonnaise-maconnais'],
  champagne: ['france', 'france-champagne'],
  rhone: ['france', 'france-rhone'],
  loire: ['france', 'france-loire'],
  alsace: ['france', 'france-alsace'],
  beaujolais: ['france', 'france-beaujolais'],
  jura: ['france', 'france-jura'],
  savoie: ['france', 'france-savoie'],
  languedoc: ['france', 'france-languedoc'],
  provence: ['france', 'france-provence'],
  'southwest-france': ['france', 'france-southwest'],
  sauternes: ['france', 'france-bordeaux', 'france-bordeaux-sauternes'],
}

export function inferTags(filePath: string): string[] {
  const rel = filePath.includes('wine-saint-certified')
    ? filePath.split('wine-saint-certified/')[1]
    : filePath

  const parts = rel.split(path.sep)
  const filename = parts[parts.length - 1].replace(/\.md$/, '')

  let tags: string[] = []

  // L1/L2/L3 modules
  if (parts[0] === 'level-1') {
    const topic = filename.replace(/^module-\d+-/, '')
    tags = ['foundations', `foundations-${topic}`]
  } else if (parts[0] === 'level-2') {
    const topic = filename.replace(/^module-\d+-/, '')
    tags = ['intermediate', `intermediate-${topic}`]
  } else if (parts[0] === 'level-3') {
    const topic = filename.replace(/^module-\d+-/, '')
    tags = ['advanced', `advanced-${topic}`]
  } else if (parts[0] === 'mastery') {
    const track = parts[1]
    const topic = filename.replace(/^\d+-/, '')

    if (track === 'france') {
      // Look for known sub-region keyword in the filename topic
      let matched = false
      for (const [key, mappedTags] of Object.entries(FRANCE_SUBREGIONS)) {
        if (topic.includes(key)) {
          tags = [...mappedTags, `france-${topic}`]
          matched = true
          break
        }
      }
      if (!matched) tags = ['france', `france-${topic}`]
    } else if (track === 'wine-program-management') {
      tags = ['wine-program-management', `wine-program-management-${topic}`]
    } else {
      tags = [track, `${track}-${topic}`]
    }
  }

  // Dedupe while preserving order (e.g. drop the redundant `france-southwest-france`
  // when the country-sub-region tag already covers it). Also dedupe exact repeats.
  const seen = new Set<string>()
  return tags.filter((t) => {
    if (seen.has(t)) return false
    // Suppress tags that are strictly redundant restatements: if `france-southwest` is
    // already present, don't also emit `france-southwest-france`.
    for (const prior of seen) {
      if (t.startsWith(prior + '-') && t.endsWith('-' + parts[1])) return false
    }
    seen.add(t)
    return true
  })
}
