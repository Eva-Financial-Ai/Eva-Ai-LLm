# Post-Quantum Cryptography (PQC) Security Components

This directory contains the components necessary to provide quantum-resistant security features to the Eva AI financial services platform. These components enable secure authentication, transaction verification, and digital signatures that are resistant to attacks from both classical and quantum computers.

## Overview

The PQC security system implements NIST-standardized post-quantum cryptographic algorithms:

1. **CRYSTALS-Kyber**: For key encapsulation mechanism (KEM) used in secure key exchange
2. **CRYSTALS-Dilithium**: For digital signatures to verify transaction integrity

These components provide a complete quantum-resistant security infrastructure for:
- User authentication
- Transaction verification
- Dual-signature approval (sender and receiver)
- Secure data transmission
- Blockchain integration

## Components

### 1. PQCryptographyProvider

This is the core provider that makes quantum-resistant cryptographic operations available throughout the application:

```jsx
import { PQCryptographyProvider, usePQCryptography } from './components/security/PQCryptographyProvider';

// Wrap your application or component tree
<PQCryptographyProvider>
  <YourApp />
</PQCryptographyProvider>

// Use PQC functions in your components
const MyComponent = () => {
  const { 
    signData, 
    verifySignature, 
    encryptData, 
    decryptData 
  } = usePQCryptography();
  
  // Use the functions...
};
```

### 2. PQCLogin

A quantum-resistant authentication component that enables secure login with:
- Challenge-response authentication
- PQC key generation
- Session management

```jsx
<PQCLogin onLoginSuccess={handleSuccessfulAuth} />
```

### 3. PQCTransactionVerification

Ensures transactions are verified by both parties (sender and receiver) using quantum-resistant signatures before they are recorded on the blockchain:

```jsx
<PQCTransactionVerification
  transaction={transactionData}
  onVerificationComplete={handleVerificationComplete}
  onCancel={handleCancel}
/>
```

## Implementation Details

### Authentication Flow

1. The user enters their username
2. The system generates a cryptographic challenge
3. The user signs the challenge with their private key
4. The system verifies the signature with the user's public key
5. If valid, the user is authenticated

### Transaction Verification Flow

1. Transaction details are prepared for signing
2. The sender signs the transaction using PQC
3. The receiver verifies and signs the transaction using PQC
4. Both signatures are verified
5. The transaction with both signatures is submitted to the blockchain

## Security Considerations

- **Key Management**: Private keys should be securely stored, preferably in a hardware security module (HSM) or secure enclave
- **Entropy Source**: Ensure appropriate entropy for key generation
- **Update Strategy**: As NIST standards evolve, plan for algorithm transitions
- **Hybrid Approach**: Consider implementing hybrid cryptography for critical systems

## Future Enhancements

- Integration with hardware security modules (HSMs)
- Support for additional PQC algorithms as they are standardized
- Cryptocurrency wallet integration
- Multi-factor authentication combining PQC with biometrics

## Usage Examples

### Signing Data

```jsx
const { signData } = usePQCryptography();
const signature = await signData(transactionData, privateKey);
```

### Verifying Signatures

```jsx
const { verifySignature } = usePQCryptography();
const isValid = await verifySignature(data, signature, publicKey);
```

### Encrypting Data

```jsx
const { encryptData } = usePQCryptography();
const encrypted = await encryptData(sensitiveData, recipientPublicKey);
```

### Complete Transaction Verification

```jsx
// In your transaction execution component
const handlePQCVerificationComplete = (success, verifiedTransaction) => {
  if (success) {
    // Send to blockchain with quantum-resistant signatures
    submitToBlockchain(verifiedTransaction);
  }
};

// Render the verification component when needed
{showPQCVerification && (
  <PQCTransactionVerification
    transaction={currentTransaction}
    onVerificationComplete={handlePQCVerificationComplete}
    onCancel={() => setShowPQCVerification(false)}
  />
)}
``` 