// Simplified: remove unused portfolio/recent widgets; focus on history table
import { fetchHistoryItems, fetchPortfolio, fetchAndDisplayCash, fetchStockPrices, loadSettings, saveSettings, applyTheme, formatCents } from './api.js';
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
          <div id="toolbar">
            <button id="renderNetWorth_1d" class="btn btn-sm btn-outline-secondary">1D</button>
            <button id="renderNetWorth_1w" class="btn btn-sm btn-outline-secondary">1W</button>
            <button id="renderNetWorth_1m" class="btn btn-sm btn-outline-secondary">1M</button>
            <button id="renderNetWorth_3m" class="btn btn-sm btn-outline-secondary">3M</button>
            <button id="renderNetWorth_1y" class="btn btn-sm btn-outline-secondary">1Y</button>
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
          <button class="btn btn-primary btn-sm" id="buyPortfolio" data-bs-toggle="modal" data-bs-target="#buyPortfolioModal">
            <i class='bx bx-plus me-1'></i>Buy
          </button>
          <button class="btn btn-secondary btn-sm" id ="sellPortfolio" data-bs-toggle="modal" data-bs-target="#sellPortfolioModal">
            <i class='bx bx-minus me-1'></i>Sell
          </button>
        </div>


        <!-- Buy Portfolio Modal -->
<div class="modal fade" id="buyPortfolioModal" tabindex="-1" aria-labelledby="buyPortfolioModalLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <form id="buyPortfolioForm">
        <div class="modal-header">
          <h5 class="modal-title" id="buyPortfolioModalLabel">Buy Stock</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          
          <!-- Stock Symbol -->
          <div class="mb-3">
            <label for="buyTicker" class="form-label">Ticker</label>
            <input type="text" class="form-control" id="buyTicker" name="ticker" placeholder="e.g. AAPL" required>
          </div>

          <!-- Shares -->
          <div class="mb-3">
            <label for="buyQuantity" class="form-label">Quantity</label>
            <input type="number" class="form-control" id="buyQuantity" name="quantity" min="1" required>
          </div>

          <!-- Price -->
          <div class="mb-3">
            <label for="buyPrice" class="form-label">Price</label>
            <input type="number" class="form-control" id="buyPrice" name="price" step="0.01" min="0.01" required>
          </div>

          <!-- Alerts -->
          <div id="buyPortfolioSuccess" class="alert alert-success d-none" role="alert">
            Purchase successful!
          </div>
          <div id="buyPortfolioError" class="alert alert-danger d-none" role="alert">
            Error while buying stock.
          </div>

        </div>
        <div class="modal-footer">
          <button type="submit" class="btn btn-primary">Buy</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        </div>
      </form>
    </div>
  </div>
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

