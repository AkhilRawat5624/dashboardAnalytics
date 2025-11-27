'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { Settings, Shield, Bell, Save } from 'lucide-react';
import { ClipLoader } from 'react-spinners';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications'>('general');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await axios.get('/api/settings?userId=default-user');
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updateData: any) => {
      const response = await axios.put('/api/settings', {
        userId: 'default-user',
        ...updateData,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
  });

  const [formData, setFormData] = useState({
    general: {
      companyName: '',
      timezone: '',
      dateFormat: '',
      currency: '',
      language: '',
    },
    security: {
      twoFactorEnabled: false,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginNotifications: true,
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReports: true,
      alertThreshold: 80,
    },
  });

  useState(() => {
    if (data?.data) {
      setFormData({
        general: data.data.general || formData.general,
        security: data.data.security || formData.security,
        notifications: data.data.notifications || formData.notifications,
      });
    }
  });

  const handleSave = () => {
    updateMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
         <ClipLoader  color="#45d4d7" speedMultiplier={1}  size={70}/>
        {/* <div className="text-lg">Loading settings...</div> */}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-500">Manage your application preferences</p>
      </div>

      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'general'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Settings className="h-4 w-4" />
          General
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Shield className="h-4 w-4" />
          Security
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`px-4 py-2 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'notifications'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          <Bell className="h-4 w-4" />
          Notifications
        </button>
      </div>

      <div className="border rounded-lg p-6">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">General Settings</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <input
                type="text"
                value={formData.general.companyName}
                onChange={(e) => setFormData({
                  ...formData,
                  general: { ...formData.general, companyName: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Timezone</label>
              <select
                value={formData.general.timezone}
                onChange={(e) => setFormData({
                  ...formData,
                  general: { ...formData.general, timezone: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date Format</label>
              <select
                value={formData.general.dateFormat}
                onChange={(e) => setFormData({
                  ...formData,
                  general: { ...formData.general, dateFormat: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <select
                value={formData.general.currency}
                onChange={(e) => setFormData({
                  ...formData,
                  general: { ...formData.general, currency: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="JPY">JPY - Japanese Yen</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={formData.general.language}
                onChange={(e) => setFormData({
                  ...formData,
                  general: { ...formData.general, language: e.target.value }
                })}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Two-Factor Authentication</div>
                <div className="text-sm text-gray-500">Add an extra layer of security</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.security.twoFactorEnabled}
                  onChange={(e) => setFormData({
                    ...formData,
                    security: { ...formData.security, twoFactorEnabled: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
              <input
                type="number"
                value={formData.security.sessionTimeout}
                onChange={(e) => setFormData({
                  ...formData,
                  security: { ...formData.security, sessionTimeout: parseInt(e.target.value) }
                })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password Expiry (days)</label>
              <input
                type="number"
                value={formData.security.passwordExpiry}
                onChange={(e) => setFormData({
                  ...formData,
                  security: { ...formData.security, passwordExpiry: parseInt(e.target.value) }
                })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Login Notifications</div>
                <div className="text-sm text-gray-500">Get notified of new login attempts</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.security.loginNotifications}
                  onChange={(e) => setFormData({
                    ...formData,
                    security: { ...formData.security, loginNotifications: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-gray-500">Receive updates via email</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications.emailNotifications}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, emailNotifications: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Push Notifications</div>
                <div className="text-sm text-gray-500">Receive browser push notifications</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications.pushNotifications}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, pushNotifications: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Weekly Reports</div>
                <div className="text-sm text-gray-500">Receive weekly analytics summary</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.notifications.weeklyReports}
                  onChange={(e) => setFormData({
                    ...formData,
                    notifications: { ...formData.notifications, weeklyReports: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Alert Threshold (%)</label>
              <input
                type="number"
                value={formData.notifications.alertThreshold}
                onChange={(e) => setFormData({
                  ...formData,
                  notifications: { ...formData.notifications, alertThreshold: parseInt(e.target.value) }
                })}
                className="w-full px-4 py-2 border rounded-lg"
                min="0"
                max="100"
              />
              <p className="text-sm text-gray-500 mt-1">
                Get alerted when metrics exceed this threshold
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={updateMutation.isPending}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {updateMutation.isSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
          Settings saved successfully!
        </div>
      )}
    </div>
  );
}
