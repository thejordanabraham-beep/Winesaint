/**
 * Fix isEssential flag for grapes
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import grapesData from '../app/data/grapes.json'
import overridesData from '../app/data/grape-overrides.json'

const PAYLOAD_URL = 'http://localhost:3000'

function createSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

async function login(): Promise<string> {
  const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.PAYLOAD_ADMIN_EMAIL,
      password: process.env.PAYLOAD_ADMIN_PASSWORD,
    }),
  })
  const data = await res.json()
  if (!data.token) throw new Error('Login failed')
  return data.token
}

async function main() {
  console.log('Fixing isEssential flag for grapes...\n')

  const token = await login()
  console.log('Authenticated\n')

  const overrides = overridesData as any
  const grapes = (grapesData as any).grapes

  // Find essential grapes
  const essentialGrapes = grapes.filter((g: any) => {
    // Check if override exists
    if (overrides.essential_overrides?.hasOwnProperty(g.id)) {
      return overrides.essential_overrides[g.id]
    }
    return g.is_essential
  })

  console.log(`Found ${essentialGrapes.length} essential grapes\n`)

  let updated = 0

  for (const grape of essentialGrapes) {
    const slug = createSlug(grape.name)

    // Find in Payload
    const findRes = await fetch(
      `${PAYLOAD_URL}/api/grapes?where[slug][equals]=${slug}&limit=1`,
      { headers: { Authorization: `JWT ${token}` } }
    )
    const findData = await findRes.json()

    if (findData.docs?.length > 0) {
      const id = findData.docs[0].id

      // Update isEssential
      const updateRes = await fetch(`${PAYLOAD_URL}/api/grapes/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
        body: JSON.stringify({ isEssential: true }),
      })

      if (updateRes.ok) {
        updated++
      } else {
        console.log(`Failed to update: ${grape.name}`)
      }
    }
  }

  console.log(`\nUpdated ${updated} grapes to essential`)
}

main().catch(console.error)
