import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

// Define types for our PQC operations
type KeyPair = {
  publicKey: string;
  privateKey: string;
};

type PQCAlgorithm = 'CRYSTALS-Kyber' | 'CRYSTALS-Dilithium' | 'Falcon' | 'SPHINCS+';

interface PQCContextType {
  // Authentication
  generateKeypair: (algorithm: PQCAlgorithm) => Promise<KeyPair>;
  encryptData: (data: string, publicKey: string) => Promise<string>;
  decryptData: (encryptedData: string, privateKey: string) => Promise<string>;
  
  // Signatures
  signData: (data: string, privateKey: string) => Promise<string>;
  verifySignature: (data: string, signature: string, publicKey: string) => Promise<boolean>;
  
  // Transaction verification
  verifyTransaction: (transaction: any, senderSig: string, receiverSig: string) => Promise<boolean>;
  
  // User authentication
  authenticateUser: (userId: string, challenge: string, signature: string) => Promise<boolean>;
  
  // Status
  isReady: boolean;
  currentAlgorithm: PQCAlgorithm;
  setCurrentAlgorithm: (algorithm: PQCAlgorithm) => void;
  
  // Session management
  sessionExpireTime: number;
  sessionTimeRemaining: number;
  resetSession: () => void;
  isSessionExpired: boolean;
}

// Define session timeout in seconds
const SESSION_TIMEOUT = 5400; // 90 minutes

// Create the context with default values
const PQCContext = createContext<PQCContextType>({
  generateKeypair: async () => ({ publicKey: '', privateKey: '' }),
  encryptData: async () => '',
  decryptData: async () => '',
  signData: async () => '',
  verifySignature: async () => false,
  verifyTransaction: async () => false,
  authenticateUser: async () => false,
  isReady: false,
  currentAlgorithm: 'CRYSTALS-Kyber',
  setCurrentAlgorithm: () => {},
  sessionExpireTime: 0,
  sessionTimeRemaining: 0,
  resetSession: () => {},
  isSessionExpired: true,
});

// Mock implementation of PQC algorithms (in a production app, this would use actual WebAssembly implementations)
class PQCryptography {
  private static instance: PQCryptography;
  private kyberModule: any = null;
  private dilithiumModule: any = null;
  private ready = false;

  private constructor() {
    this.initModules();
  }

  static getInstance(): PQCryptography {
    if (!PQCryptography.instance) {
      PQCryptography.instance = new PQCryptography();
    }
    return PQCryptography.instance;
  }

  private async initModules() {
    // In a real implementation, you'd load WASM modules for the actual algorithms
    // For this demo, we'll simulate the loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock modules
    this.kyberModule = {
      generateKeypair: async (): Promise<KeyPair> => {
        // Generate a mock Kyber key pair with realistic-looking keys
        const publicKey = 'kyber-pk-' + Array.from({ length: 32 }, () => 
          Math.floor(Math.random() * 16).toString(16)).join('');
        const privateKey = 'kyber-sk-' + Array.from({ length: 32 }, () => 
          Math.floor(Math.random() * 16).toString(16)).join('');
        
        return { publicKey, privateKey };
      },
      encapsulate: async (publicKey: string): Promise<{ ciphertext: string, sharedSecret: string }> => {
        const ciphertext = 'kyber-ct-' + Array.from({ length: 24 }, () => 
          Math.floor(Math.random() * 16).toString(16)).join('');
        const sharedSecret = 'kyber-ss-' + Array.from({ length: 16 }, () => 
          Math.floor(Math.random() * 16).toString(16)).join('');
        
        return { ciphertext, sharedSecret };
      },
      decapsulate: async (ciphertext: string, privateKey: string): Promise<string> => {
        // In a real implementation, this would recover the shared secret
        return 'kyber-ss-' + ciphertext.substring(9, 25);
      }
    };
    
    this.dilithiumModule = {
      generateKeypair: async (): Promise<KeyPair> => {
        // Generate a mock Dilithium key pair
        const publicKey = 'dilithium-pk-' + Array.from({ length: 48 }, () => 
          Math.floor(Math.random() * 16).toString(16)).join('');
        const privateKey = 'dilithium-sk-' + Array.from({ length: 96 }, () => 
          Math.floor(Math.random() * 16).toString(16)).join('');
        
        return { publicKey, privateKey };
      },
      sign: async (message: string, privateKey: string): Promise<string> => {
        // Generate a mock signature
        return 'dilithium-sig-' + Array.from({ length: 64 }, () => 
          Math.floor(Math.random() * 16).toString(16)).join('');
      },
      verify: async (message: string, signature: string, publicKey: string): Promise<boolean> => {
        // Simple mock verification
        return signature.startsWith('dilithium-sig-');
      }
    };
    
    this.ready = true;
  }

