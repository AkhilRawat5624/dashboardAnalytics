# 📊 Dashboard Analytics

A modern, full-stack analytics dashboard built with Next.js 15, React 19, TypeScript, and MongoDB. Features comprehensive business intelligence tools with role-based access control, real-time analytics, and AI-powered insights.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.1-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-green?style=flat-square&logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

## ✨ Features

### 🔐 Authentication & Security
- **Secure Authentication** - NextAuth.js with JWT sessions
- **Password Reset** - Email-based token verification
- **Role-Based Access Control** - Admin, Analyst, and Viewer roles
- **Rate Limiting** - Protection against brute force and API abuse
- **Input Validation** - Comprehensive Zod schemas

### 📈 Analytics Dashboards
- **Sales Analytics** - Revenue trends, regional performance, product insights
- **Marketing Metrics** - Campaign ROI, conversion rates, channel analysis
- **Client Insights** - Acquisition, retention, lifetime value
- **Financial Reports** - Revenue vs expenses, profit margins, cash flow

### 👥 User Management
- **Admin Panel** - Complete user CRUD operations
- **Profile Management** - Update information, change password
- **Settings** - Customizable preferences and notifications

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first with Tailwind CSS
- **Command Palette** - Keyboard-first navigation (⌘K)
- **Notification System** - Real-time alerts and updates
- **Data Visualization** - Interactive charts with Recharts
- **Export Functionality** - CSV and JSON data exports

### 🤖 AI Integration
- **AI Suggestions** - Google Gemini-powered insights
- **Data Summarization** - Automated report generation
- **Trend Analysis** - Predictive analytics

## 🚀 Quick Start

### Prerequisites

- Node.js 20.x or higher
- MongoDB 6.x or higher
- npm or yarn

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
   
   Edit `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/dashboardanalytics
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   GEMINI_API_KEY=your-gemini-api-key (optional)
   ```

4. **Start MongoDB**
   ```bash
   mongod
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

## 🎯 Demo Credentials

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

## 📁 Project Structure

```
dashboardanalytics/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   ├── auth/              # Authentication pages
│   │   └── dashboard/         # Dashboard pages
│   ├── components/            # React components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # UI components
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries
│   ├── models/                # Mongoose models
│   ├── services/              # Business logic
│   └── types/                 # TypeScript types
├── public/                    # Static assets
└── docs/                      # Documentation
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Styling
- **Recharts** - Data visualization
- **React Query** - Server state management
- **Redux Toolkit** - Client state management

### Backend
- **Next.js API Routes** - Serverless endpoints
- **NextAuth.js** - Authentication
- **MongoDB** - Database
- **Mongoose** - ODM
- **Zod** - Validation
- **bcrypt** - Password hashing

### DevOps
- **Vercel** - Deployment platform
- **MongoDB Atlas** - Cloud database
- **GitHub Actions** - CI/CD

## 📚 Documentation

- **[Complete Documentation](DOCUMENTATION.md)** - Full technical documentation
- **[Rate Limiting Guide](RATE_LIMITING_GUIDE.md)** - Rate limiting implementation
- **[API Documentation](DOCUMENTATION.md#api-documentation)** - API endpoints reference

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ bcrypt password hashing (12 rounds)
- ✅ Rate limiting on critical endpoints
- ✅ Input validation with Zod
- ✅ CSRF protection
- ✅ Secure password reset tokens
- ✅ Role-based permissions
- ✅ HTTP-only cookies
- ✅ Security headers

## 🎨 Key Features Showcase

### Command Palette (⌘K)
Quick navigation with fuzzy search and keyboard shortcuts.

### Role-Based Access Control
Three-tier permission system:
- **Admin** - Full system access
- **Analyst** - View and export analytics
- **Viewer** - Read-only access

### Rate Limiting
Automatic protection against abuse:
- Login: 5 attempts / 15 minutes
- Signup: 3 attempts / hour
- Password Reset: 3 requests / hour
- API: 60 requests / minute

### Export Functionality
Export data to CSV or JSON with role-based access control.

## 📊 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run seed         # Seed database
npm run create-admin # Create admin user
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/dashboardanalytics)

### Docker

```bash
docker-compose up -d
```

See [Deployment Guide](DOCUMENTATION.md#deployment) for detailed instructions.

## 🧪 Testing

```bash
# Test password reset
npx tsx src/scripts/test-password-reset.ts

# Test rate limiting
npx tsx src/scripts/test-rate-limit.ts
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](DOCUMENTATION.md#contributing) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment platform
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Recharts](https://recharts.org/) - Charting library

## 📧 Support

For support, email support@example.com or create an issue on GitHub.

## 🔗 Links

- [Live Demo](https://your-demo-url.vercel.app)
- [Documentation](DOCUMENTATION.md)
- [API Reference](DOCUMENTATION.md#api-documentation)
- [Changelog](DOCUMENTATION.md#changelog)

---

**Built with ❤️ using Next.js 15 and React 19**
