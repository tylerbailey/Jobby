# Jobby

Jobby is a full-stack job application tracker with a kanban pipeline, calendar, recruiter CRM, AI resume tools, and an admin approval workflow. The stack is **ASP.NET Core 10** (API + SPA host) and **React 19 / Vite / TypeScript**.

## Architecture

```
jobby.client/          React SPA (Vite, Tailwind, shadcn/ui)
Jobby.Server/          ASP.NET Core Web API, EF Core, Identity + JWT
Jobby.Server.Tests/    xUnit tests for shared helpers and constants
```

In development, the Vite dev server runs on `https://localhost:60922` and proxies `/api` to the backend at `https://localhost:7048`. In production, the API serves the built SPA from `jobby.client/dist`.

## Features

| Area | Description |
|------|-------------|
| **Dashboard / Kanban** | Drag-and-drop pipeline of job applications across custom stages |
| **Applications** | Company, title, URL, location, salary, notes, status, archive |
| **Calendar** | Interview and follow-up events tied to applications |
| **Recruiters** | Track recruiter contacts, agencies, and follow-up dates |
| **Resume rating** | Upload a `.docx` resume for ATS-style scoring via Ollama |
| **Resume tailoring** | Paste a job posting + upload `.docx` to generate a tailored resume |
| **Archive** | View and restore archived applications |
| **Admin** | Approve users, manage roles (`User`, `Admin`), edit accounts |

## Authentication

- ASP.NET Core Identity with JWT bearer tokens
- New registrations require admin approval (`IsApproved`) before login succeeds
- Password rules: 8+ chars, uppercase, digit
- Frontend stores token and user in `localStorage`; axios attaches `Authorization: Bearer` on each request

### Roles

- **User** — standard access to own data
- **Admin** — access to `/admin` user management

## API Overview

All routes are under `/api` and require authentication unless noted.

| Controller | Base route | Key endpoints |
|------------|------------|---------------|
| Auth | `/api/auth` | `POST register`, `POST login`, `GET user` |
| App | `/api/app` | `GET all`, `POST new`, `POST update`, `POST move/{id}`, `POST gen`, `GET archive`, `DELETE {id}` |
| Stage | `/api/stage` | `GET pipeline`, `POST new`, `POST update`, `DELETE delete/{id}` |
| Recruiter | `/api/recruiter` | `GET all`, `GET {id}`, `POST new`, `POST update`, `DELETE {id}` |
| Events | `/api/events` | `GET get`, `POST new`, `DELETE delete/{id}` |
| History | `/api/history` | `GET {appId}` |
| Resume | `/api/resume` | `POST review` |
| Admin | `/api/admin` | User and role management |

**Multipart uploads:** `POST /api/app/gen` and `POST /api/resume/review` accept `file` (`.docx`) via `multipart/form-data`. Resume generation also requires a `posting` field.

## AI (Ollama)

Resume features use **Ollama Cloud** through `OllamaSharp`:

- **Tailoring** (`AppService.EditDocxAsync`) — extracts resume blocks from Word, analyzes the job posting, applies targeted edits, returns base64 docx + change list
- **Rating** (`ResumeService.RateResumeAsync`) — extracts text from Word, returns structured JSON analysis

Configure in `appsettings.Development.json` (gitignored):

```json
"Ollama": {
  "ApiKey": "<your-key>",
  "BaseUrl": "https://ollama.com",
  "TextModel": "gpt-oss:120b"
}
```

## Database

- **PostgreSQL** via EF Core (`Npgsql`)
- Migrations run automatically on startup
- Key entities: `JobApp`, `AppStage`, `JobEvent`, `JobHistory`, `Recruiter`, `ApplicationUser`

## Getting Started

### Prerequisites

- .NET 10 SDK
- Node.js 20+
- PostgreSQL connection string in `Jobby.Server/appsettings.Development.json`

### Run locally

1. Start the backend (also launches Vite via SPA proxy):

   ```bash
   cd Jobby.Server
   dotnet run --launch-profile https
   ```

2. Open `https://localhost:60922` (or the URL shown in the console).

3. Register an account, then approve it via an existing admin user or directly in the database.

### Environment (frontend)

`jobby.client/.env.development`:

```
VITE_API_URL=/api
DEV_SERVER_PORT=60922
```

## Testing

### Backend (xUnit)

```bash
dotnet test Jobby.Server.Tests/Jobby.Server.Tests.csproj
```

> If the server is running, stop it first so the build can copy `Jobby.Server.exe`.

### Frontend (Vitest)

```bash
cd jobby.client
npm test
```

## Project Conventions

### Backend

- Controllers use `[ApiController]` + `[Route("api/...")]`
- Services use `IDbContextFactory<AppDbContext>` for scoped database access
- Async methods use the `Async` suffix
- User-scoped operations filter by `userId` from JWT claims

### Frontend

- API calls go through `src/api.ts` (axios instance)
- Feature services live in `src/services/`
- Types in `src/types/`
- Protected routes via `ProtectedRoute`; admin routes via `AdminRoute`
- `AuthProvider` wraps the app once in `App.tsx`

## Recent Cleanup (summary)

- Fixed duplicate `AuthProvider` nesting
- Renamed `RecruitorController` → `RecruiterController` and standardized recruiter service method names
- Added user ownership checks on app update, archive, history, and recruiter update
- Fixed `ArchiveAppAsync` missing `SaveChangesAsync`
- Scoped kanban pipeline stages to the current user
- Fixed `gap-2te` CSS typo and missing React keys in kanban cards
- Renamed `JsonSerializerExtentions.cs` → `JsonHelpers.cs`
- Removed unused SQL Server package reference
- Added initial test projects and this documentation

## License

Private / not specified.
