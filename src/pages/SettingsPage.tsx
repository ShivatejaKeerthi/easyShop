import React, { useState, useEffect } from 'react';
import { Settings, Bell, Lock, Globe, Moon, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/firebase';
import { usePageTitle } from '../utils/usePageTitle';

interface UserPreferences {
  notifications: {
    email: boolean;
    orders: boolean;
    marketing: boolean;
  };
  privacy: {
    twoFactor: boolean;
    showOnline: boolean;
  };
  appearance: 'light' | 'dark' | 'system';
  language: string;
}

export function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>({
    notifications: {
      email: true,
      orders: true,
      marketing: false
    },
    privacy: {
      twoFactor: false,
      showOnline: true
    },
    appearance: 'light',
    language: 'English (US)'
  });
  usePageTitle('Settings');

  useEffect(() => {
    async function loadPreferences() {
      if (!user?.id) return;

      try {
        setLoading(true);
        const userDetails = await userService.getUserDetails(user.id);
        if (userDetails?.preferences) {
          setPreferences(userDetails.preferences as UserPreferences);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load preferences');
      } finally {
        setLoading(false);
      }
    }

    loadPreferences();
  }, [user?.id]);

  const handlePreferenceChange = async (
    category: keyof UserPreferences,
    setting: string,
    value: boolean | string
  ) => {
    if (!user?.id) return;

    try {
      setError(null);
      const newPreferences = { ...preferences };
      
      if (typeof value === 'boolean') {
        (newPreferences[category] as any)[setting] = value;
      } else {
        (newPreferences[category as keyof UserPreferences] as any) = value;
      }
      
      setPreferences(newPreferences);
      
      await userService.saveUserDetails(user.id, {
        preferences: newPreferences
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save preferences');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Settings</h1>
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Settings</h1>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="ml-3 text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <div className="flex items-center mb-4">
            <Bell className="h-5 w-5 text-gray-400 mr-3" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4 ml-8">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-blue-600"
                checked={preferences.notifications.email}
                onChange={(e) => handlePreferenceChange('notifications', 'email', e.target.checked)}
              />
              <span className="ml-2">Email notifications</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-blue-600"
                checked={preferences.notifications.orders}
                onChange={(e) => handlePreferenceChange('notifications', 'orders', e.target.checked)}
              />
              <span className="ml-2">Order updates</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-blue-600"
                checked={preferences.notifications.marketing}
                onChange={(e) => handlePreferenceChange('notifications', 'marketing', e.target.checked)}
              />
              <span className="ml-2">Marketing emails</span>
            </label>
          </div>
        </div>

        <div className="p-6 border-b">
          <div className="flex items-center mb-4">
            <Lock className="h-5 w-5 text-gray-400 mr-3" />
            <h2 className="text-lg font-semibold">Privacy</h2>
          </div>
          <div className="space-y-4 ml-8">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-blue-600"
                checked={preferences.privacy.twoFactor}
                onChange={(e) => handlePreferenceChange('privacy', 'twoFactor', e.target.checked)}
              />
              <span className="ml-2">Two-factor authentication</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded text-blue-600"
                checked={preferences.privacy.showOnline}
                onChange={(e) => handlePreferenceChange('privacy', 'showOnline', e.target.checked)}
              />
              <span className="ml-2">Show online status</span>
            </label>
          </div>
        </div>

        <div className="p-6 border-b">
          <div className="flex items-center mb-4">
            <Globe className="h-5 w-5 text-gray-400 mr-3" />
            <h2 className="text-lg font-semibold">Language & Region</h2>
          </div>
          <div className="ml-8">
            <select
              className="w-full max-w-xs rounded-lg border-gray-300"
              value={preferences.language}
              onChange={(e) => handlePreferenceChange('language', '', e.target.value)}
            >
              <option>English (US)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-4">
            <Moon className="h-5 w-5 text-gray-400 mr-3" />
            <h2 className="text-lg font-semibold">Appearance</h2>
          </div>
          <div className="ml-8">
            <select
              className="w-full max-w-xs rounded-lg border-gray-300"
              value={preferences.appearance}
              onChange={(e) => handlePreferenceChange('appearance', '', e.target.value as any)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}