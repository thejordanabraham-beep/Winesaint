# WineSaint Security Configuration

## Bot & Scraper Protection

### 1. robots.txt (`/public/robots.txt`)

**What it does:**
- Blocks AI training bots (GPTBot, CCBot, Claude-Web, etc.)
- Blocks common scrapers (SemrushBot, AhrefsBot, etc.)
- Allows legitimate search engines (Google, Bing) with crawl delays
- Protects API routes and admin areas from crawling

**Blocked bots:**
- GPTBot (OpenAI)
- CCBot (Common Crawl)
- anthropic-ai / Claude-Web
- cohere-ai
- PerplexityBot
- SemrushBot, AhrefsBot (SEO tools)

**Allowed with restrictions:**
- Googlebot (2 second crawl delay)
- Bingbot (2 second crawl delay)
- Other search engines (10 second crawl delay)

### 2. Rate Limiting (`/middleware.ts`)

**What it does:**
- Limits requests per IP address to prevent abuse
- Stricter limits on API routes
- Automatic cleanup of old entries
- Returns 429 status code when limit exceeded

**Limits:**
- **General pages:** 100 requests per minute per IP
- **API routes:** 30 requests per minute per IP

**How it works:**
- Tracks each IP address in memory
- Counts requests within 1-minute windows
- Resets counter after window expires
- Adds rate limit headers to responses:
  - `X-RateLimit-Limit`: Max requests allowed
  - `X-RateLimit-Remaining`: Requests remaining

**Response when rate limited:**
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded. Please try again later."
}
```
HTTP Status: 429
Header: `Retry-After: 60`

### 3. Protected Routes

The middleware protects all routes except:
- Static files (`_next/static`)
- Image optimization (`_next/image`)
- Public images (`.svg`, `.png`, `.jpg`, etc.)
- Favicon

**Fully protected:**
- All page routes
- All API routes (`/api/*`)
- Sanity Studio (`/studio/*`)

## Testing Rate Limits

Test locally by making rapid requests:

```bash
# Test general page rate limit (100/min)
for i in {1..105}; do curl http://localhost:3000/ -w "\n%{http_code}\n"; done

# Test API rate limit (30/min)
for i in {1..35}; do curl http://localhost:3000/api/wines -w "\n%{http_code}\n"; done
```

You should see `429` responses after hitting the limit.

## Limitations & Considerations

**In-memory rate limiting:**
- ✅ Simple, works out of the box
- ✅ No external dependencies
- ❌ Resets on server restart
- ❌ Doesn't work across multiple server instances

**For high-traffic production:**
Consider upgrading to:
- **Vercel KV** (Redis) for persistent rate limiting
- **Cloudflare** for enterprise-grade protection
- **Vercel Firewall** (Pro plan) for advanced bot detection

## Deployment Notes

When deploying to Vercel:
1. `robots.txt` is automatically served from `/public`
2. Middleware runs on Vercel Edge Runtime
3. IP detection works correctly on Vercel
4. Rate limits apply per-visitor, not globally

## Monitoring

Check rate limit effectiveness:
1. Monitor 429 responses in Vercel Analytics
2. Check for suspicious patterns in access logs
3. Review blocked bot attempts via User-Agent headers

## Additional Recommendations

**Future enhancements:**
1. Add Cloudflare (free) for DDoS protection
2. Implement CAPTCHA on forms
3. Add API authentication tokens
4. Use Vercel Firewall (Pro plan) for advanced protection
5. Monitor with Sentry or similar for abuse patterns
