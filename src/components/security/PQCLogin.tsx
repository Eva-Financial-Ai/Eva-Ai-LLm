import React, { useState, useEffect } from 'react';
import { usePQCryptography } from './PQCryptographyProvider';

// Whitelist of allowed emails for development
const ALLOWED_EMAILS = [
  'justin@evafi.ai',
  'rao@evafi.ai',
  'abel@evafi.ai',
  'lahari@evafi.ai',
  'tech@evafi.ai',
  'demo@evafi.ai',
  'customer@lender.com',
  'investor@gmail.com',
];

// Allowed phone number for development access
const ALLOWED_PHONE = '7027654321';

// Add a type for the MOCK_USERS object with an index signature
interface MockUser {
  name: string;
  role: string;
  publicKey: string;
  id: string;
  mobileNumber?: string;
  email?: string;
}

interface MockUsers {
  [key: string]: MockUser;
}

// Update the MOCK_USERS declaration with the proper type and add emails
const MOCK_USERS: MockUsers = {
  admin: {
    name: 'Admin User',
    role: 'admin',
    publicKey: 'dilithium-pk-4a5f6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b',
    id: '1001',
    mobileNumber: ALLOWED_PHONE,
    email: 'tech@evafi.ai',
  },
  borrower: {
    name: 'John Smith',
    role: 'borrower',
    publicKey: 'dilithium-pk-1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    id: '1002',
    mobileNumber: ALLOWED_PHONE,
    email: 'customer@lender.com',
  },
  lender: {
    name: 'Financial Corp LLC',
    role: 'lender',
    publicKey: 'dilithium-pk-7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e',
    id: '1003',
    mobileNumber: ALLOWED_PHONE,
    email: 'justin@evafi.ai',
  },
  broker: {
    name: 'Finance Broker Inc',
    role: 'broker',
    publicKey: 'dilithium-pk-8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f',
    id: '1004',
    mobileNumber: ALLOWED_PHONE,
    email: 'rao@evafi.ai',
  },
  vendor: {
    name: 'Asset Supply Co',
    role: 'vendor',
    publicKey: 'dilithium-pk-9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a',
    id: '1005',
    mobileNumber: ALLOWED_PHONE,
    email: 'investor@gmail.com',
  },
};

interface PQCLoginProps {
  onLoginSuccess?: (userData: any) => void;
}

const PQCLogin: React.FC<PQCLoginProps> = ({ onLoginSuccess }) => {
  const { isReady, authenticateUser, encryptData, decryptData, signData, generateKeypair } =
    usePQCryptography();

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [authStep, setAuthStep] = useState<'credentials' | 'challenge' | 'key-generation' | '2fa'>(
    'credentials'
  );
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

  const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    if (!ALLOWED_EMAILS.includes(email.toLowerCase())) {
      return 'This email is not authorized for development access';
    }
    return null;
  };

  const validatePhone = (phone: string) => {
    if (!phone) return 'Phone number is required';
    if (phone !== ALLOWED_PHONE) {
      return 'Invalid phone number for development access';
    }
    return null;
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (authMode === 'signin') {
        // Sign in flow
        const user = MOCK_USERS[username.toLowerCase()];

        if (!user) {
          throw new Error(
            'Invalid username. Try "admin", "borrower", "lender", "broker", or "vendor"'
          );
        }

        // Validate the email if provided
        if (email) {
          const emailError = validateEmail(email);
          if (emailError) {
            throw new Error(emailError);
          }

          // Check if email matches user's email
          if (user.email && user.email.toLowerCase() !== email.toLowerCase()) {
            throw new Error('Email does not match the account');
          }
        }

        // Validate phone number
        if (mobileNumber !== ALLOWED_PHONE) {
          throw new Error('Invalid phone number for development access');
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

        // Validate the email
        const emailError = validateEmail(email);
        if (emailError) {
          throw new Error(emailError);
        }

        // Validate phone number
        if (mobileNumber !== ALLOWED_PHONE) {
          throw new Error('Invalid phone number for development access');
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
          mobileNumber: mobileNumber,
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {authMode === 'signin'
              ? 'Sign in with quantum-secure authentication'
              : 'Sign up for quantum-secure authentication'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {authMode === 'signin'
              ? 'Using post-quantum cryptography for enhanced security'
              : 'Create a new quantum-secure account'}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {authStep === 'credentials' && (
          <form className="mt-8 space-y-6" onSubmit={handleUsernameSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="username" className="sr-only">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                  placeholder="Email (must be on whitelist)"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="mobile-number" className="sr-only">
                  Mobile Number
                </label>
                <input
                  id="mobile-number"
                  name="mobileNumber"
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                  placeholder="Mobile Number (7027654321)"
                  value={mobileNumber}
                  onChange={e => setMobileNumber(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="text-sm text-center">
              <p className="font-medium text-gray-500">Development System Access Only</p>
              <p className="text-xs text-gray-400 mt-1">
                Restricted to authorized emails and phone number
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg
                      className="animate-spin h-5 w-5 text-indigo-300"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </span>
                ) : (
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                )}
                {loading ? 'Please wait...' : 'Continue'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-500"
                onClick={() => {
                  setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                  setError(null);
                }}
              >
                {authMode === 'signin'
                  ? 'Sign up for a new account'
                  : 'Sign in with existing account'}
              </button>
            </div>
          </form>
        )}

        {authStep === '2fa' && (
          <form onSubmit={handle2FASubmit}>
            <div className="mb-6">
              <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-md mb-6">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p>
                    Verification code sent to{' '}
                    {mobileNumber ||
                      MOCK_USERS[username.toLowerCase()]?.mobileNumber ||
                      'your mobile'}
                  </p>
                </div>
              </div>

              <label
                htmlFor="twoFactorCode"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Enter verification code
              </label>
              <input
                id="twoFactorCode"
                type="text"
                value={twoFactorCode}
                onChange={e => setTwoFactorCode(e.target.value)}
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
                First-time login detected. We need to generate quantum-resistant cryptographic keys
                for your account.
              </p>
            </div>

            <div className="space-y-6 mb-6">
              <p className="text-gray-600">This will create a CRYSTALS-Dilithium key pair for:</p>
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
                    <>
                      Authentication challenge ready. Please enter your passphrase to sign the
                      challenge.
                    </>
                  )}
                </p>
              </div>

              {!userKeys && authMode === 'signin' && (
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Passphrase
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter 'quantum' to proceed"
                    required
                  />
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Challenge</label>
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
                {loading
                  ? 'Verifying...'
                  : authMode === 'signup'
                    ? 'Complete Registration'
                    : 'Complete Authentication'}
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
