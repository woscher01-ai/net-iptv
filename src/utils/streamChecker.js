/**
 * Stream Health Checker Utility
 * Tests if an HLS stream (.m3u8) or media URL is active and responding.
 */

export async function checkStreamHealth(url, useCorsProxy = false, timeoutMs = 6000) {
  if (!url) return 'offline';

  let targetUrl = url;
  if (useCorsProxy || url.includes('iptv-org.github.io')) {
    targetUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    // Try HEAD request first for efficiency
    let response = await fetch(targetUrl, {
      method: 'HEAD',
      signal: controller.signal
    }).catch(() => null);

    // Fallback to GET with Range header if HEAD is rejected by server
    if (!response || !response.ok) {
      const getController = new AbortController();
      const getTimeoutId = setTimeout(() => getController.abort(), timeoutMs);
      response = await fetch(targetUrl, {
        method: 'GET',
        headers: { 'Range': 'bytes=0-500' },
        signal: getController.signal
      }).catch(() => null);
      clearTimeout(getTimeoutId);
    }

    clearTimeout(timeoutId);

    if (response && response.ok) {
      return 'online';
    }
    return 'offline';
  } catch (err) {
    clearTimeout(timeoutId);
    return 'offline';
  }
}
