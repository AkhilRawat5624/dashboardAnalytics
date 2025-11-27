import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch alerts from analytics API
  const { data: analyticsData } = useQuery({
    queryKey: ['analytics-alerts'],
    queryFn: async () => {
      const response = await axios.get('/api/analytics?period=week');
      return response.data;
    },
    refetchInterval: 60000, // Refetch every minute
  });

  useEffect(() => {
    if (analyticsData?.data?.alerts) {
      const alerts = analyticsData.data.alerts;
      
      // Convert alerts to notifications
      const newNotifications: Notification[] = alerts.map((alert: any, index: number) => ({
        id: `alert-${index}-${Date.now()}`,
        type: alert.severity === 'high' ? 'error' : 'warning',
        title: `${alert.category.toUpperCase()} Alert`,
        message: alert.message,
        timestamp: new Date(),
        read: false,
      }));

      // Add some sample notifications for demo
      const sampleNotifications: Notification[] = [
        {
          id: 'sample-1',
          type: 'success',
          title: 'Sales Target Achieved',
          message: 'Monthly sales target exceeded by 15%',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          read: false,
        },
        {
          id: 'sample-2',
          type: 'info',
          title: 'New Report Available',
          message: 'Weekly analytics report is ready for review',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          read: true,
        },
      ];

      setNotifications([...newNotifications, ...sampleNotifications]);
    }
  }, [analyticsData]);

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
  };
}
