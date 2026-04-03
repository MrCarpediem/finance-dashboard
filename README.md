# Finance Dashboard - Microservices Architecture

A production-ready finance management platform built with microservices architecture. Provides transaction tracking, analytics, and role-based access control.

## 📊 System Architecture

```
Client (React/Vite) → API Gateway (3001) → Microservices → PostgreSQL
                              ↓
                   ┌──────────┼──────────┐
                   ↓          ↓          ↓
              Auth Svc    Finance Svc  Analytics Svc
              (4001)      (4002)       (4003)
              Node.js     Python       Python
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Redux Toolkit, Recharts |
| **API Gateway** | Express.js, JWT, Rate Limiting, CORS |
| **Auth Service** | Node.js, Prisma ORM, PostgreSQL, bcryptjs |
| **Finance Service** | Python, Flask, SQLAlchemy |
| **Analytics Service** | Python, Flask, SQLAlchemy |
| **Database** | PostgreSQL 15 |
| **Infrastructure** | Docker, Docker Compose, Nginx |

## ✅ Prerequisites

```bash
Docker 20.10+, Docker Compose 2.0+, Git, Node 18+, Python 3.11+
```

## 🏷️ Release / Version

- Version: 1.0.0
- Release date: 2026-04-03
- Changelog: initial multi-service bootstrap with API gateway

## 🧩 Install Dependencies (Local)

```bash
# Root folder
cd finance-dashboard

# Frontend
cd client && npm install

# API gateway
cd ../services/api-gateway && npm install

# Auth service
cd ../auth-service && npm install

# Finance + analytics services
cd ../../finance-service && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt
cd ../analytics-service && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt

# Auth service database (Prisma)
cd ../auth-service
npx prisma migrate deploy
```

## 🚀 Quick Start

### 1. Clone & Navigate
```bash
git clone https://github.com/MrCarpediem/finance-dashboard
cd finance-dashboard
```

### 2. Configure Environment
Create `.env` files for each service:

**Auth Service** (`services/auth-service/.env`):
```env
PORT=4001
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/auth_db
JWT_SECRET=your_super_secret_jwt_key_min_50_chars
JWT_EXPIRES_IN=15m
BCRYPT_ROUNDS=12
```

**Finance Service** (`services/finance-service/.env`):
```env
PORT=4002
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/finance_db
JWT_SECRET=your_super_secret_jwt_key_min_50_chars
```

**Analytics Service** (`services/analytics-service/.env`):
```env
PORT=4003
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/finance_db
JWT_SECRET=your_super_secret_jwt_key_min_50_chars
```

**API Gateway** (`services/api-gateway/.env`):
```env
PORT=3001
JWT_SECRET=your_super_secret_jwt_key_min_50_chars
AUTH_SERVICE_URL=http://auth-service:4001
FINANCE_SERVICE_URL=http://finance-service:4002
ANALYTICS_SERVICE_URL=http://analytics-service:4003
```

### 3. Start Services
```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### 4. Verify Services
```bash
# Check health endpoints
curl http://localhost:3001/health        # API Gateway
curl http://localhost:4001/health        # Auth Service
curl http://localhost:4002/health        # Finance Service
curl http://localhost:4003/health        # Analytics Service
```

## 📡 API Endpoints

### Authentication
```
POST   /auth/register          Register user
POST   /auth/login             Login user
POST   /auth/refresh           Refresh token
```

### Users
```
GET    /users                  List all users (ADMIN)
GET    /users/:id              Get user details
PUT    /users/:id              Update user
DELETE /users/:id              Delete user
```

### Transactions
```
GET    /transactions           List transactions
GET    /transactions/:id       Get transaction
POST   /transactions           Create transaction
PUT    /transactions/:id       Update transaction
DELETE /transactions/:id       Delete transaction
```

### Analytics
```
GET    /analytics/summary      Monthly/yearly summary
GET    /analytics/trends       Spending trends
GET    /analytics/dashboard    Complete dashboard data
```

## 🏗️ Services Overview

### API Gateway (Port 3001)
- Central request router
- JWT token validation
- Rate limiting (200 req/15min)
- CORS & logging

