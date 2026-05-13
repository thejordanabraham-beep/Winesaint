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

    // --- Score filter: find wine IDs from reviews in score range ---
    let scoreWineIds: (string | number)[] | null = null
    if (scoreMin || scoreMax) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const reviewConditions: any[] = []
      if (scoreMin) reviewConditions.push({ score: { greater_than_equal: parseFloat(scoreMin) } })
      if (scoreMax) reviewConditions.push({ score: { less_than_equal: parseFloat(scoreMax) } })

      const reviewResult = await payload.find({
        collection: 'reviews',
        where: reviewConditions.length > 1 ? { and: reviewConditions } : reviewConditions[0],
        pagination: false,
        depth: 0,
        select: { wine: true },
      })

      scoreWineIds = reviewResult.docs.map((r) =>
        typeof r.wine === 'object' && r.wine !== null ? r.wine.id : (r.wine as number),
      )
      if (scoreWineIds.length === 0) {
        return NextResponse.json({ docs: [], totalDocs: 0, page: 1, totalPages: 0 })
      }
      wineConditions.push({ id: { in: scoreWineIds } })
    }

    // --- Build where clause ---
    const where =
      wineConditions.length > 1
        ? { and: wineConditions }
        : wineConditions.length === 1
          ? wineConditions[0]
          : {}

    // --- Sort ---
    const needsScoreSort = sortBy === 'score'
    let sort: string | undefined
    if (sortBy === 'vintage') sort = '-vintage'
    else if (sortBy === 'price') sort = 'priceUsd'
    else if (!needsScoreSort) sort = '-vintage'

    // Score sort requires fetching all matches then sorting by review score
    const wineResult = await payload.find({
      collection: 'wines',
      where,
      sort: needsScoreSort ? undefined : sort,
      ...(needsScoreSort ? { pagination: false } : { page, limit: perPage }),
      depth: 1,
    })

    const wines = wineResult.docs || []
    const wineIds = wines.map((w) => w.id)

    // --- Fetch reviews for matched wines ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reviewsByWine = new Map<string | number, any>()
    if (wineIds.length > 0) {
      const reviewResult = await payload.find({
        collection: 'reviews',
        where: { wine: { in: wineIds } },
        pagination: false,
        depth: 0,
      })
      for (const review of reviewResult.docs) {
        const wineId = typeof review.wine === 'object' && review.wine !== null ? review.wine.id : review.wine
        if (wineId && !reviewsByWine.has(wineId)) {
          reviewsByWine.set(wineId, review)
        }
      }
    }

    // --- Transform ---
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transform = (wine: any) => {
      const review = reviewsByWine.get(wine.id)
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
        review: review
          ? {
              score: review.score,
              tastingNotes: review.tastingNotes,
              reviewerName: review.reviewer || 'Wine Saint',
              flavorProfile: review.flavorProfile?.map(
                (f: { flavor: string }) => f.flavor,
              ),
              foodPairings: review.foodPairings?.map(
                (p: { pairing: string }) => p.pairing,
              ),
              drinkThisIf: review.drinkThisIf,
              drinkingWindowStart: review.drinkingWindowStart,
              drinkingWindowEnd: review.drinkingWindowEnd,
            }
          : undefined,
      }
    }

    // --- Score sort: sort all results then paginate ---
    if (needsScoreSort) {
      let sorted = wines.map(transform)
      sorted.sort((a, b) => (b.review?.score || 0) - (a.review?.score || 0))
      const totalDocs = sorted.length
      const totalPages = Math.ceil(totalDocs / perPage)
      sorted = sorted.slice((page - 1) * perPage, page * perPage)
      return NextResponse.json({ docs: sorted, totalDocs, page, totalPages })
    }

    return NextResponse.json({
      docs: wines.map(transform),
      totalDocs: wineResult.totalDocs,
      page: wineResult.page,
      totalPages: wineResult.totalPages,
    })
  } catch (error) {
    console.error('Error in wines-list:', error)
    return NextResponse.json({ docs: [], totalDocs: 0, page: 1, totalPages: 0 }, { status: 200 })
  }
}
