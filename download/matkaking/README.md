# MatkaKing - React + Node.js + MySQL Architecture

A full-stack web application built with **React (Vite)**, **Node.js (Express)**, and **MySQL (Prisma ORM)**. Originally converted from a Next.js + SQLite project to a separated frontend/backend architecture.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Client (React)                       │
│              Vite + Tailwind CSS + shadcn/ui             │
│                    Port: 5173 (dev)                      │
└────────────────────┬────────────────────────────────────┘
                     │ HTTP / WebSocket
                     ▼
┌─────────────────────────────────────────────────────────┐
│                   Server (Express.js)                    │
│          REST API + Socket.IO + Prisma ORM               │
│                    Port: 3001                            │
└────────────────────┬────────────────────────────────────┘
                     │ MySQL Protocol
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    MySQL Database                        │
│                 Port: 3306                               │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

### Frontend (Client)
| Technology | Purpose |
|---|---|
| React 19 | UI Framework |
| Vite 6 | Build Tool & Dev Server |
| TypeScript 5 | Type Safety |
| Tailwind CSS 4 | Utility-First Styling |
| shadcn/ui | Component Library (New York style) |
| Framer Motion | Animations & Transitions |
| React Router DOM | Client-Side Routing |
| Socket.IO Client | Real-Time Communication |
| Lucide React | Icon Library |
| Zustand | State Management |
| Recharts | Data Visualization |

### Backend (Server)
| Technology | Purpose |
|---|---|
| Express 5 | Web Framework |
| TypeScript 5 | Type Safety |
| Prisma 6 | ORM & Database Migrations |
| Socket.IO 4 | Real-Time WebSocket Communication |
| MySQL 8 | Relational Database |
| CORS | Cross-Origin Resource Sharing |
| dotenv | Environment Variable Management |

## Project Structure

