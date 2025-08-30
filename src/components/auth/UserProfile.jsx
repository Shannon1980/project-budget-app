import React from 'react';
import { User, Mail, Shield, Edit3, Save, X } from 'lucide-react';

const UserProfile = ({ 
  showEditProfile, 
  setShowEditProfile, 
  editingProfile, 
  setEditingProfile, 
  handleSaveProfile,
  currentUser,
  darkMode 
}) => {
  if (!showEditProfile) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveProfile();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
          <button
            onClick={() => setShowEditProfile(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name
            </label>
            <div className="relative">
              <input
                type="text"
                value={editingProfile.name}
                onChange={(e) => setEditingProfile({...editingProfile, name: e.target.value})}
                className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter full name"
                required
              />
              <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={editingProfile.email}
                onChange={(e) => setEditingProfile({...editingProfile, email: e.target.value})}
                className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
                required
              />
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Current Role
            </label>
            <div className="relative">
              <input
                type="text"
                value={currentUser?.role || ''}
                className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-500 dark:text-gray-400"
                disabled
              />
              <Shield className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Role changes require admin approval
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Password (optional)
            </label>
            <div className="relative">
              <input
                type="password"
                value={editingProfile.password}
                onChange={(e) => setEditingProfile({...editingProfile, password: e.target.value})}
                className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter new password (leave blank to keep current)"
              />
              <Shield className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type="password"
                value={editingProfile.confirmPassword}
                onChange={(e) => setEditingProfile({...editingProfile, confirmPassword: e.target.value})}
                className="w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirm new password"
              />
              <Shield className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setShowEditProfile(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;