  isReady(): boolean {
    return this.ready;
  }

  async generateKyberKeypair(): Promise<KeyPair> {
    if (!this.ready) throw new Error('PQC modules not initialized');
    return this.kyberModule.generateKeypair();
  }
  
  async generateDilithiumKeypair(): Promise<KeyPair> {
    if (!this.ready) throw new Error('PQC modules not initialized');
    return this.dilithiumModule.generateKeypair();
  }
  
  async encryptData(data: string, publicKey: string): Promise<string> {
    if (!this.ready) throw new Error('PQC modules not initialized');
    
    // In a real implementation, you'd use a hybrid encryption scheme
    // 1. Use Kyber to encapsulate a shared secret
    // 2. Use that shared secret with a symmetric cipher (like AES) to encrypt the data
    const { ciphertext, sharedSecret } = await this.kyberModule.encapsulate(publicKey);
    
    // Mock encryption with the shared secret
    const encryptedData = data.split('').map(c => {
      const charCode = c.charCodeAt(0);
      // XOR with the first byte of the shared secret (mock encryption)
      return String.fromCharCode(charCode ^ sharedSecret.charCodeAt(0));
    }).join('');
    
    // Return the ciphertext and encrypted data
    return JSON.stringify({ 
      ciphertext, 
      encryptedData: Buffer.from(encryptedData).toString('base64')
    });
  }
  
  async decryptData(encryptedPackage: string, privateKey: string): Promise<string> {
    if (!this.ready) throw new Error('PQC modules not initialized');
    
    // Parse the encrypted package
    const { ciphertext, encryptedData } = JSON.parse(encryptedPackage);
    
    // In a real implementation:
    // 1. Use Kyber to decapsulate the shared secret from the ciphertext
    // 2. Use that shared secret with a symmetric cipher to decrypt the data
    const sharedSecret = await this.kyberModule.decapsulate(ciphertext, privateKey);
    
    // Convert from base64
    const encryptedBytes = Buffer.from(encryptedData, 'base64').toString();
    
    // Mock decryption with the shared secret
    const decryptedData = encryptedBytes.split('').map(c => {
      const charCode = c.charCodeAt(0);
      // XOR with the first byte of the shared secret (mock decryption)
      return String.fromCharCode(charCode ^ sharedSecret.charCodeAt(0));
    }).join('');
    
    return decryptedData;
  }
  
  async signData(data: string, privateKey: string): Promise<string> {
    if (!this.ready) throw new Error('PQC modules not initialized');
    return this.dilithiumModule.sign(data, privateKey);
  }
  
  async verifySignature(data: string, signature: string, publicKey: string): Promise<boolean> {
    if (!this.ready) throw new Error('PQC modules not initialized');
    return this.dilithiumModule.verify(data, signature, publicKey);
  }
}

