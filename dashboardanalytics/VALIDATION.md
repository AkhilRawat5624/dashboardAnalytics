# Input Validation & Security

This document describes the input validation and security measures implemented in the Dashboard Analytics application.

## Overview

All API endpoints now include comprehensive input validation using **Zod** schemas to ensure data integrity and prevent security vulnerabilities.

## Validation Features

### 1. Query Parameter Validation

All GET endpoints validate query parameters:

```typescript
// Example: /api/analytics?period=month
const validation = validateQueryParams(searchParams, analyticsQuerySchema);
if (!validation.success) {
  return NextResponse.json(
    { success: false, message: `Validation error: ${validation.error}` },
    { status: 400 }
  );
}
```

### 2. Request Body Validation

All POST/PUT endpoints validate request bodies:

```typescript
// Example: POST /api/settings
const validation = validateRequestBody(body, updateSettingsSchema);
if (!validation.success) {
  return NextResponse.json(
    { success: false, message: `Validation error: ${validation.error}` },
    { status: 400 }
  );
}
```

### 3. Environment Variable Validation

Environment variables are validated at startup:

```typescript
import { env } from '@/lib/env';
// Throws error if required env vars are missing
```

## Validation Schemas

### Analytics
- `period`: enum ['today', 'week', 'month', 'quarter', 'year']

### Sales
- `page`: positive integer (default: 1)
- `limit`: positive integer, max 100 (default: 20)
- `region`: string, max 100 chars
- `startDate`: date string (YYYY-MM-DD) or ISO datetime
- `endDate`: date string (YYYY-MM-DD) or ISO datetime

### Marketing
- `startDate`: date string (YYYY-MM-DD) or ISO datetime
- `endDate`: date string (YYYY-MM-DD) or ISO datetime
- `campaignId`: string, max 100 chars

### Financial
- `period`: enum ['daily', 'monthly', 'quarterly', 'yearly']
- `startDate`: date string (YYYY-MM-DD) or ISO datetime
- `endDate`: date string (YYYY-MM-DD) or ISO datetime

### Settings
- `userId`: string, 1-100 chars (default: 'default-user')
- `companyName`: string, 1-200 chars
- `timezone`: string, max 50 chars
- `currency`: string, exactly 3 chars (ISO 4217)
- `language`: string, exactly 2 chars (ISO 639-1)
- `sessionTimeout`: integer, 5-1440 minutes
- `passwordExpiry`: integer, 0-365 days
- `alertThreshold`: integer, 0-100

### AI Endpoints
- `type`: enum ['sales', 'marketing', 'financial', 'client', 'general']
- `period`: enum ['daily', 'weekly', 'monthly']
- `format`: enum ['brief', 'detailed']

## Security Features

### 1. Input Sanitization

All string inputs are sanitized to prevent XSS attacks:

```typescript
import { sanitizeString, sanitizeObject } from '@/lib/sanitize';

const clean = sanitizeString(userInput);
const cleanObj = sanitizeObject(requestBody);
```

Features:
- Removes `<` and `>` characters
- Removes `javascript:` protocol
- Removes event handlers (`onclick=`, etc.)
- Limits string length to 10,000 characters

### 2. Rate Limiting

API endpoints can be rate-limited:

```typescript
import { withRateLimit } from '@/lib/api-middleware';

export const GET = withRateLimit(handler, {
  maxRequests: 100,
  windowMs: 60000 // 1 minute
});
```

Default limits:
- 100 requests per minute per IP address
- Returns 429 status code when exceeded
- Includes `Retry-After` header

### 3. MongoDB Query Protection

- Regex characters are escaped
- Query parameters are validated before use
- Mongoose validators run on updates

### 4. Error Handling

- Generic error messages in production
- Detailed errors only in development
- All errors logged server-side
- No stack traces exposed to clients

## Usage Examples

### Validating Query Parameters

```typescript
import { validateQueryParams, salesQuerySchema } from '@/lib/validations';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  
  const validation = validateQueryParams(searchParams, salesQuerySchema);
  if (!validation.success) {
    return NextResponse.json(
      { success: false, message: `Validation error: ${validation.error}` },
      { status: 400 }
    );
  }
  
  const { page, limit, region } = validation.data;
  // Use validated data...
}
```

### Validating Request Body

```typescript
import { validateRequestBody, generalSettingsSchema } from '@/lib/validations';

export async function PUT(req: Request) {
  const body = await req.json();
  
  const validation = validateRequestBody(body, generalSettingsSchema);
  if (!validation.success) {
    return NextResponse.json(
      { success: false, message: `Validation error: ${validation.error}` },
      { status: 400 }
    );
  }
  
  const { userId, companyName } = validation.data;
  // Use validated data...
}
```

### Using Middleware

```typescript
import { withMiddleware } from '@/lib/api-middleware';

const handler = async (req: Request) => {
  // Your handler logic
};

export const GET = withMiddleware(handler, {
  rateLimit: { maxRequests: 50, windowMs: 60000 },
  sanitize: true,
  errorHandling: true,
});
```

## Error Response Format

All validation errors return a consistent format:

```json
{
  "success": false,
  "message": "Validation error: period: Invalid enum value. Expected 'today' | 'week' | 'month' | 'quarter' | 'year', received 'invalid'"
}
```

## Environment Variables

Required environment variables (see `.env.example`):

```bash
MONGODB_URI=mongodb://localhost:27017/dashboardAnalytics
GEMINI_API_KEY=your_api_key_here
```

Optional:
```bash
NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000
NODE_ENV=development
```

## Testing Validation

### Valid Request
```bash
curl http://localhost:3000/api/analytics?period=month
```

### Invalid Request
```bash
curl http://localhost:3000/api/analytics?period=invalid
# Returns: 400 Bad Request with validation error
```

## Best Practices

1. **Always validate** - Never trust user input
2. **Fail fast** - Return validation errors immediately
3. **Be specific** - Provide clear error messages
4. **Sanitize** - Clean inputs even after validation
5. **Rate limit** - Protect against abuse
6. **Log errors** - Monitor for attack patterns
7. **Use TypeScript** - Leverage type safety

## Future Enhancements

- [ ] Add authentication middleware
- [ ] Implement CSRF protection
- [ ] Add request signing
- [ ] Implement API key authentication
- [ ] Add SQL injection protection (if using SQL)
- [ ] Add file upload validation
- [ ] Implement content security policy
- [ ] Add CORS configuration
