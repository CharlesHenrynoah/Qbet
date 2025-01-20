import React, { useState } from 'react';
import { X, Upload, Camera, Crown } from 'lucide-react';
import type { User } from '../types';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  isOpen: boolean;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, isOpen }) => {
  const [showUploadPhoto, setShowUploadPhoto] = useState(false);
  
  if (!isOpen) return null;

  const plans = [
    { name: 'Free', price: '0€/month', features: ['5 conversations/month', 'Basic search', 'Email support'] },
    { name: 'Pro', price: '29€/month', features: ['Unlimited conversations', 'Advanced search', 'Priority support', 'Custom exports'] },
    { name: 'Enterprise', price: 'Custom', features: ['Custom features', 'Dedicated support', 'API access', 'Team management'] }
  ];

  const currentPlan = plans[0]; // À remplacer par le vrai plan de l'utilisateur

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-mono-900 rounded-lg w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-orbitron text-mono-50">Profile</h2>
          <button
            onClick={onClose}
            className="text-mono-400 hover:text-mono-50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Content */}
        <div className="space-y-6">
          {/* Profile Picture */}
          <div className="flex justify-center relative">
            <div className="relative group">
              <div className="w-24 h-24 rounded-full bg-mono-800 flex items-center justify-center text-mono-400 relative overflow-hidden">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">{user.firstName.charAt(0)}{user.lastName.charAt(0)}</span>
                )}
                <button 
                  onClick={() => setShowUploadPhoto(true)}
                  className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                >
                  <Camera className="w-6 h-6 text-mono-50" />
                </button>
              </div>
            </div>
          </div>

          {/* User Info (non modifiable) */}
          <div className="space-y-4 border-b border-mono-800 pb-4">
            <div>
              <label className="block text-sm font-medium text-mono-400 mb-1">Name</label>
              <div className="text-mono-50">{user.firstName} {user.lastName}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-mono-400 mb-1">Email</label>
              <div className="text-mono-50">{user.email}</div>
            </div>
            {user.company && (
              <div>
                <label className="block text-sm font-medium text-mono-400 mb-1">Company</label>
                <div className="text-mono-50">{user.company}</div>
              </div>
            )}
            {user.phone && (
              <div>
                <label className="block text-sm font-medium text-mono-400 mb-1">Phone</label>
                <div className="text-mono-50">{user.phone}</div>
              </div>
            )}
          </div>

          {/* Current Plan */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-mono-50 font-medium flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-500" />
                  Current Plan
                </h3>
                <p className="text-mono-400 text-sm">{currentPlan.name} - {currentPlan.price}</p>
              </div>
              <button className="px-4 py-2 bg-mono-800 text-mono-50 rounded-lg hover:bg-mono-700 transition-colors text-sm">
                Upgrade
              </button>
            </div>
            <div className="space-y-2">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="text-sm text-mono-400 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-mono-400" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upload Photo Modal */}
        {showUploadPhoto && (
          <div className="absolute inset-0 bg-mono-900 rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-orbitron text-mono-50">Update Profile Picture</h3>
              <button
                onClick={() => setShowUploadPhoto(false)}
                className="text-mono-400 hover:text-mono-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-full h-48 border-2 border-dashed border-mono-700 rounded-lg flex flex-col items-center justify-center text-mono-400 cursor-pointer hover:border-mono-500 transition-colors">
                <Upload className="w-8 h-8 mb-2" />
                <p className="text-sm">Drop your image here or click to upload</p>
                <p className="text-xs text-mono-500">PNG, JPG up to 5MB</p>
                <input type="file" className="hidden" accept="image/*" />
              </div>
              <button className="w-full py-2 bg-mono-50 text-mono-900 rounded-lg hover:bg-mono-200 transition-colors">
                Upload Photo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
