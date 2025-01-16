import React from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Settings, Mail, Phone } from 'lucide-react';
import { usePageTitle } from '../utils/usePageTitle';

export function ProfilePage() {
  const { user } = useAuth();
  
  // Set page title
  usePageTitle('My Profile');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">My Profile</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center text-gray-600">
            <Mail className="h-5 w-5 mr-3" />
            <span>Email notifications enabled</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone className="h-5 w-5 mr-3" />
            <span>Phone number not verified</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <button className="flex items-center text-blue-600 hover:text-blue-800">
            <Settings className="h-5 w-5 mr-2" />
            Edit Profile Settings
          </button>
        </div>
      </div>
    </div>
  );
}