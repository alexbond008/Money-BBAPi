// Minimal API module: only what is needed for HistoryItem table
export async function fetchHistoryItems() {
  const resp = await fetch('/historyItem', { headers: { Accept: 'application/json' } });
  if (!resp.ok) throw new Error('HTTP ' + resp.status);
  const data = (await resp.json()).reverse();
  return Array.isArray(data) ? data : [data];
}

export async function fetchPortfolio() {
  const resp = await fetch('/portfolio', { headers: { Accept: 'application/json' } });
  if (!resp.ok) throw new Error('HTTP ' + resp.status);
  const data = await resp.json();
  return Array.isArray(data) ? data : [data];
}


// OPTIONAL: mapper if price is in cents
export function mapHistoryItem(raw){
  return {
    timestamp: raw.timestamp,
    ticker: raw.ticker,
    quantity: raw.quantity,
    // adjust if raw.price is in cents:
    price: raw.price >= 1000 ? raw.price / 100 : raw.price
  };
}

async function fetchAndDisplayCash() {
  try {
    const resp = await fetch('/cash/latest');
    if (!resp.ok) throw new Error('cash fetch ' + resp.status);
    const data = await resp.json();
    const el = document.getElementById('cashBar');
    if (el) el.textContent = data ? `Cash: ${formatCents(data.amount)}` : 'No cash data';
  } catch (e) {
    console.error(e);
    const el = document.getElementById('cashBar');
    if (el) el.textContent = 'Cash load error';
  }
}

function formatCents(v){
  if (v == null) return '-';
  return '$' + (v/100).toFixed(2);
}

// Auto-run once DOM ready
document.addEventListener('DOMContentLoaded', fetchAndDisplayCash);