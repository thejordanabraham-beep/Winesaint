/**
 * Update grapes in Payload with full markdown content
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import grapesData from '../app/data/grapes.json'

const API_URL = process.env.NEXT_PUBLIC_PAYLOAD_URL || 'http://localhost:3000/api'

interface Grape {
  id: string
  name: string
  original_rewritten_content?: string
}

function createSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

async function main() {
  const grapes = (grapesData as any).grapes as Grape[]
  console.log(`Updating ${grapes.length} grapes with full content...\n`)

  let updated = 0
  let failed = 0

  for (const grape of grapes) {
    const slug = createSlug(grape.name)
    const content = grape.original_rewritten_content || ''

    if (!content) {
      console.log(`  Skipping ${grape.name} - no content`)
      continue
    }

    try {
      // Find the grape by slug
      const findRes = await fetch(`${API_URL}/grapes?where[slug][equals]=${slug}&limit=1`)
      const findData = await findRes.json()
      const existing = findData.docs?.[0]

      if (!existing) {
        console.log(`  Not found in Payload: ${grape.name}`)
        failed++
        continue
      }

      // Update with full content
      const updateRes = await fetch(`${API_URL}/grapes/${existing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })

      if (updateRes.ok) {
        updated++
        if (updated % 20 === 0) {
          console.log(`  Updated ${updated} grapes...`)
        }
      } else {
        console.log(`  Failed to update ${grape.name}: ${updateRes.status}`)
        failed++
      }
    } catch (err: any) {
      console.log(`  Error updating ${grape.name}: ${err.message}`)
      failed++
    }
  }

  console.log(`\nDone. Updated: ${updated}, Failed: ${failed}`)
}

main().catch(console.error)