// Single route: /stocks
register('/stocks', () => `
  <div class="card">
    <div class="card-header border-bottom">
      <div class="d-flex justify-content-between align-items-center row">
        <div class="col-md-4">
          <h5 class="card-title mb-0">Stock Prices</h5>
        </div>
        <div class="col-md-4">
          <div class="input-group input-group-merge">
            <span class="input-group-text"><i class="bx bx-search"></i></span>
            <input type="text" 
                   id="stockSearch" 
                   class="form-control" 
                   placeholder="Search ticker..."
                   aria-label="Search stocks">
          </div>
        </div>
        <div class="col-md-4 text-end">
          <button class="btn btn-sm btn-outline-secondary" id="reloadStocks">
            <i class='bx bx-refresh me-1'></i>Reload
          </button>
        </div>
      </div>
    </div>
    <div class="table-responsive">
      <table class="table table-striped mb-0" id="stockTable">
        <thead class="table-light">
          <tr>
            <th>Ticker</th>
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

// Add the Settings route registration
register('/settings', () => {
  const s = loadSettings();
  return `
    <div class="card">
      <div class="card-header"><h5 class="mb-0">Settings</h5></div>
      <div class="card-body">
        <form id="settingsForm" class="row g-4">
          <div class="col-md-6">
            <label class="form-label">Main Currency</label>
            <select class="form-select" name="currency" required>
              ${['USD','EUR','GBP','JPY','CHF','AUD','CAD','SEK','NOK','DKK']
                .map(c=>`<option value="${c}" ${c===s.currency?'selected':''}>${c}</option>`).join('')}
            </select>
            <div class="form-text">Used for displaying amounts.</div>
          </div>
          <div class="col-md-6">
            <label class="form-label">Theme</label>
            <select class="form-select" name="theme">
              <option value="light" ${s.theme==='light'?'selected':''}>Light</option>
              <option value="dark" ${s.theme==='dark'?'selected':''}>Dark</option>
            </select>
            <div class="form-text">Switch UI appearance.</div>
          </div>
          <div class="col-12 d-flex gap-2">
            <button type="submit" class="btn btn-primary"><i class='bx bx-save me-1'></i>Save</button>
            <button type="button" id="resetSettings" class="btn btn-outline-secondary">Reset</button>
          </div>
        </form>
        <div class="alert alert-success d-none mt-3" id="settingsSaved">Settings saved.</div>
      </div>
    </div>`;
});

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
    // Portfolio ##########################################################################################

// Add this after other initialization code
document.getElementById('buyPortfolio')?.addEventListener('click', () => {
  const modal = new bootstrap.Modal(document.getElementById('buyPortfolioModal'));
  modal.show();
});

document.getElementById('buyPortfolioForm')?.addEventListener('submit', async (e) => {
  console.log('Hejjjjj')
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const ticker = formData.get('ticker').toUpperCase().trim();
  const quantity = parseInt(formData.get('quantity'), 10);
  const price = formData.get('price').replace('$', '');
  
  try {
    // Validate amount format
    if (!/^\d+(\.\d{2})?$/.test(price)) {
      throw new Error('Invalid amount format');
    }
    
    // Convert to cents
    const amountInCents = Math.round(parseFloat(price) * 100);
    
    // Validate positive amount
    if (amountInCents <= 0) {
      throw new Error('Amount must be positive');
    }

    const response = await fetch('http://localhost:8080/historyItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        ticker: ticker,
        quantity: quantity,
        price: amountInCents
      })
    });

    if (!response.ok) throw new Error('Portfolio transaction failed');

    // Show success message
    const successAlert = document.getElementById('portfolioSuccess');
    const errorAlert = document.getElementById('portfolioError');
    // successAlert.classList.remove('d-none');
    // errorAlert.classList.add('d-none');
    
    // Clear form and close modal
    form.reset();
    setTimeout(() => {
      const modal = bootstrap.Modal.getInstance(document.getElementById('buyPortfolioModal'));
      document.getElementsByClassName('modal-backdrop fade show')[0]?.remove();
      modal.hide();
      fetchAndDisplayCash();
      // successAlert.classList.add('d-none');
    }, 2000);

  } catch (error) {
    console.error('Error making portfolio transaction:', error);
    const errorAlert = document.getElementById('portfolioError');
    // errorAlert.classList.remove('d-none');
    // setTimeout(() => errorAlert.classList.add('d-none'), 3000);
  }
});
  }
  if (path === '/') renderNetWorth();
  if (path === '/holdings') renderHoldingsPieChart();
  if (path === '/stocks') renderStockPrices();
  if (path === '/settings') {
    const form = document.getElementById('settingsForm');
    const alertBox = document.getElementById('settingsSaved');
    form.addEventListener('submit', e=>{
      e.preventDefault();
      const fd = new FormData(form);
      const newSettings = {
        currency: fd.get('currency'),
        theme: fd.get('theme')
      };
      saveSettings(newSettings);
      applyTheme(newSettings.theme);
      alertBox.classList.remove('d-none');
      // Refresh top bars if amounts already loaded
      const cashEl = document.getElementById('cashBar');
      if (cashEl && cashEl.textContent.match(/\d/)){
        // crude attempt: reparse number from existing
        const num = cashEl.textContent.replace(/[^\d.]/g,'');
        if (num) cashEl.textContent = 'Cash: ' + formatCents(Math.round(parseFloat(num)*100));
      }
      const netEl = document.getElementById('netWorthBar');
      if (netEl && netEl.textContent.match(/\d/)){
        const num = netEl.textContent.replace(/[^\d.]/g,'');
        if (num) netEl.textContent = 'Net Worth: ' + formatCents(Math.round(parseFloat(num)*100));
      }
      const profitEl = document.getElementById('profitBar');
      if (profitEl && profitEl.textContent.match(/\d/)){
        const num = profitEl.textContent.replace(/[^\d.]/g,'');
        if (num) profitEl.textContent = 'Profit: ' + formatCents(Math.round(parseFloat(num)*100));
      }
      const profitPercentageEl = document.getElementById('profitPercentageBar');
      if (profitPercentageEl && profitPercentageEl.textContent.match(/\d/)){
        const num = profitPercentageEl.textContent.replace(/[^\d.]/g,'');
        if (num) profitPercentageEl.textContent = 'Profit percentage: ' + formatCents(Math.round(parseFloat(num)*100));
      }
      setTimeout(()=>alertBox.classList.add('d-none'), 2000);
    });
    document.getElementById('resetSettings').addEventListener('click', ()=>{
      saveSettings({ currency:'USD', theme:'light' });
      applyTheme('light');
      location.reload();
    });
  }
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
          <td>${r.ticker == 'MONEY' ? 'CASH TRANSFER' : r.ticker}</td>
          <td class="text-end ${r.quantity<0?'text-danger':'text-success'}">${r.quantity}</td>
          <td class="text-end">${pricePerShare}</td>
        </tr>`;
    }).join('');

  } catch (e) {
    console.error(e);
    tbody.innerHTML = `<tr><td colspan="4" class="text-danger p-3">Load error</td></tr>`;
  }
}

