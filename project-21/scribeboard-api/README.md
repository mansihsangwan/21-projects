# scribeboard-api (simple testing version)

Minimal Express API inspired by `q225/scribeboard`.

This version intentionally does **not** include:
- Validation (Joi)
- Logging (Winston/Morgan)
- Security middleware (Helmet, CORS, rate limiting)

## 1. Setup

```bash
cd project-21/scribeboard-api
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
- `POST /api/v1/echo`
- `GET /api/v1/config`
- `GET /api/v1/error`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me` (Bearer token)
- `POST /api/v1/boards` (Bearer token)
- `GET /api/v1/boards` (Bearer token)
- `GET /api/v1/boards/:boardId` (Bearer token)
- `PATCH /api/v1/boards/:boardId` (Bearer token)
- `DELETE /api/v1/boards/:boardId` (Bearer token)
- `GET /api/v1/boards/:boardId/notes` (Bearer token)
- `POST /api/v1/boards/:boardId/notes` (Bearer token)
- `GET /api/v1/boards/:boardId/notes/:noteId` (Bearer token)
- `PATCH /api/v1/boards/:boardId/notes/:noteId` (Bearer token)
- `DELETE /api/v1/boards/:boardId/notes/:noteId` (Bearer token)

## 4. Notes

- Users, boards, and notes are stored in-memory for testing only.
- Restarting the server clears all data.
