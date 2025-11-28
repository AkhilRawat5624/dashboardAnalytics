import { z } from 'zod';

// Common validations
// Accept both date strings (YYYY-MM-DD) and datetime strings (ISO 8601)
export const dateStringSchema = z.string()
  .refine((val) => {
    if (!val) return true; // Allow empty for optional
    // Check if it's a valid date string (YYYY-MM-DD) or ISO datetime
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    const datetimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
    return dateRegex.test(val) || datetimeRegex.test(val);
  }, { message: 'Invalid date format. Expected YYYY-MM-DD or ISO datetime' })
  .optional();

export const periodSchema = z.enum(['today', 'week', 'month', 'quarter', 'year', 'daily', 'monthly', 'quarterly']).optional();
export const userIdSchema = z.string().min(1).max(100).default('default-user');
export const pageSchema = z.coerce.number().int().positive().default(1);
export const limitSchema = z.coerce.number().int().positive().max(100).default(20);

// Analytics validation
export const analyticsQuerySchema = z.object({
  period: periodSchema,
});

// Sales validation
export const salesQuerySchema = z.object({
  period: periodSchema,
  page: pageSchema,
  limit: limitSchema,
  region: z.string().max(100).optional(),
  startDate: dateStringSchema,
  endDate: dateStringSchema,
});

// Marketing validation
export const marketingQuerySchema = z.object({
  startDate: dateStringSchema,
  endDate: dateStringSchema,
  campaignId: z.string().max(100).optional(),
});

// Client insights validation
export const clientInsightsQuerySchema = z.object({
  startDate: dateStringSchema,
  endDate: dateStringSchema,
  campaign: z.string().max(100).optional(),
});

// Financial validation
export const financialQuerySchema = z.object({
  period: z.enum(['daily', 'monthly', 'quarterly', 'yearly']).optional().default('monthly'),
  startDate: dateStringSchema,
  endDate: dateStringSchema,
});

// Settings validation
export const generalSettingsSchema = z.object({
  userId: userIdSchema,
  companyName: z.string().min(1).max(200).optional(),
  timezone: z.string().max(50).optional(),
  dateFormat: z.string().max(20).optional(),
  currency: z.string().length(3).optional(),
  language: z.string().length(2).optional(),
});

export const securitySettingsSchema = z.object({
  userId: userIdSchema,
  twoFactorEnabled: z.boolean().optional(),
  sessionTimeout: z.number().int().min(5).max(1440).optional(),
  passwordExpiry: z.number().int().min(0).max(365).optional(),
  loginNotifications: z.boolean().optional(),
});

export const notificationSettingsSchema = z.object({
  userId: userIdSchema,
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  weeklyReports: z.boolean().optional(),
  alertThreshold: z.number().int().min(0).max(100).optional(),
});

export const updateSettingsSchema = z.object({
  userId: userIdSchema,
  general: z.object({
    companyName: z.string().min(1).max(200).optional(),
    timezone: z.string().max(50).optional(),
    dateFormat: z.string().max(20).optional(),
    currency: z.string().length(3).optional(),
    language: z.string().length(2).optional(),
  }).optional(),
  security: z.object({
    twoFactorEnabled: z.boolean().optional(),
    sessionTimeout: z.number().int().min(5).max(1440).optional(),
    passwordExpiry: z.number().int().min(0).max(365).optional(),
    loginNotifications: z.boolean().optional(),
  }).optional(),
  notifications: z.object({
    emailNotifications: z.boolean().optional(),
    pushNotifications: z.boolean().optional(),
    weeklyReports: z.boolean().optional(),
    alertThreshold: z.number().int().min(0).max(100).optional(),
  }).optional(),
});

// AI validation
export const aiSuggestSchema = z.object({
  context: z.string().min(10).max(5000),
  dataType: z.enum(['sales', 'marketing', 'clients', 'financial']).optional(),
});

export const aiSummariseSchema = z.object({
  data: z.record(z.string(), z.any()),
  reportType: z.enum(['sales', 'marketing', 'clients', 'financial']).optional(),
});

// Helper function to validate query params
export function validateQueryParams<T>(
  searchParams: URLSearchParams,
  schema: z.ZodType<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    
    const result = schema.safeParse(params);
    
    if (!result.success) {
      const errors = result.error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`).join(', ');
      return { success: false, error: errors };
    }
    
    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, error: error.message || 'Validation failed' };
  }
}

// Password reset validation
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address').min(1, 'Email is required'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const verifyResetTokenSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
});

// Helper function to validate request body
export function validateRequestBody<T>(
  body: any,
  schema: z.ZodType<T>
): { success: true; data: T } | { success: false; error: string } {
  try {
    const result = schema.safeParse(body);
    
    if (!result.success) {
      const errors = result.error.issues.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`).join(', ');
      return { success: false, error: errors };
    }
    
    return { success: true, data: result.data };
  } catch (error: any) {
    return { success: false, error: error.message || 'Validation failed' };
  }
}
