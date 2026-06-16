# AGENTS.md — Calendar Booking Application

## Architecture

- **Backend**: Spring Boot 3.2.5 (Java 17) in `backend/`. Entry point: `BookingApplication.java`.
- **Frontend**: React 19 + TypeScript + Vite in `frontend/`. Entry point: `src/main.tsx`.
- **API Contract**: TypeSpec spec in `main.tsp` (root). Generates `openapi.yaml`.
- **Database**: H2 in-memory (`backend/src/main/resources/application.yml`). Auto-seeded from `data.sql` on startup.
- **Root `package.json` is for TypeSpec tooling only**, not the frontend application.

## Running

```bash
# Backend
cd backend && mvn spring-boot:run   # http://localhost:8080

# Frontend
cd frontend && npm install && npm run dev   # http://localhost:5173

# Mock API (Prism, no backend needed)
cd frontend && npm run mock   # http://localhost:4010
```

## Testing & Verification

- **Backend**: `cd backend && mvn test` (JUnit 5 + Mockito). 3 test classes: `BookingServiceTest`, `CalendarServiceTest`, `BookingControllerTest`.
- **Frontend**: No test runner (Vitest/Jest) is configured. Verification is `npm run build`, which runs `tsc -b && vite build`.
- **Lint**: `cd frontend && npm run lint` (ESLint + typescript-eslint + react-hooks/refresh).

## Key Conventions

- **Frontend routes**: `/` (role selector), `/guest` (booking), `/admin` (owner). Defined in `frontend/src/App.tsx`.
- **API base URL**: `frontend/.env` sets `VITE_API_URL=http://localhost:8080`. CORS is hardcoded to `http://localhost:5173` in `CorsConfig.java`.
- **H2 Console**: Available at `http://localhost:8080/h2-console` when backend is running.
- **Codegen**: `npx tsp compile .` (from repo root) regenerates `openapi.yaml` from `main.tsp`. Prism mock server uses the generated `openapi.yaml`.
- **Date handling**: Backend uses `java.time.Instant`; frontend uses `dayjs`.
- **State management**: Frontend uses TanStack Query (React Query) for server state; Mantine UI for components and forms.

## Constraints

- Package manager is `npm@11.17.0` (specified in root `packageManager`).
- Backend uses `ddl-auto: create-drop` — data is ephemeral across restarts, re-seeded from `data.sql`.
- No CI workflows or GitHub Actions present in the repo.
