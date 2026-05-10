function getVisitorId() {
  let id = localStorage.getItem('visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('visitor_id', id);
  }
  return id;
}

function getSessionId() {
  let id = sessionStorage.getItem('session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('session_id', id);
  }
  return id;
}

// Use the correct public endpoint
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_BASE = `${API_URL}/api/public/analytics`;

export async function trackPage(page: string, tenantId?: string) {
  try {
    await fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',  // send cookies if needed
      body: JSON.stringify({
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
        page,
        tenantId,
        type: 'pageview'
      })
    });
  } catch (err) {
    console.error('Analytics track error:', err);
  }
}

export async function trackEvent(event: string, metadata?: any, tenantId?: string) {
  try {
    await fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
        event,
        metadata,
        tenantId,
        type: 'event'
      })
    });
  } catch (err) {
    console.error('Analytics track error:', err);
  }
}

export async function trackFunnelStep(stepName: string, metadata?: any, tenantId?: string) {
  try {
    await fetch(`${API_BASE}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        visitorId: getVisitorId(),
        sessionId: getSessionId(),
        event: stepName,
        metadata,
        tenantId,
        type: 'funnel_step'
      })
    });
  } catch (err) {
    console.error('Analytics track error:', err);
  }
}

let heatmapQueue: any[] = [];
//let heatmapTimer: NodeJS.Timeout | null = null;
let heatmapTimer: ReturnType<typeof setTimeout> | null = null;
export function trackHeatmapClick(page: string, x: number, y: number, element?: string, tenantId?: string) {
  heatmapQueue.push({ page, x, y, element, tenantId, sessionId: getSessionId() });
  if (!heatmapTimer) {
    heatmapTimer = setTimeout(() => {
      const batch = [...heatmapQueue];
      heatmapQueue = [];
      navigator.sendBeacon(`${API_BASE}/heatmap`, JSON.stringify(batch));
      heatmapTimer = null;
    }, 2000);
  }
}