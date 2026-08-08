# CreditSea LMS - Frontend

Frontend application for the Loan Management System built with Next.js and TypeScript.

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS & shadcn/ui**
- **Zustand** for state management
- **Axios** for API communication

## Key Features

- Multi-step Borrower Loan Application
- Client-side eligibility validation
- Salary slip upload
- Loan amount & tenure configuration
- Live repayment calculation
- Role-based Operations Dashboard
- Responsive UI
- Protected routes based on user role

## Folder Structure

```text
frontend/
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   └── vercel.svg
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (borrower)/
│   │   │   ├── apply/
│   │   │   └── borrower-success/
│   │   ├── dashboard/
│   │   │   ├── admin/
│   │   │   ├── sales/
│   │   │   ├── sanction/
│   │   │   ├── disbursement/
│   │   │   ├── collection/
│   │   │   └── layout.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   └── ui/
│   │
│   ├── lib/
│   │   ├── axios.ts
│   │   └── utils.ts
│   │
│   └── store/
│       ├── applicationStore.ts
│       └── authStore.ts
│
├── .env.example
├── .gitignore
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## Environment Variables

Create `.env.local` in the root of the `frontend` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Akshat090803/CreditSea-Assignment
```

2. Navigate to the backend directory:

```bash
cd frontend
```

3. Install dependencies:

```bash
npm install
```

## Running the Application

Start the development server:

```bash
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

Make sure the backend server is also running at:

```text
http://localhost:5000
```

## Supported Roles

- **Admin** — All modules
- **Sales** — Lead tracking
- **Sanction** — Loan approval/rejection
- **Disbursement** — Loan disbursement
- **Collection** — Payment collection
- **Borrower** — Loan application portal

## Application Flow

```text
Register/Login
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

## Development Notes

- Zustand manages application and authentication state.
- Axios communicates with the backend API.
- Frontend RBAC is combined with backend authorization.
- Salary slips are uploaded through the backend and stored using Cloudinary.
- The UI is responsive, simple, and user-friendly.