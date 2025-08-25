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
    const cashResp = await fetch('/cash/latest');
    if (!cashResp.ok) throw new Error('cash fetch ' + cashResp.status);
    const cashData = await cashResp.json();
    const cashEl = document.getElementById('cashBar');
    if (cashEl) cashEl.textContent = cashData ? `Cash: ${formatCents(cashData.amount)}` : 'No cash data';


    // Fetching net worth data
    const netWorthResp = await fetch('/netWorth/latest');
    if (!netWorthResp.ok) throw new Error('netWorth fetch ' + netWorthResp.status);
    const netWorthData = await netWorthResp.json();
    const netWorthEl = document.getElementById('netWorthBar');
    if (netWorthEl) netWorthEl.textContent = netWorthData ? `Net Worth: ${formatCents(netWorthData.amount)}` : 'No net worth data';
    
  } catch (e) {
    console.error(e);
    const cashEl = document.getElementById('cashBar');
    if (cashEl) cashEl.textContent = 'Cash load error';
    const netWorthEl = document.getElementById('netWorthBar');
    if (netWorthEl) netWorthEl.textContent = 'Net worth load error';
  }
}

function formatCents(v){
  if (v == null) return '-';
  return '$' + (v/100).toFixed(2);
}

// Auto-run once DOM ready
document.addEventListener('DOMContentLoaded', fetchAndDisplayCash);