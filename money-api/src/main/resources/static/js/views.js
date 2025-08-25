// Simplified: remove unused portfolio/recent widgets; focus on history table
import { fetchHistoryItems } from './api.js';
import * as chartlib from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.6/+esm';

const routes = {};
export const register = (path, render) => routes[path] = render;
export function resolve(path){ return routes[path] || routes['/transactions']; }

// Single route: /
register('/', () => `
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="mb-0">Net Worth History</h4>
  </div>
  <div class="card">
    <div style="width: 1fr;"><canvas id="netWorth"></canvas></div>
    </div>
  </div>
`);


// Single route: /transactions
register('/transactions', () => `
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="mb-0">History Items</h4>
    <button class="btn btn-sm btn-outline-secondary" id="reloadHistory">
      <i class='bx bx-refresh me-1'></i>Reload
    </button>
  </div>
  <div class="card">
    <div class="table-responsive">
      <table class="table table-striped mb-0" id="historyTable">
        <thead class="table-light">
          <tr>
            <th>Date</th>
            <th>Ticker</th>
            <th class="text-end">Quantity</th>
            <th class="text-end">Price / Share</th>
          </tr>
        </thead>
        <tbody><tr><td colspan="4" class="text-muted p-3">Loading…</td></tr></tbody>
      </table>
    </div>
  </div>
`);

export async function onViewRendered(path){
  if (path === '/transactions') renderHistoryTable();
  if (path === '/') renderNetWorth();
}

// Render function
async function renderHistoryTable(){
  const tbody = document.querySelector('#historyTable tbody');
  if(!tbody) return;
  try {
    const rows = await fetchHistoryItems();
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-muted p-3">No data</td></tr>`;
      return;
    }
    tbody.innerHTML = rows.map(r => {
      // If backend price is in cents convert; otherwise show raw
      const pricePerShare = r.price >= 1000 ? (r.price / 100).toFixed(2) : r.price;
      const date = (r.timestamp || '').split('T')[0];
      return `
        <tr>
          <td>${date}</td>
          <td>${r.ticker}</td>
          <td class="text-end ${r.quantity<0?'text-danger':'text-success'}">${r.quantity}</td>
          <td class="text-end">${pricePerShare}</td>
        </tr>`;
    }).join('');
  } catch (e){
    console.error(e);
    tbody.innerHTML = `<tr><td colspan="4" class="text-danger p-3">Load error</td></tr>`;
  }
  document.getElementById('reloadHistory')
    ?.addEventListener('click', renderHistoryTable, { once:true });
}

chartlib.Chart.register(...chartlib.registerables);
async function renderNetWorth() {
  const response = await fetch("http://localhost:8080/netWorth");
  const data = await response.json();
  console.log(data);
  new chartlib.Chart(
    document.getElementById('netWorth'),
    {
      type: 'line',
      data: {
        labels: data.map(row => row.calculatedAt.slice(0,10)),
        datasets: [
          {
            label: 'Net Worth',
            data: data.map(row => row.amount/100)
          }
        ]
      }
    }
  );
};

// Default initial route if no hash
if (!location.hash) location.hash = '#/transactions';