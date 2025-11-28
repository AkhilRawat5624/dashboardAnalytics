# Quick Start Guide

Get up and running with Dashboard Analytics in 5 minutes.

## Prerequisites

- Node.js 20+ installed
- MongoDB 6+ installed and running
- Basic knowledge of React and Next.js

## Installation Steps

### 1. Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd dashboardanalytics

# Install dependencies
npm install
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/dashboardanalytics
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here-minimum-32-characters
```

**Generate a secure secret**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Start MongoDB

```bash
# If using MongoDB service
mongod

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### 4. Seed Database

```bash
# Seed with sample data
npm run seed

# Create admin user
npm run create-admin
```

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## First Login

Use these credentials to log in:

```
Admin:
Email: admin@example.com
Password: admin123

Analyst:
Email: analyst@example.com
Password: analyst123

Viewer:
Email: viewer@example.com
Password: viewer123
```

## Explore Features

### 1. Dashboard Overview
Navigate to `/dashboard` to see:
- Total revenue
- Sales count
- Active clients
- Conversion rate

### 2. Sales Analytics
Go to `/dashboard/sales` for:
- Revenue trends chart
- Sales by region
- Product performance
- Export to CSV/JSON

### 3. Command Palette
Press `⌘K` (Mac) or `Ctrl+K` (Windows) to:
- Quick navigation
- Search features
- Keyboard shortcuts

### 4. User Management (Admin Only)
Visit `/dashboard/admin/users` to:
- View all users
- Create new users
- Edit user roles
- Delete users

### 5. Profile Settings
Go to `/dashboard/profile` to:
- Update your information
- Change password
- Manage preferences

## Common Tasks

### Create a New User

1. Log in as admin
2. Go to Admin → Users
3. Click "Create User"
4. Fill in details
5. Assign role
6. Save

### Export Data

1. Navigate to any analytics page
2. Click "Export" button
3. Choose format (CSV or JSON)
4. File downloads automatically

### Change Password

1. Go to Profile
2. Click "Change Password"
3. Enter current password
4. Enter new password
5. Confirm new password
6. Save

### Reset Password (Forgot Password)

1. Go to sign-in page
2. Click "Forgot password?"
3. Enter your email
4. Check console for reset link (in development)
5. Click link and set new password

## Development Workflow

### File Structure

```
src/
├── app/              # Pages and API routes
├── components/       # React components
├── hooks/            # Custom hooks
├── lib/              # Utilities
├── models/           # Database models
└── types/            # TypeScript types
```

### Adding a New Page

1. Create file in `src/app/dashboard/`
2. Export default component
3. Add route to sidebar
4. Add permission check if needed

Example:
```typescript
// src/app/dashboard/mypage/page.tsx
export default function MyPage() {
  return <div>My New Page</div>;
}
```

### Adding a New API Endpoint

1. Create file in `src/app/api/`
2. Export GET, POST, PUT, or DELETE functions
3. Add authentication check
4. Add rate limiting
5. Add validation

Example:
```typescript
// src/app/api/myendpoint/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return NextResponse.json({ data: 'Hello' });
}
```

### Adding a New Component

1. Create file in `src/components/`
2. Export component
3. Import where needed

Example:
```typescript
// src/components/MyComponent.tsx
export function MyComponent() {
  return <div>My Component</div>;
}
```

## Testing

### Test Password Reset

```bash
npx tsx src/scripts/test-password-reset.ts
```

### Test Rate Limiting

```bash
npx tsx src/scripts/test-rate-limit.ts
```

### Manual Testing

1. Create test user
2. Test all features
3. Check error handling
4. Verify permissions

## Troubleshooting

### MongoDB Connection Error

**Problem**: Cannot connect to MongoDB

**Solution**:
```bash
# Check if MongoDB is running
mongosh

# If not, start it
mongod

# Or use Docker
docker start mongodb
```

### Port Already in Use

**Problem**: Port 3000 is already in use

**Solution**:
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9

# Or use different port
PORT=3001 npm run dev
```

### Authentication Not Working

**Problem**: Cannot log in

**Solution**:
1. Check NEXTAUTH_SECRET is set
2. Clear browser cookies
3. Restart dev server
4. Check user exists in database

### Rate Limit Errors

**Problem**: Getting 429 errors

**Solution**:
1. Wait for rate limit to reset
2. Check rate limit configuration
3. Clear NodeCache if needed

## Next Steps

### Learn More

- Read [Complete Documentation](DOCUMENTATION.md)
- Check [API Reference](API_REFERENCE.md)
- Review [Rate Limiting Guide](RATE_LIMITING_GUIDE.md)

### Customize

1. Update branding and colors
2. Add your own analytics
3. Customize dashboards
4. Add new features

### Deploy

1. Build for production: `npm run build`
2. Deploy to Vercel (recommended)
3. Set up MongoDB Atlas
4. Configure environment variables

See [Deployment Guide](DOCUMENTATION.md#deployment) for details.

## Getting Help

- Check [Documentation](DOCUMENTATION.md)
- Review [Troubleshooting](DOCUMENTATION.md#troubleshooting)
- Create an issue on GitHub
- Contact support

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run seed             # Seed database
npm run create-admin     # Create admin user

# Testing
npx tsx src/scripts/test-password-reset.ts
npx tsx src/scripts/test-rate-limit.ts

# Linting
npm run lint             # Run ESLint
```

## Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [MongoDB Docs](https://docs.mongodb.com)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Ready to build something amazing!** 🚀

For detailed information, see [DOCUMENTATION.md](DOCUMENTATION.md)
