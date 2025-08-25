# Money-BBAPi

Lightweight personal portfolio & net worth tracker with real-time visualization (Spring Boot + Maven).

## Tech Stack

### Backend
- Java 17, Spring Boot 3 (Web, Data JPA)
- H2 in‑memory DB (dev)
- RESTful API endpoints
- Service-oriented architecture

### Frontend
- Vanilla JavaScript with modules
- Sneat Bootstrap Admin Template
- ApexCharts for data visualization
- Responsive design with Bootstrap 5

## Features

- 📊 Real-time portfolio tracking
- 📈 Net worth visualization
- 🔄 Transaction management
- 🔍 Search functionality for transactions and holdings
- 📱 Responsive mobile-friendly interface
- 💰 Real-time profit/loss calculations
- 📉 Holdings distribution visualization

## Components

### Backend Entities
- `HistoryItem`: Transaction records
- `NetWorth`: Point-in-time portfolio valuations
- `StockPrice`: Historical price data
- `PortfolioItem`: Current holdings representation

### Frontend Structure
- Dynamic routing system
- Real-time search functionality
- Interactive charts
- Transaction management interface
- Responsive data tables

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/portfolio` | GET | Returns current portfolio holdings with calculated metrics |
| `/netWorth` | GET | Retrieves net worth history for charting |
| `/historyItem` | POST | Adds new transaction |
| `/historyItem` | GET | Returns transaction history |

### Sample Responses

#### GET /portfolio
```json
[
  {
    "ticker": "AAPL",
    "quantity": 10,
    "avgPrice": 15000,
    "currentPrice": 17500,
    "totalValue": 175000
  }
]
```

#### POST /historyItem
```json
{
  "ticker": "AAPL",
  "quantity": 10,
  "price": 15000,
  "timestamp": "2025-08-22"
}
```

## Features in Detail

### Portfolio View
- Real-time holdings overview
- Profit/loss calculations
- Search functionality
- Interactive data refresh

### Transaction Management
- Add new transactions
- View transaction history
- Search transactions by ticker
- Real-time updates

### Net Worth Tracking
- Historical net worth visualization
- Interactive timeline
- Tooltip details for specific dates

### Holdings Distribution
- Pie chart visualization
- Percentage allocation view
- Interactive legend
- Real-time updates

## Getting Started

1. Clone the repository
2. Ensure Java 17 is installed
3. Run `mvn spring-boot:run`
4. Access the application at `http://localhost:8080`

## Development

### Project Structure
```
money-api/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com.bbapi.money_api/
│   │   │       ├── controller/
│   │   │       ├── service/
│   │   │       ├── repository/
│   │   │       └── entity/
│   │   └── resources/
│   │       └── static/
│   │           ├── js/
│   │           │   ├── views.js
│   │           │   └── api.js
│   │           └── index.html
│   └── test/
└── pom.xml
```

## Future Enhancements

- [ ] User authentication
- [ ] Multiple portfolio support
- [ ] Export functionality
- [ ] Advanced analytics
- [ ] Price alerts
- [ ] Custom date ranges for reports

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.