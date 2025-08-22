### Schedule

Thursday:

-Repo, rough sketch, first meeting to discuss business requirements

Friday:

-MVP

Monday:

-Checking with business, discussing any additional requirements to v1.0

-Create presentable v1.0, add any bonus QoL features (tests, CI, swagger, etc.)

Tuesday:

-Morning: last improvements (be ready to roll back to v1.0 if needed)

-Afternoon: start preparing (thinking about) the presentation

Wednesday:

-Finalise and practise the presentatiom


#Meeting 1 - MVP

Items - stocks (+cash)
Favcourite stock exchange - NYSE(?)
Most important elemnt - total worth of portfolio
Currency - $$
Frequency of historical data - adjustable



status 1pm lunch break friday:

FOR MVP

Add current price sourcing (stub now = 150). Create PriceService:
Method: Integer getLatestPrice(String ticker) (lookup StockPrice or call external → persist).
Add NetWorthService:
NetWorth snapshotNow()
List<NetWorth> listAll()
Add controllers:
NetWorthController (/networth, /networth/latest)
PriceController (/prices/{ticker})
Enhance PortfolioServiceImpl:
Dynamic ticker discovery (from HistoryItem)
Correct sell logic (reduce cost basis proportionally)
Add method getTickerHistory(String ticker)
Persist periodic net worth (Scheduler @FixedRate).
Add profit fields to PortfolioItem or compute in controller (unrealized = (currentPrice - avgPrice)*qty)



FOR NON MVP:
Feature	Endpoints (planned)	Notes
Orders	POST /orders, GET /orders	Either map directly to HistoryItem or separate Order entity
Reports (CSV)	GET /reports/transactions.csv, GET /reports/positions.csv	Stream generated CSV via ResponseEntity<Resource>
Multiple portfolios	Prefix: /portfolios/{portfolioId}/...	Add portfolioId column to HistoryItem & NetWorth
Benchmarks (e.g. SPY)	/benchmarks/{symbol}	Store SPY in StockPrice & compare performance
Comparative performance	/performance/compare?symbols=AAPL,SPY	Return normalized index series
Authentication	/auth/*	Optional later
Swagger / OpenAPI	/swagger-ui.html	Add springdoc-openapi dependenc