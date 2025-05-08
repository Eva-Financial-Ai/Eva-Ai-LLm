import React, { useState, useEffect } from 'react';
import { usePQCryptography } from './PQCryptographyProvider';

interface SessionExpiryNotificationProps {
  onReauthenticate: () => void;
}

const SessionExpiryNotification: React.FC<SessionExpiryNotificationProps> = ({ 
  onReauthenticate 
}) => {
  const { sessionTimeRemaining, isSessionExpired, resetSession } = usePQCryptography();
  const [showWarning, setShowWarning] = useState(false);
  const [showExpiredNotice, setShowExpiredNotice] = useState(false);

  // Show warning when less than 30 seconds remaining
  useEffect(() => {
    if (sessionTimeRemaining <= 30 && sessionTimeRemaining > 0) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }

    if (isSessionExpired) {
      setShowExpiredNotice(true);
      setShowWarning(false);
    } else {
      setShowExpiredNotice(false);
    }
  }, [sessionTimeRemaining, isSessionExpired]);

  // Listen for PQC session expired events
  useEffect(() => {
    const handleSessionExpired = () => {
      setShowExpiredNotice(true);
      setShowWarning(false);
    };

    window.addEventListener('pqc-session-expired', handleSessionExpired);
    
    return () => {
      window.removeEventListener('pqc-session-expired', handleSessionExpired);
    };
  }, []);

  if (!showWarning && !showExpiredNotice) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80 shadow-lg rounded-lg overflow-hidden">
      {showWarning && !showExpiredNotice && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Security warning:</strong> Your quantum-resistant cryptography session will expire in {sessionTimeRemaining} seconds.
              </p>
              <div className="mt-2">
                <button
                  onClick={resetSession}
                  className="px-2 py-1 bg-yellow-400 text-sm text-yellow-900 rounded hover:bg-yellow-500"
                >
                  Extend Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExpiredNotice && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                <strong>Security alert:</strong> Your quantum-resistant cryptography session has expired. For your security, please re-authenticate.
              </p>
              <div className="mt-2">
                <button
                  onClick={onReauthenticate}
                  className="px-2 py-1 bg-red-500 text-sm text-white rounded hover:bg-red-600"
                >
                  Re-authenticate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionExpiryNotification; 