import React, { useState, useEffect } from 'react';
import { useUserType } from '../../contexts/UserTypeContext';
import { UserType } from '../../types/UserTypes';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: 'borrower' | 'vendor' | 'broker' | 'lender';
}

const profileTemplates: Record<string, ProfileData[]> = {
  borrower: [
    {
      id: 'b1',
      name: 'Jane Smith',
      company: 'Tech Innovators LLC',
      email: 'jane@techinnovators.com',
      phone: '(555) 123-4567',
      avatarUrl: '/avatars/jane-smith.png',
      role: 'borrower'
    },
    {
      id: 'b2',
      name: 'Robert Chen',
      company: 'GreenGrow Farms',
      email: 'robert@greengrow.com',
      phone: '(555) 234-5678',
      avatarUrl: '/avatars/robert-chen.png',
      role: 'borrower'
    },
  ],
  vendor: [
    {
      id: 'v1',
      name: 'David Johnson',
      company: 'Equipment Solutions Inc.',
      email: 'david@equipmentsolutions.com',
      phone: '(555) 345-6789',
      avatarUrl: '/avatars/david-johnson.png',
      role: 'vendor'
    },
    {
      id: 'v2',
      name: 'Emily Patel',
      company: 'Asset World Corp',
      email: 'emily@assetworld.com',
      phone: '(555) 456-7890',
      avatarUrl: '/avatars/emily-patel.png',
      role: 'vendor'
    },
  ],
  broker: [
    {
      id: 'br1',
      name: 'Michael Rodriguez',
      company: 'Capital Connect Brokers',
      email: 'michael@capitalconnect.com',
      phone: '(555) 567-8901',
      avatarUrl: '/avatars/michael-rodriguez.png',
      role: 'broker'
    },
    {
      id: 'br2',
      name: 'Sarah Kim',
      company: 'Alliance Financial',
      email: 'sarah@alliancefinancial.com',
      phone: '(555) 678-9012',
      avatarUrl: '/avatars/sarah-kim.png',
      role: 'broker'
    },
  ],
  lender: [
    {
      id: 'l1',
      name: 'Thomas Wilson',
      company: 'First Capital Bank',
      email: 'thomas@firstcapital.com',
      phone: '(555) 789-0123',
      avatarUrl: '/avatars/thomas-wilson.png',
      role: 'lender'
    },
    {
      id: 'l2',
      name: 'Jennifer Lee',
      company: 'Apex Lending Partners',
      email: 'jennifer@apexlending.com',
      phone: '(555) 890-1234',
      avatarUrl: '/avatars/jennifer-lee.png',
      role: 'lender'
    },
  ],
};

const UserProfileSimulator: React.FC = () => {
  const { setUserType } = useUserType();
  const [selectedRole, setSelectedRole] = useState<'borrower' | 'vendor' | 'broker' | 'lender'>('borrower');
  const [selectedProfile, setSelectedProfile] = useState<string>(profileTemplates.borrower[0].id);
  const [profiles, setProfiles] = useState<ProfileData[]>(profileTemplates.borrower);
  const navigate = useNavigate();

  // Map role strings to UserType enum
  const roleToUserType = (role: string): UserType => {
    switch (role) {
      case 'borrower':
        return UserType.BUSINESS;
      case 'vendor':
        return UserType.VENDOR;
      case 'broker':
        return UserType.BROKERAGE;
      case 'lender':
        return UserType.LENDER;
      default:
        return UserType.BUSINESS;
    }
  };

  // Update the user context when role changes
  useEffect(() => {
    setUserType(roleToUserType(selectedRole));
    // Save role to localStorage for persistence
    localStorage.setItem('userRole', selectedRole);
    
    // Update available profiles when role changes
    setProfiles(profileTemplates[selectedRole]);
    
    // If there's no valid profile for the new role, select the first one
    if (!profileTemplates[selectedRole].find(p => p.id === selectedProfile)) {
      setSelectedProfile(profileTemplates[selectedRole][0].id);
    }
  }, [selectedRole, setUserType]);

  // Select a specific profile
  const handleProfileSelect = (profileId: string) => {
    setSelectedProfile(profileId);
    // Here you would update user context with the profile data
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      // Save profile data for persistence
      localStorage.setItem('userProfile', JSON.stringify(profile));
    }
  };

  // Recommend pages based on user role
  const getRecommendedPages = (): {name: string, path: string}[] => {
    switch(selectedRole) {
      case 'borrower':
        return [
          { name: 'Credit Application', path: '/credit-application' },
          { name: 'Document Center', path: '/documents' },
          { name: 'My Loans', path: '/my-loans' }
        ];
      case 'vendor':
        return [
          { name: 'Asset Listings', path: '/asset-listings' },
          { name: 'Document Center', path: '/documents' },
          { name: 'Sales Dashboard', path: '/vendor-dashboard' }
        ];
      case 'broker':
        return [
          { name: 'Client Applications', path: '/broker/applications' },
          { name: 'Lender Marketplace', path: '/lender-marketplace' },
          { name: 'Commission Reports', path: '/broker/commissions' }
        ];
      case 'lender':
        return [
          { name: 'Deal Pipeline', path: '/pipeline' },
          { name: 'Portfolio Overview', path: '/portfolio-wallet' },
          { name: 'Risk Assessment', path: '/risk-assessment/standard' }
        ];
      default:
        return [];
    }
  };

  const currentProfile = profiles.find(p => p.id === selectedProfile) || profiles[0];
  const recommendedPages = getRecommendedPages();

  return (
    <div className="bg-white shadow rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">User Profile Simulator</h2>
      
      {/* Role Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">1. Select Role</h3>
        <div className="grid grid-cols-4 gap-4">
          {(['borrower', 'vendor', 'broker', 'lender'] as const).map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`
                px-4 py-3 rounded-md text-center capitalize font-medium transition-all
                ${selectedRole === role 
                  ? 'bg-primary-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
              `}
            >
              {role}
            </button>
          ))}
        </div>
      </div>
      
      {/* Profile Selection */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">2. Select Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          {profiles.map(profile => (
            <div 
              key={profile.id}
              onClick={() => handleProfileSelect(profile.id)}
              className={`
                flex items-center p-4 rounded-lg cursor-pointer border transition-all
                ${selectedProfile === profile.id 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-200 hover:bg-gray-50'}
              `}
            >
              <div className="flex-shrink-0 mr-4">
                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                  {/* Placeholder avatar with initials if no image */}
                  {profile.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg font-medium text-gray-600">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{profile.name}</h4>
                <p className="text-sm text-gray-600">{profile.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Current Profile Details */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Active Profile</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="font-medium">{currentProfile.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Company</p>
            <p className="font-medium">{currentProfile.company}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{currentProfile.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{currentProfile.phone}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium capitalize">{currentProfile.role}</p>
          </div>
        </div>
      </div>
      
      {/* Recommended Pages */}
      <div>
        <h3 className="text-lg font-medium text-gray-700 mb-3">Recommended Pages</h3>
        <div className="grid grid-cols-3 gap-4">
          {recommendedPages.map((page, index) => (
            <button
              key={index}
              onClick={() => navigate(page.path)}
              className="bg-white border border-gray-300 rounded-md px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {page.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfileSimulator; 