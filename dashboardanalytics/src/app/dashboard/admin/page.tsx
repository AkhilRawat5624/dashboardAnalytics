'use client';

import { usePermissions } from '@/hooks/usePermissions';
import { Users, Shield, Activity, Key, Database, Settings as SettingsIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminPanel() {
  const { isAdmin, canManageUsers } = usePermissions();

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
          <Link href="/dashboard" className="mt-4 inline-block text-blue-600 hover:text-blue-700">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const adminCards = [
    {
      title: 'User Management',
      description: 'Manage users, roles, and permissions',
      icon: <Users className="h-8 w-8" />,
      href: '/dashboard/admin/users',
      color: 'bg-blue-500',
    },
    {
      title: 'Audit Logs',
      description: 'View system activity and user actions',
      icon: <Activity className="h-8 w-8" />,
      href: '/dashboard/admin/audit-logs',
      color: 'bg-green-500',
    },
    {
      title: 'API Keys',
      description: 'Manage API keys and integrations',
      icon: <Key className="h-8 w-8" />,
      href: '/dashboard/admin/api-keys',
      color: 'bg-purple-500',
    },
    {
      title: 'Database',
      description: 'Backup, restore, and manage database',
      icon: <Database className="h-8 w-8" />,
      href: '/dashboard/admin/database',
      color: 'bg-orange-500',
    },
    {
      title: 'System Settings',
      description: 'Configure system-wide settings',
      icon: <SettingsIcon className="h-8 w-8" />,
      href: '/dashboard/admin/system-settings',
      color: 'bg-red-500',
    },
    {
      title: 'Security',
      description: 'Security settings and configurations',
      icon: <Shield className="h-8 w-8" />,
      href: '/dashboard/admin/security',
      color: 'bg-indigo-500',
    },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600 mt-2">Manage system settings and configurations</p>
      </div>

      {/* Admin Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {adminCards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block p-6 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className={`inline-flex p-3 rounded-lg ${card.color} text-white mb-4`}>
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
            <p className="text-sm text-gray-600">{card.description}</p>
          </Link>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Total Users</div>
          <div className="text-3xl font-bold text-gray-900">24</div>
          <div className="text-sm text-green-600 mt-2">+3 this week</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">Active Sessions</div>
          <div className="text-3xl font-bold text-gray-900">12</div>
          <div className="text-sm text-blue-600 mt-2">Currently online</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">API Calls Today</div>
          <div className="text-3xl font-bold text-gray-900">1,234</div>
          <div className="text-sm text-gray-600 mt-2">Within limits</div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-1">System Health</div>
          <div className="text-3xl font-bold text-green-600">Good</div>
          <div className="text-sm text-gray-600 mt-2">All systems operational</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Admin Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'User created', user: 'john@example.com', time: '5 minutes ago' },
            { action: 'Settings updated', user: 'System', time: '1 hour ago' },
            { action: 'Role changed', user: 'jane@example.com', time: '2 hours ago' },
            { action: 'API key generated', user: 'admin@example.com', time: '3 hours ago' },
          ].map((activity, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.user}</p>
              </div>
              <span className="text-xs text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
