# Dashboard Analytics - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Architecture](#architecture)
6. [Features](#features)
7. [API Documentation](#api-documentation)
8. [Database Models](#database-models)
9. [Authentication & Authorization](#authentication--authorization)
10. [Security](#security)
11. [Deployment](#deployment)
12. [Contributing](#contributing)

---

## Project Overview

**Dashboard Analytics** is a full-stack analytics dashboard application built with Next.js 15, React 19, and TypeScript. It provides comprehensive business intelligence features including sales analytics, marketing metrics, client insights, and financial reporting with role-based access control.

### Key Features

- 🔐 **Authentication System** - Secure login, signup, and password reset
- 👥 **Role-Based Access Control** - Admin, Analyst, and Viewer roles
- 📊 **Analytics Dashboards** - Sales, Marketing, Clients, Financial
- 🎨 **Modern UI** - Responsive design with Tailwind CSS
- 🔍 **Command Palette** - Keyboard-first navigation (⌘K)
- 🔔 **Notification System** - Real-time alerts and updates
- 📤 **Export Functionality** - CSV and JSON data exports
- 🛡️ **Rate Limiting** - API protection against abuse
- ✅ **Input Validation** - Comprehensive Zod schemas
- 🎯 **Error Handling** - Global error boundaries and custom pages

### Demo Credentials

```
Admin Account:
Email: admin@example.com
Password: admin123

Analyst Account:
Email: analyst@example.com
Password: analyst123

Viewer Account:
Email: viewer@example.com
Password: viewer123
```

---

## Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Utility-first styling
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **React Query** - Server state management
- **Redux Toolkit** - Client state management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication solution
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **Zod** - Schema validation
- **bcrypt** - Password hashing

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Static type checking
- **tsx** - TypeScript execution
- **nodemon** - Development server

### External Services
- **Google Gemini AI** - AI-powered suggestions
- **NodeCache** - In-memory caching

---


## Project Structure

```
dashboardanalytics/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── api/                  # API Routes
│   │   │   ├── analytics/        # Analytics endpoints
│   │   │   ├── auth/             # Authentication endpoints
│   │   │   ├── reports/          # Report generation
│   │   │   ├── settings/         # Settings management
│   │   │   └── user/             # User management
│   │   ├── auth/                 # Authentication pages
│   │   │   ├── signin/           # Sign in page
│   │   │   ├── signup/           # Sign up page
│   │   │   ├── forgot-password/  # Password reset request
│   │   │   └── reset-password/   # Password reset form
│   │   ├── dashboard/            # Dashboard pages
│   │   │   ├── admin/            # Admin panel
│   │   │   ├── sales/            # Sales analytics
│   │   │   ├── marketing/        # Marketing metrics
│   │   │   ├── clients/          # Client insights
│   │   │   ├── financial/        # Financial reports
│   │   │   ├── profile/          # User profile
│   │   │   └── settings/         # User settings
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Landing page
│   │   ├── error.tsx             # Error page
│   │   └── not-found.tsx         # 404 page
│   ├── components/               # React components
│   │   ├── dashboard/            # Dashboard-specific components
│   │   ├── layout/               # Layout components
│   │   │   ├── Header.tsx        # Top navigation
│   │   │   ├── Sidebar.tsx       # Side navigation
│   │   │   └── UserMenu.tsx      # User dropdown menu
│   │   └── ui/                   # Reusable UI components
│   │       ├── CommandPalette.tsx
│   │       ├── NotificationDropdown.tsx
│   │       └── ExportButton.tsx
│   ├── hooks/                    # Custom React hooks
│   │   ├── usePermissions.ts     # Permission checking
│   │   └── useNotifications.ts   # Notification management
│   ├── lib/                      # Utility libraries
│   │   ├── db.ts                 # Database connection
│   │   ├── rate-limiter.ts       # Rate limiting logic
│   │   ├── validations.ts        # Zod schemas
│   │   ├── permissions.ts        # Permission definitions
│   │   ├── error-handler.ts      # Error handling
│   │   └── gemini.ts             # AI integration
│   ├── middleware/               # Middleware functions
│   │   ├── auth.middleware.ts    # Auth middleware
│   │   └── rateLimitMiddleware.ts
│   ├── models/                   # Mongoose models
│   │   ├── User.ts               # User model
│   │   ├── PasswordReset.ts      # Password reset tokens
│   │   ├── Sale.ts               # Sales data
│   │   ├── MarketingMetric.ts    # Marketing data
│   │   ├── ClientInsights.ts     # Client data
│   │   ├── Financial.ts          # Financial data
│   │   └── Settings.ts           # User settings
│   ├── scripts/                  # Utility scripts
│   │   ├── create-admin.ts       # Create admin user
│   │   ├── seed.ts               # Seed database
│   │   ├── test-password-reset.ts
│   │   └── test-rate-limit.ts
│   ├── services/                 # Business logic
│   │   ├── ai.service.ts         # AI operations
│   │   ├── analytics.service.ts  # Analytics logic
│   │   └── reports.service.ts    # Report generation
│   ├── types/                    # TypeScript types
│   │   ├── next-auth.d.ts        # NextAuth types
│   │   ├── analytics.d.ts        # Analytics types
│   │   └── reports.d.ts          # Report types
│   └── utils/                    # Helper functions
│       ├── dateHelpers.ts        # Date utilities
│       ├── aggregations.ts       # Data aggregation
│       └── fakerHelpers.ts       # Mock data generation
├── public/                       # Static assets
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── next.config.ts                # Next.js config
└── README.md                     # Project readme
```

---


## Getting Started

### Prerequisites

- Node.js 20.x or higher
- MongoDB 6.x or higher
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dashboardanalytics
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/dashboardanalytics
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   
   # Google Gemini AI (Optional)
   GEMINI_API_KEY=your-gemini-api-key
   ```

4. **Start MongoDB**
   ```bash
   # Using MongoDB service
   mongod
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```

6. **Create admin user**
   ```bash
   npm run create-admin
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
npm run create-admin # Create admin user
```

### Testing Scripts

```bash
npx tsx src/scripts/test-password-reset.ts  # Test password reset
npx tsx src/scripts/test-rate-limit.ts      # Test rate limiting
```

---


## Architecture

### Application Flow

```
User Request
    ↓
Next.js Middleware (src/middleware.ts)
    ↓
Authentication Check (NextAuth)
    ↓
Rate Limiting (if API route)
    ↓
Route Handler (Page or API)
    ↓
Business Logic (Services)
    ↓
Database (MongoDB via Mongoose)
    ↓
Response
```

### Authentication Flow

```
1. User submits credentials
2. NextAuth validates against MongoDB
3. JWT token generated
4. Session stored in cookie
5. Protected routes check session
6. Role-based permissions applied
```

### Data Flow

```
Client Component
    ↓
React Query / Axios
    ↓
API Route (/api/*)
    ↓
Validation (Zod)
    ↓
Service Layer
    ↓
Mongoose Model
    ↓
MongoDB
```

### State Management

- **Server State**: React Query (TanStack Query)
- **Client State**: Redux Toolkit
- **Form State**: React useState
- **Session State**: NextAuth

---


## Features

### 1. Authentication System

**Location**: `src/app/auth/`

#### Sign In
- Email/password authentication
- Session management with JWT
- Remember me functionality
- Error handling with user feedback

#### Sign Up
- User registration with validation
- Password strength requirements
- Duplicate email/username checking
- Rate limiting (3 signups/hour)

#### Password Reset
- Forgot password flow
- Secure token generation (32-byte random)
- Token expiration (1 hour)
- Email notification (console log in dev)
- Rate limiting (3 requests/hour)

**Files**:
- `src/app/auth/signin/page.tsx`
- `src/app/auth/signup/page.tsx`
- `src/app/auth/forgot-password/page.tsx`
- `src/app/auth/reset-password/page.tsx`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/auth/signup/route.ts`
- `src/app/api/auth/forgot-password/route.ts`
- `src/app/api/auth/reset-password/route.ts`

---

### 2. Role-Based Access Control (RBAC)

**Location**: `src/lib/permissions.ts`, `src/hooks/usePermissions.ts`

#### Roles

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all features, user management, system settings |
| **Analyst** | View and export all analytics, create reports, no user management |
| **Viewer** | View-only access to dashboards, no exports or modifications |

#### Permission Checks

```typescript
// Component level
const { hasPermission } = usePermissions();
if (hasPermission('EXPORT_DATA')) {
  // Show export button
}

// API level
import { checkPermission } from '@/lib/permissions';
if (!checkPermission(session.user.role, 'MANAGE_USERS')) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

#### Available Permissions

- `VIEW_DASHBOARD` - View analytics dashboards
- `EXPORT_DATA` - Export data to CSV/JSON
- `MANAGE_USERS` - Create, edit, delete users
- `MANAGE_SETTINGS` - Modify system settings
- `VIEW_REPORTS` - Access reports
- `CREATE_REPORTS` - Generate new reports
- `DELETE_DATA` - Remove data records

---

### 3. Dashboard Pages

#### Main Dashboard (`/dashboard`)
- Overview metrics
- Quick stats cards
- Recent activity
- Navigation to sub-dashboards

#### Sales Dashboard (`/dashboard/sales`)
- Revenue trends
- Sales by region
- Product performance
- Time-based filtering
- Export functionality

#### Marketing Dashboard (`/dashboard/marketing`)
- Campaign performance
- Conversion rates
- ROI metrics
- Channel analysis
- Date range filtering

#### Clients Dashboard (`/dashboard/clients`)
- Client acquisition
- Retention metrics
- Lifetime value
- Segmentation analysis

#### Financial Dashboard (`/dashboard/financial`)
- Revenue vs expenses
- Profit margins
- Cash flow analysis
- Period comparisons

**Files**:
- `src/app/dashboard/page.tsx`
- `src/app/dashboard/sales/page.tsx`
- `src/app/dashboard/marketing/page.tsx`
- `src/app/dashboard/clients/page.tsx`
- `src/app/dashboard/financial/page.tsx`

---

### 4. Admin Panel

**Location**: `src/app/dashboard/admin/`

#### User Management
- View all users
- Create new users
- Edit user details
- Change user roles
- Delete users
- Search and filter

**Files**:
- `src/app/dashboard/admin/page.tsx`
- `src/app/dashboard/admin/users/page.tsx`

---

### 5. Profile Management

**Location**: `src/app/dashboard/profile/`

#### Features
- View profile information
- Update name and email
- Change password
- Password strength validation
- Success/error notifications

**API Endpoints**:
- `GET/PUT /api/user/profile` - Profile operations
- `POST /api/user/password` - Password change

**Files**:
- `src/app/dashboard/profile/page.tsx`
- `src/app/api/user/profile/route.ts`
- `src/app/api/user/password/route.ts`

---

### 6. Settings Management

**Location**: `src/app/dashboard/settings/`

#### Settings Categories

**General Settings**
- Company name
- Timezone
- Date format
- Currency
- Language

**Security Settings**
- Two-factor authentication
- Session timeout
- Password expiry
- Login notifications

**Notification Settings**
- Email notifications
- Push notifications
- Weekly reports
- Alert thresholds

**Files**:
- `src/app/dashboard/settings/page.tsx`
- `src/app/api/settings/route.ts`

---

### 7. Command Palette

**Location**: `src/components/ui/CommandPalette.tsx`

#### Features
- Keyboard shortcut: `⌘K` (Mac) or `Ctrl+K` (Windows)
- Fuzzy search
- Quick navigation
- Keyboard navigation (arrow keys)
- Role-based command filtering

#### Available Commands
- Navigate to dashboards
- Access settings
- View profile
- Admin functions (admin only)
- Sign out

---

### 8. Notification System

**Location**: `src/components/ui/NotificationDropdown.tsx`

#### Features
- Real-time notifications
- Notification types: info, success, warning, error
- Mark as read
- Clear all notifications
- Notification count badge

**Hook**: `src/hooks/useNotifications.ts`

---

### 9. Export Functionality

**Location**: `src/components/ui/ExportButton.tsx`

#### Features
- Export to CSV
- Export to JSON
- Role-based access (Analyst and Admin only)
- Rate limiting (5 exports/minute)

---

### 10. Rate Limiting

**Location**: `src/lib/rate-limiter.ts`

#### Protected Endpoints

| Endpoint | Limit | Window |
|----------|-------|--------|
| Login | 5 requests | 15 minutes |
| Signup | 3 requests | 1 hour |
| Password Reset | 3 requests | 1 hour |
| General API | 60 requests | 1 minute |
| Export | 5 requests | 1 minute |

#### Response Headers
- `X-RateLimit-Remaining` - Requests remaining
- `X-RateLimit-Reset` - Reset timestamp
- `Retry-After` - Seconds until reset

**Documentation**: `RATE_LIMITING_GUIDE.md`

---

### 11. Error Handling

#### Global Error Boundary
**Location**: `src/components/ErrorBoundary.tsx`

Catches React errors and displays user-friendly message.

#### Error Pages
- `src/app/error.tsx` - Global error page
- `src/app/not-found.tsx` - 404 page
- `src/app/auth/error/page.tsx` - Auth errors

#### API Error Handling
**Location**: `src/lib/error-handler.ts`

Standardized error responses with proper HTTP status codes.

---

### 12. Input Validation

**Location**: `src/lib/validations.ts`

#### Zod Schemas

All API endpoints use Zod for validation:
- `analyticsQuerySchema` - Analytics queries
- `salesQuerySchema` - Sales filters
- `marketingQuerySchema` - Marketing filters
- `forgotPasswordSchema` - Password reset request
- `resetPasswordSchema` - Password reset
- `signupSchema` - User registration
- `updateProfileSchema` - Profile updates
- `changePasswordSchema` - Password change

---


## API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Create a new user account.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Response** (201):
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "role": "viewer"
  }
}
```

**Rate Limit**: 3 requests per hour

---

#### POST `/api/auth/forgot-password`
Request password reset link.

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Response** (200):
```json
{
  "message": "If an account exists with that email, a password reset link has been sent."
}
```

**Rate Limit**: 3 requests per hour

---

#### GET `/api/auth/reset-password?token={token}`
Verify password reset token.

**Response** (200):
```json
{
  "valid": true
}
```

---

#### POST `/api/auth/reset-password`
Reset password with token.

**Request Body**:
```json
{
  "token": "reset_token",
  "password": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

**Response** (200):
```json
{
  "message": "Password has been reset successfully"
}
```

**Rate Limit**: 3 requests per hour

---

### Analytics Endpoints

#### GET `/api/analytics`
Get overview analytics.

**Query Parameters**:
- `period` (optional): `today`, `week`, `month`, `quarter`, `year`

**Response** (200):
```json
{
  "totalRevenue": 125000,
  "totalSales": 450,
  "activeClients": 89,
  "conversionRate": 3.2,
  "trends": {
    "revenue": 12.5,
    "sales": 8.3,
    "clients": 5.1
  }
}
```

---

#### GET `/api/analytics/sales`
Get sales analytics.

**Query Parameters**:
- `period` (optional): `today`, `week`, `month`, `quarter`, `year`
- `region` (optional): Filter by region
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response** (200):
```json
{
  "sales": [
    {
      "id": "sale_id",
      "product": "Product Name",
      "amount": 1500,
      "region": "North",
      "date": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 450,
    "pages": 23
  },
  "summary": {
    "totalRevenue": 125000,
    "totalSales": 450,
    "averageOrderValue": 278
  }
}
```

---

#### GET `/api/analytics/marketing`
Get marketing metrics.

**Query Parameters**:
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD
- `campaignId` (optional): Filter by campaign

**Response** (200):
```json
{
  "campaigns": [
    {
      "id": "campaign_id",
      "name": "Summer Sale",
      "impressions": 50000,
      "clicks": 2500,
      "conversions": 125,
      "cost": 5000,
      "revenue": 15000,
      "roi": 200
    }
  ],
  "summary": {
    "totalImpressions": 150000,
    "totalClicks": 7500,
    "totalConversions": 375,
    "averageCTR": 5.0,
    "averageROI": 180
  }
}
```

---

#### GET `/api/analytics/clients`
Get client insights.

**Query Parameters**:
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD
- `campaign` (optional): Filter by campaign

**Response** (200):
```json
{
  "clients": [
    {
      "id": "client_id",
      "name": "Acme Corp",
      "totalSpent": 25000,
      "lastPurchase": "2024-01-15T10:30:00Z",
      "status": "active"
    }
  ],
  "summary": {
    "totalClients": 89,
    "activeClients": 67,
    "newClients": 12,
    "churnRate": 2.5,
    "averageLifetimeValue": 15000
  }
}
```

---

#### GET `/api/analytics/financial`
Get financial reports.

**Query Parameters**:
- `period` (optional): `daily`, `monthly`, `quarterly`, `yearly`
- `startDate` (optional): YYYY-MM-DD
- `endDate` (optional): YYYY-MM-DD

**Response** (200):
```json
{
  "data": [
    {
      "period": "2024-01",
      "revenue": 125000,
      "expenses": 75000,
      "profit": 50000,
      "margin": 40
    }
  ],
  "summary": {
    "totalRevenue": 1500000,
    "totalExpenses": 900000,
    "totalProfit": 600000,
    "averageMargin": 40
  }
}
```

---

### User Endpoints

#### GET `/api/user/profile`
Get current user profile.

**Response** (200):
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "role": "analyst",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

---

#### PUT `/api/user/profile`
Update user profile.

**Request Body**:
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Response** (200):
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "user_id",
    "name": "John Smith",
    "email": "john.smith@example.com"
  }
}
```

---

#### POST `/api/user/password`
Change user password.

**Request Body**:
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

**Response** (200):
```json
{
  "message": "Password changed successfully"
}
```

---

### Settings Endpoints

#### GET `/api/settings`
Get user settings.

**Response** (200):
```json
{
  "general": {
    "companyName": "Acme Corp",
    "timezone": "America/New_York",
    "dateFormat": "MM/DD/YYYY",
    "currency": "USD",
    "language": "en"
  },
  "security": {
    "twoFactorEnabled": false,
    "sessionTimeout": 30,
    "passwordExpiry": 90,
    "loginNotifications": true
  },
  "notifications": {
    "emailNotifications": true,
    "pushNotifications": false,
    "weeklyReports": true,
    "alertThreshold": 80
  }
}
```

---

#### PUT `/api/settings`
Update user settings.

**Request Body**:
```json
{
  "general": {
    "companyName": "New Company Name",
    "timezone": "America/Los_Angeles"
  },
  "security": {
    "twoFactorEnabled": true
  }
}
```

**Response** (200):
```json
{
  "message": "Settings updated successfully"
}
```

---

### Admin Endpoints

#### GET `/api/admin/users`
Get all users (Admin only).

**Query Parameters**:
- `page` (optional): Page number
- `limit` (optional): Items per page
- `search` (optional): Search query

**Response** (200):
```json
{
  "users": [
    {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "analyst",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "pages": 3
  }
}
```

---

#### POST `/api/admin/users`
Create new user (Admin only).

**Request Body**:
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "username": "janedoe",
  "password": "SecurePass123",
  "role": "analyst"
}
```

**Response** (201):
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "analyst"
  }
}
```

---

#### PUT `/api/admin/users/:id`
Update user (Admin only).

**Request Body**:
```json
{
  "name": "Jane Smith",
  "role": "admin"
}
```

**Response** (200):
```json
{
  "message": "User updated successfully"
}
```

---

#### DELETE `/api/admin/users/:id`
Delete user (Admin only).

**Response** (200):
```json
{
  "message": "User deleted successfully"
}
```

---

### Reports Endpoints

#### POST `/api/reports/generate`
Generate custom report.

**Request Body**:
```json
{
  "type": "sales",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "format": "pdf",
  "includeCharts": true
}
```

**Response** (200):
```json
{
  "reportId": "report_id",
  "downloadUrl": "/api/reports/download/report_id",
  "expiresAt": "2024-01-15T10:30:00Z"
}
```

---

### AI Endpoints

#### POST `/api/ai/suggest`
Get AI-powered suggestions.

**Request Body**:
```json
{
  "context": "Sales data for Q1 2024",
  "dataType": "sales"
}
```

**Response** (200):
```json
{
  "suggestions": [
    "Focus on North region - 25% growth potential",
    "Product X shows declining trend - investigate",
    "Weekend sales are 30% lower - consider promotions"
  ]
}
```

---

#### POST `/api/ai/summarise`
Get AI summary of data.

**Request Body**:
```json
{
  "data": { /* analytics data */ },
  "reportType": "sales"
}
```

**Response** (200):
```json
{
  "summary": "Sales increased by 15% compared to last quarter...",
  "keyInsights": [
    "Top performing product: Product X",
    "Highest revenue region: North",
    "Peak sales day: Friday"
  ]
}
```

---


## Database Models

### User Model

**Location**: `src/models/User.ts`

```typescript
{
  name: String,              // User's full name
  email: String,             // Unique email address
  username: String,          // Unique username
  passwordHash: String,      // Bcrypt hashed password
  role: String,              // 'admin' | 'analyst' | 'viewer'
  mfaEnabled: Boolean,       // Two-factor auth status
  recoveryEmail: String,     // Recovery email
  createdAt: Date,           // Auto-generated
  updatedAt: Date            // Auto-generated
}
```

**Indexes**:
- `email` (unique)
- `username` (unique)

---

### PasswordReset Model

**Location**: `src/models/PasswordReset.ts`

```typescript
{
  userId: ObjectId,          // Reference to User
  token: String,             // Unique reset token
  expiresAt: Date,           // Expiration timestamp
  used: Boolean,             // Whether token has been used
  createdAt: Date            // Auto-generated
}
```

**Indexes**:
- `token` (unique)
- `expiresAt` (TTL index for auto-cleanup)

---

### Sale Model

**Location**: `src/models/Sale.ts`

```typescript
{
  product: String,           // Product name
  amount: Number,            // Sale amount
  quantity: Number,          // Quantity sold
  region: String,            // Geographic region
  category: String,          // Product category
  date: Date,                // Sale date
  customerId: String,        // Customer identifier
  status: String,            // 'completed' | 'pending' | 'cancelled'
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `date`
- `region`
- `category`

---

### MarketingMetric Model

**Location**: `src/models/MarketingMetric.ts`

```typescript
{
  campaignId: String,        // Campaign identifier
  campaignName: String,      // Campaign name
  channel: String,           // Marketing channel
  impressions: Number,       // Ad impressions
  clicks: Number,            // Click count
  conversions: Number,       // Conversion count
  cost: Number,              // Campaign cost
  revenue: Number,           // Generated revenue
  date: Date,                // Metric date
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `campaignId`
- `date`
- `channel`

---

### ClientInsights Model

**Location**: `src/models/ClientInsights.ts`

```typescript
{
  clientId: String,          // Client identifier
  clientName: String,        // Client name
  industry: String,          // Industry sector
  totalSpent: Number,        // Total spending
  lastPurchase: Date,        // Last purchase date
  status: String,            // 'active' | 'inactive' | 'churned'
  acquisitionDate: Date,     // When client was acquired
  lifetimeValue: Number,     // Customer lifetime value
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `clientId` (unique)
- `status`
- `lastPurchase`

---

### Financial Model

**Location**: `src/models/Financial.ts`

```typescript
{
  period: String,            // Time period (YYYY-MM)
  revenue: Number,           // Total revenue
  expenses: Number,          // Total expenses
  profit: Number,            // Net profit
  margin: Number,            // Profit margin %
  category: String,          // Financial category
  date: Date,                // Period date
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `period`
- `date`
- `category`

---

### Settings Model

**Location**: `src/models/Settings.ts`

```typescript
{
  userId: ObjectId,          // Reference to User
  general: {
    companyName: String,
    timezone: String,
    dateFormat: String,
    currency: String,
    language: String
  },
  security: {
    twoFactorEnabled: Boolean,
    sessionTimeout: Number,
    passwordExpiry: Number,
    loginNotifications: Boolean
  },
  notifications: {
    emailNotifications: Boolean,
    pushNotifications: Boolean,
    weeklyReports: Boolean,
    alertThreshold: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:
- `userId` (unique)

---

### AiSuggestion Model

**Location**: `src/models/AiSuggestion.ts`

```typescript
{
  userId: ObjectId,          // Reference to User
  context: String,           // Context provided
  dataType: String,          // Type of data analyzed
  suggestions: [String],     // AI suggestions
  createdAt: Date
}
```

**Indexes**:
- `userId`
- `createdAt`

---


## Authentication & Authorization

### NextAuth Configuration

**Location**: `src/app/api/auth/[...nextauth]/route.ts`

#### Session Strategy
- **Type**: JWT (JSON Web Token)
- **Max Age**: 30 days
- **Storage**: HTTP-only cookie

#### Credentials Provider

```typescript
{
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" }
  },
  authorize: async (credentials) => {
    // 1. Validate credentials
    // 2. Find user in database
    // 3. Verify password with bcrypt
    // 4. Return user object or null
  }
}
```

#### Callbacks

**JWT Callback**:
```typescript
async jwt({ token, user }) {
  if (user) {
    token.id = user.id;
    token.role = user.role;
  }
  return token;
}
```

**Session Callback**:
```typescript
async session({ session, token }) {
  if (session.user) {
    session.user.id = token.id;
    session.user.role = token.role;
  }
  return session;
}
```

---

### Protected Routes

**Middleware**: `src/middleware.ts`

```typescript
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/analytics/:path*',
    '/api/user/:path*',
    '/api/settings/:path*',
    '/api/admin/:path*'
  ]
};
```

#### Route Protection Flow

1. Request to protected route
2. Middleware checks for session
3. If no session → redirect to `/auth/signin`
4. If session exists → allow access
5. Role-based checks in components/APIs

---

### Permission System

**Location**: `src/lib/permissions.ts`

#### Permission Definitions

```typescript
export const PERMISSIONS = {
  VIEW_DASHBOARD: ['admin', 'analyst', 'viewer'],
  EXPORT_DATA: ['admin', 'analyst'],
  MANAGE_USERS: ['admin'],
  MANAGE_SETTINGS: ['admin'],
  VIEW_REPORTS: ['admin', 'analyst', 'viewer'],
  CREATE_REPORTS: ['admin', 'analyst'],
  DELETE_DATA: ['admin']
};
```

#### Check Permission

```typescript
export function checkPermission(
  userRole: string,
  permission: keyof typeof PERMISSIONS
): boolean {
  return PERMISSIONS[permission]?.includes(userRole) || false;
}
```

#### Usage in Components

```typescript
import { usePermissions } from '@/hooks/usePermissions';

function MyComponent() {
  const { hasPermission } = usePermissions();
  
  return (
    <>
      {hasPermission('EXPORT_DATA') && (
        <ExportButton />
      )}
    </>
  );
}
```

#### Usage in API Routes

```typescript
import { checkPermission } from '@/lib/permissions';
import { getServerSession } from 'next-auth';

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!checkPermission(session.user.role, 'DELETE_DATA')) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }
  
  // Proceed with deletion
}
```

---

### Password Security

#### Hashing
- **Algorithm**: bcrypt
- **Rounds**: 12
- **Salt**: Auto-generated per password

#### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

#### Password Reset Security
- Cryptographically secure tokens (32 bytes)
- One-time use tokens
- 1-hour expiration
- Tokens stored hashed in database
- Rate limiting (3 requests/hour)

---


## Security

### Rate Limiting

**Location**: `src/lib/rate-limiter.ts`

#### Implementation
- **Storage**: NodeCache (in-memory)
- **Production**: Redis recommended for distributed systems
- **Identifier**: IP address or User ID
- **Headers**: X-RateLimit-Remaining, X-RateLimit-Reset, Retry-After

#### Rate Limits

| Endpoint Type | Limit | Window | Purpose |
|--------------|-------|--------|---------|
| Login | 5 requests | 15 min | Prevent brute force |
| Signup | 3 requests | 1 hour | Prevent spam accounts |
| Password Reset | 3 requests | 1 hour | Prevent abuse |
| General API | 60 requests | 1 min | API protection |
| Export | 5 requests | 1 min | Resource protection |
| Admin API | 100 requests | 1 min | Relaxed for admins |

#### Usage

```typescript
import { applyRateLimit, RATE_LIMITS } from '@/lib/rate-limiter';

const rateLimitResult = await applyRateLimit(
  request,
  RATE_LIMITS.API_GENERAL,
  'rl:endpoint-name'
);

if (!rateLimitResult.success) {
  return NextResponse.json(
    { error: rateLimitResult.error },
    { status: 429, headers: rateLimitResult.headers }
  );
}
```

**Documentation**: See `RATE_LIMITING_GUIDE.md` for details

---

### Input Validation

**Location**: `src/lib/validations.ts`

#### Validation Strategy
- **Library**: Zod
- **Where**: All API endpoints
- **When**: Before processing any user input

#### Example Schema

```typescript
export const salesQuerySchema = z.object({
  period: z.enum(['today', 'week', 'month', 'quarter', 'year']).optional(),
  region: z.string().max(100).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20)
});
```

#### Validation Helper

```typescript
import { validateRequestBody } from '@/lib/validations';

const validation = validateRequestBody(body, schema);
if (!validation.success) {
  return NextResponse.json(
    { error: validation.error },
    { status: 400 }
  );
}
```

---

### Data Sanitization

**Location**: `src/lib/sanitize.ts`

#### Sanitization Functions
- Remove HTML tags
- Escape special characters
- Trim whitespace
- Normalize unicode

#### Usage

```typescript
import { sanitizeInput } from '@/lib/sanitize';

const cleanData = sanitizeInput(userInput);
```

---

### Error Handling

**Location**: `src/lib/error-handler.ts`

#### Error Types
- **ValidationError** (400) - Invalid input
- **AuthenticationError** (401) - Not authenticated
- **AuthorizationError** (403) - Insufficient permissions
- **NotFoundError** (404) - Resource not found
- **RateLimitError** (429) - Too many requests
- **ServerError** (500) - Internal error

#### Error Response Format

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": { /* optional */ }
}
```

---

### Security Headers

**Location**: `next.config.ts`

```typescript
{
  headers: [
    {
      key: 'X-Frame-Options',
      value: 'DENY'
    },
    {
      key: 'X-Content-Type-Options',
      value: 'nosniff'
    },
    {
      key: 'Referrer-Policy',
      value: 'strict-origin-when-cross-origin'
    },
    {
      key: 'Permissions-Policy',
      value: 'camera=(), microphone=(), geolocation=()'
    }
  ]
}
```

---

### Environment Variables

**Location**: `.env`

#### Required Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/dashboardanalytics

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-minimum-32-characters

# Optional
GEMINI_API_KEY=your-gemini-api-key
```

#### Security Best Practices
- Never commit `.env` to version control
- Use different secrets for each environment
- Rotate secrets regularly
- Use strong, random values for secrets
- Minimum 32 characters for NEXTAUTH_SECRET

---

### CORS Configuration

**Location**: API routes

```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization'
};
```

---

### Session Security

#### Cookie Configuration
- **HttpOnly**: true (prevents XSS)
- **Secure**: true in production (HTTPS only)
- **SameSite**: 'lax' (CSRF protection)
- **Max Age**: 30 days

#### Session Validation
- Validate on every request
- Check expiration
- Verify signature
- Refresh when needed

---

### Database Security

#### Connection Security
- Use connection string with authentication
- Enable SSL/TLS in production
- Limit database user permissions
- Use read-only users where possible

#### Query Security
- Use Mongoose for query building
- Parameterized queries (no string concatenation)
- Input validation before queries
- Limit query results

---

### Logging & Monitoring

**Location**: `src/lib/logger.ts`

#### What to Log
- Authentication attempts
- Authorization failures
- Rate limit violations
- API errors
- Database errors
- Security events

#### What NOT to Log
- Passwords
- Tokens
- Personal data
- Credit card numbers
- API keys

#### Log Format

```typescript
{
  timestamp: '2024-01-15T10:30:00Z',
  level: 'error',
  message: 'Failed login attempt',
  userId: 'user_id',
  ip: '192.168.1.1',
  userAgent: 'Mozilla/5.0...'
}
```

---


## Deployment

### Production Checklist

#### 1. Environment Setup

```env
# Production .env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<strong-random-secret-min-32-chars>
GEMINI_API_KEY=<your-api-key>
```

#### 2. Database Setup

**MongoDB Atlas** (Recommended):
1. Create cluster at mongodb.com/cloud/atlas
2. Configure network access (whitelist IPs)
3. Create database user
4. Get connection string
5. Update MONGODB_URI in .env

**Self-Hosted MongoDB**:
1. Install MongoDB 6.x+
2. Enable authentication
3. Create database and user
4. Configure firewall rules
5. Enable SSL/TLS

#### 3. Build Application

```bash
# Install dependencies
npm install --production

# Build for production
npm run build

# Test production build locally
npm start
```

#### 4. Security Hardening

- [ ] Set strong NEXTAUTH_SECRET (min 32 chars)
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set secure cookie flags
- [ ] Enable rate limiting
- [ ] Configure CSP headers
- [ ] Set up monitoring
- [ ] Enable error tracking
- [ ] Configure backups
- [ ] Review environment variables

---

### Deployment Platforms

#### Vercel (Recommended)

**Pros**: Zero-config, automatic HTTPS, global CDN, serverless

**Steps**:
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Configuration**: `vercel.json`
```json
{
  "env": {
    "MONGODB_URI": "@mongodb-uri",
    "NEXTAUTH_SECRET": "@nextauth-secret"
  }
}
```

---

#### Netlify

**Steps**:
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables
5. Deploy

---

#### AWS (EC2 + RDS)

**Architecture**:
- EC2 instance for Next.js app
- MongoDB Atlas or DocumentDB
- CloudFront for CDN
- Route 53 for DNS
- ALB for load balancing

**Steps**:
1. Launch EC2 instance (t3.medium recommended)
2. Install Node.js 20+
3. Clone repository
4. Install dependencies
5. Build application
6. Set up PM2 for process management
7. Configure nginx as reverse proxy
8. Set up SSL with Let's Encrypt

**PM2 Configuration**:
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "dashboard" -- start

# Save PM2 configuration
pm2 save

# Set up auto-restart on reboot
pm2 startup
```

**Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

#### Docker

**Dockerfile**:
```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=${MONGODB_URI}
      - NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
      - NEXTAUTH_URL=${NEXTAUTH_URL}
    depends_on:
      - mongodb
  
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password

volumes:
  mongodb_data:
```

**Deploy**:
```bash
docker-compose up -d
```

---

### Performance Optimization

#### 1. Image Optimization
- Use Next.js Image component
- Serve WebP format
- Implement lazy loading
- Use CDN for static assets

#### 2. Code Splitting
- Dynamic imports for large components
- Route-based code splitting (automatic)
- Lazy load charts and heavy libraries

#### 3. Caching Strategy
```typescript
// API Route caching
export const revalidate = 60; // Revalidate every 60 seconds

// Static page generation
export const dynamic = 'force-static';
```

#### 4. Database Optimization
- Add indexes on frequently queried fields
- Use aggregation pipelines
- Implement pagination
- Cache frequent queries

#### 5. Bundle Size
```bash
# Analyze bundle
npm run build
npx @next/bundle-analyzer
```

---

### Monitoring & Logging

#### Error Tracking

**Sentry Integration**:
```bash
npm install @sentry/nextjs
```

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

#### Performance Monitoring

**Vercel Analytics**:
```bash
npm install @vercel/analytics
```

```typescript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### Application Monitoring

**Recommended Tools**:
- **Sentry** - Error tracking
- **DataDog** - APM and logs
- **New Relic** - Performance monitoring
- **LogRocket** - Session replay
- **Vercel Analytics** - Web vitals

---

### Backup Strategy

#### Database Backups

**MongoDB Atlas**:
- Automatic continuous backups
- Point-in-time recovery
- Configurable retention

**Self-Hosted**:
```bash
# Daily backup script
mongodump --uri="mongodb://localhost:27017/dashboardanalytics" \
  --out="/backups/$(date +%Y%m%d)"

# Restore from backup
mongorestore --uri="mongodb://localhost:27017/dashboardanalytics" \
  /backups/20240115
```

#### Application Backups
- Version control (Git)
- Environment variables backup
- Configuration files backup
- Regular testing of restore process

---

### CI/CD Pipeline

**GitHub Actions** (`.github/workflows/deploy.yml`):
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

### Scaling Considerations

#### Horizontal Scaling
- Deploy multiple instances
- Use load balancer
- Implement Redis for rate limiting
- Use Redis for session storage

#### Database Scaling
- MongoDB replica sets
- Sharding for large datasets
- Read replicas for analytics
- Connection pooling

#### Caching Layer
- Redis for API responses
- CDN for static assets
- Browser caching headers
- Service worker for offline

---


## Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Create a Pull Request**

---

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug in component
docs: update documentation
style: format code
refactor: refactor function
test: add tests
chore: update dependencies
```

---

### Code Style

#### TypeScript
- Use TypeScript for all new code
- Define interfaces for data structures
- Avoid `any` type
- Use strict mode

#### React
- Use functional components
- Use hooks for state management
- Keep components small and focused
- Extract reusable logic to custom hooks

#### Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **Functions**: camelCase (`getUserData()`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Files**: kebab-case for utilities (`date-helpers.ts`)

---

### Testing

#### Unit Tests
```bash
npm test
```

#### Integration Tests
```bash
npm run test:integration
```

#### E2E Tests
```bash
npm run test:e2e
```

---

### Documentation

- Update README.md for user-facing changes
- Update DOCUMENTATION.md for technical changes
- Add JSDoc comments for complex functions
- Update API documentation for endpoint changes

---

## Troubleshooting

### Common Issues

#### 1. Database Connection Failed

**Error**: `MongooseError: Could not connect to MongoDB`

**Solutions**:
- Check MONGODB_URI in .env
- Verify MongoDB is running
- Check network connectivity
- Verify credentials
- Check firewall rules

---

#### 2. Authentication Not Working

**Error**: `[next-auth][error][SIGNIN_ERROR]`

**Solutions**:
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain
- Clear browser cookies
- Check user exists in database
- Verify password is correct

---

#### 3. Rate Limiting Issues

**Error**: `429 Too Many Requests`

**Solutions**:
- Wait for rate limit window to reset
- Check rate limit configuration
- Verify IP address detection
- Clear NodeCache if needed
- Consider increasing limits for development

---

#### 4. Build Errors

**Error**: `Type error: Cannot find module`

**Solutions**:
- Run `npm install`
- Delete `.next` folder and rebuild
- Check TypeScript configuration
- Verify import paths
- Check for circular dependencies

---

#### 5. Environment Variables Not Loading

**Error**: `undefined` for environment variables

**Solutions**:
- Restart development server
- Check .env file exists
- Verify variable names (no typos)
- Check .env is not in .gitignore
- Use NEXT_PUBLIC_ prefix for client-side variables

---

### Debug Mode

Enable debug logging:

```env
# .env
DEBUG=true
LOG_LEVEL=debug
```

Check logs:
```bash
# Development
npm run dev

# Production
pm2 logs dashboard
```

---

## Additional Resources

### Documentation Files

- `README.md` - Project overview and quick start
- `DOCUMENTATION.md` - This file (complete documentation)
- `RATE_LIMITING_GUIDE.md` - Rate limiting implementation
- `RATE_LIMITING_SUMMARY.md` - Quick rate limiting reference
- `COMMAND_PALETTE.md` - Command palette usage
- `VALIDATION.md` - Input validation guide
- `FIXES.md` - Bug fixes and solutions

### External Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Zod Documentation](https://zod.dev)

---

## License

This project is licensed under the MIT License.

---

## Support

For issues, questions, or contributions:
- Create an issue on GitHub
- Submit a pull request
- Contact the maintainers

---

## Changelog

### Version 1.0.0 (Current)

**Features**:
- ✅ Complete authentication system
- ✅ Role-based access control
- ✅ Password reset functionality
- ✅ Rate limiting
- ✅ Analytics dashboards (Sales, Marketing, Clients, Financial)
- ✅ Admin panel with user management
- ✅ Profile management
- ✅ Settings management
- ✅ Command palette
- ✅ Notification system
- ✅ Export functionality
- ✅ Error handling
- ✅ Input validation
- ✅ AI-powered suggestions (Gemini)

**Security**:
- ✅ bcrypt password hashing
- ✅ JWT session management
- ✅ Rate limiting on critical endpoints
- ✅ Input validation with Zod
- ✅ CSRF protection
- ✅ Secure password reset tokens

**Performance**:
- ✅ Server-side rendering
- ✅ API route optimization
- ✅ Database indexing
- ✅ Caching strategy

---

## Acknowledgments

Built with:
- Next.js 15
- React 19
- TypeScript
- MongoDB
- Tailwind CSS
- NextAuth.js
- And many other amazing open-source libraries

---

**Last Updated**: January 2024

**Version**: 1.0.0

**Maintained By**: Dashboard Analytics Team

---

