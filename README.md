# Jobby

Full-stack job application tracker: kanban pipeline, calendar, recruiter CRM, AI resume tools, and admin approval. Built as a multi-project .NET solution with a React SPA.

## Architecture

```
jobby.client/           React 19 + Vite + TypeScript SPA (Tailwind, shadcn/ui)
Jobby.Server/           ASP.NET Core 10 Web API and SPA host
Jobby.Models/           Shared entities and API DTOs
Jobby.Infrastructure/   EF Core DbContext, PostgreSQL, migrations
Jobby.Scraper/          Playwright-based HTML scrape microservice
Jobby.Server.Tests/     xUnit tests
```

```
┌─────────────────┐     cookie JWT      ┌──────────────────┐
│  jobby.client   │ ◄──────────────────► │  Jobby.Server    │
│  (Vite / React) │   /api/*             │  Controllers +   │
└─────────────────┘                      │  domain services │
                                         └────────┬─────────┘
                    ┌─────────────────────────────┼─────────────────────────────┐
                    ▼                             ▼                             ▼
           ┌────────────────┐          ┌─────────────────┐          ┌──────────────────┐
           │ PostgreSQL     │          │ Jobby.Scraper   │          │ Ollama (cloud)   │
           │ via            │          │ Playwright HTML │          │ resume AI        │
           │ Infrastructure │          └─────────────────┘          └──────────────────┘
           └────────────────┘
```

| Layer | Responsibility |
|-------|----------------|
| **Client** | UI, axios client (`withCredentials`), feature services under `src/services/` |
| **Server** | Auth, REST API, orchestration (jobs, stages, scrape + Ollama calls) |
| **Models** | `Job`, `JobStage`, `CalendarEvent`, `JobHistory`, `Recruiter`, `LocationType`, `ApplicationUser` |
| **Infrastructure** | `AppDbContext`, Npgsql, migrations (applied on API startup) |
| **Scraper** | Separate service: POST `/scrape` → rendered HTML for a job URL |

### Runtime topology

- **Development:** Vite on `https://localhost:60922`, API on `https://localhost:7048` (SPA proxy). Client env `VITE_API_URL=/api`.
- **Production:** Docker/publish builds the Vite SPA into `wwwroot`; API serves it and falls back to `index.html` for client routes. Client env `VITE_API_URL=/api` (same origin).
- **Auth:** ASP.NET Identity + JWT stored in an httpOnly `token` cookie. The client caches the user profile (including `expiresAt`) in `localStorage` and auto-clears the session when that time is reached or an API call returns 401.

## Features

| Area | Description |
|------|-------------|
| **Dashboard / Kanban** | Drag-and-drop jobs across custom stages |
| **Applications** | Company, title, URL, location type, salary, notes, status, archive; optional scrape-from-URL |
| **Calendar** | Events linked to applications |
| **Recruiters** | Contacts, agencies, follow-up dates |
| **Profile** | Display name + activity stats |
| **Resume rating** | Upload `.docx` → ATS-style analysis via Ollama |
| **Resume tailoring** | Job posting + `.docx` → edited docx + change list |
| **Archive** | Archived applications |
| **Admin** | Approve users, roles (`User`, `Admin`) |

## API surface

Authenticated routes under `/api` (except register/login):

| Area | Base route |
|------|------------|
| Auth | `/api/auth` |
| Jobs | `/api/app` |
| Stages | `/api/stage` |
| Recruiters | `/api/recruiter` |
| Calendar | `/api/events` |
| History | `/api/history` |
| Resume | `/api/resume` |
| Profile | `/api/profile` |
| Admin | `/api/admin` |

Multipart: `POST /api/app/gen` and `POST /api/resume/review` take a `.docx` `file`; generation also needs `posting`.

## AI & scraping

- **Ollama** (via OllamaSharp) powers resume rating and tailoring. Configured under `Ollama` in server appsettings.
- **Job posting scrape:** API calls `Jobby.Scraper`, then asks Ollama to structure the HTML into job fields.

## Getting started

### Prerequisites

- .NET 10 SDK
- Node.js 20+
- PostgreSQL (connection string in `Jobby.Server/appsettings.Development.json`)
- Optional: running `Jobby.Scraper` and Ollama credentials for scrape/resume flows

### Run the SPA + API

```bash
cd Jobby.Server
dotnet run --launch-profile https
```

Open `https://localhost:60922`. Register, then approve the user as an admin (UI or database) before login works.

### Tests

```bash
dotnet test Jobby.Server.Tests/Jobby.Server.Tests.csproj

cd jobby.client
npm test
```

## Conventions

**Backend:** Controllers at `api/...`; services use `IDbContextFactory<AppDbContext>`; user-scoped queries filter by JWT user id.

**Frontend:** Axios instance in `src/api.ts`; feature API wrappers in `src/services/`; types in `src/types/`; route guards via `ProtectedRoute` / `AdminRoute`.

## License

Private / not specified.
