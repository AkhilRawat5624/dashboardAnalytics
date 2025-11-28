import { NextResponse } from 'next/server';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(409, message);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(500, message);
  }
}

export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error);

  // Handle known AppError instances
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
        statusCode: error.statusCode,
      },
      { status: error.statusCode }
    );
  }

  // Handle Mongoose validation errors
  if (error && typeof error === 'object' && 'name' in error && error.name === 'ValidationError') {
    return NextResponse.json(
      {
        success: false,
        message: 'Validation failed',
        errors: error,
      },
      { status: 400 }
    );
  }

  // Handle Mongoose duplicate key errors
  if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
    return NextResponse.json(
      {
        success: false,
        message: 'Duplicate entry. Resource already exists.',
      },
      { status: 409 }
    );
  }

  // Handle generic errors
  if (error instanceof Error) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      {
        success: false,
        message: isDevelopment ? error.message : 'An unexpected error occurred',
        ...(isDevelopment && { stack: error.stack }),
      },
      { status: 500 }
    );
  }

  // Fallback for unknown errors
  return NextResponse.json(
    {
      success: false,
      message: 'An unexpected error occurred',
    },
    { status: 500 }
  );
}

// Async error wrapper for API routes
export function asyncHandler(
  handler: (req: Request, context?: any) => Promise<NextResponse>
) {
  return async (req: Request, context?: any) => {
    try {
      return await handler(req, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}

// Log error to external service (implement as needed)
export function logError(error: Error, context?: Record<string, any>) {
  // TODO: Implement logging to external service (Sentry, LogRocket, etc.)
  console.error('Error logged:', {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
}
