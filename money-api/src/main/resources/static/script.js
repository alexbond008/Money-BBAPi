// Function to fetch portfolio data from the backend
async function fetchPortfolio() {
    try {
        const response = await fetch('/portfolio');
        if (!response.ok) {
            throw new Error('Failed to fetch portfolio data');
        }
        const data = await response.json();
        displayPortfolio(data);
    } catch (error) {
        document.getElementById('portfolio-data').innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
    }
}

// Function to display portfolio data in a table
function displayPortfolio(data) {
    if (data.length === 0) {
        document.getElementById('portfolio-data').innerHTML = '<p>No portfolio items found.</p>';
        return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Ticker</th>
                <th>Quantity</th>
                <th>Average Price</th>
                <th>Current Price</th>
                <th>Profit</th>
            </tr>
        </thead>
        <tbody>
            ${data.map(item => `
                <tr>
                    <td>${item.ticker}</td>
                    <td>${item.quantity}</td>
                    <td>${item.avgPrice}</td>
                    <td>${item.currentPrice}</td>
                    <td>${item.profit}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    document.getElementById('portfolio-data').innerHTML = '';
    document.getElementById('portfolio-data').appendChild(table);
}

// Fetch portfolio data on page load
fetchPortfolio();