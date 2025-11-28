'use client';

import { useState } from 'react';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { usePermissions } from '@/hooks/usePermissions';

interface ExportButtonProps {
  data: any;
  filename: string;
  title?: string;
}

export default function ExportButton({ data, filename, title = 'Export' }: ExportButtonProps) {
  const { canExport } = usePermissions();
  const [isOpen, setIsOpen] = useState(false);

  if (!canExport()) {
    return null; // Don't show button for viewers
  }

  const exportToCSV = () => {
    // Convert data to CSV
    const csv = convertToCSV(data);
    downloadFile(csv, `${filename}.csv`, 'text/csv');
    setIsOpen(false);
  };

  const exportToJSON = () => {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, `${filename}.json`, 'application/json');
    setIsOpen(false);
  };

  const convertToCSV = (data: any) => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [
      headers.join(','),
      ...data.map((row: any) =>
        headers.map((header) => JSON.stringify(row[header] ?? '')).join(',')
      ),
    ];
    
    return csvRows.join('\n');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
      >
        <Download className="h-4 w-4" />
        {title}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 py-2">
            <button
              onClick={exportToCSV}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-600" />
              Export as CSV
            </button>
            <button
              onClick={exportToJSON}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <FileText className="h-4 w-4 text-blue-600" />
              Export as JSON
            </button>
          </div>
        </>
      )}
    </div>
  );
}
