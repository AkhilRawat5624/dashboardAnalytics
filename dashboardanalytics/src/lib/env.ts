import { z } from 'zod';

// Define environment variable schema
const envSchema = z.object({
  // MongoDB
  MONGODB_URI: z.string().url().min(1, 'MONGODB_URI is required'),
  
  // Gemini AI
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),
  
  // NextAuth (optional for now)
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

// Validate environment variables
export function validateEnv() {
  try {
    const env = envSchema.parse({
      MONGODB_URI: process.env.MONGODB_URI,
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      NODE_ENV: process.env.NODE_ENV,
    });
    
    return { success: true, env };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('\n');
      console.error('❌ Environment validation failed:\n', errors);
      throw new Error(`Environment validation failed:\n${errors}`);
    }
    throw error;
  }
}

// Export validated environment variables
export const env = validateEnv().env;
