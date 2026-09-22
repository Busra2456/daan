# Daan — Donate with Trust

Daan is a backend platform that connects verified needy people with donors in a trusted and structured way.

A needy person can create a donation request with detailed information and optional situation media. Admins review and verify requests. Donors can browse verified requests, communicate with needy people, create donations, and complete payments through the integrated payment system.

## User Roles

- **NEEDY** — creates and manages donation requests.
- **DONOR** — views verified requests and makes donations.
- **ADMIN** — verifies or rejects donation requests and moderates the platform.

## Core Workflow

```text
NEEDY creates request
        ↓
PENDING
        ↓
ADMIN reviews
   ↙           ↘
REJECTED      VERIFIED
                 ↓
              DONOR
                 ↓
             DONATION
                 ↓
              PAYMENT
                 ↓
             COMPLETED
```

## Main Features

### Authentication
- Email/password registration
- Email verification with OTP
- Login
- JWT access and refresh tokens
- Get current user
- Forgot password with OTP
- Reset password
- Google login support

### Donation Requests
- Needy users can create donation requests.
- Requests contain title, description, required amount, and optional situation video/audio.
- Needy users can update and delete their own requests.
- Admins can view pending requests.
- Admins can verify or reject requests.
- Donors can view verified donation requests.

### Donations
- Donors can create donations for verified requests.
- Donors can view their donation history.
- Donations track amount, donation status, payment ID, and payment status.

### Payments
- bKash payment creation
- bKash payment execution
- bKash callback handling

### API Documentation
Swagger/OpenAPI documentation is available through:

```text
/api-docs
```

## Tech Stack

- Node.js
- Express.js
- TypeScript
- PostgreSQL
- Prisma ORM
- Redis
- JWT
- Zod
- Nodemailer
- Google Authentication
- Cloudinary
- bKash Payment Gateway
- Swagger/OpenAPI
- Biome
- Vercel

## Project Structure

```text
daan-backend/
├── api/
│   └── index.ts
├── prisma/
│   ├── migrations/
│   └── schema/
├── src/
│   ├── app/
│   │   ├── config/
│   │   ├── docs/
│   │   ├── lib/
│   │   ├── middleware/
│   │   ├── module/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── communication/
│   │   │   ├── donation/
│   │   │   ├── donationRequest/
│   │   │   ├── donor/
│   │   │   └── payment/
│   │   └── utils/
│   ├── generated/
│   ├── app.ts
│   └── server.ts
├── .env
├── prisma.config.ts
├── tsconfig.json
├── package.json
└── vercel.json
```

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

Create a `.env` file and configure the required environment variables.

Then generate the Prisma client:

```bash
npx prisma generate
```

Run the development server:

```bash
npm run dev
```

## Environment Variables

Configure the following categories in `.env` according to your deployment environment:

```env
DATABASE_URL=

PORT=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

REDIS_HOST=
REDIS_PORT=
REDIS_USER=
REDIS_PASSWORD=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

BKASH_BASE_URL=
BKASH_APP_KEY=
BKASH_APP_SECRET=
BKASH_USERNAME=
BKASH_PASSWORD=
BKASH_CALLBACK_URL=
```

> Never commit `.env` or real API credentials to GitHub.

## API Base URL

Production:

```text
https://daan-7z6n.vercel.app/api
```

Health check:

```text
GET /
```

API documentation:

```text
GET /api-docs
```

## Main API Routes

### Authentication

```text
POST /api/auth/register
POST /api/auth/verify-email
POST /api/auth/login
POST /api/auth/google-login
GET  /api/auth/me
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/refresh-token
```

### Donation Requests

```text
POST   /api/donation-requests
GET    /api/donation-requests/:requestId
PATCH  /api/donation-requests/:requestId
DELETE /api/donation-requests/:requestId
```

### Admin

```text
GET   /api/admin/donation-requests/pending
PATCH /api/admin/donation-requests/:requestId/verify
PATCH /api/admin/donation-requests/:requestId/reject
```

### Donor

```text
GET /api/donor/donation-requests
```

### Donations

```text
POST /api/donations
GET  /api/donations/my-donations
```

### Payments

```text
POST /api/payments/:donationId/create
POST /api/payments/:donationId/execute
GET  /api/payments/bkash/callback
```

## Response Format

Successful responses follow a structured format such as:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Request successful",
  "data": {}
}
```

Errors follow a structured format such as:

```json
{
  "success": false,
  "message": "Something went wrong",
  "errors": []
}
```

## Authorization

Protected endpoints use JWT authentication.

The authenticated user's role is checked through RBAC middleware.

Supported roles:

```text
NEEDY
DONOR
ADMIN
```

## Deployment

The backend is deployed on Vercel.

Production URL:

```text
https://daan-7z6n.vercel.app
```

## Development Commands

```bash
npm run dev
npm run build
npm start
npm run format:check
npm run format:fix
npm run lint:check
npm run lint:fix
```

## Important Security Notes

- Do not commit `.env`.
- Do not expose JWT secrets.
- Do not expose bKash credentials.
- Do not expose Google OAuth secrets.
- Do not expose Cloudinary secrets.
- Use sandbox/test credentials while developing payment functionality.

## Project Goal

**Daan — Donate with Trust**

The goal is to make charitable giving more transparent by allowing donors to review verified donation requests and relevant information before providing financial support.
