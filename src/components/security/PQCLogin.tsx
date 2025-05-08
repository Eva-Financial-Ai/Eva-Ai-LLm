import React, { useState, useEffect } from 'react';
import { usePQCryptography } from './PQCryptographyProvider';

// Add a type for the MOCK_USERS object with an index signature
interface MockUser {
  name: string;
  role: string;
  publicKey: string;
  id: string;
  mobileNumber?: string;
}

interface MockUsers {
  [key: string]: MockUser;
}

// Update the MOCK_USERS declaration with the proper type
const MOCK_USERS: MockUsers = {
  'admin': {
    name: 'Admin User',
    role: 'admin',
    publicKey: 'dilithium-pk-4a5f6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
    id: '1001',
    mobileNumber: '+1-555-123-4567'
  },
  'borrower': {
    name: 'John Smith',
    role: 'borrower',
    publicKey: 'dilithium-pk-1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    id: '1002',
    mobileNumber: '+1-555-234-5678'
  },
  'lender': {
    name: 'Financial Corp LLC',
    role: 'lender',
    publicKey: 'dilithium-pk-7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e',
    id: '1003',
    mobileNumber: '+1-555-345-6789'
  },
  'broker': {
    name: 'Finance Broker Inc',
    role: 'broker',
    publicKey: 'dilithium-pk-8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
    id: '1004',
    mobileNumber: '+1-555-456-7890'
  },
  'vendor': {
    name: 'Asset Supply Co',
    role: 'vendor',
    publicKey: 'dilithium-pk-9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
    id: '1005',
    mobileNumber: '+1-555-567-8901'
  }
};

interface PQCLoginProps {
  onLoginSuccess?: (userData: any) => void;
}

