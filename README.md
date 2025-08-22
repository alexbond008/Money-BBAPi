# Money-BBAPi

Lightweight personal portfolio & net worth tracker (Spring Boot + Maven).

## Tech Stack
- Java 17, Spring Boot 3 (Web, Data JPA)
- H2 in‑memory DB (dev)
- Entities: `HistoryItem`, `NetWorth`, `StockPrice`
- Repos: `HistoryItemRepository`, `NetWorthRepository`, `StockPriceRepository`
- Service layer: `PortfolioService` (+ future services)
- DTO/helper: `PortfolioItem`
- Static UI prototype in `src/main/resources/static`

---

## Domain Model (MVP)

| Concept | Purpose | Backing class |
|---------|---------|---------------|
| Transaction / History | Raw buy/sell events (quantity (+/-), price, timestamp) | `HistoryItem` (+ `HistoryItemId`) |
| Position (derived) | Aggregated shares held & avg cost per ticker | Built in `PortfolioServiceImpl` → `PortfolioItem` |
| Net Worth snapshot | Point-in-time total value (cash + positions) | `NetWorth` |
| Price history | Per‑ticker historical prices (for PnL / charts) | `StockPrice` (+ `StockPriceId`) |

---

## MVP Endpoints

Base path suggestion: `/api` (current code uses `/portfolio` without `/api`; adjust later).

| Endpoint | Method | Returns | Description |
|----------|--------|---------|-------------|
| `/portfolio` | GET | `List<PortfolioItem>` | Current open positions (qty, avg cost, current price, profit calc client-side) |
| `/networth` | GET | `List<NetWorth>` or latest only | Historical or latest net worth snapshots |
| `/networth/latest` | GET | `NetWorth` | Convenience latest snapshot |
| `/prices/{ticker}` | GET | `List<StockPrice>` | Raw price bars stored (optional filter by date range) |
| `/portfolio/history/{ticker}` | GET | Time series of position size & cost basis | For position chart |
| `/health` (optional) | GET | `{status:"UP"}` | Simple liveness |

Planned computation:
- Positions: aggregate `HistoryItem` rows (buy qty > 0 increases qty & cost basis; sell qty < 0 reduces qty & proportional cost).
- Net worth: sum(positionQty * latestPrice) + (future cash ledger) → persisted periodically as `NetWorth`.

---

### Example POST request

curl -X POST http://localhost:8080/historyItem/add \
  -H "Content-Type: application/json" \
  -d '{"ticker":"AAPL","quantity":10,"price":189,"timestamp":"2025-08-22T12:00:00Z"}'




---

### Sample JSON

`GET /portfolio`
```json
[
  { "ticker":"AAPL","quantity":25,"avgPrice":142,"currentPrice":150 },
  { "ticker":"MSFT","quantity":10,"avgPrice":315,"currentPrice":328 }
]
```

^^ this is up to edit (in case we want total profit, %profit)

*add CRUD transactions for endpoint to edit historical performance