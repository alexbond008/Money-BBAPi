// Simplified: remove unused portfolio/recent widgets; focus on history table
import { fetchHistoryItems, fetchPortfolio } from './api.js';
import * as chartlib from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.6/+esm';

const routes = {};
export const register = (path, render) => routes[path] = render;
export function resolve(path){ return routes[path] || routes['/transactions']; }

// Single route: /
register('/', () => `
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between pb-0">
          <div class="card-title mb-0">
            <h5 class="m-0 me-2">Net Worth History</h5>
            <small class="text-muted">Financial performance over time</small>
          </div>
        </div>
        <div class="card-body">
          <div id="netWorthChart"></div>
        </div>
      </div>
    </div>
  </div>
`);

// Single route: /portfolios
register('/portfolios', () => `
  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="mb-0">Portfolio</h4>
    <button class="btn btn-sm btn-outline-secondary" id="reloadPortfolio">
      <i class='bx bx-refresh me-1'></i>Reload
    </button>
  </div>
  <div class="card">
    <div class="table-responsive">
      <table class="table table-striped mb-0" id="portfolioTable">
        <thead class="table-light">
          <tr>
            <th>Ticker</th>
            <th class="text-end">Quantity</th>
            <th class="text-end">Avg. Price / Share</th>
            <th class="text-end">Current Price / Share</th>
            <th class="text-end">Profit</th>
            <th class="text-end">Profit %</th>
            <th class="text-end">Total Value</th>
          </tr>
        </thead>
        <tbody><tr><td colspan="4" class="text-muted p-3">Loading…</td></tr></tbody>
      </table>
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
  if (path === '/portfolios') renderPortfolio();
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

async function renderNetWorth() {
  try {
    const response = await fetch("http://localhost:8080/netWorth");
    const data = await response.json();

    const options = {
      series: [{
        name: 'Net Worth',
        data: data.map(row => ({
          x: new Date(row.calculatedAt).getTime(),
          y: row.amount/100
        }))
      }],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false
        },
        fontFamily: 'Helvetica'
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      grid: {
        borderColor: '#e7e7e7',
        row: {
          colors: ['transparent'],
          opacity: 0.5
        }
      },
      xaxis: {
        type: 'datetime',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      yaxis: {
        labels: {
          formatter: function(value) {
            return '$' + value.toFixed(2)
          }
        }
      },
      colors: ['#696cff'],
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 90, 100]
        }
      },
      tooltip: {
        shared: false,
        x: {
          format: 'MMM dd, yyyy HH:mm'
        },
        y: {
          formatter: function(value) {
            return '$' + value.toFixed(2)
          }
        },
        theme: 'light',
        marker: {
          show: true
        }
      },
      markers: {
        size: 4,
        colors: ['#696cff'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7,
          sizeOffset: 3
        }
      }
    };

    // Clean up any existing chart
    const chartElement = document.getElementById('netWorthChart');
    chartElement.innerHTML = '';

    // Create new ApexCharts instance
    const chart = new ApexCharts(chartElement, options);
    chart.render();

  } catch (error) {
    console.error('Error rendering net worth chart:', error);
    document.getElementById('netWorthChart').innerHTML = `
      <div class="alert alert-danger">Failed to load chart data</div>
    `;
  }
}

async function renderPortfolio(){
  const tbody = document.querySelector('#portfolioTable tbody');
  if(!tbody) return;
  try {
    const rows = await fetchPortfolio();
    if (!rows.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-muted p-3">No data</td></tr>`;
      return;
    }
    tbody.innerHTML = rows.map(r => {
      const avgPrice = (r.avgPrice / 100).toFixed(2);
      const currentPrice = (r.currentPrice / 100).toFixed(2);
      const ticker = r.ticker || '';
      const quantity = r.quantity || 0;
      const profit = (currentPrice - avgPrice).toFixed(2);
      const profit_percentage = ((currentPrice-avgPrice)/avgPrice * 100).toFixed(2);
      const totalValue = currentPrice * quantity;


      return `
        <tr>
          <td>${ticker}</td>
          <td class="text-end" >${quantity}</td>
          <td class="text-end" >${avgPrice}</td>
          <td class="text-end" >${currentPrice}</td>
          <td class="text-end ${profit<0?'text-danger':'text-success'}">${profit}</td>
          <td class="text-end ${profit<0?'text-danger':'text-success'}">${profit_percentage}\%</td>
          <td class="text-end"><b>${totalValue}</b></td>
        </tr>`;
    }).join('');
  } catch (e){
    console.error(e);
    tbody.innerHTML = `<tr><td colspan="4" class="text-danger p-3">Load error</td></tr>`;
  }
  document.getElementById('reloadPorfolio')
    ?.addEventListener('click', renderPortfolio, { once:true });
}

// Default initial route if no hash
if (!location.hash) location.hash = '#/transactions';