### Auth Service (Port 4001) - Node.js
- User registration/login
- JWT token generation
- Role-based access control (ADMIN, ANALYST, VIEWER)
- User management

**Database Schema**:
```sql
Users table: id, email, password, name, role, status, createdAt, updatedAt
```

### Finance Service (Port 4002) - Python
- Transaction CRUD operations
- Data validation & sanitization
- Role-based access

**Database Schema**:
```sql
Transactions: id, user_id, amount, category, description, date, status
```

### Analytics Service (Port 4003) - Python
- Financial summaries
- Trend analysis
- Dashboard data aggregation

## 🔐 Security Features

✅ **Implemented**:
- JWT authentication (15min access + 7d refresh tokens)
- Password hashing (bcryptjs, 12 rounds)
- Role-Based Access Control (RBAC)
- Rate limiting & DDoS protection
- Input validation & sanitization
- SQL injection prevention (ORM)
- CORS policy enforcement

⚠️ **Production Requirements**:
- Generate strong JWT secrets (50+ characters)
- Use environment variables for all secrets
- Enable HTTPS/TLS certificates
- Set up database backups
- Configure monitoring & alerting
- Implement secrets management (AWS Secrets Manager)

## 🔄 Health Check Response

```json
{
  "success": true,
  "service": "api-gateway",
  "status": "running",
  "timestamp": "2026-04-03T10:30:00.000Z"
}
```

## 🗄️ Database

- **Host**: postgres (Docker) / localhost (local)
- **Port**: 5432
- **User**: postgres
- **Password**: postgres
- **Databases**: auth_db, finance_db

Auto-initialized via `infrastructure/postgres/init.sql`

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| Services won't start | `docker-compose down && docker-compose up -d` |
| DB connection error | `docker-compose exec postgres pg_isready -U postgres` |
| JWT errors | Verify JWT_SECRET matches across all services |
| CORS errors | Check API Gateway URL in frontend config |
| Rate limiting blocked | Wait 15 minutes or check X-RateLimit-Reset header |
| Port conflicts | `lsof -i :PORT` to find process using port |

## ▶️ Manual local startup (no Docker)

If Docker Compose is not working, run services manually in separate terminals or background processes:

```bash
# 1) Auth Service
cd services/auth-service && npm run dev &

# 2) API Gateway
cd services/api-gateway && npm run dev &

# 3) Finance Service
cd services/finance-service && source venv/bin/activate && python run.py &

# 4) Analytics Service
cd services/analytics-service && source venv/bin/activate && python run.py &

# 5) Frontend Client
cd client && npm run dev
```

Or run as a single one-liner (same shell, separate pids):

```bash
(cd services/auth-service && npm run dev) &
(cd services/api-gateway && npm run dev) &
(cd services/finance-service && source venv/bin/activate && python run.py) &
(cd services/analytics-service && source venv/bin/activate && python run.py) &
cd client && npm run dev
```

> Note: Keep your PostgreSQL instance running and ensure each service has a valid `.env` configuration.

## 📊 HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad request/validation error
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `429` - Rate limit exceeded
- `500` - Server error

## 🚀 Deployment Checklist

- [ ] Generate strong JWT secrets
- [ ] Configure env variables for all services
- [ ] Enable HTTPS/TLS
- [ ] Set up database backups
- [ ] Configure monitoring/alerting
- [ ] Load testing completed
- [ ] Security audit performed

## 📈 Performance Targets

- API response time: < 200ms
- Database query time: < 100ms
- Concurrent users: 1000+
- Uptime SLA: 99.9%

## 📝 Development

```bash
# Install dependencies
cd client && npm install
cd services/auth-service && npm install
cd services/api-gateway && npm install
cd services/finance-service && pip install -r requirements.txt
cd services/analytics-service && pip install -r requirements.txt
```

## 📄 License

Copyright © 2026 Zorvyn. All rights reserved.

## 📞 Support

For issues or questions, contact the development team or create an issue in the repository.

---

**Version**: 1.0.0 | **Status**: Production Ready ✅ | **Last Updated**: April 3, 2026
