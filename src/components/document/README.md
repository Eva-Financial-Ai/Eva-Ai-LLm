# Document Management Components

> **NOTE: PDF uploads are now indexed into AutoRAG pipelines via the `/api/upload-pdf` endpoint, handled by the Cloudflare Worker.**

This directory contains the components necessary for intelligent document management, processing, and verification within the Eva AI financial services platform. These components enable secure document handling, automated information extraction, and streamlined document workflows throughout the credit origination process.

## Overview

The Document Management system implements several advanced document-handling capabilities:

1. **Intelligent Document Analysis**: AI-powered information extraction and validation
2. **Secure Document Storage**: Encrypted document repository with access controls
3. **Document Workflow Automation**: Streamlined document collection and approval process
4. **Digital Signature Integration**: Legally compliant e-signature capabilities
5. **Document Request Tracking**: Status monitoring for document collection process
6. **Shield Network Integration**: Blockchain verification for immutable document records

These components provide a complete document management infrastructure for:

- Secure document upload and storage
- Automated information extraction
- Document verification and validation
- Digital signature workflows
- Document request management
- PDF viewing and editing
- Tamper-proof document locking

## Components

### 1. FilelockDriveApp

The core document management interface providing secure access to documents with version control:

```jsx
import FilelockDriveApp from '../components/document/FilelockDriveApp';

// Example usage
<FilelockDriveApp
  userId={currentUser.id}
  transactionId={transactionId}
  enableBlockchainVerification={true}
/>;
```

### 2. DocumentViewer

Advanced document viewing component with support for multiple document formats:

```jsx
import DocumentViewer from '../components/document/DocumentViewer';

// Example usage
<DocumentViewer documentId={documentId} showAnnotationTools={true} enablePrinting={false} />;
```

### 3. PDFEditor

PDF editing capabilities with form filling, annotation, and redaction features:

```jsx
import PDFEditor from '../components/document/PDFEditor';

// Example usage
<PDFEditor
  documentId={documentId}
  onDocumentSave={handleDocumentSave}
  readOnly={false}
  permittedOperations={['annotate', 'fillForms', 'sign']}
/>;
```

### 4. SignatureWorkflow

Manages the complete e-signature process with multi-party signing and verification:

```jsx
import SignatureWorkflow from '../components/document/SignatureWorkflow';

// Example usage
<SignatureWorkflow
  documentId={documentId}
  signatories={signatoryList}
  onWorkflowComplete={handleSigningComplete}
  reminderFrequency="daily"
/>;
```

### 5. DocumentRequestTracker

Tracks and manages document collection status and outstanding requests:

```jsx
import DocumentRequestTracker from '../components/document/DocumentRequestTracker';

// Example usage
<DocumentRequestTracker
  transactionId={transactionId}
  onRequestStatusChange={handleStatusChange}
  showCompletionStatus={true}
/>;
```

### 6. FileExplorer

File management interface with drag-and-drop capabilities, folder organization, and search:

```jsx
import FileExplorer from '../components/document/FileExplorer';

// Example usage
<FileExplorer
  rootFolder={transactionFolder}
  allowUpload={true}
  onFileSelect={handleFileSelect}
  viewMode="grid"
/>;
```

### 7. ShieldNetworkLocker

New component that provides blockchain-based document verification and locking:

```jsx
import ShieldNetworkLocker from '../components/document/ShieldNetworkLocker';

// Example usage
<ShieldNetworkLocker
  documentId={documentId}
  onLockComplete={handleDocumentLocked}
  verifyMetadata={['timestamp', 'source', 'hash']}
  showVerificationHistory={true}
/>;
```

## Implementation Details

### Document Processing Flow

1. Document is uploaded via the FilelockDriveApp or FileExplorer
2. The system performs AI-powered document classification and validation
3. Relevant information is extracted and stored in the transaction record
4. Documents are securely stored with appropriate access controls
5. Users can view, annotate, and manage documents through the document interfaces
6. Signature workflows can be initiated for documents requiring execution
7. Critical documents can be locked on the Shield Network blockchain for immutable verification

### Document Security