// Create the provider component
export const PQCryptographyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<PQCAlgorithm>('CRYSTALS-Kyber');
  const [pqcInstance, setPqcInstance] = useState<PQCryptography | null>(null);
  
  // Session timeout management
  const [sessionExpireTime, setSessionExpireTime] = useState(0);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(0);
  const [isSessionExpired, setIsSessionExpired] = useState(true);
  const [lastActivity, setLastActivity] = useState(0);
  
  // Function to reset the session timer
  const resetSession = useCallback(() => {
    const now = Date.now();
    const expireTime = now + (SESSION_TIMEOUT * 1000);
    setSessionExpireTime(expireTime);
    setLastActivity(now);
    setIsSessionExpired(false);
  }, []);
  
  // Initialize PQC instance
  useEffect(() => {
    const init = async () => {
      // Get the singleton instance
      const instance = PQCryptography.getInstance();
      setPqcInstance(instance);
      
      // Wait for it to initialize
      const checkReady = () => {
        if (instance.isReady()) {
          setIsReady(true);
          // Initialize session on ready
          resetSession();
        } else {
          setTimeout(checkReady, 100);
        }
      };
      checkReady();
    };
    
    init();
  }, [resetSession]);
  
  // Session timer effect
  useEffect(() => {
    if (!isReady) return;
    
    const handleUserActivity = () => {
      // Only reset if session is not expired and if it's been at least 1 second since the last activity
      if (!isSessionExpired && (Date.now() - lastActivity) > 1000) {
        setLastActivity(Date.now());
      }
    };
    
    // Update session timer every second
    const timerInterval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, sessionExpireTime - now);
      
      setSessionTimeRemaining(Math.floor(remaining / 1000));
      
      // Check if session has expired
      if (remaining <= 0 && !isSessionExpired) {
        setIsSessionExpired(true);
        // Fire an event that the session has expired
        window.dispatchEvent(new CustomEvent('pqc-session-expired'));
      }
    }, 1000);
    
    // Add event listeners for user activity
    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);
    window.addEventListener('click', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);
    
    return () => {
      clearInterval(timerInterval);
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('click', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
    };
  }, [isReady, isSessionExpired, sessionExpireTime, lastActivity, resetSession]);
  
  const generateKeypair = async (algorithm: PQCAlgorithm): Promise<KeyPair> => {
    if (!pqcInstance) throw new Error('PQCryptography not initialized');
    if (isSessionExpired) throw new Error('Session expired. Please re-authenticate.');
    
    switch (algorithm) {
      case 'CRYSTALS-Kyber':
        return pqcInstance.generateKyberKeypair();
      case 'CRYSTALS-Dilithium':
        return pqcInstance.generateDilithiumKeypair();
      default:
        // For Falcon and SPHINCS+, use Dilithium as a stand-in
        return pqcInstance.generateDilithiumKeypair();
    }
  };
  
  const encryptData = async (data: string, publicKey: string): Promise<string> => {
    if (!pqcInstance) throw new Error('PQCryptography not initialized');
    if (isSessionExpired) throw new Error('Session expired. Please re-authenticate.');
    return pqcInstance.encryptData(data, publicKey);
  };
  
  const decryptData = async (encryptedData: string, privateKey: string): Promise<string> => {
    if (!pqcInstance) throw new Error('PQCryptography not initialized');
    if (isSessionExpired) throw new Error('Session expired. Please re-authenticate.');
    return pqcInstance.decryptData(encryptedData, privateKey);
  };
  
  const signData = async (data: string, privateKey: string): Promise<string> => {
    if (!pqcInstance) throw new Error('PQCryptography not initialized');
    if (isSessionExpired) throw new Error('Session expired. Please re-authenticate.');
    return pqcInstance.signData(data, privateKey);
  };
  
  const verifySignature = async (data: string, signature: string, publicKey: string): Promise<boolean> => {
    if (!pqcInstance) throw new Error('PQCryptography not initialized');
    if (isSessionExpired) throw new Error('Session expired. Please re-authenticate.');
    return pqcInstance.verifySignature(data, signature, publicKey);
  };
  
  // Transaction verification requires both sender and receiver signatures
  const verifyTransaction = async (transaction: any, senderSig: string, receiverSig: string): Promise<boolean> => {
    if (!pqcInstance) throw new Error('PQCryptography not initialized');
    if (isSessionExpired) throw new Error('Session expired. Please re-authenticate.');
    
    // Verify sender signature
    const senderVerification = await pqcInstance.verifySignature(
      JSON.stringify(transaction),
      senderSig,
      transaction.senderPublicKey
    );
    
    // Verify receiver signature
    const receiverVerification = await pqcInstance.verifySignature(
      JSON.stringify(transaction),
      receiverSig,
      transaction.receiverPublicKey
    );
    
    // Both must be valid
    return senderVerification && receiverVerification;
  };
  
  // User authentication with challenge-response
  const authenticateUser = async (userId: string, challenge: string, signature: string): Promise<boolean> => {
    if (!pqcInstance) throw new Error('PQCryptography not initialized');
    
    // In a real system, you'd look up the user's public key from a database
    // For this demo, we'll simulate retrieving a public key based on userId
    const mockUserKey = `dilithium-pk-user-${userId}-` + Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)).join('');
    
    // Verify the challenge was signed correctly
    const isAuthenticated = await pqcInstance.verifySignature(challenge, signature, mockUserKey);
    
    // If authenticated, reset the session
    if (isAuthenticated) {
      resetSession();
    }
    
    return isAuthenticated;
  };
  
  const contextValue: PQCContextType = {
    generateKeypair,
    encryptData,
    decryptData,
    signData,
    verifySignature,
    verifyTransaction,
    authenticateUser,
    isReady,
    currentAlgorithm,
    setCurrentAlgorithm,
    sessionExpireTime,
    sessionTimeRemaining,
    resetSession,
    isSessionExpired,
  };
  
  return (
    <PQCContext.Provider value={contextValue}>
      {children}
    </PQCContext.Provider>
  );
};

// Custom hook to use the PQC context
export const usePQCryptography = () => useContext(PQCContext);

// Export the context for direct use
export default PQCContext; 