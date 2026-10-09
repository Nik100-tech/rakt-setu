# Rakt Setu

Full-stack blood donor/request registry based on the reference design.

## Stack

- React + Vite
- Express
- Prisma
- PostgreSQL
- REST API
- Responsive CSS
- QR donor ID card download

## Requirements

- Node.js 18+
- Docker Desktop (recommended) or a local PostgreSQL 14+
- npm

## Quick start

### 1. Start PostgreSQL

```bash
docker compose up -d
```

### 2. Install dependencies

```bash
npm install
npm run install:all
```

### 3. Configure the server

Copy:

```text
server/.env.example -> server/.env
```

The default Docker database URL is already provided.

### 4. Create Prisma client and database

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 5. Start both apps

```bash
npm run dev
```

Frontend: http://localhost:5173  
API: http://localhost:5000

## Manual start

Server:

```bash
cd server
npm install
npm run dev
```

Client:

```bash
cd client
npm install
npm run dev
```

## API

- `GET /api/health`
- `POST /api/donors`
- `GET /api/donors`
- `GET /api/donors/:token`
- `PATCH /api/donors/:token/status`
- `GET /api/donors/:token/matches`
- `POST /api/requests`
- `GET /api/requests`
- `GET /api/requests/:token`
- `GET /api/requests/:token/matches`
- `GET /api/stats`
- `GET /api/activity`
- `GET /api/donors/:token/id-card`

## Notes

The matching service supports standard red-cell compatibility and prioritizes location matches. Location matching is intentionally text-based in this prototype; it does not claim GPS distance.

No real SMS is sent. Registration/request activity is logged as a simulated SMS/activity event.
