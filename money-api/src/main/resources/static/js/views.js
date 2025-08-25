// Simplified: remove unused portfolio/recent widgets; focus on history table
import { fetchHistoryItems, fetchPortfolio } from './api.js';
import * as chartlib from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.6/+esm';

const bootstrap = window.bootstrap;

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

// Update the portfolios route registration to include search
register('/portfolios', () => `
  <div class="card">
    <div class="card-header border-bottom">
      <div class="d-flex justify-content-between align-items-center row">
        <div class="col-md-4">
          <h5 class="card-title mb-0">Portfolio</h5>
        </div>
        <div class="col-md-4">
          <div class="input-group input-group-merge">
            <span class="input-group-text"><i class="bx bx-search"></i></span>
            <input type="text" 
                   id="portfolioSearch" 
                   class="form-control" 
                   placeholder="Search ticker..."
                   aria-label="Search portfolio">
          </div>
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-sm btn-outline-secondary" id="reloadPortfolio">
            <i class='bx bx-refresh me-1'></i>Reload
          </button>
        </div>
      </div>
    </div>
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
        <tbody><tr><td colspan="7" class="text-muted p-3">Loading…</td></tr></tbody>
      </table>
    </div>
  </div>
`);

// Single route: /transactions
register('/transactions', () => `
  <div class="card">
    <div class="card-header border-bottom">
      <div class="d-flex justify-content-between align-items-center row">
        <div class="col-md-4">
          <h5 class="card-title mb-0">Transaction History</h5>
        </div>
        <div class="col-md-4">
          <div class="input-group input-group-merge">
            <span class="input-group-text"><i class="bx bx-search"></i></span>
            <input type="text" 
                   id="transactionSearch" 
                   class="form-control" 
                   placeholder="Search ticker..."
                   aria-label="Search transactions">
          </div>
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-sm btn-outline-primary" id="addTransaction">
            <i class='bx bx-plus me-1'></i>Add
          </button>
          <button class="btn btn-sm btn-outline-secondary" id="reloadHistory">
            <i class='bx bx-refresh me-1'></i>Reload
          </button>
        </div>
      </div>
    </div>
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

// Add the Holdings route registration
register('/holdings', () => `
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between pb-0">
          <div class="card-title mb-0">
            <h5 class="m-0 me-2">Portfolio Holdings</h5>
            <small class="text-muted">Current allocation of assets</small>
          </div>
          <button class="btn btn-sm btn-outline-secondary" id="reloadHoldings">
            <i class='bx bx-refresh me-1'></i>Reload
          </button>
        </div>
        <div class="card-body">
          <div id="holdingsPieChart" class ="holdingsPieChart"></div>
        </div>
      </div>
    </div>
  </div>
`);

// Update the onViewRendered function to include portfolio search
export async function onViewRendered(path){
  if (path === '/transactions') {
    renderHistoryTable();
    
    // Add search input listener
    const searchInput = document.getElementById('transactionSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderHistoryTable(e.target.value.trim());
      });
    }

    // Add transaction button listener
    document.getElementById('addTransaction')?.addEventListener('click', () => {
      const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasTx'));
      offcanvas.show();
    });

    // Add form submit handler
    document.getElementById('txForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      const formData = new FormData(form);
      
      try {
        const response = await fetch('http://localhost:8080/historyItem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ticker: formData.get('ticker'),
            quantity: parseFloat(formData.get('quantity')),
            price: Math.round(parseFloat(formData.get('price')) * 100), // Convert to cents
            timestamp: formData.get('date')
          })
        });

        if (!response.ok) throw new Error('Transaction failed');

        // Show success message
        const successAlert = document.getElementById('txSuccess');
        successAlert.classList.remove('d-none');
        setTimeout(() => successAlert.classList.add('d-none'), 3000);

        // Clear form and close offcanvas
        form.reset();
        const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('offcanvasTx'));
        offcanvas.hide();

        // Refresh the transactions table
        renderHistoryTable();

      } catch (error) {
        console.error('Error adding transaction:', error);
        alert('Failed to add transaction');
      }
    });

    // Add reload button listener
    document.getElementById('reloadHistory')?.addEventListener('click', () => {
      const searchInput = document.getElementById('transactionSearch');
      renderHistoryTable(searchInput?.value.trim() || '');
    }, { once: true });
  }
  if (path === '/portfolios') {
    renderPortfolio();
    
    // Add search input listener
    const searchInput = document.getElementById('portfolioSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        renderPortfolio(e.target.value.trim());
      });
    }

    // Add reload button listener
    document.getElementById('reloadPortfolio')?.addEventListener('click', () => {
      const searchInput = document.getElementById('portfolioSearch');
      renderPortfolio(searchInput?.value.trim() || '');
    }, { once: true });
  }
  if (path === '/') renderNetWorth();
  if (path === '/holdings') renderHoldingsPieChart();
}

// Render function
async function renderHistoryTable(searchTicker = '') {
  const tbody = document.querySelector('#historyTable tbody');
  if(!tbody) return;

  try {
    const rows = await fetchHistoryItems();
    
    // Filter rows based on search input
    const filteredRows = searchTicker 
      ? rows.filter(r => r.ticker.toLowerCase().includes(searchTicker.toLowerCase()))
      : rows;

    if (!filteredRows.length) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-muted p-3">No matching transactions found</td></tr>`;
      return;
    }

    tbody.innerHTML = filteredRows.map(r => {
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

  } catch (e) {
    console.error(e);
    tbody.innerHTML = `<tr><td colspan="4" class="text-danger p-3">Load error</td></tr>`;
  }
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

// Update the renderPortfolio function to include search functionality
async function renderPortfolio(searchTicker = ''){
  const tbody = document.querySelector('#portfolioTable tbody');
  if(!tbody) return;
  
  try {
    const rows = await fetchPortfolio();
    
    // Filter rows based on search input
    const filteredRows = searchTicker 
      ? rows.filter(r => r.ticker.toLowerCase().includes(searchTicker.toLowerCase()))
      : rows;

    if (!filteredRows.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-muted p-3">No matching holdings found</td></tr>`;
      return;
    }

    tbody.innerHTML = filteredRows.map(r => {
      const avgPrice = (r.avgPrice / 100).toFixed(2);
      const currentPrice = (r.currentPrice / 100).toFixed(2);
      const ticker = r.ticker || '';
      const quantity = r.quantity || 0;
      const profit = ((currentPrice - avgPrice)*quantity).toFixed(2);
      const profit_percentage = ((currentPrice-avgPrice)/avgPrice * 100).toFixed(2);
      const totalValue = (currentPrice * quantity).toFixed(2);

      return `
        <tr>
          <td>${ticker}</td>
          <td class="text-end">${quantity}</td>
          <td class="text-end">${avgPrice}</td>
          <td class="text-end">${currentPrice}</td>
          <td class="text-end ${profit<0?'text-danger':'text-success'}">${profit}</td>
          <td class="text-end ${profit<0?'text-danger':'text-success'}">${profit_percentage}%</td>
          <td class="text-end"><b>${totalValue}</b></td>
        </tr>`;
    }).join('');
  } catch (e){
    console.error(e);
    tbody.innerHTML = `<tr><td colspan="7" class="text-danger p-3">Load error</td></tr>`;
  }
}

async function renderHoldingsPieChart() {
  try {
    const response = await fetch("http://localhost:8080/portfolio");
    const data = await response.json();
    
    // Clean up any existing chart
    const chartElement = document.getElementById('holdingsPieChart');
    chartElement.innerHTML = '';
    
    // Calculate total portfolio value for percentages
    const totalValue = data.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0);
    
    const options = {
      series: data.map(item => ((item.currentPrice * item.quantity)/100)),
      chart: {
        type: 'pie',
        height: 420,
        fontFamily: 'Helvetica'
      },
      labels: data.map(item => item.ticker),
      colors: [
        '#696cff', // primary
        '#71dd37', // success
        '#03c3ec', // info
        '#ffab00', // warning
        '#ff3e1d', // danger
        '#8592a3', // secondary
        '#03c3ec', // info
      ],
      legend: {
        position: 'bottom',
        fontFamily: 'Helvetica',
        labels: {
          colors: '#697a8d',
        }
      },
      plotOptions: {
        pie: {
          expandOnClick: true
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val, opts) {
          const value = opts.w.globals.seriesTotals[opts.seriesIndex];
          return opts.w.config.labels[opts.seriesIndex] + '\n$' + value.toFixed(2);
        },
        style: {
          fontSize: '14px',
          fontFamily: 'Helvetica',
          colors: ['#fff']
        }
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: function(value) {
            return '$' + value.toFixed(2) + ' (' + (value * 100 / totalValue).toFixed(1) + '%)';
          }
        }
      }
    };

    const chart = new ApexCharts(document.querySelector("#holdingsPieChart"), options);
    await chart.render();

    // Add reload button event listener
    document.getElementById('reloadHoldings')?.addEventListener('click', () => {
      chart.destroy();
      renderHoldingsPieChart();
    }, { once: true });

  } catch (error) {
    console.error('Error rendering holdings chart:', error);
    document.getElementById('holdingsPieChart').innerHTML = `
      <div class="alert alert-danger">Failed to load holdings data</div>
    `;
  }
}

// Default initial route if no hash
if (!location.hash) location.hash = '#/transactions';