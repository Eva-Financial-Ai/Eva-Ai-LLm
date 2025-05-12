/**
 * @component SmartMatching
 * @description AI-powered matching system for connecting borrowers, lenders, brokers, and vendors
 *
 * @userStories
 * 1. As a borrower, I want to be matched with lenders most likely to approve my loan so that I can avoid wasting time with rejections.
 * 2. As a lender, I want to see borrowers who meet my lending criteria so that I can focus on qualified leads with higher conversion potential.
 * 3. As a broker, I want to match my clients with appropriate lenders so that I can increase my deal success rate.
 * 4. As a vendor, I want to find businesses that need my equipment solutions so that I can expand my customer base with qualified leads.
 *
 * @userJourney Borrower Using Smart Matching
 * 1. Trigger: Borrower needs financing for equipment purchase
 * 2. Entry Point: Navigates to Smart Matching from dashboard
 * 3. Role Selection: Confirms borrower role (already selected based on account)
 * 4. Requirements Input: Enters financing needs, amount, timeline, business details
 * 5. Match Processing: System analyzes criteria against lender database
 * 6. Match Results: Views list of matched lenders with compatibility scores
 * 7. Profile Exploration: Reviews detailed profiles of top matches
 * 8. Preferences: Swipes right on preferred lenders, left on non-preferred
 * 9. Initial Contact: Receives notification when matched lender also expresses interest
 * 10. Communication: Initiates conversation via platform messaging
 * 11. Next Steps: Begins formal application process with selected lender
 */

import React, { useState, useRef, useEffect } from 'react';
// @ts-ignore
import { useSpring, animated } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';

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
    <div className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl h-[90vh] bg-white dark:bg-gray-900 rounded-lg flex flex-col shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="font-medium text-gray-900 dark:text-white">Smart Matching</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
              <svg
                className="h-12 w-12 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Smart Matching
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
              {userRole === 'lender' &&
                'Connect with pre-qualified borrowers that match your lending criteria.'}
              {userRole === 'borrower' &&
                'Find lenders that match your financing needs with higher approval chances.'}
              {userRole === 'broker' &&
                'Match your clients with the right lenders based on their specific needs.'}
              {userRole === 'vendor' &&
                'Connect with businesses that need your solutions based on their profiles.'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-left">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Match Criteria
                </h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    Credit Score Range
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    Business Industry
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    Financing Type
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    Geographic Location
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 text-left">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Benefits</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    Higher Approval Rate
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    Faster Decision Times
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    Better Terms Matching
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
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
                    Reduced Documentation
                  </li>
                </ul>
              </div>
            </div>

            <button className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Start Smart Matching
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartMatching;
