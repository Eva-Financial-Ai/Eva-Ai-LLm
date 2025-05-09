import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore
import { useSpring, animated } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';

// Types for matching system
type UserRole = 'borrower' | 'broker' | 'vendor' | 'lender';

interface MatchProfile {
  id: string;
  name: string;
  role: UserRole;
  description: string;
  amount?: number;
  rate?: number;
  term?: number;
  industry?: string;
  location?: string;
  yearEstablished?: number;
  projectType?: string;
  fundingSpeed?: string;
  avatarUrl: string;
  matchScore: number;
  credit?: { score: number; rating: string };
  dealVolume?: string;
  contactInfo?: {
    email: string;
    phone: string;
  };
}

// Stats tracking interface
interface MatchStats {
  totalSwipes: number;
  rightSwipes: number;
  leftSwipes: number;
  timeSpent: number;
  startTime: number;
  mutualMatches: number;
  dealMatchRate: number;
}

// Role compatibility mapping - defines which roles a user can match with
const COMPATIBLE_ROLES: Record<UserRole, UserRole[]> = {
  lender: ['borrower', 'broker'],
  borrower: ['lender', 'broker'],
  broker: ['borrower', 'lender'],
  vendor: ['borrower', 'broker', 'lender'], // Assuming vendors can match with all
};

// Mock data based on user role
const MOCK_PROFILES: Record<UserRole, MatchProfile[]> = {
  borrower: [
    {
      id: 'lender-1',
      name: 'Northeast Capital Partners',
      role: 'lender',
      description: 'Specializing in equipment financing with competitive rates',
      rate: 5.75,
      term: 60,
      industry: 'Manufacturing',
      location: 'Boston, MA',
      yearEstablished: 2005,
      fundingSpeed: 'Fast (7-10 days)',
      avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
      matchScore: 92,
      dealVolume: '$250M+ annually',
      contactInfo: {
        email: 'deals@northeastcapital.com',
        phone: '(617) 555-1234',
      },
    },
    {
      id: 'lender-2',
      name: 'Accelerated Funding Solutions',
      role: 'lender',
      description: 'Fast approval commercial real estate loans',
      rate: 6.25,
      term: 120,
      industry: 'Real Estate',
      location: 'Chicago, IL',
      yearEstablished: 2010,
      fundingSpeed: 'Very Fast (3-5 days)',
      avatarUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
      matchScore: 87,
      dealVolume: '$150M+ annually',
      contactInfo: {
        email: 'funding@acceleratedfunding.com',
        phone: '(312) 555-6789',
      },
    },
    {
      id: 'broker-1',
      name: 'Premium Finance Partners',
      role: 'broker',
      description: 'Specialized equipment finance brokerage with lender relationships',
      industry: 'Finance',
      location: 'New York, NY',
      yearEstablished: 2012,
      fundingSpeed: 'Medium (10-14 days)',
      avatarUrl: 'https://randomuser.me/api/portraits/men/61.jpg',
      matchScore: 89,
      dealVolume: '$75M+ annually',
      contactInfo: {
        email: 'brokers@premiumfinance.com',
        phone: '(212) 555-9876',
      },
    },
  ],
  broker: [
    {
      id: 'borrower-1',
      name: 'Innovative Manufacturing Inc.',
      role: 'borrower',
      description: 'Seeking equipment financing for expansion',
      amount: 450000,
      industry: 'Manufacturing',
      location: 'Detroit, MI',
      yearEstablished: 2008,
      projectType: 'Equipment Purchase',
      credit: { score: 720, rating: 'Good' },
      avatarUrl: 'https://randomuser.me/api/portraits/men/22.jpg',
      matchScore: 95,
      contactInfo: {
        email: 'finance@innovativemfg.com',
        phone: '(313) 555-4321',
      },
    },
    {
      id: 'lender-1',
      name: 'Capital Express Funding',
      role: 'lender',
      description: 'Looking for quality broker partners',
      rate: 5.25,
      industry: 'Finance',
      location: 'Denver, CO',
      yearEstablished: 2007,
      fundingSpeed: 'Fast (5-7 days)',
      avatarUrl: 'https://randomuser.me/api/portraits/women/61.jpg',
      matchScore: 88,
      dealVolume: '$120M+ annually',
      contactInfo: {
        email: 'partners@capitalexpress.com',
        phone: '(720) 555-2468',
      },
    },
  ],
  lender: [
    {
      id: 'borrower-1',
      name: 'Summit Properties LLC',
      role: 'borrower',
      description: 'Commercial property refinance opportunity',
      amount: 1250000,
      term: 84,
      industry: 'Real Estate',
      location: 'Seattle, WA',
      yearEstablished: 2003,
      projectType: 'Refinance',
      credit: { score: 760, rating: 'Excellent' },
      avatarUrl: 'https://randomuser.me/api/portraits/men/42.jpg',
      matchScore: 94,
      contactInfo: {
        email: 'refinance@summitproperties.com',
        phone: '(206) 555-7890',
      },
    },
    {
      id: 'broker-1',
      name: 'Elite Financial Brokers',
      role: 'broker',
      description: 'Specialized in quality commercial deals',
      industry: 'Finance',
      location: 'Miami, FL',
      yearEstablished: 2015,
      fundingSpeed: 'Medium (7-14 days)',
      avatarUrl: 'https://randomuser.me/api/portraits/men/91.jpg',
      matchScore: 88,
      dealVolume: '$60M+ annually',
      contactInfo: {
        email: 'deals@elitefinancial.com',
        phone: '(305) 555-1357',
      },
    },
  ],
  vendor: [
    {
      id: 'borrower-1',
      name: 'Modern Tech Solutions',
      role: 'borrower',
      description: 'Looking for equipment with financing options',
      amount: 320000,
      industry: 'Technology',
      avatarUrl: 'https://randomuser.me/api/portraits/men/29.jpg',
      matchScore: 91,
    },
    {
      id: 'lender-1',
      name: 'VendorFin Capital',
      role: 'lender',
      description: 'Specialized in vendor equipment financing',
      rate: 6.0,
      term: 48,
      industry: 'Finance',
      avatarUrl: 'https://randomuser.me/api/portraits/women/54.jpg',
      matchScore: 89,
    },
    {
      id: 'broker-1',
      name: 'Alliance Broker Network',
      role: 'broker',
      description: 'Connecting vendors with qualified buyers',
      industry: 'Finance',
      avatarUrl: 'https://randomuser.me/api/portraits/men/62.jpg',
      matchScore: 83,
    },
  ],
};

