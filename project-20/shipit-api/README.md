# shipit-api (simple testing version)

Minimal Express API inspired by `q225/shipit-api`.

This version intentionally does **not** include:
- Validation (Joi)
- Logging (Winston/Morgan)
- Security middleware (Helmet, CORS, rate limiting)

## 1. Setup

```bash
cd project-20/shipit-api
cp env.example .env
npm install
```

## 2. Run

```bash
npm run dev
```

## 3. Endpoints

- `GET /`
- `GET /health`
- `GET /health/live`
- `GET /health/ready`
- `GET /health/detailed`
- `GET /api/v1`
- `GET /api/v1/items`
- `GET /api/v1/items/:id`
- `POST /api/v1/echo`
- `GET /api/v1/config`
- `GET /api/v1/error`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` (Bearer token)

## 4. Notes

- Auth users are stored in-memory for testing only.
- Restarting the server clears registered users.
