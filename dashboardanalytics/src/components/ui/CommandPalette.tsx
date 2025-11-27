'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  LayoutDashboard, 
  TrendingUp, 
  BarChart3, 
  Users, 
  DollarSign, 
  Settings,
  FileText,
  Sparkles,
  X
} from 'lucide-react';

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  keywords?: string[];
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  const commands: Command[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      description: 'View main analytics dashboard',
      icon: <LayoutDashboard className="h-4 w-4" />,
      action: () => router.push('/dashboard'),
      keywords: ['home', 'overview', 'main'],
    },
    {
      id: 'sales',
      label: 'Sales Report',
      description: 'View sales analytics and transactions',
      icon: <TrendingUp className="h-4 w-4" />,
      action: () => router.push('/dashboard/sales'),
      keywords: ['revenue', 'orders', 'transactions'],
    },
    {
      id: 'marketing',
      label: 'Marketing Analytics',
      description: 'View campaign performance and metrics',
      icon: <BarChart3 className="h-4 w-4" />,
      action: () => router.push('/dashboard/marketing'),
      keywords: ['campaigns', 'cpo', 'clicks', 'performance'],
    },
    {
      id: 'clients',
      label: 'Client Insights',
      description: 'View customer behavior and satisfaction',
      icon: <Users className="h-4 w-4" />,
      action: () => router.push('/dashboard/clients'),
      keywords: ['customers', 'users', 'satisfaction', 'engagement'],
    },
    {
      id: 'financial',
      label: 'Financial Overview',
      description: 'View financial health and metrics',
      icon: <DollarSign className="h-4 w-4" />,
      action: () => router.push('/dashboard/financial'),
      keywords: ['profit', 'liquidity', 'capital', 'ratios'],
    },
    {
      id: 'settings',
      label: 'Settings',
      description: 'Manage application preferences',
      icon: <Settings className="h-4 w-4" />,
      action: () => router.push('/dashboard/settings'),
      keywords: ['preferences', 'config', 'configuration'],
    },
    {
      id: 'sales-api',
      label: 'Sales API Documentation',
      description: 'View sales API endpoints',
      icon: <FileText className="h-4 w-4" />,
      action: () => window.open('/api/reports/sales', '_blank'),
      keywords: ['api', 'docs', 'documentation'],
    },
    {
      id: 'marketing-api',
      label: 'Marketing API Documentation',
      description: 'View marketing API endpoints',
      icon: <FileText className="h-4 w-4" />,
      action: () => window.open('/api/reports/marketing', '_blank'),
      keywords: ['api', 'docs', 'documentation'],
    },
    {
      id: 'ai-suggest',
      label: 'AI Suggestions',
      description: 'Get AI-powered insights',
      icon: <Sparkles className="h-4 w-4" />,
      action: () => alert('AI Suggestions feature - Coming soon!'),
      keywords: ['ai', 'artificial intelligence', 'insights', 'suggestions'],
    },
  ];

  const filteredCommands = commands.filter((command) => {
    const searchLower = search.toLowerCase();
    return (
      command.label.toLowerCase().includes(searchLower) ||
      command.description?.toLowerCase().includes(searchLower) ||
      command.keywords?.some((keyword) => keyword.includes(searchLower))
    );
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen((prev) => !prev);
      setSearch('');
      setSelectedIndex(0);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearch('');
      setSelectedIndex(0);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const executeCommand = (command: Command) => {
    command.action();
    setIsOpen(false);
    setSearch('');
    setSelectedIndex(0);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter' && filteredCommands[selectedIndex]) {
      e.preventDefault();
      executeCommand(filteredCommands[selectedIndex]);
    }
  };

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={() => setIsOpen(false)}
      />

      {/* Command Palette */}
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4 animate-in zoom-in-95 duration-200">
        <div className="bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center border-b border-gray-200 px-4">
            <Search className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Type a command or search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleInputKeyDown}
              className="flex-1 px-4 py-4 outline-none text-lg"
              autoFocus
            />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                No results found for "{search}"
              </div>
            ) : (
              <div className="py-2">
                {filteredCommands.map((command, index) => (
                  <button
                    key={command.id}
                    onClick={() => executeCommand(command)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                      index === selectedIndex
                        ? 'bg-blue-50 border-l-2 border-blue-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-8 h-8 rounded-md ${
                      index === selectedIndex
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {command.icon}
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium ${
                        index === selectedIndex ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {command.label}
                      </div>
                      {command.description && (
                        <div className={`text-sm ${
                          index === selectedIndex ? 'text-blue-700' : 'text-gray-500'
                        }`}>
                          {command.description}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Enter</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Esc</kbd>
                Close
              </span>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">⌘K</kbd>
              <span>or</span>
              <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-xs">Ctrl+K</kbd>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