interface SmartMatchingProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
}

const SmartMatching: React.FC<SmartMatchingProps> = ({
  isOpen,
  onClose,
  userRole: initialUserRole,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [profiles, setProfiles] = useState<MatchProfile[]>([]);
  const [matches, setMatches] = useState<string[]>([]);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<MatchProfile | null>(null);
  const [userRole, setUserRole] = useState<UserRole>(initialUserRole);
  const [showAllMatches, setShowAllMatches] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'swipe' | 'list'>('swipe');
  const [allMatches, setAllMatches] = useState<MatchProfile[]>([]);

  const [stats, setStats] = useState<MatchStats>({
    totalSwipes: 0,
    rightSwipes: 0,
    leftSwipes: 0,
    timeSpent: 0,
    startTime: Date.now(),
    mutualMatches: 0,
    dealMatchRate: 0,
  });

  const navigate = useNavigate();

  // Load from localStorage on mount
  useEffect(() => {
    const savedMatches = localStorage.getItem(`eva_matches_${userRole}`);
    const savedStats = localStorage.getItem(`eva_matchstats_${userRole}`);

    if (savedMatches) {
      setMatches(JSON.parse(savedMatches));
    }

    if (savedStats) {
      setStats({
        ...JSON.parse(savedStats),
        startTime: Date.now(),
      });
    }

    // For demonstration purposes, immediately populate allMatches
    // with some mock data that would normally be loaded from an API
    const mockAllMatches = [...MOCK_PROFILES[userRole]].filter((_, index) => index % 2 === 0);
    setAllMatches(mockAllMatches);
  }, [userRole]);

  // Initialize profiles when component mounts or userRole changes
  useEffect(() => {
    // Find compatible roles for the current user
    const compatibleRoles = COMPATIBLE_ROLES[userRole];

    if (!compatibleRoles) return;

    // Update profiles based on userRole
    const newProfiles = MOCK_PROFILES[userRole] || [];
    setProfiles(newProfiles);
    setCurrentIndex(0);

    // Reset stats for the new user role
    setStats({
      totalSwipes: 0,
      rightSwipes: 0,
      leftSwipes: 0,
      timeSpent: 0,
      startTime: Date.now(),
      mutualMatches: 0,
      dealMatchRate: 0,
    });
  }, [userRole]);

  // Track time spent
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isOpen) {
      interval = setInterval(() => {
        setStats(prev => ({
          ...prev,
          timeSpent: Math.floor((Date.now() - prev.startTime) / 1000),
        }));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen]);

  // Reference for card being swiped
  const swiperRef = useRef<HTMLDivElement>(null);

  // Spring animation for card
  const [{ x, y, rotate, scale }, api] = useSpring(() => ({
    x: 0,
    y: 0,
    rotate: 0,
    scale: 1,
    config: { tension: 300, friction: 30 },
  }));

  // Function to save match data to localStorage
  const saveMatchData = (updatedMatches: string[], updatedStats: MatchStats) => {
    try {
      localStorage.setItem(`eva_matches_${userRole}`, JSON.stringify(updatedMatches));
      localStorage.setItem(`eva_matchstats_${userRole}`, JSON.stringify(updatedStats));
    } catch (error) {
      console.error('Error saving match data:', error);
    }
  };

  // Switch user role function
  const handleSwitchRole = (newRole: UserRole) => {
    // Save current data before switching
    saveMatchData(matches, stats);

    // Update role and reset view
    setUserRole(newRole);
    setViewMode('swipe');
    setShowAllMatches(false);
  };

  // Handle swipe gesture
  const handleSwipe = (dir: 'left' | 'right') => {
    if (currentIndex >= profiles.length) return;

    const profile = profiles[currentIndex];

    // Update animation
    setDirection(dir);

    const swipeDistance = window.innerWidth * 1.5;
    api.start({
      x: dir === 'right' ? swipeDistance : -swipeDistance,
      y: 0,
      rotate: dir === 'right' ? 45 : -45,
      scale: 0.8,
      onRest: finishSwipe,
    });

    // Update stats
    const newStats = {
      ...stats,
      totalSwipes: stats.totalSwipes + 1,
      rightSwipes: stats.rightSwipes + (dir === 'right' ? 1 : 0),
      leftSwipes: stats.leftSwipes + (dir === 'left' ? 1 : 0),
    };

    // If swiped right, add to matches
    if (dir === 'right') {
      const updatedMatches = [...matches, profile.id];
      setMatches(updatedMatches);

      // Simulate a mutual match with 40% probability
      if (Math.random() < 0.4) {
        setTimeout(() => {
          setMatchedProfile(profile);
          setShowMatch(true);

          // Update match stats
          const matchStats = {
            ...newStats,
            mutualMatches: newStats.mutualMatches + 1,
            dealMatchRate: Math.round(((newStats.mutualMatches + 1) / newStats.rightSwipes) * 100),
          };
          setStats(matchStats);
          saveMatchData(updatedMatches, matchStats);

          // Add to allMatches for the list view
          setAllMatches([...allMatches, profile]);
        }, 500);
      } else {
        setStats(newStats);
        saveMatchData([...matches, profile.id], newStats);
      }
    } else {
      setStats(newStats);
      saveMatchData(matches, newStats);
    }
  };

  // Complete the swipe animation
  const finishSwipe = () => {
    setDirection(null);
    setCurrentIndex(prev => prev + 1);

    api.start({
      x: 0,
      y: 0,
      rotate: 0,
      scale: 1,
      immediate: true,
    });
  };

  // Get current profile
  const currentProfile = profiles[currentIndex];

  // Determine if all profiles have been viewed
  const allProfilesViewed = currentIndex >= profiles.length;

  // Render detailed profile information
  const renderProfileDetails = (profile: MatchProfile) => {
    const roleColor =
      profile.role === 'borrower'
        ? 'blue'
        : profile.role === 'lender'
          ? 'green'
          : profile.role === 'broker'
            ? 'purple'
            : 'gray';

    return (
      <div className="p-4">
        <div className="flex items-center mb-3">
          <span
            className={`px-2 py-1 text-xs rounded-full bg-${roleColor}-100 text-${roleColor}-800 mr-2`}
          >
            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
          </span>
          <span className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800">
            {profile.matchScore}% Match
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{profile.name}</h3>
        <p className="text-gray-600 mb-4">{profile.description}</p>

        <div className="space-y-3 mb-4">
          {profile.industry && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Industry:</span>
              <span className="text-sm font-medium">{profile.industry}</span>
            </div>
          )}

          {profile.location && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Location:</span>
              <span className="text-sm font-medium">{profile.location}</span>
            </div>
          )}

          {profile.yearEstablished && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Established:</span>
              <span className="text-sm font-medium">{profile.yearEstablished}</span>
            </div>
          )}

          {profile.amount && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Amount:</span>
              <span className="text-sm font-medium">${profile.amount.toLocaleString()}</span>
            </div>
          )}

          {profile.rate && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Rate:</span>
              <span className="text-sm font-medium">{profile.rate}%</span>
            </div>
          )}

          {profile.term && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Term:</span>
              <span className="text-sm font-medium">{profile.term} months</span>
            </div>
          )}

          {profile.credit && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Credit:</span>
              <span className="text-sm font-medium">
                {profile.credit.score} ({profile.credit.rating})
              </span>
            </div>
          )}

          {profile.projectType && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Project Type:</span>
              <span className="text-sm font-medium">{profile.projectType}</span>
            </div>
          )}

          {profile.fundingSpeed && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Funding Speed:</span>
              <span className="text-sm font-medium">{profile.fundingSpeed}</span>
            </div>
          )}

          {profile.dealVolume && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Deal Volume:</span>
              <span className="text-sm font-medium">{profile.dealVolume}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Handle dismissing a match
  const dismissMatch = () => {
    setShowMatch(false);
    setMatchedProfile(null);
  };

  // Format time for display
  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes < 60) {
      return `${minutes}m ${remainingSeconds}s`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}m`;
  };

  // Get description based on role
  const getRoleDescription = () => {
    switch (userRole) {
      case 'borrower':
        return 'Find lenders and brokers for your financing needs';
      case 'lender':
        return 'Discover qualified borrowers and broker partners';
      case 'broker':
        return 'Connect with lenders and potential clients';
      case 'vendor':
        return 'Match with potential equipment buyers and partners';
      default:
        return 'Find your perfect financial match';
    }
  };

  // View all matches
  const handleViewAllMatches = () => {
    setViewMode('list');
  };

  // Return to swipe view
  const handleReturnToSwipe = () => {
    setViewMode('swipe');
  };

  // Handle connect with match - navigate to deal structuring
  const handleConnect = (match: MatchProfile) => {
    // Close the smart matching modal
    onClose();

    // Navigate to deal structuring page with the match information
    navigate('/deal-structuring', {
      state: {
        propertyId: match.id,
        propertyName: match.name,
        matchScore: match.matchScore,
        amount: match.amount,
      },
    });
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[90vh] flex flex-col relative overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Smart Matching</h2>
            <p className="text-sm text-gray-500 mt-0.5">Find your perfect match</p>
          </div>

          {/* User role toggle */}
          <div className="flex items-center space-x-2">
            <select
              value={userRole}
              onChange={e => handleSwitchRole(e.target.value as UserRole)}
              className="text-sm rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="borrower">As Borrower</option>
              <option value="broker">As Broker</option>
              <option value="lender">As Lender</option>
              <option value="vendor">As Vendor</option>
            </select>

            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="px-6 py-2 flex justify-between items-center border-b border-gray-200 bg-gray-50">
          <div className="flex space-x-2">
            <button
              onClick={handleReturnToSwipe}
              className={`px-3 py-1 text-sm rounded-md ${viewMode === 'swipe' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Swipe View
            </button>
            <button
              onClick={handleViewAllMatches}
              className={`px-3 py-1 text-sm rounded-md ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Matches List
            </button>
          </div>

          <div className="text-sm text-gray-600">
            <button
              onClick={handleViewAllMatches}
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              {stats.mutualMatches} matches so far
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-hidden bg-gray-50 relative">
          {/* Swipe View */}
          {viewMode === 'swipe' && (
            <div className="h-full flex flex-col">
              {!allProfilesViewed && currentProfile ? (
                <div className="relative flex-1 flex items-center justify-center px-4 py-6">
                  {/* Card to be swiped */}
                  <animated.div
                    ref={swiperRef}
                    style={{
                      x,
                      y,
                      rotate,
                      scale,
                      touchAction: 'none',
                    }}
                    className="absolute w-full max-w-sm bg-white rounded-xl shadow-lg overflow-hidden"
                  >
                    {/* Profile image */}
                    <div className="h-64 bg-gray-300 relative">
                      <img
                        src={currentProfile.avatarUrl}
                        alt={currentProfile.name}
                        className="w-full h-full object-cover"
                      />

                      {/* Match score overlay */}
                      <div className="absolute top-3 right-3 bg-white bg-opacity-90 rounded-full px-3 py-1 text-sm font-bold text-primary-600">
                        {currentProfile.matchScore}% Match
                      </div>

                      {/* Role badge */}
                      <div className="absolute bottom-3 left-3 bg-primary-600 text-white text-xs px-2 py-1 rounded-md uppercase tracking-wider">
                        {currentProfile.role}
                      </div>
                    </div>

                    {/* Profile details */}
                    {renderProfileDetails(currentProfile)}
                  </animated.div>

                  {/* Swipe direction indicators */}
                  {direction === 'left' && (
                    <div className="absolute top-5 left-5 bg-red-500 text-white px-4 py-2 rounded-lg transform -rotate-12 text-xl font-bold">
                      PASS
                    </div>
                  )}

                  {direction === 'right' && (
                    <div className="absolute top-5 right-5 bg-green-500 text-white px-4 py-2 rounded-lg transform rotate-12 text-xl font-bold">
                      MATCH
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center p-8">
                  <div className="text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No more profiles</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You've seen all available matches for now. Check back later for new
                      opportunities.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={handleViewAllMatches}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                      >
                        View Your Matches
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              {!allProfilesViewed && currentProfile && (
                <div className="px-6 py-4 flex justify-center space-x-6 bg-white border-t border-gray-200">
                  <button
                    onClick={() => handleSwipe('left')}
                    className="w-14 h-14 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow hover:shadow-md"
                  >
                    <svg
                      className="h-6 w-6 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => handleSwipe('right')}
                    className="w-14 h-14 flex items-center justify-center rounded-full bg-white border border-gray-300 shadow hover:shadow-md"
                  >
                    <svg
                      className="h-6 w-6 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Matches List View */}
          {viewMode === 'list' && (
            <div className="h-full flex flex-col">
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your Matches</h3>
                <p className="text-sm text-gray-500 mb-4">
                  You have matched with {allMatches.length}{' '}
                  {allMatches.length === 1 ? 'profile' : 'profiles'}
                </p>

                {allMatches.length === 0 ? (
                  <div className="text-center py-8">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No matches yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start swiping to find your perfect matches
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={handleReturnToSwipe}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Start Matching
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                    <ul className="divide-y divide-gray-200">
                      {allMatches.map(match => (
                        <li key={match.id} className="py-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <img
                                src={match.avatarUrl}
                                alt={match.name}
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {match.name}
                                </p>
                                <span
                                  className={`ml-2 px-2 py-0.5 text-xs rounded-full 
                                  ${
                                    match.role === 'borrower'
                                      ? 'bg-blue-100 text-blue-800'
                                      : match.role === 'lender'
                                        ? 'bg-green-100 text-green-800'
                                        : match.role === 'broker'
                                          ? 'bg-purple-100 text-purple-800'
                                          : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {match.role.charAt(0).toUpperCase() + match.role.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 truncate">{match.description}</p>
                              <div className="mt-1 flex items-center">
                                <span className="text-xs text-primary-600 font-medium">
                                  {match.matchScore}% Match
                                </span>
                                {match.industry && (
                                  <span className="ml-2 text-xs text-gray-500">
                                    • {match.industry}
                                  </span>
                                )}
                                {match.location && (
                                  <span className="ml-2 text-xs text-gray-500">
                                    • {match.location}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex-shrink-0">
                              <button
                                onClick={() => handleConnect(match)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-primary-700 bg-primary-100 hover:bg-primary-200"
                              >
                                Connect
                              </button>
                            </div>
                          </div>

                          {/* Key details */}
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            {match.amount && (
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">Amount:</span> $
                                {match.amount.toLocaleString()}
                              </div>
                            )}
                            {match.rate && (
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">Rate:</span> {match.rate}%
                              </div>
                            )}
                            {match.term && (
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">Term:</span> {match.term} months
                              </div>
                            )}
                            {match.credit && (
                              <div className="text-xs text-gray-500">
                                <span className="font-medium">Credit:</span> {match.credit.rating}
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Match notification overlay */}
          {showMatch && matchedProfile && (
            <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-20">
              <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center">
                <div className="h-20 w-20 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg
                    className="h-10 w-10 text-primary-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">It's a Match!</h3>
                <p className="text-gray-600 mb-6">
                  You and <span className="font-semibold">{matchedProfile.name}</span> have
                  expressed interest in each other
                </p>

                <div className="flex -space-x-4 justify-center mb-6">
                  <img
                    src={matchedProfile.avatarUrl}
                    alt=""
                    className="w-16 h-16 rounded-full border-2 border-white object-cover z-10"
                  />
                  <img
                    src="https://randomuser.me/api/portraits/women/18.jpg"
                    alt=""
                    className="w-16 h-16 rounded-full border-2 border-white object-cover"
                  />
                </div>

                <div className="space-y-3">
                  <button
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                    onClick={() => {
                      dismissMatch();
                      handleViewAllMatches();
                    }}
                  >
                    View All Matches
                  </button>

                  <button
                    className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    onClick={dismissMatch}
                  >
                    Keep Swiping
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Stats footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex justify-between">
          <div>Time: {formatTime(stats.timeSpent)}</div>
          <div>Swipes: {stats.totalSwipes}</div>
          <div>Match Rate: {stats.dealMatchRate}%</div>
        </div>
      </div>
    </div>
  );
};

export default SmartMatching;
