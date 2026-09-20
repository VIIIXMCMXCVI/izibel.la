import { getStore } from '@netlify/blobs';

export default async () => {
  const token = process.env.X_BEARER_TOKEN?.trim();
  if (!token) throw new Error('Set X_BEARER_TOKEN in Netlify environment variables, then redeploy.');
  const response = await fetch('https://api.x.com/2/users/by/username/Izibella?user.fields=public_metrics', {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) throw new Error(`X returned HTTP ${response.status}; check API access and credit balance.`);
  const data = await response.json();
  const metrics = data?.data?.public_metrics;
  const count = metrics?.post_count ?? metrics?.tweet_count;
  if (!Number.isSafeInteger(count) || count < 0) throw new Error('X did not return a valid post count.');
  await getStore('x-profile').setJSON('izibella', { count, updatedAt: new Date().toISOString() });
  console.log('X post count refreshed successfully.');
};
