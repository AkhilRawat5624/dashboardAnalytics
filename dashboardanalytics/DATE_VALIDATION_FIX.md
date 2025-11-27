# Date Validation Fix

## Problem

API endpoints were rejecting date inputs from HTML date fields with the error:
```json
{
  "success": false,
  "message": "Validation error: startDate: Invalid ISO datetime, endDate: Invalid ISO datetime"
}
```

## Root Cause

1. **HTML date inputs** return date strings in format: `YYYY-MM-DD` (e.g., `"2024-01-15"`)
2. **Zod validation** was expecting full ISO datetime strings: `YYYY-MM-DDTHH:mm:ss.sssZ` (e.g., `"2024-01-15T00:00:00.000Z"`)
3. The `.datetime()` validator was too strict for simple date inputs

## Solution

### 1. Updated Date Validation Schema

**Before:**
```typescript
export const dateStringSchema = z.string().datetime().optional();
```

**After:**
```typescript
export const dateStringSchema = z.string()
  .refine((val) => {
    if (!val) return true; // Allow empty for optional
    // Accept both YYYY-MM-DD and ISO datetime formats
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    return dateRegex.test(val) || datetimeRegex.test(val);
  }, { message: 'Invalid date format. Expected YYYY-MM-DD or ISO datetime' })
  .optional();
```

### 2. Improved Date Handling in API Routes

Updated all API routes to properly handle date ranges:

**Before:**
```typescript
if (startDate) matchStage.date.$gte = new Date(startDate);
if (endDate) matchStage.date.$lte = new Date(endDate);
```

**After:**
```typescript
if (startDate) {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0); // Start of day
  matchStage.date.$gte = start;
}
if (endDate) {
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999); // End of day
  matchStage.date.$lte = end;
}
```

## Benefits

✅ **Accepts both formats**: Works with HTML date inputs (`YYYY-MM-DD`) and ISO datetime strings
✅ **Proper date ranges**: Start date includes from 00:00:00, end date includes until 23:59:59
✅ **Better UX**: Users can use native date pickers without conversion
✅ **Backward compatible**: Still accepts full ISO datetime strings if needed

## Affected Files

### Validation Schema
- `src/lib/validations.ts`

### API Routes
- `src/app/api/reports/marketing/route.ts`
- `src/app/api/reports/financial/route.ts`
- `src/app/api/reports/client-insights/route.ts`
- `src/app/api/reports/sales/route.ts`

### Documentation
- `VALIDATION.md`

## Testing

### Valid Date Formats

✅ `2024-01-15` (HTML date input format)
✅ `2024-01-15T00:00:00.000Z` (ISO datetime)
✅ `2024-01-15T14:30:00Z` (ISO datetime with time)
✅ Empty string (optional dates)

### Invalid Date Formats

❌ `01/15/2024` (US format)
❌ `15-01-2024` (European format)
❌ `2024/01/15` (Slash separator)
❌ `invalid-date` (Non-date string)

## Example Usage

### Frontend (HTML Date Input)
```typescript
<input
  type="date"
  value={startDate}
  onChange={(e) => setStartDate(e.target.value)}
/>
// Sends: "2024-01-15"
```

### API Request
```bash
GET /api/reports/marketing?startDate=2024-01-15&endDate=2024-01-31
```

### API Response
```json
{
  "success": true,
  "data": {
    "kpis": { ... },
    "trend": [ ... ]
  }
}
```

## Date Range Behavior

When filtering by dates:

- **Start Date**: Includes all records from 00:00:00 of that day
- **End Date**: Includes all records until 23:59:59 of that day
- **Both Dates**: Includes all records within the full date range (inclusive)

Example:
- `startDate=2024-01-15` → Records from `2024-01-15 00:00:00`
- `endDate=2024-01-31` → Records until `2024-01-31 23:59:59`
- Result: All records from Jan 15 to Jan 31 (inclusive)

## Migration Notes

No migration needed! The fix is backward compatible:
- Existing API calls with ISO datetime strings continue to work
- New calls with simple date strings now work too
- No database changes required
- No frontend changes required (except the marketing page filter fix)
