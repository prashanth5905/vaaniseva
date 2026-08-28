# VaaniSeva

VaaniSeva is a conversational citizen-service portal for discovering government certificate services, submitting applications, uploading documents, and tracking application status. It combines a React frontend with a FastAPI backend and a PostgreSQL database.

> This is a demonstration project. It does not connect to real Aadhaar records or production government systems.

## Features

- Aadhaar-number lookup and OTP-based sign-in
- JWT-authenticated citizen sessions
- Conversational assistant for service guidance
- Income, Residence, Birth, and Community certificate applications
- Document upload and document listing
- Application status tracking
- Officer dashboard for approving or rejecting applications
- Generated certificate downloads for approved applications
- Persistent chat sessions and message history

## Architecture

```text
React + Vite + Tailwind CSS
          |
          | HTTP / JSON
          v
FastAPI + Pydantic + SQLAlchemy
          |
          v
PostgreSQL
```

The backend also uses Alembic for database migrations, ReportLab for certificate generation, and Google Gemini for AI-assisted chat responses. Uploaded documents and generated certificates are stored in the backend filesystem during local development.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Tailwind CSS, Axios, Lucide React |
| Backend | FastAPI, Pydantic Settings, Uvicorn |
| Persistence | PostgreSQL, SQLAlchemy, Alembic |
| Authentication | OTP verification and JWT bearer tokens |
| AI | Google Gemini API |
| Files | Multipart uploads, local storage, ReportLab-generated PDFs |

## Project Structure

```text
vaaniseva/
├── backend/
│   ├── app/
│   │   ├── api/routes/       # HTTP endpoints
│   │   ├── core/             # Settings and security
│   │   ├── models/           # SQLAlchemy models
│   │   ├── repositories/     # Database access
│   │   ├── schemas/          # Pydantic request/response models
│   │   └── services/         # Application, chat, OTP, and certificate logic
│   ├── alembic/              # Database migrations
│   ├── certificates/         # Generated certificate files
│   ├── uploads/documents/    # Uploaded documents
│   └── tests/
├── docs/screenshots/         # README screenshots
└── frontend/src/
    ├── api/                  # Axios client
    ├── components/           # Shared UI components
    ├── layouts/              # Citizen, officer, and auth layouts
    ├── pages/                # Application screens
    └── services/             # Frontend API services
```

## Requirements

- Python 3.13 or a compatible recent Python version
- Node.js and npm
- PostgreSQL
- A Google Gemini API key for AI-assisted chat

## Configuration

Create `backend/.env` with local values. The backend expects these settings:

```env
APP_NAME=VaaniSeva API
APP_VERSION=0.1.0
API_V1_PREFIX=/api/v1
OTP_SECRET_KEY=replace-with-a-local-secret
DATABASE_URL=postgresql+psycopg://user:password@localhost:5432/vaaniseva
JWT_SECRET_KEY=replace-with-a-local-secret
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
GEMINI_API_KEY=replace-with-your-gemini-key
```

Do not commit real credentials or production secrets. The frontend uses `http://127.0.0.1:8000/api/v1` by default. To point it elsewhere, create `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1
```

## Run Locally

### 1. Start the backend

From the repository root:

```powershell
cd backend
python -m venv .venv
.\\.venv\\Scripts\\Activate.ps1
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

The API is available at `http://127.0.0.1:8000`. FastAPI documentation is available at `/docs`.

### 2. Start the frontend

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually `http://localhost:5173`.

### 3. Optional seed data

The backend includes a citizen seed script:

```powershell
cd backend
python scripts/seed_citizens.py
```

## Main Screens

| Route | Screen |
| --- | --- |
| `/` | Aadhaar and OTP sign-in |
| `/chat` | VaaniSeva conversational assistant |
| `/dashboard` | Citizen dashboard |
| `/apply` | Certificate application form |
| `/documents` | Uploaded documents |
| `/applications` | Application list and statuses |
| `/applications/:id` | Application details and certificate download |
| `/admin` | Officer application dashboard |
| `/admin/applications/:id` | Officer application review |

## API Overview

The backend exposes REST endpoints under `/api/v1`:

| Area | Example endpoints |
| --- | --- |
| Health | `GET /system/health` |
| Citizen and auth | `POST /citizens/lookup`, `POST /otp/request`, `POST /otp/verify`, `GET /auth/me` |
| Profile | `GET /profile` |
| Applications | `POST /applications`, `GET /applications`, `GET /applications/{application_id}` |
| Certificates | `GET /applications/{application_id}/certificate` |
| Documents | `POST /documents/upload`, `GET /documents`, `GET /documents/{document_id}/download` |
| Chat | `POST /chat`, `POST /chat/apply`, `POST /chat/message`, `GET /chat/sessions` |
| Administration | `GET /admin/applications`, `POST /admin/applications/{application_id}/approve`, `POST /admin/applications/{application_id}/reject` |

## Tests and Checks

Run the existing backend test file from the repository root:

```powershell
cd backend
pytest
```

Frontend checks are available through the package scripts:

```powershell
cd frontend
npm run lint
npm run build
```

## Screenshots

Store README screenshots in `docs/screenshots/`. The current six screenshot files use these names:

| Filename | Page shown |
| --- | --- |
| `login.png` | Aadhaar and OTP sign-in |
| `chat.png` | Conversational assistant |
| `apply.png` | Certificate application |
| `applications.png` | Application tracker |
| `admin.png` | Officer review dashboard |
| `certificate.png` | Approved certificate download |

![Login](docs/screenshots/login.jpg)
![OTP verification](docs/screenshots/otp.jpg)


![Conversational assistant](docs/screenshots/chat.jpg)

![Certificate application](docs/screenshots/apply.jpg)

![Application tracker](docs/screenshots/applications.jpg)

![Officer review dashboard](docs/screenshots/admin.jpg)

![Approved certificate download](docs/screenshots/certificate.jpg)

Copy the attached Document Centre screenshot to `docs/screenshots/documents.png` when adding it to the repository. The other current screenshots already use the documented names, so no rename is required for them.

## Notes

- Database schema changes live in `backend/alembic/versions/`.
- Local uploads are written to `backend/uploads/documents/`.
- Generated certificates are written to `backend/certificates/`.
- The `/phone` frontend route is a development-only OTP display.
