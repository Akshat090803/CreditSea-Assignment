# CreditSea LMS - Backend

This is the Node.js/Express backend for the Loan Management System. It provides secure authentication, role-based access control (RBAC), and manages the core database operations for loan applications and status tracking.

## Environment Variables

Create a `.env` file in the root of the `backend` directory and add the following configuration:

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

## Installation

### Prerequisites

- Node.js v18+
- MongoDB
- Cloudinary account

### Setup

1. Clone the repository:

```bash
git clone https://github.com/Akshat090803/CreditSea-Assignment
```

2. Navigate to the backend directory:

```bash
cd backend
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file using the environment variables shown above.

## Running the Server

```bash
npm run dev
```

The backend server will start at:

```text
http://localhost:5000
```

## Database Seeding

A seed script is provided to create evaluator accounts for all required LMS roles.

Run:

```bash
npx tsx src/seed.ts
```

The seed script creates one account for each required role so the evaluator can immediately test the RBAC functionality.

### Evaluator Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@test.com` | password123 |
| **Sales** | `sales@test.com` | password123 |
| **Sanction** | `sanction@test.com` | password123 |
| **Disbursement** | `disbursement@test.com` | password123 |
| **Collection** | `collection@test.com` | password123 |
| **Borrower** | `borrower@test.com` | password123 |

## Role-Based Access Control

The system supports the following roles:

- **Admin** — Access to all operations modules
- **Sales** — Manages registered borrowers who have not yet applied
- **Sanction** — Reviews and approves/rejects applied loans
- **Disbursement** — Processes sanctioned loans and releases funds
- **Collection** — Records payments for active loans
- **Borrower** — Accesses the borrower application portal

RBAC is enforced on the backend using authentication and role-based middleware. Frontend route protection is also implemented separately.

## Salary Slip Uploads

Borrower salary slips are uploaded to Cloudinary using Multer and `multer-storage-cloudinary`.

Supported formats:

- PDF
- JPG
- JPEG
- PNG

Maximum file size:

```text
5 MB
```

The returned Cloudinary URL is stored with the corresponding loan application.

## Loan Lifecycle

Loans follow the following lifecycle:

```text
APPLIED
   ↓
SANCTIONED
   ↓
DISBURSED
   ↓
CLOSED
```

A loan can also be rejected during the sanction stage:

```text
APPLIED
   ↓
REJECTED
```

The allowed status transitions are enforced by the backend according to the user's role.

## Business Rule Engine (BRE)

Before a borrower can submit a loan application, the backend validates the eligibility rules.

The application is rejected if:

- Age is not between **23 and 50**
- Monthly salary is below **₹25,000**
- PAN does not match the required format
- Employment mode is **Unemployed**

The BRE is enforced on the server so that eligibility cannot be bypassed by manipulating frontend requests.

## Loan Calculation

The interest rate is fixed at **12% per annum**.

Simple interest is calculated using:

```text
SI = (P × R × T) / (365 × 100)
```

Where:

- `P` = Principal loan amount
- `R` = Annual interest rate
- `T` = Tenure in days

Total repayment:

```text
Total Repayment = Principal + Simple Interest
```

## Security

The backend implements:

- JWT-based authentication
- Password hashing using bcrypt
- Role-based authorization
- Protected API routes
- Server-side Business Rule Engine validation


## Project Structure

```text
backend/
├── src/
│   ├── config/
│   │   ├── cloudinary.ts
│   │   └── db.ts
│   │
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── loanController.ts
│   │   ├── paymentController.ts
│   │   └── uploadController.ts
│   │
│   ├── middlewares/
│   │   └── authMiddleware.ts
│   │
│   ├── models/
│   │   ├── User.ts
│   │   ├── Loan.ts
│   │   └── Payment.ts
│   │
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── loanRoutes.ts
│   │   ├── paymentRoutes.ts
│   │   └── uploadRoutes.ts
│   │
│   ├── seed.ts
│   └── server.ts
│
├── .env
├── .env.example
├── package.json
└── tsconfig.json
```

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/auth/register` | Register a borrower |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/uploads` | Upload salary slip |
| `POST` | `/api/loans` | Create loan application |
| `GET` | `/api/loans` | Get loans according to role |
| `PATCH` | `/api/loans/:id/sanction` | Approve/reject a loan |
| `PATCH` | `/api/loans/:id/disburse` | Disburse a sanctioned loan |
| `POST` | `/api/loans/:id/payments` | Record borrower payment |


## License

This project was created as part of the CreditSea Loan Management System assignment.