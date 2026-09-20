async function updatePostCount() {
  const label = document.getElementById('x-post-count');
  try {
    const response = await fetch('/.netlify/functions/x-count', { signal: AbortSignal.timeout(8000) });
    if (!response.ok) return;
    const { count, updatedAt } = await response.json();
    const date = new Date(updatedAt);
    if (!Number.isSafeInteger(count) || count < 0 || !Number.isFinite(date.getTime())) return;
    const stale = Date.now() - date.getTime() > 48 * 60 * 60 * 1000;
    label.textContent = `${count.toLocaleString()} ${count === 1 ? 'post' : 'posts'}${stale ? ' · last recorded' : ''}`;
    label.title = `Updated ${date.toLocaleString()}; refreshes every 6 hours`;
  } catch { /* Keep the original label or last successfully displayed count. */ }
}
updatePostCount();
setInterval(() => { if (!document.hidden) updatePostCount(); }, 5 * 60 * 1000);
