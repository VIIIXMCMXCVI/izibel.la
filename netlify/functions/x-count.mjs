import { getStore } from '@netlify/blobs';

export default async (request) => {
  if (request.method !== 'GET') return new Response(null, { status: 405, headers: { Allow: 'GET' } });
  try {
    const value = await getStore('x-profile').get('izibella', { type: 'json' });
    if (!Number.isSafeInteger(value?.count) || value.count < 0 || !Number.isFinite(Date.parse(value.updatedAt))) {
      return Response.json({ unavailable: true }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
    }
    return Response.json({ count: value.count, updatedAt: value.updatedAt }, {
      headers: { 'Cache-Control': 'public, max-age=60', 'Netlify-CDN-Cache-Control': 'public, s-maxage=300' },
    });
  } catch {
    return Response.json({ unavailable: true }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
};
