'use client';

import { useState, useEffect } from 'react';
import { Bell, Search, User, Command } from 'lucide-react';

export default function Header() {
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const handleSearchClick = () => {
    // Trigger the command palette by dispatching a keyboard event
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: isMac,
      ctrlKey: !isMac,
      bubbles: true,
    });
    document.dispatchEvent(event);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center flex-1">
          <button
            onClick={handleSearchClick}
            className="relative w-96 group"
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-gray-600" />
            <div className="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-lg text-left text-gray-500 group-hover:border-gray-400 transition-colors cursor-pointer">
              Search...
            </div>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded">
                {isMac ? '⌘' : 'Ctrl'}
              </kbd>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100 border border-gray-300 rounded">
                K
              </kbd>
            </div>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-gray-900 transition-colors">
            <User className="h-5 w-5" />
            <span className="text-sm font-medium">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}
