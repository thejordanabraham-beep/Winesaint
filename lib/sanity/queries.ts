import { groq } from 'next-sanity';

// Wine queries
export const allWinesQuery = groq`
  *[_type == "wine"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    vintage,
    grapeVarieties,
    priceRange,
    priceUsd,
    criticAvg,
    vivinoScore,
    flavorMentions,
    image,
    producer->{
      _id,
      name,
      "slug": slug.current
    },
    region->{
      _id,
      name,
      "slug": slug.current,
      country
    },
    climat->{
      _id,
      name,
      classification
    },
    "latestReview": *[_type == "review" && wine._ref == ^._id] | order(reviewDate desc)[0] {
      _id,
      score,
      tastingNotes,
      reviewerName,
      reviewDate
    }
  }
`;

export const wineBySlugQuery = groq`
  *[_type == "wine" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    vintage,
    grapeVarieties,
    priceRange,
    alcoholPercentage,
    appellation,
    image,
    producer->{
      _id,
      name,
      "slug": slug.current,
      description,
      website,
      image
    },
    region->{
      _id,
      name,
      "slug": slug.current,
      country,
      description
    },
    climat->{
      _id,
      name,
      "slug": slug.current,
      classification,
      acreage,
      soilTypes,
      aspect,
      slope,
      description,
      historicalNotes,
      appellation->{
        name
      }
    },
    "reviews": *[_type == "review" && wine._ref == ^._id] | order(reviewDate desc) {
      _id,
      score,
      tastingNotes,
      drinkingWindowStart,
      drinkingWindowEnd,
      reviewerName,
      reviewDate
    }
  }
`;

export const featuredWinesQuery = groq`
  *[_type == "review" && isFeatured == true] | order(reviewDate desc)[0...6] {
    _id,
    score,
    tastingNotes,
    reviewerName,
    reviewDate,
    wine->{
      _id,
      name,
      "slug": slug.current,
      vintage,
      image,
      producer->{
        name
      },
      region->{
        name,
        country
      },
      climat->{
        name,
        classification
      }
    }
  }
`;

export const topRatedWinesQuery = groq`
  *[_type == "review"] | order(score desc)[0...10] {
    _id,
    score,
    wine->{
      _id,
      name,
      "slug": slug.current,
      vintage,
      image,
      producer->{
        name
      },
      region->{
        name
      }
    }
  }
`;

// Region queries
export const allRegionsQuery = groq`
  *[_type == "region"] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    country,
    description,
    image
  }
`;

export const regionBySlugQuery = groq`
  *[_type == "region" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    country,
    description,
    subRegions,
    image
  }
`;

// Vintage Report queries
export const allVintageReportsQuery = groq`
  *[_type == "vintageReport"] | order(year desc) {
    _id,
    year,
    "slug": slug.current,
    overview,
    overallRating,
    image,
    region->{
      _id,
      name,
      "slug": slug.current,
      country
    }
  }
`;

export const latestVintageReportsQuery = groq`
  *[_type == "vintageReport"] | order(year desc)[0...4] {
    _id,
    year,
    "slug": slug.current,
    overview,
    overallRating,
    image,
    region->{
      _id,
      name,
      "slug": slug.current,
      country
    }
  }
`;

export const vintageReportQuery = groq`
  *[_type == "vintageReport" && region->slug.current == $region && year == $year][0] {
    _id,
    year,
    "slug": slug.current,
    overview,
    conditionsNotes,
    overallRating,
    image,
    region->{
      _id,
      name,
      "slug": slug.current,
      country,
      description
    },
    featuredWines[]->{
      _id,
      name,
      "slug": slug.current,
      vintage,
      image,
      producer->{
        name
      },
      "latestReview": *[_type == "review" && wine._ref == ^._id] | order(reviewDate desc)[0] {
        score
      }
    }
  }
`;

// Search query
export const searchWinesQuery = groq`
  *[_type == "wine" && (
    name match $query + "*" ||
    producer->name match $query + "*" ||
    region->name match $query + "*" ||
    grapeVarieties[] match $query + "*"
  )] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    vintage,
    image,
    producer->{
      name
    },
    region->{
      name
    },
    climat->{
      name,
      classification
    },
    "latestReview": *[_type == "review" && wine._ref == ^._id] | order(reviewDate desc)[0] {
      score
    }
  }
`;

// Filtered wines query
export const filteredWinesQuery = groq`
  *[_type == "wine"
    && ($region == "" || region->slug.current == $region)
    && ($grape == "" || $grape in grapeVarieties)
    && ($minScore == 0 || count(*[_type == "review" && wine._ref == ^._id && score >= $minScore]) > 0)
  ] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    vintage,
    grapeVarieties,
    priceRange,
    image,
    producer->{
      name,
      "slug": slug.current
    },
    region->{
      name,
      "slug": slug.current
    },
    climat->{
      name,
      classification
    },
    "latestReview": *[_type == "review" && wine._ref == ^._id] | order(reviewDate desc)[0] {
      score
    }
  }
`;
