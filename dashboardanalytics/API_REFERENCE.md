# API Reference

Complete API documentation for Dashboard Analytics.

## Base URL

```
Development: http://localhost:3000/api
Production: https://yourdomain.com/api
```

## Authentication

All protected endpoints require authentication via NextAuth session cookie.

### Headers

```
Content-Type: application/json
Cookie: next-auth.session-token=<token>
```

## Rate Limiting

All endpoints include rate limit headers:

```
X-RateLimit-Remaining: 58
X-RateLimit-Reset: 2024-01-15T10:30:00.000Z
Retry-After: 45 (only on 429 responses)
```

---

## Authentication Endpoints

### Sign Up

Create a new user account.

**Endpoint**: `POST /api/auth/signup`

**Rate Limit**: 3 requests per hour

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "SecurePass123"
}
```

**Success Response** (201):
```json
{
  "message": "Account created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "role": "viewer"
  }
}
```

**Error Responses**:
- `400` - Validation error
- `429` - Rate limit exceeded

---

### Forgot Password

Request a password reset link.

**Endpoint**: `POST /api/auth/forgot-password`

**Rate Limit**: 3 requests per hour

**Request Body**:
```json
{
  "email": "john@example.com"
}
```

**Success Response** (200):
```json
{
  "message": "If an account exists with that email, a password reset link has been sent."
}
```

**Notes**:
- Always returns success to prevent email enumeration
- Reset link expires in 1 hour
- Token is single-use only

---

### Verify Reset Token

Check if a password reset token is valid.

**Endpoint**: `GET /api/auth/reset-password?token={token}`

**Rate Limit**: 60 requests per minute

**Success Response** (200):
```json
{
  "valid": true
}
```

**Error Response** (400):
```json
{
  "valid": false,
  "error": "Invalid or expired reset token"
}
```

---

### Reset Password

Reset password using a valid token.

**Endpoint**: `POST /api/auth/reset-password`

**Rate Limit**: 3 requests per hour

**Request Body**:
```json
{
  "token": "a1b2c3d4e5f6...",
  "password": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Success Response** (200):
```json
{
  "message": "Password has been reset successfully"
}
```

**Error Responses**:
- `400` - Invalid token or validation error
- `429` - Rate limit exceeded

---


## Analytics Endpoints

### Get Overview Analytics

Get dashboard overview metrics.

**Endpoint**: `GET /api/analytics`

**Authentication**: Required

**Query Parameters**:
- `period` (optional): `today` | `week` | `month` | `quarter` | `year`

**Example Request**:
```
GET /api/analytics?period=month
```

**Success Response** (200):
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
  },
  "period": "month"
}
```

---

### Get Sales Analytics

Get detailed sales data and metrics.

**Endpoint**: `GET /api/analytics/sales`

**Authentication**: Required

**Query Parameters**:
- `period` (optional): `today` | `week` | `month` | `quarter` | `year`
- `region` (optional): Filter by region name
- `startDate` (optional): YYYY-MM-DD format
- `endDate` (optional): YYYY-MM-DD format
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Example Request**:
```
GET /api/analytics/sales?period=month&region=North&page=1&limit=20
```

**Success Response** (200):
```json
{
  "sales": [
    {
      "id": "507f1f77bcf86cd799439011",
      "product": "Product A",
      "amount": 1500,
      "quantity": 3,
      "region": "North",
      "category": "Electronics",
      "date": "2024-01-15T10:30:00Z",
      "status": "completed"
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
    "averageOrderValue": 278,
    "topProduct": "Product A",
    "topRegion": "North"
  }
}
```

---

### Get Marketing Metrics

Get marketing campaign performance data.

**Endpoint**: `GET /api/analytics/marketing`

**Authentication**: Required

**Query Parameters**:
- `startDate` (optional): YYYY-MM-DD format
- `endDate` (optional): YYYY-MM-DD format
- `campaignId` (optional): Filter by specific campaign

**Example Request**:
```
GET /api/analytics/marketing?startDate=2024-01-01&endDate=2024-01-31
```

**Success Response** (200):
```json
{
  "campaigns": [
    {
      "id": "campaign_123",
      "name": "Summer Sale 2024",
      "channel": "social_media",
      "impressions": 50000,
      "clicks": 2500,
      "conversions": 125,
      "cost": 5000,
      "revenue": 15000,
      "roi": 200,
      "ctr": 5.0,
      "conversionRate": 5.0,
      "startDate": "2024-01-01",
      "endDate": "2024-01-31"
    }
  ],
  "summary": {
    "totalImpressions": 150000,
    "totalClicks": 7500,
    "totalConversions": 375,
    "totalCost": 15000,
    "totalRevenue": 45000,
    "averageCTR": 5.0,
    "averageROI": 180,
    "bestPerformingCampaign": "Summer Sale 2024"
  }
}
```

---

### Get Client Insights

Get client acquisition and retention metrics.

**Endpoint**: `GET /api/analytics/clients`

**Authentication**: Required

**Query Parameters**:
- `startDate` (optional): YYYY-MM-DD format
- `endDate` (optional): YYYY-MM-DD format
- `campaign` (optional): Filter by acquisition campaign

**Example Request**:
```
GET /api/analytics/clients?startDate=2024-01-01&endDate=2024-01-31
```

**Success Response** (200):
```json
{
  "clients": [
    {
      "id": "client_456",
      "name": "Acme Corporation",
      "industry": "Technology",
      "totalSpent": 25000,
      "lastPurchase": "2024-01-15T10:30:00Z",
      "acquisitionDate": "2023-06-01T00:00:00Z",
      "status": "active",
      "lifetimeValue": 50000,
      "purchaseCount": 12
    }
  ],
  "summary": {
    "totalClients": 89,
    "activeClients": 67,
    "newClients": 12,
    "churnedClients": 5,
    "churnRate": 2.5,
    "averageLifetimeValue": 15000,
    "retentionRate": 75.3
  }
}
```

---

### Get Financial Reports

Get financial data and profit analysis.

**Endpoint**: `GET /api/analytics/financial`

**Authentication**: Required

**Query Parameters**:
- `period` (optional): `daily` | `monthly` | `quarterly` | `yearly` (default: monthly)
- `startDate` (optional): YYYY-MM-DD format
- `endDate` (optional): YYYY-MM-DD format

**Example Request**:
```
GET /api/analytics/financial?period=monthly&startDate=2024-01-01&endDate=2024-12-31
```

**Success Response** (200):
```json
{
  "data": [
    {
      "period": "2024-01",
      "revenue": 125000,
      "expenses": 75000,
      "profit": 50000,
      "margin": 40,
      "date": "2024-01-01T00:00:00Z"
    }
  ],
  "summary": {
    "totalRevenue": 1500000,
    "totalExpenses": 900000,
    "totalProfit": 600000,
    "averageMargin": 40,
    "bestMonth": "2024-03",
    "worstMonth": "2024-07"
  }
}
```

---


## User Endpoints

### Get User Profile

Get current authenticated user's profile.

**Endpoint**: `GET /api/user/profile`

**Authentication**: Required

**Success Response** (200):
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "role": "analyst",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

---

### Update User Profile

Update current user's profile information.

**Endpoint**: `PUT /api/user/profile`

**Authentication**: Required

**Request Body**:
```json
{
  "name": "John Smith",
  "email": "john.smith@example.com"
}
```

**Success Response** (200):
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Smith",
    "email": "john.smith@example.com",
    "username": "johndoe",
    "role": "analyst"
  }
}
```

**Error Responses**:
- `400` - Validation error
- `401` - Not authenticated
- `409` - Email already in use

---

### Change Password

Change current user's password.

**Endpoint**: `POST /api/user/password`

**Authentication**: Required

**Request Body**:
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123",
  "confirmPassword": "NewPassword123"
}
```

**Success Response** (200):
```json
{
  "message": "Password changed successfully"
}
```

**Error Responses**:
- `400` - Validation error or passwords don't match
- `401` - Current password incorrect
- `401` - Not authenticated

---

## Settings Endpoints

### Get User Settings

Get current user's settings.

**Endpoint**: `GET /api/settings`

**Authentication**: Required

**Success Response** (200):
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

### Update User Settings

Update user settings (partial update supported).

**Endpoint**: `PUT /api/settings`

**Authentication**: Required

**Request Body**:
```json
{
  "general": {
    "companyName": "New Company Name",
    "timezone": "America/Los_Angeles"
  },
  "security": {
    "twoFactorEnabled": true,
    "sessionTimeout": 60
  },
  "notifications": {
    "emailNotifications": false
  }
}
```

**Success Response** (200):
```json
{
  "message": "Settings updated successfully",
  "settings": {
    "general": { /* updated settings */ },
    "security": { /* updated settings */ },
    "notifications": { /* updated settings */ }
  }
}
```

---

## Admin Endpoints

All admin endpoints require `admin` role.

### List All Users

Get paginated list of all users.

**Endpoint**: `GET /api/admin/users`

**Authentication**: Required (Admin only)

**Query Parameters**:
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)
- `search` (optional): Search by name, email, or username
- `role` (optional): Filter by role

**Example Request**:
```
GET /api/admin/users?page=1&limit=20&search=john&role=analyst
```

**Success Response** (200):
```json
{
  "users": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "username": "johndoe",
      "role": "analyst",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastLogin": "2024-01-15T10:30:00Z"
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

**Error Responses**:
- `401` - Not authenticated
- `403` - Insufficient permissions

---

### Create User

Create a new user (Admin only).

**Endpoint**: `POST /api/admin/users`

**Authentication**: Required (Admin only)

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

**Success Response** (201):
```json
{
  "message": "User created successfully",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "username": "janedoe",
    "role": "analyst",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses**:
- `400` - Validation error
- `401` - Not authenticated
- `403` - Insufficient permissions
- `409` - Email or username already exists

---

### Update User

Update user information (Admin only).

**Endpoint**: `PUT /api/admin/users/:id`

**Authentication**: Required (Admin only)

**Request Body**:
```json
{
  "name": "Jane Smith",
  "email": "jane.smith@example.com",
  "role": "admin"
}
```

**Success Response** (200):
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "role": "admin"
  }
}
```

**Error Responses**:
- `400` - Validation error
- `401` - Not authenticated
- `403` - Insufficient permissions
- `404` - User not found

---

### Delete User

Delete a user (Admin only).

**Endpoint**: `DELETE /api/admin/users/:id`

**Authentication**: Required (Admin only)

**Success Response** (200):
```json
{
  "message": "User deleted successfully"
}
```

**Error Responses**:
- `401` - Not authenticated
- `403` - Insufficient permissions or cannot delete self
- `404` - User not found

---

## AI Endpoints

### Get AI Suggestions

Get AI-powered suggestions based on data context.

**Endpoint**: `POST /api/ai/suggest`

**Authentication**: Required

**Request Body**:
```json
{
  "context": "Sales data for Q1 2024 showing 15% growth",
  "dataType": "sales"
}
```

**Success Response** (200):
```json
{
  "suggestions": [
    "Focus marketing efforts on North region - showing 25% growth potential",
    "Product X shows declining trend - investigate supply chain or quality issues",
    "Weekend sales are 30% lower - consider weekend promotions",
    "Customer retention in Q1 improved by 12% - maintain current strategies"
  ],
  "confidence": 0.85,
  "generatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses**:
- `400` - Invalid context or data type
- `401` - Not authenticated
- `500` - AI service error

---

### Summarize Data

Get AI-generated summary of analytics data.

**Endpoint**: `POST /api/ai/summarise`

**Authentication**: Required

**Request Body**:
```json
{
  "data": {
    "totalRevenue": 125000,
    "totalSales": 450,
    "topProduct": "Product A",
    "topRegion": "North"
  },
  "reportType": "sales"
}
```

**Success Response** (200):
```json
{
  "summary": "Sales performance in the analyzed period shows strong growth with total revenue of $125,000 from 450 transactions. Product A emerged as the top performer, while the North region led in sales volume. Overall trends indicate healthy business growth with opportunities for expansion in underperforming regions.",
  "keyInsights": [
    "Top performing product: Product A with 35% of total sales",
    "Highest revenue region: North with $45,000",
    "Peak sales day: Friday with 25% higher volume",
    "Average order value increased by 12% compared to previous period"
  ],
  "recommendations": [
    "Increase inventory for Product A to meet demand",
    "Replicate North region strategies in other areas",
    "Consider Friday-specific promotions to maximize peak day performance"
  ],
  "generatedAt": "2024-01-15T10:30:00Z"
}
```

---

## Reports Endpoints

### Generate Report

Generate a custom report.

**Endpoint**: `POST /api/reports/generate`

**Authentication**: Required (Analyst or Admin)

**Request Body**:
```json
{
  "type": "sales",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "format": "pdf",
  "includeCharts": true,
  "sections": ["summary", "trends", "breakdown"]
}
```

**Success Response** (200):
```json
{
  "reportId": "report_789",
  "downloadUrl": "/api/reports/download/report_789",
  "expiresAt": "2024-01-16T10:30:00Z",
  "status": "completed"
}
```

---

### Download Report

Download a generated report.

**Endpoint**: `GET /api/reports/download/:reportId`

**Authentication**: Required

**Success Response** (200):
- Content-Type: application/pdf or application/json
- File download

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message",
  "code": "VALIDATION_ERROR",
  "details": {
    "field": "email",
    "message": "Invalid email format"
  }
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions",
  "code": "FORBIDDEN"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found",
  "code": "NOT_FOUND"
}
```

### 429 Too Many Requests
```json
{
  "error": "Rate limit exceeded. Please try again later.",
  "code": "RATE_LIMIT_EXCEEDED"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "code": "INTERNAL_ERROR"
}
```

---

## Pagination

Paginated endpoints return this structure:

```json
{
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Date Formats

All dates should be in ISO 8601 format:
- Date only: `YYYY-MM-DD` (e.g., `2024-01-15`)
- Date and time: `YYYY-MM-DDTHH:mm:ss.sssZ` (e.g., `2024-01-15T10:30:00.000Z`)

---

## Testing

Use these tools to test the API:

### cURL Example
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","username":"testuser","password":"TestPass123"}'
```

### Postman Collection
Import the Postman collection from `/docs/postman_collection.json`

---

**Last Updated**: January 2024
**API Version**: 1.0.0
