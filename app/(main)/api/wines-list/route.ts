import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const PER_PAGE = 18

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const q = params.get('q')?.trim() || ''
    const page = Math.max(1, parseInt(params.get('page') || '1'))
    const perPage = parseInt(params.get('perPage') || String(PER_PAGE))
    const sortBy = params.get('sortBy') || 'default'
    const vintageMin = params.get('vintageMin')
    const vintageMax = params.get('vintageMax')
    const scoreMin = params.get('scoreMin')
    const scoreMax = params.get('scoreMax')
    const priceMin = params.get('priceMin')
    const priceMax = params.get('priceMax')
    const countries = params.get('countries')?.split(',').filter(Boolean) || []

    const payload = await getPayload({ config })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wineConditions: any[] = []

    // --- Text search: match on wine name, producer name, or region name ---
    if (q) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const orClauses: any[] = [{ name: { like: q } }]

      const [producerResult, regionResult] = await Promise.all([
        payload.find({
          collection: 'producers',
          where: { name: { like: q } },
          pagination: false,
          depth: 0,
          select: {},
        }),
        payload.find({
          collection: 'regions',
          where: { name: { like: q } },
          pagination: false,
          depth: 0,
          select: {},
        }),
      ])

      if (producerResult.docs.length > 0) {
        orClauses.push({ producer: { in: producerResult.docs.map((p) => p.id) } })
      }
      if (regionResult.docs.length > 0) {
        orClauses.push({ region: { in: regionResult.docs.map((r) => r.id) } })
      }

      wineConditions.push({ or: orClauses })
    }

    // --- Direct filters on wine fields ---
    if (vintageMin) wineConditions.push({ vintage: { greater_than_equal: parseInt(vintageMin) } })
    if (vintageMax) wineConditions.push({ vintage: { less_than_equal: parseInt(vintageMax) } })
    if (priceMin) wineConditions.push({ priceUsd: { greater_than_equal: parseInt(priceMin) } })
    if (priceMax) wineConditions.push({ priceUsd: { less_than_equal: parseInt(priceMax) } })
    if (scoreMin) wineConditions.push({ score: { greater_than_equal: parseFloat(scoreMin) } })
    if (scoreMax) wineConditions.push({ score: { less_than_equal: parseFloat(scoreMax) } })

    // --- Country filter: find region IDs in those countries ---
    if (countries.length > 0) {
      const regionResult = await payload.find({
        collection: 'regions',
        where: { country: { in: countries } },
        pagination: false,
        depth: 0,
        select: {},
      })
      if (regionResult.docs.length === 0) {
        return NextResponse.json({ docs: [], totalDocs: 0, page: 1, totalPages: 0 })
      }
      wineConditions.push({ region: { in: regionResult.docs.map((r) => r.id) } })
    }

    // --- Sort ---
    let sort: string | undefined
    if (sortBy === 'score') {
      sort = '-score'
      wineConditions.push({ score: { exists: true } })
    } else if (sortBy === 'vintage') sort = '-vintage'
    else if (sortBy === 'price') sort = 'priceUsd'
    else sort = '-vintage'

    // --- Build where clause ---
    const where =
      wineConditions.length > 1
        ? { and: wineConditions }
        : wineConditions.length === 1
          ? wineConditions[0]
          : {}

    const wineResult = await payload.find({
      collection: 'wines',
      where,
      sort,
      page,
      limit: perPage,
      depth: 1,
    })

    const wines = wineResult.docs || []

    // --- Transform ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const docs = wines.map((wine: any) => {
      const producer = typeof wine.producer === 'object' ? wine.producer : null
      const region = typeof wine.region === 'object' ? wine.region : null

      return {
        _id: String(wine.id),
        name: wine.name,
        slug: wine.slug,
        vintage: wine.vintage,
        wineType: wine.wineType,
        priceUsd: wine.priceUsd,
        producer: producer ? { name: producer.name, slug: producer.slug } : null,
        region: region ? { name: region.name, slug: region.slug, country: region.country } : null,
        review: wine.score
          ? {
              score: wine.score,
              tastingNotes: wine.tastingNotes,
              reviewerName: wine.reviewerName || 'Wine Saint',
              flavorProfile: wine.flavorProfile?.map(
                (f: { flavor: string }) => f.flavor,
              ),
              foodPairings: wine.foodPairings?.map(
                (p: { pairing: string }) => p.pairing,
              ),
              drinkThisIf: wine.drinkThisIf,
              drinkingWindowStart: wine.drinkingWindowStart,
              drinkingWindowEnd: wine.drinkingWindowEnd,
            }
          : undefined,
      }
    })

    return NextResponse.json({
      docs,
      totalDocs: wineResult.totalDocs,
      page: wineResult.page,
      totalPages: wineResult.totalPages,
    })
  } catch (error) {
    console.error('Error in wines-list:', error)
    return NextResponse.json({ docs: [], totalDocs: 0, page: 1, totalPages: 0 }, { status: 200 })
  }
}