- End-to-end encryption for document storage and transmission
- Role-based access controls for document viewing and editing
- Audit logs for all document actions
- Secure document deletion with compliance safeguards
- Blockchain verification of document integrity via Shield Network

### Shield Network Document Locking

The Shield Network integration provides enhanced document security:

1. **Document Locking**: Lock documents to create immutable records on the blockchain
2. **OCR Verification**: AI-powered document content verification against the blockchain record
3. **Source Authentication**: Verify the origin and authenticity of documents
4. **Fraud Prevention**: Create tamper-proof verification records
5. **Compliance Tracking**: Maintain verifiable document history for regulatory compliance

## Integration with Other Services

The Document components integrate with several other Eva AI services:

- **Risk Assessment**: Provides financial documents for analysis
- **AI Core**: Leverages Eva AI for document classification and data extraction
- **Blockchain Service**: Integrates with Shield Network for immutable document verification
- **Signature Service**: Connects with e-signature providers for legal document execution
- **Communication Service**: Facilitates document requests and notifications
- **Transaction Service**: Links documents to relevant loan applications

## Performance Considerations

For optimal performance when using document components:

- Use the `React.memo` HOC for document display components
- Implement lazy loading for large document lists
- Enable compression for document uploads
- Use WebWorkers for client-side document processing
- Implement virtualization for file explorers with many documents

## Recent Updates

- Added Shield Network blockchain verification
- Improved OCR accuracy with EVA AI integration
- Enhanced document comparison capabilities
- Added batch document processing
- Implemented advanced redaction tools
- Added support for additional document formats

## Usage Examples

### Document Verification with Shield Network

```jsx
// In your document verification component
import { useState } from 'react';
import DocumentViewer from '../components/document/DocumentViewer';
import ShieldNetworkLocker from '../components/document/ShieldNetworkLocker';

const DocumentVerificationPage = ({ documentId }) => {
  const [verificationStatus, setVerificationStatus] = useState(null);

  const handleVerificationComplete = result => {
    setVerificationStatus(result);
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Document Verification</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <DocumentViewer documentId={documentId} showAnnotationTools={false} />
        </div>

        <div>
          <ShieldNetworkLocker
            documentId={documentId}
            onVerificationComplete={handleVerificationComplete}
            verifyMetadata={['timestamp', 'source', 'hash']}
            showVerificationHistory={true}
          />

          {verificationStatus && (
            <div
              className={`mt-4 p-4 rounded-md ${
                verificationStatus.verified
                  ? 'bg-green-50 text-green-800'
                  : 'bg-red-50 text-red-800'
              }`}
            >
              {verificationStatus.verified
                ? 'Document successfully verified on Shield Network.'
                : 'Document verification failed. Possible tampering detected.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```

### Document Collection Workflow

```jsx
// In your document collection component
import { useState } from 'react';
import DocumentRequestTracker from '../components/document/DocumentRequestTracker';
import DocumentRequestModal from '../components/document/DocumentRequestModal';
import FileExplorer from '../components/document/FileExplorer';

const DocumentCollectionPage = ({ transactionId }) => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState('root');

  const handleRequestComplete = () => {
    setShowRequestModal(false);
    // Refresh document tracker
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Document Collection</h1>
        <button
          className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700"
          onClick={() => setShowRequestModal(true)}
        >
          Request Documents
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DocumentRequestTracker transactionId={transactionId} showCompletionStatus={true} />
        </div>

        <div className="lg:col-span-2">
          <FileExplorer
            rootFolder={`transactions/${transactionId}/documents`}
            allowUpload={true}
            onFolderSelect={setSelectedFolder}
            viewMode="grid"
          />
        </div>
      </div>

      {showRequestModal && (
        <DocumentRequestModal
          transactionId={transactionId}
          onRequestComplete={handleRequestComplete}
          onCancel={() => setShowRequestModal(false)}
        />
      )}
    </div>
  );
};
```

## PDF Upload and RAG Indexing

- Use the DocumentUpload component to upload PDFs.
- The file and selected pipeline are sent to `/api/upload-pdf` (POST, multipart/form-data).
- The Worker extracts text and indexes it into the correct AutoRAG pipeline.
- After upload, the document is available for RAG chat via `/api/rag-query`.
