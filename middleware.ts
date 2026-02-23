import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100; // requests per minute per IP
const API_RATE_LIMIT = 30; // stricter limit for API routes

// In-memory store for rate limiting
// Note: This resets on server restart. For production at scale, use Redis/Vercel KV
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

function checkRateLimit(ip: string, limit: number): { allowed: boolean; remaining: number } {
  const now = Date.now();

  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    });
    return { allowed: true, remaining: limit - 1 };
  }

  const ipData = rateLimitStore.get(ip)!;

  // Reset if window has passed
  if (now > ipData.resetTime) {
    ipData.count = 1;
    ipData.resetTime = now + RATE_LIMIT_WINDOW_MS;
    return { allowed: true, remaining: limit - 1 };
  }

  // Check if limit exceeded
  if (ipData.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  // Increment count
  ipData.count += 1;
  return { allowed: true, remaining: limit - ipData.count };
}

export function middleware(request: NextRequest) {
  // Get IP address (works on Vercel)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ??
            request.headers.get('x-real-ip') ??
            'unknown';

  // Determine rate limit based on path
  const isApiRoute = request.nextUrl.pathname.startsWith('/api/');
  const limit = isApiRoute ? API_RATE_LIMIT : MAX_REQUESTS_PER_WINDOW;

  // Check rate limit
  const { allowed, remaining } = checkRateLimit(ip, limit);

  if (!allowed) {
    return new NextResponse(
      JSON.stringify({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.'
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '60'
        }
      }
    );
  }

  // Add rate limit headers to response
  const response = NextResponse.next();
  response.headers.set('X-RateLimit-Limit', limit.toString());
  response.headers.set('X-RateLimit-Remaining', remaining.toString());

  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