const PQCLogin: React.FC<PQCLoginProps> = ({ onLoginSuccess }) => {
  const { isReady, authenticateUser, encryptData, decryptData, signData, generateKeypair } = usePQCryptography();
  
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [authStep, setAuthStep] = useState<'credentials' | 'challenge' | 'key-generation' | '2fa'>('credentials');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [challenge, setChallenge] = useState('');
  const [userKeys, setUserKeys] = useState<{ publicKey: string; privateKey: string } | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  // Generate a cryptographic challenge for the user to sign
  const generateChallenge = () => {
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes, b => b.toString(16).padStart(2, '0')).join('');
  };
  
  useEffect(() => {
    // Reset state when component mounts
    setAuthStep('credentials');
    setError(null);
    setLoading(false);
  }, []);
  
  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (authMode === 'signin') {
        // Sign in flow
        const user = MOCK_USERS[username.toLowerCase()];
        if (!user) {
          throw new Error('Invalid username. Try "admin", "borrower", "lender", "broker", or "vendor"');
        }
        
        // Proceed to 2FA step
        setLoading(false);
        setOtpSent(true);
        
        // Simulate sending 2FA code
        setTimeout(() => {
          setAuthStep('2fa');
        }, 1500);
        
      } else {
        // Sign up flow
        if (!mobileNumber) {
          throw new Error('Mobile number is required for signup');
        }
        
        if (MOCK_USERS[username.toLowerCase()]) {
          throw new Error('Username already exists. Please choose another.');
        }
        
        // For signup flow, we'll generate keys
        setAuthStep('key-generation');
        setLoading(false);
      }
      
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setLoading(false);
    }
  };
  
  const handleKeyGeneration = async () => {
    setLoading(true);
    try {
      // Generate quantum-resistant keys for the user
      const keys = await generateKeypair('CRYSTALS-Dilithium');
      setUserKeys(keys);
      
      // Generate challenge for authentication
      const newChallenge = generateChallenge();
      setChallenge(newChallenge);
      
      // For signup flow, proceed to challenge step
      setAuthStep('challenge');
      
    } catch (err: any) {
      setError(err.message || 'Key generation failed');
    } finally {
      setLoading(false);
    }
  };
  
  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, verify the 2FA code
      // For this demo, we'll accept "123456" as a valid code
      if (twoFactorCode === '123456') {
        const user = MOCK_USERS[username.toLowerCase()];
        handleSuccessfulAuth(user);
      } else {
        throw new Error('Invalid verification code. Try "123456"');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };
  
  const handleChallengeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, the user's wallet/app would sign the challenge
      // For this demo, we'll simulate a successful signature verification
      
      if (authMode === 'signup') {
        // Create a new user
        const newUser = {
          name: username, // In a real app, you'd collect the full name
          role: 'borrower', // Default role
          publicKey: userKeys?.publicKey || '',
          id: `${Date.now()}`,
          mobileNumber: mobileNumber
        };
        
        // In a real app, you would save this to your database
        // For our demo, we just simulate success
        handleSuccessfulAuth(newUser);
      } else if (userKeys) {
        // Sign in with generated keys
        const signature = await signData(challenge, userKeys.privateKey);
        
        // Verify the signature
        const user = MOCK_USERS['lender'];
        const authenticated = true; // This would be the result of authenticateUser
        
        if (authenticated) {
          handleSuccessfulAuth(user);
        } else {
          throw new Error('Signature verification failed');
        }
      } else {
        // For existing users, simulate verification
        const user = MOCK_USERS[username.toLowerCase()];
        
        // In a real app, you'd verify the signature
        if (password === 'quantum') {
          handleSuccessfulAuth(user);
        } else {
          throw new Error('Invalid password. Try "quantum"');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSuccessfulAuth = (user: any) => {
    // In a real app, create a session, get tokens, etc.
    
    // If onLoginSuccess callback was provided, call it
    if (onLoginSuccess) {
      onLoginSuccess(user);
    }
    
    // Remove navigation - rely on parent component to handle this
    // navigate('/');
  };
  
  // Render loading spinner when PQC modules are initializing
  if (!isReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-600">Initializing quantum-resistant cryptography...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Quantum-Resistant Login</h2>
          <p className="text-sm text-gray-600 mt-2">
            Secure authentication using post-quantum cryptography
          </p>
        </div>
        
        {/* Toggle between sign in and sign up */}
        <div className="flex justify-center mb-8">
          <div className="flex p-1 bg-gray-100 rounded-md">
            <button
              onClick={() => setAuthMode('signin')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                authMode === 'signin'
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setAuthMode('signup');
                setAuthStep('credentials');
              }}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                authMode === 'signup'
                  ? 'bg-white shadow-sm text-gray-800'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-md mb-6">
            {error}
          </div>
        )}
        
        {authStep === 'credentials' && (
          <form onSubmit={handleUsernameSubmit}>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder={authMode === 'signin' ? "Try 'admin', 'borrower', 'lender', 'broker', or 'vendor'" : "Choose a username"}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile Number {authMode === 'signup' && <span className="text-red-500">*</span>}
                </label>
                <input
                  id="mobileNumber"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your mobile number for 2FA"
                  required={authMode === 'signup'}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {authMode === 'signin' 
                    ? "We'll send a verification code to this number" 
                    : "This number will be used for 2FA verification"}
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <button
                type="submit"
                disabled={loading || !username || (authMode === 'signup' && !mobileNumber)}
                className={`w-full sm:flex-1 px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading 
                  ? 'Processing...' 
                  : authMode === 'signin' 
                    ? otpSent ? 'Sending verification code...' : 'Continue' 
                    : 'Create Account'}
              </button>
              
              {authMode === 'signin' && (
                <button
                  type="button"
                  className="w-full sm:flex-1 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Use Hardware Security Key
                </button>
              )}
            </div>
          </form>
        )}
        
        {authStep === '2fa' && (
          <form onSubmit={handle2FASubmit}>
            <div className="mb-6">
              <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-md mb-6">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>Verification code sent to {mobileNumber || MOCK_USERS[username.toLowerCase()]?.mobileNumber || 'your mobile'}</p>
                </div>
              </div>
              
              <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-700 mb-2">
                Enter verification code
              </label>
              <input
                id="twoFactorCode"
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-center tracking-widest font-mono text-xl"
                placeholder="123456"
                maxLength={6}
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Enter the 6-digit code sent to your mobile number. For demo, use "123456".
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <button
                type="submit"
                disabled={loading || twoFactorCode.length !== 6}
                className={`w-full sm:flex-1 px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setAuthStep('credentials');
                  setTwoFactorCode('');
                  setOtpSent(false);
                }}
                className="w-full sm:flex-1 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Back
              </button>
            </div>
          </form>
        )}
        
        {authStep === 'key-generation' && (
          <div>
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-6 py-4 rounded-md mb-6">
              <p>
                First-time login detected. We need to generate quantum-resistant cryptographic keys for your account.
              </p>
            </div>
            
            <div className="space-y-6 mb-6">
              <p className="text-gray-600">
                This will create a CRYSTALS-Dilithium key pair for:
              </p>
              <ul className="text-gray-700 list-disc list-inside space-y-2">
                <li>Digital signatures</li>
                <li>Transaction verification</li>
                <li>Secure communication</li>
              </ul>
              
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <h3 className="font-medium mb-2">Account Information</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-500">Username:</div>
                  <div className="font-medium">{username}</div>
                  <div className="text-gray-500">Mobile:</div>
                  <div className="font-medium">{mobileNumber}</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <button
                onClick={handleKeyGeneration}
                disabled={loading}
                className={`w-full sm:flex-1 px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                    Generating Keys...
                  </span>
                ) : (
                  'Generate Quantum-Resistant Keys'
                )}
              </button>
              
              <button
                onClick={() => {
                  setAuthStep('credentials');
                }}
                className="w-full sm:flex-1 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Back
              </button>
            </div>
          </div>
        )}
        
        {authStep === 'challenge' && (
          <form onSubmit={handleChallengeSubmit}>
            <div className="mb-6">
              <div className="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded-md mb-6">
                <p>
                  {userKeys ? (
                    <>Your new key pair has been generated. Please complete authentication.</>
                  ) : (
                    <>Authentication challenge ready. Please enter your passphrase to sign the challenge.</>
                  )}
                </p>
              </div>
              
              {!userKeys && authMode === 'signin' && (
                <div className="mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Passphrase
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter 'quantum' to proceed"
                    required
                  />
                </div>
              )}
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Challenge
                </label>
                <div className="w-full px-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500 text-sm font-mono overflow-hidden text-ellipsis">
                  {challenge}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <button
                type="submit"
                disabled={loading || (!userKeys && !password && authMode === 'signin')}
                className={`w-full sm:flex-1 px-6 py-3 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Verifying...' : authMode === 'signup' ? 'Complete Registration' : 'Complete Authentication'}
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setAuthStep('credentials');
                  setPassword('');
                }}
                className="w-full sm:flex-1 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Back
              </button>
            </div>
          </form>
        )}
        
        <div className="text-center text-sm text-gray-500 mt-8">
          <p>
            Using NIST-approved post-quantum cryptography:
            <br />
            <span className="font-mono text-xs">CRYSTALS-Kyber & CRYSTALS-Dilithium</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PQCLogin; 