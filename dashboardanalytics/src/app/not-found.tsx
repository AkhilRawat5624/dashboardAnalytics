import Link from 'next/link';
import { Search, Home, ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-blue-100 rounded-full mb-6">
            <FileQuestion className="h-16 w-16 text-blue-600" />
          </div>
          <h1 className="text-9xl font-bold text-blue-600 mb-4">404</h1>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            <Home className="h-5 w-5" />
            Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-colors font-semibold"
          >
            <ArrowLeft className="h-5 w-5" />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center justify-center gap-2">
            <Search className="h-5 w-5" />
            Quick Links
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Link
              href="/dashboard"
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="text-sm font-medium text-gray-900">Dashboard</div>
              <div className="text-xs text-gray-500 mt-1">Main overview</div>
            </Link>
            <Link
              href="/dashboard/sales"
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="text-sm font-medium text-gray-900">Sales</div>
              <div className="text-xs text-gray-500 mt-1">Sales reports</div>
            </Link>
            <Link
              href="/dashboard/marketing"
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="text-sm font-medium text-gray-900">Marketing</div>
              <div className="text-xs text-gray-500 mt-1">Campaign data</div>
            </Link>
            <Link
              href="/dashboard/clients"
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="text-sm font-medium text-gray-900">Clients</div>
              <div className="text-xs text-gray-500 mt-1">Client insights</div>
            </Link>
            <Link
              href="/dashboard/financial"
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="text-sm font-medium text-gray-900">Financial</div>
              <div className="text-xs text-gray-500 mt-1">Financial data</div>
            </Link>
            <Link
              href="/dashboard/settings"
              className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
            >
              <div className="text-sm font-medium text-gray-900">Settings</div>
              <div className="text-xs text-gray-500 mt-1">Preferences</div>
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <p className="mt-8 text-sm text-gray-500">
          If you believe this is a mistake, please contact support or use the command palette (⌘K) to navigate.
        </p>
      </div>
    </div>
  );
}
