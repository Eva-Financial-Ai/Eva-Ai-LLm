import React, { useState } from 'react';
import SafeForms from './SafeForms';
import FinancialStatements from './FinancialStatements';
import BusinessTaxReturns from './BusinessTaxReturns';

interface CustomDocumentRequest {
  id: string;
  name: string;
  description: string;
  required: boolean;
  requestedBy: string;
  requestDate: string;
}

interface CreditApplicationProps {
  userType: 'lender' | 'broker' | 'borrower' | 'vendor';
  applicationId?: string;
}

const CreditApplication: React.FC<CreditApplicationProps> = ({ 
  userType, 
  applicationId = 'APP-12345' 
}) => {
  const [activeView, setActiveView] = useState('main');
  const [customDocumentRequests, setCustomDocumentRequests] = useState<CustomDocumentRequest[]>([
    {
      id: 'doc-1',
      name: 'Equipment Invoice',
      description: 'Original invoice for financed equipment',
      required: true,
      requestedBy: 'ABC Funding',
      requestDate: '2023-07-10'
    },
    {
      id: 'doc-2',
      name: 'Business License',
      description: 'Current business license',
      required: true,
      requestedBy: 'XYZ Brokers',
      requestDate: '2023-07-12'
    }
  ]);
  
  const [newDocumentRequest, setNewDocumentRequest] = useState({
    name: '',
    description: '',
    required: true
  });
  
  // Handle adding a new custom document request
  const handleAddCustomDocument = () => {
    if (!newDocumentRequest.name) return;
    
    const newRequest: CustomDocumentRequest = {
      id: `doc-${Date.now()}`,
      name: newDocumentRequest.name,
      description: newDocumentRequest.description,
      required: newDocumentRequest.required,
      requestedBy: userType === 'lender' ? 'ABC Funding' : 'XYZ Brokers',
      requestDate: new Date().toISOString().split('T')[0]
    };
    
    setCustomDocumentRequests([...customDocumentRequests, newRequest]);
    setNewDocumentRequest({
      name: '',
      description: '',
      required: true
    });
  };
  
  // Render different headers based on user type
  const renderHeader = () => {
    switch (userType) {
      case 'lender':
        return (
          <div className="credit-app-header lender-view">
            <h1>Credit Application #{applicationId}</h1>
            <div className="action-buttons">
              <button className="send-to-borrower">Send to Borrower</button>
              <button className="review-app">Review Application</button>
            </div>
          </div>
        );
      case 'broker':
        return (
          <div className="credit-app-header broker-view">
            <h1>Credit Application #{applicationId}</h1>
            <div className="action-buttons">
              <button className="send-to-borrower">Send to Borrower</button>
              <button className="send-to-lender">Submit to Lender</button>
            </div>
          </div>
        );
      case 'vendor':
        return (
          <div className="credit-app-header vendor-view">
            <h1>Credit Application #{applicationId}</h1>
            <div className="action-buttons">
              <button className="prefill-app">Pre-fill for Customer</button>
              <button className="send-to-borrower">Send to Customer</button>
            </div>
          </div>
        );
      case 'borrower':
      default:
        return (
          <div className="credit-app-header borrower-view">
            <h1>Credit Application #{applicationId}</h1>
            <div className="status-indicator">
              <span className="status-badge in-progress">In Progress</span>
              <span className="completion">65% Complete</span>
            </div>
          </div>
        );
    }
  };
  
  // Render view selector tabs
  const renderViewSelector = () => {
    // Only show view selector for non-borrower users
    if (userType === 'borrower') return null;
    
    return (
      <div className="view-selector">
        <h3>Application View</h3>
        <div className="view-options">
          <button 
            className={activeView === 'main' ? 'active' : ''} 
            onClick={() => setActiveView('main')}
          >
            Main View
          </button>
          <button 
            className={activeView === 'borrower' ? 'active' : ''} 
            onClick={() => setActiveView('borrower')}
          >
            Borrower View
          </button>
          {userType === 'lender' && (
            <button 
              className={activeView === 'broker' ? 'active' : ''} 
              onClick={() => setActiveView('broker')}
            >
              Broker View
            </button>
          )}
          {(userType === 'lender' || userType === 'broker') && (
            <button 
              className={activeView === 'vendor' ? 'active' : ''} 
              onClick={() => setActiveView('vendor')}
            >
              Vendor View
            </button>
          )}
        </div>
      </div>
    );
  };
  
  // Render custom document request form for lenders and brokers
  const renderCustomDocumentRequestForm = () => {
    if (userType !== 'lender' && userType !== 'broker') return null;
    
    return (
      <div className="custom-document-request">
        <h3>Request Additional Documents</h3>
        <p>Select custom documents to request from the borrower</p>
        
        <div className="custom-document-form">
          <div className="form-group">
            <label>Document Name</label>
            <input 
              type="text" 
              value={newDocumentRequest.name}
              onChange={(e) => setNewDocumentRequest({...newDocumentRequest, name: e.target.value})}
              placeholder="Enter document name"
            />
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <input 
              type="text" 
              value={newDocumentRequest.description}
              onChange={(e) => setNewDocumentRequest({...newDocumentRequest, description: e.target.value})}
              placeholder="Enter document description"
            />
          </div>
          
          <div className="form-group checkbox">
            <input 
              type="checkbox" 
              id="required-doc" 
              checked={newDocumentRequest.required}
              onChange={(e) => setNewDocumentRequest({...newDocumentRequest, required: e.target.checked})}
            />
            <label htmlFor="required-doc">Required Document</label>
          </div>
          
          <button 
            className="add-document-btn"
            onClick={handleAddCustomDocument}
            disabled={!newDocumentRequest.name}
          >
            Add Document Request
          </button>
        </div>
        
        <div className="requested-documents">
          <h4>Requested Documents</h4>
          
          {customDocumentRequests.length === 0 ? (
            <p>No custom documents requested</p>
          ) : (
            <ul className="document-request-list">
              {customDocumentRequests.map(doc => (
                <li key={doc.id} className="document-request-item">
                  <div className="doc-request-details">
                    <h5>{doc.name} {doc.required && <span className="required-badge">Required</span>}</h5>
                    <p>{doc.description}</p>
                    <p className="request-meta">
                      Requested by {doc.requestedBy} on {doc.requestDate}
                    </p>
                  </div>
                  <button 
                    className="remove-request"
                    onClick={() => setCustomDocumentRequests(
                      customDocumentRequests.filter(d => d.id !== doc.id)
                    )}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };
  
  // Determine the effective user type for the view
  const effectiveUserType = activeView === 'main' ? userType : activeView as 'lender' | 'broker' | 'borrower' | 'vendor';
  
  return (
    <div className={`credit-application ${userType}-type ${activeView}-view`}>
      {renderHeader()}
      {renderViewSelector()}
      
      <div className="credit-app-sections">
        {/* Show Safe Forms - templates for requesters, requested forms for borrowers */}
        <div className="credit-app-section">
          <SafeForms 
            userType={effectiveUserType} 
            requestMode={effectiveUserType !== 'borrower'}
          />
        </div>
        
        {/* Financial Statements Section */}
        <div className="credit-app-section">
          <FinancialStatements userType={effectiveUserType} />
        </div>
        
        {/* Business Tax Returns Section */}
        <div className="credit-app-section">
          <BusinessTaxReturns />
        </div>
        
        {/* Custom Document Requests */}
        {renderCustomDocumentRequestForm()}
        
        {/* Custom Document Upload/View for Borrowers */}
        {effectiveUserType === 'borrower' && customDocumentRequests.length > 0 && (
          <div className="credit-app-section custom-document-uploads">
            <h3>Requested Documents</h3>
            <p>Please upload the following requested documents:</p>
            
            <ul className="requested-document-list">
              {customDocumentRequests.map(doc => (
                <li key={doc.id} className="requested-document-item">
                  <div className="document-details">
                    <h4>{doc.name} {doc.required && <span className="required-badge">Required</span>}</h4>
                    <p>{doc.description}</p>
                    <p className="request-meta">
                      Requested by {doc.requestedBy} on {doc.requestDate}
                    </p>
                  </div>
                  <div className="upload-controls">
                    <input type="file" id={`upload-${doc.id}`} className="hidden-file-input" />
                    <label htmlFor={`upload-${doc.id}`} className="upload-button">Upload Document</label>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      
      {/* Application Action Footer */}
      <div className="credit-app-footer">
        {effectiveUserType === 'borrower' ? (
          <div className="borrower-actions">
            <button className="save-draft">Save Draft</button>
            <button className="submit-application">Submit Application</button>
          </div>
        ) : effectiveUserType === 'lender' ? (
          <div className="lender-actions">
            <button className="request-more-info">Request More Information</button>
            <button className="make-decision">Make Credit Decision</button>
          </div>
        ) : effectiveUserType === 'broker' ? (
          <div className="broker-actions">
            <button className="save-changes">Save Changes</button>
            <button className="submit-to-lender">Submit to Lender</button>
          </div>
        ) : (
          <div className="vendor-actions">
            <button className="save-changes">Save Changes</button>
            <button className="submit-to-customer">Submit to Customer</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditApplication; 