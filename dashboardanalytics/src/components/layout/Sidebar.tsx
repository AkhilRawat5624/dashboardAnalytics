'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Users, 
  DollarSign, 
  BarChart3,
  Settings,
  Shield,
  User as UserIcon
} from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['admin', 'analyst', 'viewer'] },
  { name: 'Sales', href: '/dashboard/sales', icon: TrendingUp, roles: ['admin', 'analyst', 'viewer'] },
  { name: 'Marketing', href: '/dashboard/marketing', icon: BarChart3, roles: ['admin', 'analyst', 'viewer'] },
  { name: 'Clients', href: '/dashboard/clients', icon: Users, roles: ['admin', 'analyst', 'viewer'] },
  { name: 'Financial', href: '/dashboard/financial', icon: DollarSign, roles: ['admin', 'analyst', 'viewer'] },
  { name: 'Admin Panel', href: '/dashboard/admin', icon: Shield, roles: ['admin'] },
  { name: 'Profile', href: '/dashboard/profile', icon: UserIcon, roles: ['admin', 'analyst', 'viewer'] },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings, roles: ['admin', 'analyst', 'viewer'] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role } = usePermissions();

  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Dashboard Analytics</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navigation
            .filter((item) => item.roles.includes(role))
            .map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
        </nav>
      </div>
    </div>
  );
}
