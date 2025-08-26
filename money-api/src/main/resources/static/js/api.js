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

// Settings persistence (localStorage)
const SETTINGS_KEY = 'appSettings';
const DEFAULT_SETTINGS = { currency: 'USD', theme: 'light' };
const CURRENCY_SYMBOLS = { USD:'$', EUR:'€', GBP:'£', JPY:'¥', CHF:'Fr', AUD:'A$', CAD:'C$', SEK:'kr', NOK:'kr', DKK:'kr' };

export function loadSettings(){
  try { return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}') }; }
  catch { return { ...DEFAULT_SETTINGS }; }
}

export function saveSettings(s){
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}

export function applyTheme(theme){
  const html = document.documentElement;
  if (theme === 'dark'){
    html.classList.remove('light-style');
    html.classList.add('dark-style');
    document.body.classList.add('dark-mode');
  } else {
    html.classList.add('light-style');
    html.classList.remove('dark-style');
    document.body.classList.remove('dark-mode');
  }
}

function getCurrencySymbol(){
  const s = loadSettings();
  return CURRENCY_SYMBOLS[s.currency] || s.currency + ' ';
}

// Replace / extend existing formatCents
export function formatCents(v){
  if (v == null) return '-';
  return getCurrencySymbol() + (v/100).toFixed(2);
}

// On module load apply stored theme early
applyTheme(loadSettings().theme);

export async function fetchAndDisplayCash() {
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

// Auto-run once DOM ready
document.addEventListener('DOMContentLoaded', fetchAndDisplayCash);