```
matkaking/
├── client/                         # React Vite Frontend
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── components/ui/          # shadcn/ui components (40+)
│   │   ├── hooks/                  # Custom React hooks
│   │   │   ├── use-mobile.ts       # Mobile breakpoint detection
│   │   │   └── use-toast.ts        # Toast notification system
│   │   ├── lib/
│   │   │   ├── api.ts              # API client with typed fetch
│   │   │   └── utils.ts            # cn() utility function
│   │   ├── pages/
│   │   │   ├── HomePage.tsx        # Landing page (hero, features, download)
│   │   │   └── ChatPage.tsx        # WebSocket chat demo
│   │   ├── App.tsx                 # Root component with routing
│   │   ├── main.tsx                # Entry point
│   │   ├── globals.css             # Tailwind + CSS variables
│   │   └── vite-env.d.ts           # Vite type declarations
│   ├── index.html                  # HTML template
│   ├── vite.config.ts              # Vite configuration
│   ├── tsconfig.json               # TypeScript configuration
│   ├── postcss.config.mjs          # PostCSS configuration
│   └── package.json
│
├── server/                         # Node.js Express Backend
│   ├── prisma/
│   │   ├── schema.prisma           # Database schema (MySQL)
│   │   └── seed.ts                 # Database seed script
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts         # Prisma client singleton
│   │   │   └── env.ts              # Environment configuration
│   │   ├── routes/
│   │   │   └── api.ts              # REST API routes
│   │   ├── socket/
│   │   │   └── chat.ts             # Socket.IO chat handlers
│   │   └── index.ts                # Server entry point
│   ├── tsconfig.json
│   └── package.json
│
├── scripts/
│   ├── dev.sh                      # Development startup script
│   └── build.sh                    # Production build script
│
├── docker-compose.yml              # Docker Compose for deployment
├── Dockerfile                      # Multi-stage Docker build
├── Caddyfile                       # Caddy reverse proxy config
├── .env.example                    # Environment variable template
├── .env.docker                     # Docker-specific env vars
└── .gitignore
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Health check & server status |
| GET | `/api/users` | Get all users with their posts |
| GET | `/api/users/:id` | Get a specific user by ID |
| POST | `/api/users` | Create a new user |
| GET | `/api/posts` | Get all posts with authors |
| POST | `/api/posts` | Create a new post |

## WebSocket Events

| Event | Direction | Description |
|---|---|---|
| `join` | Client → Server | Join chat with username |
| `message` | Client → Server | Send a chat message |
| `user-joined` | Server → Client | Notification when user joins |
| `user-left` | Server → Client | Notification when user leaves |
| `message` | Server → Client | Broadcast chat message |
| `users-list` | Server → Client | Current online users list |

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **MySQL** 8.0+ running locally or accessible remotely
- (Optional) **Docker** and **Docker Compose** for containerized setup

### Quick Start (Development)

1. **Clone and navigate to the project:**
   ```bash
   cd matkaking
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your MySQL credentials
   ```
   
   For the server, create `server/.env`:
   ```bash
   cp server/.env.example server/.env
   # Update DATABASE_URL with your MySQL connection string
   ```

3. **Install dependencies:**
   ```bash
   cd server && npm install
   cd ../client && npm install
   ```

4. **Set up the database:**
   ```bash
   cd server
   npx prisma generate     # Generate Prisma client
   npx prisma db push      # Push schema to MySQL
   npx tsx prisma/seed.ts  # Seed sample data
   ```

5. **Start development servers:**
   
   Terminal 1 (Backend):
   ```bash
   cd server
   npm run dev
   ```
   
   Terminal 2 (Frontend):
   ```bash
   cd client
   npm run dev
   ```

6. **Open the application:**
   - Frontend: http://localhost:5173
   - API Health: http://localhost:3001/api/health
   - Chat Page: http://localhost:5173/chat

### One-Command Setup

```bash
bash scripts/dev.sh setup   # Install deps + setup DB
bash scripts/dev.sh dev     # Start both servers
```

### Docker Deployment

1. **Build and start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Run database migrations:**
   ```bash
   docker-compose exec api npx prisma migrate deploy
   ```

3. **Access the application:**
   - App: http://localhost:81
   - API: http://localhost:81/api/health

## Database Schema

### User Model
| Field | Type | Description |
|---|---|---|
| id | String (CUID) | Primary key |
| email | String | Unique email address |
| name | String? | Optional display name |
| createdAt | DateTime | Account creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Post Model
| Field | Type | Description |
|---|---|---|
| id | String (CUID) | Primary key |
| title | String | Post title |
| content | String? | Optional post content |
| published | Boolean | Publication status (default: false) |
| authorId | String | Foreign key to User |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

## Migration from Next.js

This project was converted from the original Next.js + SQLite architecture. Key changes:

| Aspect | Before (Next.js) | After (React + Express) |
|---|---|---|
| Framework | Next.js 16 (App Router) | React 19 + Vite 6 |
| Backend | Next.js API Routes | Express.js 5 REST API |
| Database | SQLite via Prisma | MySQL via Prisma |
| Routing | File-based (App Router) | React Router DOM |
| WebSocket | Separate Socket.IO server | Integrated into Express |
| SSR | Server-Side Rendering | Client-Side SPA |
| Build | Next.js standalone | Vite build + tsc |
| Proxy | Caddy with XTransformPort | Vite proxy (dev) / Caddy (prod) |

## Production Build

```bash
# Build both client and server
bash scripts/build.sh

# Or manually:
cd client && npm run build    # Output: client/dist/
cd server && npm run build    # Output: server/dist/

# Start production server
cd server
NODE_ENV=production DATABASE_URL="mysql://..." npm start
```

## Environment Variables

### Server (.env)
| Variable | Default | Description |
|---|---|---|
| PORT | 3001 | Server port |
| NODE_ENV | development | Environment mode |
| DATABASE_URL | - | MySQL connection string |
| CORS_ORIGIN | http://localhost:5173 | Allowed CORS origins |

### Client (.env)
| Variable | Default | Description |
|---|---|---|
| VITE_API_URL | (empty) | API base URL (empty = same origin) |
| VITE_SOCKET_URL | (empty) | Socket.IO server URL |

## Development Notes

- The Vite dev server proxies `/api` and `/socket.io` requests to the Express backend automatically
- In production, the Express server can serve the client's static files directly
- Caddy is configured as a reverse proxy for production deployment
- Socket.IO is integrated into the Express server (no separate process needed)
- Prisma schema uses `@default(cuid())` for auto-generating IDs
- The database uses MySQL-specific features through Prisma's MySQL provider
