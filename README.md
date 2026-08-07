# VaaniSeva — Conversational Citizen Service Assistant

VaaniSeva is a digital citizen-service assistant that simplifies government certificate applications through a familiar WhatsApp-style chat experience. It is designed to make essential public services easier to access for citizens with limited technical knowledge.

## 1. Project Overview

VaaniSeva combines a React-based citizen portal with a FastAPI backend to support secure login, certificate applications, document handling, application tracking, and administrative review. The conversational interface guides citizens toward the right service using clear language and action-oriented buttons.

## 2. Problem Statement

Government-service portals can be difficult to navigate for first-time and less technically confident users. Citizens often need to understand which certificate to choose, what documents are required, and where to track their application. These multi-step processes can create friction and reduce access to essential services.

## 3. Solution

VaaniSeva provides a guided, mobile-friendly service journey. Citizens authenticate with Aadhaar-based OTP verification, use a simple chat assistant to explore services, receive certificate-specific document guidance, and are directed to relevant application, document, and tracking screens. Administrative users can review applications, approve or reject requests, and enable certificate downloads.

## 4. Features

- Aadhaar-based login with OTP verification
- Citizen profile access and management
- WhatsApp-style conversational chat interface
- Guided certificate selection and document guidance
- Applications for Income, Residence, Birth, and Community certificates
- Document upload and secure document viewing
- Citizen application tracking and status visibility
- Admin review dashboard for application processing
- Application approval and rejection workflow
- Generated certificate download for approved applications
- Persistent client-side chat history for a continuous conversation experience

## 5. System Architecture

```text
┌───────────────────────────────────────────────────────────┐
│ React + Vite + Tailwind CSS                                │
│ Citizen portal, chat assistant, applications, documents,   │
│ and admin dashboard                                        │
└──────────────────────────┬────────────────────────────────┘
                           │ HTTP / JSON
                           ▼
┌───────────────────────────────────────────────────────────┐
│ FastAPI Backend                                            │
│ OTP authentication, citizen profile, applications,         │
│ documents, certificates, chat, and admin workflows         │
└──────────────────────────┬────────────────────────────────┘
                           │ SQLAlchemy ORM
                           ▼
┌───────────────────────────────────────────────────────────┐
│ PostgreSQL                                                 │
│ Citizens, OTP records, applications, documents, chat data, │
│ and certificate metadata                                   │
└───────────────────────────────────────────────────────────┘
```

Document uploads and generated certificate files are stored by the backend and served through authenticated application workflows.

## 6. Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, Tailwind CSS, Axios |
| Backend | FastAPI, Pydantic, Uvicorn |
| Database | PostgreSQL, SQLAlchemy, Alembic |
| Authentication | Aadhaar-based OTP flow and JWT access tokens |
| File Handling | FastAPI uploads and file responses |

## 7. Application Workflow

1. A citizen enters an Aadhaar number and requests an OTP.
2. After OTP verification, the backend issues an access token and the citizen enters the chat assistant.
3. The assistant helps the citizen find applications, upload/view documents, or select a certificate.
4. For a selected certificate, the assistant presents the required documents and opens the preselected application form.
5. The citizen submits the application and can monitor its status in **My Applications**.
6. An administrator reviews the request and approves or rejects it.
7. For approved requests, the citizen can download the generated certificate.

## 8. Screenshots

Add project screenshots here when preparing the portfolio or deployment documentation.

| Screen | Placeholder |
| --- | --- |
| Aadhaar OTP Login | `docs/screenshots/login.png` |
| Citizen Chat Assistant | `docs/screenshots/chat.png` |
| Certificate Application | `docs/screenshots/apply-service.png` |
| My Applications | `docs/screenshots/my-applications.png` |
| Admin Review Dashboard | `docs/screenshots/admin-dashboard.png` |

## 9. API Overview

The FastAPI backend exposes versioned REST endpoints under `/api/v1`.

| Area | Example endpoints | Responsibility |
| --- | --- | --- |
| OTP Authentication | `POST /otp/request`, `POST /otp/verify` | Request and verify Aadhaar-linked OTPs; issue access tokens |
| Profile | `GET /profile` | Retrieve the authenticated citizen profile |
| Applications | `POST /applications`, `GET /applications`, `GET /applications/{id}` | Create and track certificate applications |
| Certificates | `GET /applications/{id}/certificate` | Download an available certificate |
| Documents | `POST /documents/upload`, `GET /documents`, `GET /documents/{id}/download` | Upload, list, and view documents |
| Administration | `/admin/*` | Review, approve, reject, and manage applications |
| Chat | `/chat/*` | Support chat session and message operations |

## 10. Future Improvements

- Multilingual text and voice interactions for broader accessibility
- Real-time application notifications through SMS, WhatsApp, or email
- Stronger role-based access controls and audit logging
- OCR-based document validation and completeness checks
- Integrated payment support for paid public services
- Analytics dashboard for service demand and processing performance
- Deployment automation, monitoring, and production-grade file storage

> VaaniSeva is a demonstration project. It does not connect to real Aadhaar records or production government systems.
