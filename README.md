# Real-Time Trading Dashboard

A microservices-based real-time trading dashboard built for the MultiBank Group coding challenge. Displays live ticker prices and interactive charts for 7 financial instruments using WebSocket streaming and simulated market data.

## Architecture

![System Architecture](docs/system-architecture.svg)

**Services:**

| Service | Port | Purpose |
|---------|------|---------|
| market-data | 3001 | GBM price simulator + WebSocket broadcast |
| history-api | 3002 | Seeded OHLC history + live aggregation + REST API |
| alert-engine | 3003 | Price threshold evaluation + alert push |
| auth | 3004 | JWT authentication (mocked users) |
| nginx | 80 | Reverse proxy / API gateway |
| frontend | 5173 | React + Vite dashboard |

## Tech Stack

- **Backend:** Node.js, TypeScript, Express, WebSocket (ws)
- **Frontend:** React 19, TypeScript, Vite, Recharts, Zustand
- **Infrastructure:** Docker, nginx, Kubernetes manifests
- **Testing:** Vitest

## Quick Start

### Development (without Docker)

```bash
npm install

# Terminal 1 — market data simulator
npm run dev -w @trading/market-data

# Terminal 2 — history API
npm run dev -w @trading/history-api

# Terminal 3 — alert engine
npm run dev -w @trading/alert-engine

# Terminal 4 — auth service
npm run dev -w @trading/auth

# Terminal 5 — frontend
cd frontend && npm run dev
```

Open http://localhost:5173 — Login with `trader1` / `password123`

### Docker Compose

```bash
docker-compose up --build
```

Open http://localhost — all services behind nginx gateway.

## Data Flow

![Data Flow](docs/data-flow.svg)

## Frontend Components

![Frontend Components](docs/frontend-components.svg)

## Key Design Decisions

### GBM Price Simulation
Prices use Geometric Brownian Motion with per-ticker drift and volatility parameters, producing realistic market behavior. Each ticker has tuned parameters (e.g., TSLA has higher volatility than MSFT). Box-Muller transform generates the normal distribution.

### WebSocket Subscription Model
Clients subscribe to specific tickers rather than receiving all ticks. The `SubscriptionManager` class maintains a per-client set of subscribed symbols, reducing unnecessary network traffic.

![WebSocket Message Flow](docs/data_websocket.svg)

### Pre-seeded History
On startup, history-api generates 500 historical candles per ticker per timeframe using the same GBM function. This ensures reviewers see a full chart immediately without waiting for candle accumulation. Live ticks are aggregated and appended seamlessly.

### Cache Strategy
Server-side caching with node-cache using TTL scaled by timeframe: 1m bars expire in 10s, 1d bars in 300s. This balances freshness with performance.

### Auth Architecture
JWT-based authentication with a dedicated auth microservice. The history-api validates tokens via the auth service but gracefully falls back to a demo user if the auth service is unavailable, ensuring the dashboard works in development without running all services.

![Authentication Flow](docs/auth_flow.svg)

### Monorepo with Shared Types
npm workspaces with a `@trading/shared` package containing TypeScript types and ticker configurations. Single source of truth for data contracts across all services.

## Backend Service Internals

![Backend Services](docs/backend_services.svg)

## Assumptions & Trade-offs

- **Mock data only** — no real market data feeds; GBM simulation is sufficient to demonstrate real-time capabilities
- **In-memory storage** — alert rules and history stored in memory; acceptable for a demo, would use Redis/PostgreSQL in production
- **Hardcoded users** — auth service uses static credentials; sufficient for demonstrating JWT flow
- **No SSL/TLS** — development setup only; production would terminate TLS at nginx
- **Single replica** — K8s manifests use 1 replica; market-data is stateful (prices in memory) so horizontal scaling would require shared state

## Infrastructure

### Docker Compose Dependencies

![Docker Dependencies](docs/docker.svg)

### Kubernetes Deployment

![Kubernetes Architecture](docs/kubernetes.svg)

## Running Tests

```bash
# Run all tests across all services
npm test

# Run tests for a specific service
npm test -w @trading/market-data
npm test -w @trading/history-api
npm test -w @trading/alert-engine
npm test -w @trading/auth
```

Tests cover core business logic:
- **GBM simulator** (5 tests) — positivity, zero-vol identity, statistical drift and spread validation
- **OHLC aggregator** (9 tests) — candle formation from ticks, edge cases, bucket boundaries
- **Threshold evaluator** (4 tests) — above/below triggers, exact boundary behavior
- **JWT** (3 tests) — sign/verify roundtrip, tampered token rejection, expiry

## Bonus Features

- [x] **Authentication** — JWT-based login with mocked users, protected routes, persistent sessions
- [x] **Caching** — node-cache with TTL-per-timeframe on history-api
- [x] **Price Alerts** — create threshold rules, real-time evaluation against live ticks, push notifications
- [x] **Docker** — multi-stage Dockerfiles, docker-compose with health checks and service dependencies
- [x] **Kubernetes** — deployment manifests with ConfigMap for nginx, Secret ref for JWT key
- [x] **Candlestick Chart** — toggle between line and candlestick views with OHLC tooltip

## Project Structure

```
trading-dashboard/
├── packages/shared/          # Shared types + ticker configs
├── services/
│   ├── market-data/          # GBM simulator + WebSocket server
│   ├── history-api/          # OHLC aggregation + REST API
│   ├── alert-engine/         # Alert rules + threshold evaluation
│   └── auth/                 # JWT authentication
├── frontend/                 # React + Vite dashboard
├── nginx/                    # Gateway config
├── k8s/                      # Kubernetes manifests
├── docs/                     # Architecture diagrams
├── docker-compose.yml
└── README.md
```
