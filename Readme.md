# CreditSea LMS

This project is a full-stack Loan Management System built for the CreditSea assignment. It includes a Next.js frontend for borrower and role-based operations, along with a Node.js/Express backend for authentication, authorization, loan workflows, and business validation.

This file gives a combined overview of both applications. For more detailed implementation notes, please refer to the respective README files inside each folder:

- Frontend details: `frontend/README.md`
- Backend details: `backend/README.md`

## Overview

The system supports a complete loan lifecycle from borrower registration to application submission, review, disbursement, and collections.

### Core functionality

- Multi-step borrower loan application
- Client-side eligibility validation
- Salary slip upload
- Loan amount and tenure configuration
- Live repayment calculation
- Role-based operations dashboard
- RBAC-based authorization
- Protected routes and secure backend validation

## Tech Stack

### Frontend

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Zustand
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- JWT authentication
- Cloudinary for salary slip upload
- Role-based access control

## Project Structure

```text
CreditSea_Assignment/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   ├── .gitignore
│   ├── next.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── backend/
│   ├── src/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   └── README.md
│
├── README.md
└── .gitignore
```

## Prerequisites

Before running the project, ensure that the following are installed:

- Node.js v18+
- npm
- MongoDB
- Cloudinary account
- Git

## Frontend Setup

### Environment Variables

Create a `.env.local` file inside `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Install and Run

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```text
http://localhost:3000
```

## Backend Setup

### Environment Variables

Create a `.env` file inside `backend/`:

```env
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary Credentials
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Install and Run

```bash
cd backend
npm install
npm run dev
```

Backend runs at:

```text
http://localhost:5000
```

## Seed Data

The backend includes a seed script to create evaluator accounts for all system roles.

Run:

```bash
cd backend
npx tsx src/seed.ts
```

### Default evaluator credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@test.com` | `password123` |
| Sales | `sales@test.com` | `password123` |
| Sanction | `sanction@test.com` | `password123` |
| Disbursement | `disbursement@test.com` | `password123` |
| Collection | `collection@test.com` | `password123` |
| Borrower | `borrower@test.com` | `password123` |

## Supported Roles

- Admin — full access to modules
- Sales — lead tracking and borrower management
- Sanction — loan review and approval/rejection
- Disbursement — fund release and disbursement workflow
- Collection — payment tracking and collections
- Borrower — loan application portal

## Application Flow

```text
Register / Login
      ↓
Personal Details
      ↓
Eligibility Check
      ↓
Salary Slip Upload
      ↓
Loan Configuration
      ↓
Apply
      ↓
Application Submitted
```

## Business Rules

The backend enforces server-side validation before a borrower can submit a loan application. A loan application is rejected if:

- Age is outside 23 to 50
- Monthly salary is below ₹25,000
- PAN format is invalid
- Employment mode is Unemployed

## Loan Lifecycle

```text
APPLIED
   ↓
SANCTIONED
   ↓
DISBURSED
   ↓
CLOSED
```

A loan may also be rejected:

```text
APPLIED
   ↓
REJECTED
```

## Loan Calculation

Interest rate is fixed at 12% per annum.

Simple interest formula:

```text
SI = (P × R × T) / (365 × 100)
```

Where:

- P = Principal amount
- R = Annual interest rate
- T = Tenure in days

Total repayment = Principal + Simple Interest

## Salary Slip Uploads

Borrower salary slips are uploaded to Cloudinary. Supported formats include:

- PDF
- JPG
- JPEG
- PNG

Max upload size:

```text
5 MB
```

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register borrower |
| POST | `/api/auth/login` | Login |
| POST | `/api/uploads` | Upload salary slip |
| POST | `/api/loans` | Create loan application |
| GET | `/api/loans` | Get loans by role |
| PATCH | `/api/loans/:id/sanction` | Approve or reject loan |
| PATCH | `/api/loans/:id/disburse` | Disburse sanctioned loan |
| POST | `/api/loans/:id/payments` | Record payment |

## Security

The backend uses:

- JWT-based authentication
- bcrypt password hashing
- middleware-based role authorization
- protected API routes
- server-side business rule validation

## Notes

- Frontend route protection is implemented separately from backend authorization.
- Zustand is used for application and auth state management.
- Axios is used for API communication.


## Detailed Readme Files

For more in-depth instructions, architecture details, and role-specific behavior, please refer to:

- `frontend/README.md`
- `backend/README.md`

## License

This project was created as part of the CreditSea Loan Management System assignment.

## Contact

For support or questions, contact the project maintainer or assignment owner.