async function renderStockPrices(searchTicker = '') {
  const tbody = document.querySelector('#stockTable tbody');
  if(!tbody) return;

  try {
    const rows = await fetchStockPrices();
    
    // Filter rows based on search input
    const filteredRows = searchTicker 
      ? rows.filter(r => r.ticker.toLowerCase().includes(searchTicker.toLowerCase()))
      : rows;

    if (!filteredRows.length) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-muted p-3">No matching stocks found</td></tr>`;
      return;
    }
    var tickers = {};
    tbody.innerHTML = filteredRows.map(r => {
      const pricePerShare = r.price >= 1000 ? (r.price / 100).toFixed(2) : r.price;
      if(tickers[r.ticker]) return '';
      tickers[r.ticker]= true;
      return `
        <tr>
          <td>${r.ticker == 'MONEY' ? 'CASH TRANSFER' : r.ticker}</td>
          <td class="text-end">${pricePerShare}</td>
        </tr>`;
    }).join('');

  } catch (e) {
    console.error(e);
    tbody.innerHTML = `<tr><td colspan="4" class="text-danger p-3">Load error</td></tr>`;
  }
}

async function renderNetWorth(timeframe = '1y') {
  try {
    const response = await fetch("http://localhost:8080/netWorth");
    var data = await response.json();
    if(timeframe == '1y' || timeframe == '3m'){
      data = data.filter(row => new Date(row.calculatedAt).getHours() == 0);
    }
    if(timeframe == '1m' || timeframe == '1w'){
      data = data.filter(row => new Date(row.calculatedAt).getMinutes() == 0);
    }
    if(timeframe == '1m'){
      data = data.filter(row => new Date(row.calculatedAt).getHours() % 4 == 0);
    }
    console.log(data.map(row => ({
      x: new Date(row.calculatedAt).getTime(),
      y: row.amount/100
    })));
    
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
    document.getElementById('renderNetWorth_1d')?.addEventListener('click', () => renderNetWorth('1d'));
    document.getElementById('renderNetWorth_1w')?.addEventListener('click', () => renderNetWorth('1w'));
    document.getElementById('renderNetWorth_1m')?.addEventListener('click', () => renderNetWorth('1m'));
    document.getElementById('renderNetWorth_3m')?.addEventListener('click', () => renderNetWorth('3m'));
    document.getElementById('renderNetWorth_1y')?.addEventListener('click', () => renderNetWorth('1y'));
    chartElement.innerHTML = '';

    // Create new ApexCharts instance
    const chart = new ApexCharts(chartElement, options);
    chart.render();
    const new_data = data.map(row => ({
      x: new Date(row.calculatedAt).getTime(),
      y: row.amount/100
    }))
    const end = new Date(new_data[new_data.length - 1].x);
    let start;
    switch (timeframe) {
      case '1d':
        start = new Date(end.getTime() - 1 * 24 * 60 * 60 * 1000);
        break;
      case '1w':
        start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '1m':
        start = new Date(end.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3m':
        start = new Date(end.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        start = new Date(end.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
    }

    chart.zoomX(start.getTime(), end.getTime());

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
            return '$' + value.toFixed(2) + ' (' + (value * 10000 / totalValue).toFixed(2) + '%)';
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

// Add this after other initialization code
document.getElementById('depositCash')?.addEventListener('click', () => {
  const modal = new bootstrap.Modal(document.getElementById('depositModal'));
  modal.show();
});

document.getElementById('depositForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const amountStr = formData.get('amount').replace('$', '');
  
  try {
    // Validate amount format
    if (!/^\d+(\.\d{2})?$/.test(amountStr)) {
      throw new Error('Invalid amount format');
    }
    
    // Convert to cents
    const amountInCents = Math.round(parseFloat(amountStr) * 100);
    
    // Validate positive amount
    if (amountInCents <= 0) {
      throw new Error('Amount must be positive');
    }

    const response = await fetch('http://localhost:8080/historyItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        price: amountInCents,
        ticker: 'MONEY',
        quantity: 1
      })
    });

    if (!response.ok) throw new Error('Deposit failed');

    // Show success message
    const successAlert = document.getElementById('depositSuccess');
    const errorAlert = document.getElementById('depositError');
    successAlert.classList.remove('d-none');
    errorAlert.classList.add('d-none');
    
    // Clear form and close modal
    form.reset();
    setTimeout(() => {
      const modal = bootstrap.Modal.getInstance(document.getElementById('depositModal'));
      document.getElementsByClassName('modal-backdrop fade show')[0]?.remove();
      modal.hide();
      fetchAndDisplayCash();
      successAlert.classList.add('d-none');
    }, 2000);

  } catch (error) {
    console.error('Error making deposit:', error);
    const errorAlert = document.getElementById('depositError');
    errorAlert.classList.remove('d-none');
    setTimeout(() => errorAlert.classList.add('d-none'), 3000);
  }
});

// Show withdraw modal
document.getElementById('withdrawCash')?.addEventListener('click', () => {
  const modal = new bootstrap.Modal(document.getElementById('withdrawModal'));
  modal.show();
});

// Handle withdraw form submit
document.getElementById('withdrawForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const amountStr = formData.get('amount').replace('$', '');
  
  try {
    // Validate amount format
    if (!/^\d+(\.\d{2})?$/.test(amountStr)) {
      throw new Error('Invalid amount format');
    }
    
    // Convert to cents
    const amountInCents = Math.round(parseFloat(amountStr) * 100);
    
    // Validate positive (user must enter >0)
    if (amountInCents <= 0) {
      throw new Error('Amount must be positive');
    }

    // For withdraw, price is negative
    const response = await fetch('http://localhost:8080/historyItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        price: -amountInCents,   // negative for withdraw
        ticker: 'MONEY',
        quantity: 1
      })
    });

    if (!response.ok) throw new Error('Withdraw failed');

    // Show success message
    const successAlert = document.getElementById('withdrawSuccess');
    const errorAlert = document.getElementById('withdrawError');
    successAlert.classList.remove('d-none');
    errorAlert.classList.add('d-none');
    
    // Clear form and close modal
    form.reset();
    setTimeout(() => {
      const modal = bootstrap.Modal.getInstance(document.getElementById('withdrawModal'));
      document.getElementsByClassName('modal-backdrop fade show')[0]?.remove();
      modal.hide();
      fetchAndDisplayCash(); // refresh balance
      successAlert.classList.add('d-none');
    }, 2000);

  } catch (error) {
    console.error('Error making withdraw:', error);
    const errorAlert = document.getElementById('withdrawError');
    errorAlert.classList.remove('d-none');
    setTimeout(() => errorAlert.classList.add('d-none'), 3000);
  }
});

// Default initial route if no hash
if (!location.hash) location.hash = '#/transactions';



