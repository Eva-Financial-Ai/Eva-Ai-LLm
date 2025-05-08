# Document Management Components

This directory contains the components necessary for intelligent document management, processing, and verification within the Eva AI financial services platform. These components enable secure document handling, automated information extraction, and streamlined document workflows throughout the credit origination process.

## Overview

The Document Management system implements several advanced document-handling capabilities:

1. **Intelligent Document Analysis**: AI-powered information extraction and validation
2. **Secure Document Storage**: Encrypted document repository with access controls
3. **Document Workflow Automation**: Streamlined document collection and approval process
4. **Digital Signature Integration**: Legally compliant e-signature capabilities
5. **Document Request Tracking**: Status monitoring for document collection process

These components provide a complete document management infrastructure for:
- Secure document upload and storage
- Automated information extraction
- Document verification and validation
- Digital signature workflows
- Document request management
- PDF viewing and editing

## Components

### 1. FilelockDriveApp

The core document management interface providing secure access to documents with version control:

```jsx
import FilelockDriveApp from './components/document/FilelockDriveApp';

// Example usage
<FilelockDriveApp 
  userId={currentUser.id}
  transactionId={transactionId}
/>
```

### 2. DocumentViewer

Advanced document viewing component with support for multiple document formats:

```jsx
import DocumentViewer from './components/document/DocumentViewer';

// Example usage
<DocumentViewer 
  documentId={documentId}
  showAnnotationTools={true}
/>
```

### 3. PDFEditor

PDF editing capabilities with form filling, annotation, and redaction features:

```jsx
import PDFEditor from './components/document/PDFEditor';

// Example usage
<PDFEditor
  documentId={documentId}
  onDocumentSave={handleDocumentSave}
  readOnly={false}
/>
```

### 4. SignatureWorkflow

Manages the complete e-signature process with multi-party signing and verification:

```jsx
import SignatureWorkflow from './components/document/SignatureWorkflow';

// Example usage
<SignatureWorkflow
  documentId={documentId}
  signatories={signatoryList}
  onWorkflowComplete={handleSigningComplete}
/>
```

### 5. DocumentRequestTracker

Tracks and manages document collection status and outstanding requests:

```jsx
import DocumentRequestTracker from './components/document/DocumentRequestTracker';

// Example usage
<DocumentRequestTracker 
  transactionId={transactionId}
  onRequestStatusChange={handleStatusChange}
/>
```

### 6. FileExplorer

File management interface with drag-and-drop capabilities, folder organization, and search:

```jsx
import FileExplorer from './components/document/FileExplorer';

// Example usage
<FileExplorer 
  rootFolder={transactionFolder}
  allowUpload={true}
  onFileSelect={handleFileSelect}
/>
```

## Implementation Details

### Document Processing Flow

1. Document is uploaded via the FilelockDriveApp or FileExplorer
2. The system performs AI-powered document classification and validation
3. Relevant information is extracted and stored in the transaction record
4. Documents are securely stored with appropriate access controls
5. Users can view, annotate, and manage documents through the document interfaces
6. Signature workflows can be initiated for documents requiring execution

### Document Security

- End-to-end encryption for document storage and transmission
- Role-based access controls for document viewing and editing
- Audit logs for all document actions
- Secure document deletion with compliance safeguards
- Optional blockchain verification of document integrity

## Integration with Other Services

The Document components integrate with several other Eva AI services:

- **Risk Assessment**: Provides financial documents for analysis
- **AI Core**: Leverages Eva AI for document classification and data extraction
- **Blockchain Service**: Optional integration for immutable document verification
- **Signature Service**: Connects with e-signature providers for legal document execution
- **Communication Service**: Facilitates document requests and notifications

## Future Enhancements

- Advanced document intelligence with improved data extraction accuracy
- Automated document versioning and comparison
- Enhanced document collaboration features
- Expanded support for complex document workflows
- Integration with additional e-signature providers
- Mobile document capture with real-time validation

## Usage Examples

### Complete Document Collection Flow

```jsx
// In your document collection component
import DocumentRequestTracker from './components/document/DocumentRequestTracker';
import DocumentRequestModal from './components/document/DocumentRequestModal';
import { useState } from 'react';

const DocumentCollectionPage = ({ transactionId }) => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  const handleRequestComplete = () => {
    setShowRequestModal(false);
    // Refresh document tracker
  };
  
  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Document Collection</h1>
        <button 
          className="bg-primary-600 text-white px-4 py-2 rounded"
          onClick={() => setShowRequestModal(true)}
        >
          Request Documents
        </button>
      </div>
      
      <DocumentRequestTracker transactionId={transactionId} />
      
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

### Implementing a Signature Workflow

```jsx
// In your document execution component
import SignatureWorkflow from './components/document/SignatureWorkflow';
import DocumentViewer from './components/document/DocumentViewer';
import { useState } from 'react';

const DocumentExecutionPage = ({ documentId, signatories }) => {
  const [isComplete, setIsComplete] = useState(false);
  
  const handleSigningComplete = (signedDocument) => {
    setIsComplete(true);
    // Handle completed document
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <DocumentViewer documentId={documentId} />
      </div>
      <div>
        <SignatureWorkflow
          documentId={documentId}
          signatories={signatories}
          onWorkflowComplete={handleSigningComplete}
        />
        
        {isComplete && (
          <div className="mt-4 p-4 bg-green-50 text-green-800 rounded-md">
            Document has been successfully executed by all parties.
          </div>
        )}
      </div>
    </div>
  );
};
``` 