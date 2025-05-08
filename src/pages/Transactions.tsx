import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useTransactionStore from '../hooks/useTransactionStore';
import BiometricKYC from '../components/BiometricKYC';
import { UserContext } from '../contexts/UserContext';
import TransactionTimeMetrics from '../components/TransactionTimeMetrics';
import { PQCryptographyProvider } from '../components/security/PQCryptographyProvider';
import PQCTransactionVerification from '../components/security/PQCTransactionVerification';
import { TransactionDocumentVault } from '../components/document';
import { FileItem } from '../components/document/FilelockDriveApp';

interface DocumentStatus {
  name: string;
  status: 'pending' | 'generated' | 'sent' | 'signed' | 'verified';
  timestamp?: string;
  blockchainTxId?: string;
}

interface Covenant {
  type: string;
  name: string;
  threshold: string;
  frequency: string;
  description: string;
  isCustom?: boolean;
}

// Define covenant template categories
interface CovenantTemplate {
  id: string;
  name: string;
  description: string;
  covenants: Covenant[];
  applicableTransactionTypes: string[];
  minAmount?: number;
  maxAmount?: number;
  requiredCollateral?: string[];
  requiredGuarantorTypes?: string[];
}

// Instrument-specific covenant templates
const COVENANT_TEMPLATES: CovenantTemplate[] = [
  {
    id: 'finance-lease-standard',
    name: 'Standard Finance Lease',
    description: 'Default covenants for standard finance lease transactions',
    applicableTransactionTypes: ['Finance Lease'],
    covenants: [
      { 
        type: 'financial', 
        name: 'Debt Service Coverage Ratio', 
        threshold: '1.25x',
        frequency: 'quarterly',
        description: 'Maintain a minimum debt service coverage ratio of 1.25x'
      },
      { 
        type: 'operational', 
        name: 'Insurance Coverage', 
        threshold: 'Full replacement value',
        frequency: 'annual',
        description: 'Maintain insurance coverage for the full replacement value of the equipment'
      }
    ]
  },
  {
    id: 'equipment-loan-standard',
    name: 'Standard Equipment Loan',
    description: 'Default covenants for equipment loans',
    applicableTransactionTypes: ['Equipment Loan'],
    covenants: [
      { 
        type: 'financial', 
        name: 'Current Ratio', 
        threshold: '1.5x',
        frequency: 'quarterly',
        description: 'Maintain a minimum current ratio of 1.5x'
      },
      { 
        type: 'financial', 
        name: 'Debt-to-EBITDA Ratio', 
        threshold: '4.0x',
        frequency: 'quarterly',
        description: 'Maintain maximum Debt-to-EBITDA ratio of 4.0x'
      },
      { 
        type: 'operational', 
        name: 'Equipment Maintenance', 
        threshold: 'Manufacturer standards',
        frequency: 'continuous',
        description: 'Maintain equipment according to manufacturer standards'
      }
    ]
  },
  {
    id: 'working-capital-standard',
    name: 'Working Capital Facility',
    description: 'Default covenants for working capital facilities',
    applicableTransactionTypes: ['Working Capital'],
    covenants: [
      { 
        type: 'financial', 
        name: 'Working Capital Ratio', 
        threshold: '1.2x',
        frequency: 'monthly',
        description: 'Maintain a minimum working capital ratio of 1.2x'
      },
      { 
        type: 'financial', 
        name: 'Accounts Receivable Aging', 
        threshold: '70% < 60 days',
        frequency: 'monthly',
        description: 'Maintain at least 70% of accounts receivable less than 60 days outstanding'
      }
    ]
  },
  {
    id: 'high-value-advanced',
    name: 'High-Value Advanced Covenants',
    description: 'Enhanced covenants for high-value transactions',
    applicableTransactionTypes: ['Finance Lease', 'Equipment Loan', 'Working Capital'],
    minAmount: 500000,
    covenants: [
      { 
        type: 'financial', 
        name: 'Debt Service Coverage Ratio', 
        threshold: '1.35x',
        frequency: 'quarterly',
        description: 'Maintain a minimum debt service coverage ratio of 1.35x'
      },
      { 
        type: 'financial', 
        name: 'Leverage Ratio', 
        threshold: '3.5x',
        frequency: 'quarterly',
        description: 'Maintain maximum total leverage ratio of 3.5x'
      },
      { 
        type: 'operational', 
        name: 'Financial Reporting', 
        threshold: 'Audited statements',
        frequency: 'annual',
        description: 'Provide annual audited financial statements within 120 days of fiscal year end'
      },
      { 
        type: 'financial', 
        name: 'Minimum Liquidity', 
        threshold: '$250,000',
        frequency: 'monthly',
        description: 'Maintain minimum liquidity of $250,000'
      }
    ]
  },
  {
    id: 'real-estate-secured',
    name: 'Real Estate Secured',
    description: 'Covenants for transactions secured by real estate',
    applicableTransactionTypes: ['Finance Lease', 'Equipment Loan', 'Working Capital'],
    requiredCollateral: ['Real Estate'],
    covenants: [
      { 
        type: 'financial', 
        name: 'Loan-to-Value Ratio', 
        threshold: '75%',
        frequency: 'annual',
        description: 'Maintain maximum loan-to-value ratio of 75%'
      },
      { 
        type: 'operational', 
        name: 'Property Insurance', 
        threshold: 'Full replacement value',
        frequency: 'annual',
        description: 'Maintain property insurance covering full replacement value'
      },
      { 
        type: 'operational', 
        name: 'Property Tax Compliance', 
        threshold: 'Current',
        frequency: 'annual',
        description: 'Maintain current property tax payments'
      }
    ]
  },
  {
    id: 'personal-guarantee',
    name: 'Personal Guarantee Covenants',
    description: 'Additional covenants when a personal guarantee is provided',
    applicableTransactionTypes: ['Finance Lease', 'Equipment Loan', 'Working Capital'],
    requiredGuarantorTypes: ['Personal'],
    covenants: [
      { 
        type: 'financial', 
        name: 'Personal Liquidity', 
        threshold: '25% of obligation',
        frequency: 'annual',
        description: 'Guarantor(s) must maintain personal liquidity equal to at least 25% of the outstanding obligation'
      },
      { 
        type: 'financial', 
        name: 'Notification of Material Change', 
        threshold: 'Any change > 25%',
        frequency: 'as needed',
        description: 'Notify lender of any material change (>25%) in personal financial condition'
      }
    ]
  }
];

// Covenant Template Selector Component
const CovenantTemplateSelector: React.FC<{
  transaction: any;
  selectedTemplates: string[];
  onTemplateChange: (templateIds: string[]) => void;
}> = ({ transaction, selectedTemplates, onTemplateChange }) => {
  
  // Filter applicable templates based on transaction type, amount, etc.
  const applicableTemplates = COVENANT_TEMPLATES.filter(template => {
    // Check if template applies to this transaction type
    if (!template.applicableTransactionTypes.includes(transaction.type)) {
      return false;
    }
    
    // Check amount range if specified
    if (template.minAmount && transaction.amount < template.minAmount) {
      return false;
    }
    if (template.maxAmount && transaction.amount > template.maxAmount) {
      return false;
    }
    
    // For collateral and guarantor checks, we'd need more transaction data
    // This is a simplified check - in a real implementation, you would check
    // transaction.collateral and transaction.guarantors
    
    return true;
  });
  
  const handleTemplateChange = (templateId: string) => {
    if (selectedTemplates.includes(templateId)) {
      // Remove template if already selected
      onTemplateChange(selectedTemplates.filter(id => id !== templateId));
    } else {
      // Add template if not selected
      onTemplateChange([...selectedTemplates, templateId]);
    }
  };
  
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-700">Available Covenant Templates</h4>
      {applicableTemplates.map(template => (
        <div key={template.id} className="flex items-start">
          <input
            type="checkbox"
            id={`template-${template.id}`}
            checked={selectedTemplates.includes(template.id)}
            onChange={() => handleTemplateChange(template.id)}
            className="mt-0.5 h-4 w-4 text-primary-600 border-gray-300 rounded"
          />
          <label htmlFor={`template-${template.id}`} className="ml-2 block text-sm">
            <span className="font-medium text-gray-700">{template.name}</span>
            <p className="text-gray-500">{template.description}</p>
          </label>
        </div>
      ))}
    </div>
  );
};

// Custom Covenant Form Component
const CustomCovenantForm: React.FC<{
  onAddCovenant: (covenant: Covenant) => void;
  onCancel: () => void;
}> = ({ onAddCovenant, onCancel }) => {
  const [covenant, setCovenant] = useState<Covenant>({
    type: 'financial',
    name: '',
    threshold: '',
    frequency: 'quarterly',
    description: '',
    isCustom: true
  });
  
  const handleChange = (field: keyof Covenant, value: string) => {
    setCovenant(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (covenant.name && covenant.threshold && covenant.description) {
      onAddCovenant(covenant);
      onCancel();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg border border-gray-200">
      <h4 className="font-medium text-gray-800 mb-4">Add Custom Covenant</h4>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select
            value={covenant.type}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="financial">Financial</option>
            <option value="operational">Operational</option>
            <option value="reporting">Reporting</option>
            <option value="regulatory">Regulatory</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={covenant.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="e.g., Fixed Charge Coverage Ratio"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Threshold</label>
          <input
            type="text"
            value={covenant.threshold}
            onChange={(e) => handleChange('threshold', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="e.g., 1.5x, $500,000, etc."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Reporting Frequency</label>
          <select
            value={covenant.frequency}
            onChange={(e) => handleChange('frequency', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="semi-annual">Semi-Annual</option>
            <option value="annual">Annual</option>
            <option value="as needed">As Needed</option>
            <option value="continuous">Continuous</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={covenant.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            rows={3}
            placeholder="Describe the covenant requirements and conditions"
            required
          />
        </div>
      </div>
      
      <div className="mt-4 flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-3 py-1.5 border border-transparent text-sm font-medium rounded text-white bg-primary-600 hover:bg-primary-700"
        >
          Add Covenant
        </button>
      </div>
    </form>
  );
};

const Transactions = () => {
  const navigate = useNavigate();
  const { currentTransaction, updateTransaction, advanceStage } = useTransactionStore();
  const { userRole } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('documents');
  const [showBiometricKYC, setShowBiometricKYC] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);
  const [blockchainVerifying, setBlockchainVerifying] = useState(false);
  const [blockchainVerified, setBlockchainVerified] = useState(false);
  const [blockchainTxId, setBlockchainTxId] = useState<string | null>(null);
  const [showPQCVerification, setShowPQCVerification] = useState(false);
  const [pqcVerified, setPQCVerified] = useState(false);
  
  // Covenant management state
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [customCovenants, setCustomCovenants] = useState<Covenant[]>([]);
  const [showAddCustomCovenant, setShowAddCustomCovenant] = useState(false);
  const [covenants, setCovenants] = useState<Covenant[]>([]);
  const [showManageCovenants, setShowManageCovenants] = useState(false);
  
  // Document list state
  const [documentList, setDocumentList] = useState<DocumentStatus[]>([
    { name: 'Master Lease Agreement', status: 'pending' },
    { name: 'Equipment Schedule', status: 'pending' },
    { name: 'Insurance Certificate', status: 'pending' },
    { name: 'Delivery & Acceptance', status: 'pending' },
    { name: 'ACH Authorization', status: 'pending' },
    { name: 'Financial Covenants Rider', status: 'pending' },
    { name: 'Approved Deal Structure', status: 'pending' },
    { name: 'Blockchain Smart Contract', status: 'pending' },
  ]);

  // Document vault state
  const [transactionFiles, setTransactionFiles] = useState<FileItem[]>([]);

  // Initialize covenants from transaction
  useEffect(() => {
    if (currentTransaction?.approvedDeal?.covenants) {
      setCovenants(currentTransaction.approvedDeal.covenants);
      
      // Find which templates these covenants match
      const matchingTemplateIds = COVENANT_TEMPLATES
        .filter(template => {
          // Check if all template covenants exist in the current covenants
          return template.covenants.every(templateCovenant => 
            currentTransaction.approvedDeal!.covenants!.some(c => 
              c.name === templateCovenant.name && c.type === templateCovenant.type
            )
          );
        })
        .map(template => template.id);
      
      setSelectedTemplates(matchingTemplateIds);
      
      // Identify custom covenants (those not in any template)
      const allTemplateCovenants = COVENANT_TEMPLATES.flatMap(t => t.covenants);
      const customCovenantsList = currentTransaction.approvedDeal.covenants.filter(
        c => !allTemplateCovenants.some(tc => tc.name === c.name && tc.type === c.type)
      );
      
      setCustomCovenants(customCovenantsList);
    }
  }, [currentTransaction]);

  // Get deal information from the current transaction
  useEffect(() => {
    if (currentTransaction && currentTransaction.approvedDeal) {
      // If there's an approved deal, update the document list
      setDocumentList(prev => {
        // Find the approved deal structure document
        const updatedList = [...prev];
        const dealDocIndex = updatedList.findIndex(d => d.name === 'Approved Deal Structure');
        
        if (dealDocIndex >= 0) {
          // Mark it as generated since we have the approved deal
          updatedList[dealDocIndex] = {
            ...updatedList[dealDocIndex],
            status: 'generated',
            timestamp: currentTransaction.approvedDeal?.approvedAt
          };
        }
        
        return updatedList;
      });
    }
  }, [currentTransaction]);
  
  // Update covenants whenever templates or custom covenants change
  useEffect(() => {
    // Get all covenants from selected templates
    const templateCovenants = selectedTemplates.flatMap(templateId => {
      const template = COVENANT_TEMPLATES.find(t => t.id === templateId);
      return template ? template.covenants : [];
    });
    
    // Combine with custom covenants
    setCovenants([...templateCovenants, ...customCovenants]);
  }, [selectedTemplates, customCovenants]);
  
  // Save covenants to transaction
  const saveCovenants = async () => {
    if (!currentTransaction || !currentTransaction.approvedDeal) return;
    
    setLoading(true);
    
    try {
      // Create updated transaction with new covenants
      const updatedDeal = {
        ...currentTransaction.approvedDeal,
        covenants: covenants
      };
      
      const updatedTransaction = {
        ...currentTransaction,
        approvedDeal: updatedDeal
      };
      
      // Ensure we update the transaction and handle any errors
      const result = await updateTransaction(updatedTransaction);
      
      if (!result) {
        throw new Error("Failed to update transaction");
      }
      
      // Show success notification
      alert("Covenants saved successfully!");
      setShowManageCovenants(false);
      
      // Update Financial Covenants Rider document status
      setDocumentList(prev => {
        const updatedList = [...prev];
        const covenantDocIndex = updatedList.findIndex(d => d.name === 'Financial Covenants Rider');
        
        if (covenantDocIndex >= 0) {
          updatedList[covenantDocIndex] = {
            ...updatedList[covenantDocIndex],
            status: 'generated',
            timestamp: new Date().toISOString()
          };
        }
        
        return updatedList;
      });
    } catch (error) {
      console.error("Error saving covenants:", error);
      alert("Error saving covenants. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleTemplateChange = (newSelectedTemplates: string[]) => {
    setSelectedTemplates(newSelectedTemplates);
  };
  
  const handleAddCustomCovenant = (covenant: Covenant) => {
    setCustomCovenants(prev => [...prev, covenant]);
  };
  
  const handleRemoveCovenant = (covenantToRemove: Covenant) => {
    // If it's a custom covenant, remove it from custom covenants
    if (covenantToRemove.isCustom) {
      setCustomCovenants(prev => prev.filter(c => c.name !== covenantToRemove.name));
    } else {
      // If it's a template covenant, need to remove the template
      const templateWithCovenant = COVENANT_TEMPLATES.find(template => 
        template.covenants.some(c => c.name === covenantToRemove.name && c.type === covenantToRemove.type)
      );
      
      if (templateWithCovenant) {
        setSelectedTemplates(prev => prev.filter(id => id !== templateWithCovenant.id));
      }
    }
  };

  const generateDocuments = () => {
    setLoading(true);
    
    // Simulate document generation
    setTimeout(() => {
      setDocumentList(prev => 
        prev.map(doc => ({
          ...doc,
          status: 'generated',
          timestamp: new Date().toISOString()
        }))
      );
      setLoading(false);
    }, 2000);
  };

  const sendForSignature = () => {
    setLoading(true);
    
    // Simulate sending for signature
    setTimeout(() => {
      setDocumentList(prev => 
        prev.map(doc => ({
          ...doc,
          status: 'sent',
          timestamp: new Date().toISOString()
        }))
      );
      setLoading(false);
    }, 2000);
  };
  
  const simulateBlockchainVerification = () => {
    if (!currentTransaction?.approvedDeal) return;
    
    setBlockchainVerifying(true);
    
    // Simulate blockchain verification
    setTimeout(() => {
      // Generate mock blockchain transaction ID
      const txId = '0x' + Array.from({length: 64}, () => 
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
      ).join('');
      
      setBlockchainTxId(txId);
      setBlockchainVerified(true);
      
      // Update the blockchain document status
      setDocumentList(prev => {
        const updatedList = [...prev];
        const blockchainDocIndex = updatedList.findIndex(d => d.name === 'Blockchain Smart Contract');
        
        if (blockchainDocIndex >= 0) {
          updatedList[blockchainDocIndex] = {
            ...updatedList[blockchainDocIndex],
            status: 'verified',
            blockchainTxId: txId,
            timestamp: new Date().toISOString()
          };
        }
        
        return updatedList;
      });
      
      setBlockchainVerifying(false);
      
      // Update transaction with blockchain verification
      if (currentTransaction) {
        updateTransaction({
          ...currentTransaction,
          blockchainVerified: true,
          blockchainTxId: txId,
          verificationTimestamp: new Date().toISOString()
        });
      }
    }, 3000);
  };

  const completeTransaction = () => {
    if (currentTransaction) {
      // Store blockchain verification status
      const updatedTransaction = {
        ...currentTransaction,
        status: 'completed',
        completionDate: new Date().toISOString(),
        blockchainVerified: blockchainVerified,
        // Only include blockchainTxId if it's not null
        ...(blockchainTxId ? { blockchainTxId } : {})
      };
      
      updateTransaction(updatedTransaction).then(() => {
        advanceStage(currentTransaction.id, 'post_closing');
        navigate('/');
      });
    }
  };

  const initiateTransactionClose = () => {
    // Show biometric KYC verification before completing transaction
    setShowBiometricKYC(true);
  };

  const handleKYCComplete = (success: boolean) => {
    setKycVerified(success);
    
    // If KYC is successful, complete the transaction after modal is closed
    if (success) {
      // KYC was verified successfully
      // The actual transaction completion will happen when the modal is closed
    }
  };

  const handleKYCClose = () => {
    setShowBiometricKYC(false);
    
    // If KYC was verified, now complete the transaction
    if (kycVerified) {
      completeTransaction();
    }
  };

  const getStatusBadge = (status: DocumentStatus['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-gray-100 text-gray-800">Pending</span>;
      case 'generated':
        return <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-blue-100 text-blue-800">Generated</span>;
      case 'sent':
        return <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-yellow-100 text-yellow-800">Sent for Signature</span>;
      case 'signed':
        return <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-green-100 text-green-800">Signed</span>;
      case 'verified':
        return <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-medium rounded-full bg-purple-100 text-purple-800">Blockchain Verified</span>;
      default:
        return null;
    }
  };

  const allDocumentsGenerated = documentList.every(doc => doc.status !== 'pending');
  const allDocumentsSent = documentList.every(doc => doc.status === 'sent' || doc.status === 'signed' || doc.status === 'verified');
  const allDocumentsSigned = documentList.every(doc => doc.status === 'signed' || doc.status === 'verified');
  const blockchainDocumentVerified = documentList.some(doc => doc.name === 'Blockchain Smart Contract' && doc.status === 'verified');

  // Format currency for display
  const formatCurrency = (value: number | undefined): string => {
    if (value === undefined) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const initiateBlockchainVerification = () => {
    // First require PQC verification by both sender and receiver
    setShowPQCVerification(true);
  };

  const handlePQCVerificationComplete = (success: boolean, verifiedTransaction: any) => {
    setShowPQCVerification(false);
    
    if (success) {
      setPQCVerified(true);
      
      // Now proceed with blockchain verification
      simulateBlockchainVerification();
    }
  };

  // Convert document list to FileItems for Shield Vault integration
  useEffect(() => {
    // Convert documentList to FileItem format
    const files: FileItem[] = documentList.map(doc => ({
      id: `doc-${doc.name.replace(/\s+/g, '-').toLowerCase()}`,
      name: doc.name,
      type: doc.name.includes('Agreement') || doc.name.includes('Contract') ? 'pdf' : 
            doc.name.includes('Certificate') ? 'image' : 'document',
      size: 1024 * Math.floor(Math.random() * 1000 + 100), // Random size for demo
      lastModified: doc.timestamp || new Date().toISOString(),
      createdAt: doc.timestamp || new Date().toISOString(),
      path: `/transactions/${currentTransaction?.id}/documents/${doc.name.replace(/\s+/g, '-').toLowerCase()}`,
      parentId: null,
      owner: currentTransaction?.applicantData?.name || 'System',
      blockchainVerified: doc.status === 'verified',
      blockchainTxId: doc.blockchainTxId,
      versions: [],
      activity: []
    }));
    
    setTransactionFiles(files);
  }, [documentList, currentTransaction]);

  // Handle file updates from the document vault
  const handleDocumentVaultUpdate = (updatedFiles: FileItem[]) => {
    setTransactionFiles(updatedFiles);
    
    // Update document statuses based on vault changes
    const updatedDocumentList = [...documentList];
    
    updatedFiles.forEach(file => {
      const docIndex = updatedDocumentList.findIndex(
        doc => doc.name === file.name
      );
      
      if (docIndex >= 0) {
        // If the file is blockchain verified in vault, update the status
        if (file.blockchainVerified) {
          updatedDocumentList[docIndex] = {
            ...updatedDocumentList[docIndex],
            status: 'verified',
            blockchainTxId: file.blockchainTxId,
            timestamp: file.lastModified
          };
        }
      }
    });
    
    setDocumentList(updatedDocumentList);
  };

  // Render covenants tab
  const renderCovenantsTab = () => {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Contract Covenants</h3>
          
          <button
            onClick={() => setShowManageCovenants(true)}
            className="px-3 py-1.5 bg-primary-600 text-white rounded text-sm font-medium hover:bg-primary-700"
          >
            Manage Covenants
          </button>
        </div>
        
        {covenants.length > 0 ? (
          <div className="space-y-4">
            {covenants.map((covenant, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                  <h4 className="text-sm font-medium text-gray-900">{covenant.name}</h4>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                    {covenant.type}
                    {covenant.isCustom && ' • Custom'}
                  </span>
                </div>
                <div className="p-4">
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{covenant.description}</p>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Threshold:</span>
                      <span className="text-sm font-medium">{covenant.threshold}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Reporting Frequency:</span>
                      <span className="text-sm font-medium">{covenant.frequency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Enforcement:</span>
                      <span className="text-sm font-medium">
                        {blockchainVerified ? 'Smart Contract (Automated)' : 'Manual Reporting'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start">
                <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm text-blue-700">
                  <p className="mb-1 font-medium">Automated Covenant Monitoring</p>
                  <p>
                    Blockchain verification enables automated monitoring of covenant compliance. 
                    The system will automatically track compliance status and alert all parties if thresholds are 
                    approached or breached.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <p className="text-gray-500">No covenants have been defined for this transaction.</p>
            <button
              onClick={() => setShowManageCovenants(true)}
              className="mt-2 px-3 py-1.5 bg-primary-600 text-white rounded text-sm font-medium hover:bg-primary-700"
            >
              Add Covenants
            </button>
          </div>
        )}
      </div>
    );
  };

  // Add Covenant Management Modal
  const renderCovenantManagementModal = () => {
    if (!showManageCovenants) return null;
    
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Manage Covenants</h3>
            <button 
              onClick={() => setShowManageCovenants(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Template Selection */}
            <div className="space-y-4">
              <h4 className="text-base font-medium text-gray-900">Covenant Templates</h4>
              <p className="text-sm text-gray-500">
                Select templates based on transaction type, amount, and structure to automatically add appropriate covenants.
              </p>
              
              {currentTransaction && (
                <CovenantTemplateSelector
                  transaction={currentTransaction}
                  selectedTemplates={selectedTemplates}
                  onTemplateChange={handleTemplateChange}
                />
              )}
              
              <div className="mt-6">
                <h4 className="text-base font-medium text-gray-900">Custom Covenants</h4>
                <p className="text-sm text-gray-500 mb-3">
                  Add custom covenants specific to this transaction.
                </p>
                
                {customCovenants.length > 0 ? (
                  <div className="space-y-2">
                    {customCovenants.map((covenant, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 border border-gray-200 rounded">
                        <span className="text-sm font-medium">{covenant.name}</span>
                        <button
                          onClick={() => setCustomCovenants(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No custom covenants added</p>
                )}
                
                {showAddCustomCovenant ? (
                  <CustomCovenantForm
                    onAddCovenant={handleAddCustomCovenant}
                    onCancel={() => setShowAddCustomCovenant(false)}
                  />
                ) : (
                  <button
                    onClick={() => setShowAddCustomCovenant(true)}
                    className="mt-3 flex items-center text-primary-600 hover:text-primary-800"
                  >
                    <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Custom Covenant</span>
                  </button>
                )}
              </div>
            </div>
            
            {/* Preview */}
            <div className="space-y-4">
              <h4 className="text-base font-medium text-gray-900">Covenant Preview</h4>
              <p className="text-sm text-gray-500">
                Review all covenants that will be applied to this transaction.
              </p>
              
              {covenants.length > 0 ? (
                <div className="space-y-3 mt-3">
                  {covenants.map((covenant, index) => (
                    <div key={index} className="p-3 bg-white border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800 mb-1">
                            {covenant.type}
                          </span>
                          <h5 className="text-sm font-medium text-gray-900">{covenant.name}</h5>
                          <p className="text-xs text-gray-500 mt-0.5">{covenant.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-medium text-gray-700">{covenant.threshold}</div>
                          <div className="text-xs text-gray-500">{covenant.frequency}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    No covenants selected. Please select templates or add custom covenants.
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={() => setShowManageCovenants(false)}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-3"
            >
              Cancel
            </button>
            <button
              onClick={saveCovenants}
              disabled={covenants.length === 0 || loading}
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                covenants.length === 0 || loading ? 'bg-gray-300' : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {loading ? 'Saving...' : 'Save Covenants'}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Transaction Execution</h1>
        <p className="mt-1 text-sm text-gray-500">
          Generate, sign, and securely store transaction documents on blockchain
        </p>
      </div>

      {!currentTransaction ? (
        <div className="bg-white shadow rounded-lg p-6 text-center">
          <p className="text-gray-500 mb-4">No transaction selected</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Back to Dashboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                      activeTab === 'documents'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('documents')}
                  >
                    Documents
                  </button>
                  <button
                    className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                      activeTab === 'blockchain'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('blockchain')}
                  >
                    Blockchain Verification
                  </button>
                  <button
                    className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                      activeTab === 'covenants'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('covenants')}
                  >
                    Covenants
                  </button>
                  <button
                    className={`py-4 px-6 text-center border-b-2 text-sm font-medium ${
                      activeTab === 'shield-vault'
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('shield-vault')}
                  >
                    Shield Vault
                  </button>
                </nav>
              </div>

              {activeTab === 'documents' && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Transaction Documents</h3>
                    <div className="space-x-2">
                      <button
                        disabled={loading || allDocumentsGenerated}
                        onClick={generateDocuments}
                        className={`px-3 py-1.5 border border-transparent text-sm font-medium rounded ${
                          loading || allDocumentsGenerated
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-primary-600 text-white hover:bg-primary-700'
                        }`}
                      >
                        {loading ? 'Processing...' : 'Generate All'}
                      </button>
                      <button
                        disabled={loading || !allDocumentsGenerated || allDocumentsSent}
                        onClick={sendForSignature}
                        className={`px-3 py-1.5 border border-transparent text-sm font-medium rounded ${
                          loading || !allDocumentsGenerated || allDocumentsSent
                            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {loading ? 'Processing...' : 'Send for Signature'}
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                          <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {documentList.map((doc, index) => (
                          <tr key={index}>
                            <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                              {doc.name}
                            </td>
                            <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                              {getStatusBadge(doc.status)}
                            </td>
                            <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                              {doc.timestamp && (
                                <span className="text-xs text-gray-500">
                                  {new Date(doc.timestamp).toLocaleString()}
                                </span>
                              )}
                            </td>
                            <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-2">
                                {doc.status !== 'pending' && (
                                  <button className="text-primary-600 hover:text-primary-900 text-sm">
                                    View
                                  </button>
                                )}
                                {doc.status === 'generated' && (
                                  <button className="text-green-600 hover:text-green-900 text-sm">
                                    Edit
                                  </button>
                                )}
                                {doc.blockchainTxId && (
                                  <button 
                                    className="text-purple-600 hover:text-purple-900 text-sm"
                                    title={`Blockchain Transaction ID: ${doc.blockchainTxId}`}
                                  >
                                    Verify
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'blockchain' && (
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Blockchain Verification</h3>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
                    <div className="flex items-start">
                      <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-sm text-gray-600">
                        <p className="mb-2">
                          Blockchain verification creates an immutable record of your contract terms 
                          and covenants. This provides a tamper-proof way to ensure contract integrity 
                          and enables automated covenant monitoring.
                        </p>
                        <p className="font-medium text-gray-800">
                          Smart contracts automatically enforce covenant compliance and payment schedules.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {blockchainVerified ? (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                      <div className="flex">
                        <svg className="h-5 w-5 text-green-500 mt-0.5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h4 className="text-sm font-medium text-green-800">Blockchain Verification Complete</h4>
                          <p className="text-sm text-green-700 mt-1">
                            Transaction has been verified and recorded on the blockchain.
                          </p>
                          <div className="mt-2 bg-white p-3 rounded text-xs font-mono break-all">
                            Transaction ID: {blockchainTxId}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-6 mb-4">
                      <div className="mb-4 text-center">
                        <h4 className="text-base font-medium text-gray-900 mb-2">
                          {pqcVerified ? 'Processing Blockchain Verification' : 'Verify on Blockchain'}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {pqcVerified 
                            ? 'Your quantum-resistant signatures have been verified, now processing blockchain verification...'
                            : 'Secure your transaction with post-quantum cryptography verification before blockchain recording'}
                        </p>
                      </div>
                      
                      {blockchainVerifying ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mb-3"></div>
                          <p className="text-sm text-gray-600">Verifying transaction on blockchain...</p>
                        </div>
                      ) : (
                        <button
                          onClick={initiateBlockchainVerification}
                          disabled={!allDocumentsGenerated || pqcVerified}
                          className={`px-4 py-2 rounded-md ${
                            allDocumentsGenerated && !pqcVerified
                              ? 'bg-purple-600 text-white hover:bg-purple-700'
                              : 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {pqcVerified ? 'Processing...' : 'Initiate Quantum-Proof Verification'}
                        </button>
                      )}
                    </div>
                  )}
                  
                  {blockchainVerified && (
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900">Blockchain Transaction Details</h4>
                      </div>
                      <div className="p-4">
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Network:</span>
                            <span className="text-sm font-medium">Ethereum Mainnet</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Contract Type:</span>
                            <span className="text-sm font-medium">ERC-1400 Security Token</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Transaction Hash:</span>
                            <span className="text-sm font-mono break-all">{blockchainTxId?.substring(0, 18)}...{blockchainTxId?.substring(blockchainTxId.length - 8)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Status:</span>
                            <span className="text-sm font-medium text-green-600">Confirmed (24 blocks)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Timestamp:</span>
                            <span className="text-sm">{new Date().toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'covenants' && renderCovenantsTab()}

              {activeTab === 'shield-vault' && (
                <div className="p-6">
                  <TransactionDocumentVault
                    transactionId={currentTransaction.id}
                    transactionStatus={currentTransaction.approvedDeal ? 'funded' : 'in_progress'}
                    initialDocuments={transactionFiles}
                    userType={userRole as 'lender' | 'broker' | 'borrower' | 'vendor'}
                    onDocumentsUpdate={handleDocumentVaultUpdate}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Transaction Summary Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Transaction Summary</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="text-sm font-medium">{currentTransaction.id}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Applicant</p>
                  <p className="text-sm font-medium">{currentTransaction.applicantData.name}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Transaction Type</p>
                  <p className="text-sm font-medium">{currentTransaction.type}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-sm font-medium">${currentTransaction.amount.toLocaleString()}</p>
                </div>
                
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-900 mb-2">Approved Terms</p>
                  
                  {currentTransaction.approvedDeal ? (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500">Term</p>
                        <p className="text-sm font-medium">{currentTransaction.approvedDeal.term} months</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Rate</p>
                        <p className="text-sm font-medium">{currentTransaction.approvedDeal.rate}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Payment</p>
                        <p className="text-sm font-medium">{formatCurrency(currentTransaction.approvedDeal.payment)}/mo</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Down Payment</p>
                        <p className="text-sm font-medium">{formatCurrency(currentTransaction.approvedDeal.downPayment)}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No approved deal terms</p>
                  )}
                </div>
              </div>
              
              {/* Action Button */}
              <div className="mt-6">
                <button
                  onClick={initiateTransactionClose}
                  disabled={!allDocumentsGenerated || !blockchainDocumentVerified}
                  className={`w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                    allDocumentsGenerated && blockchainDocumentVerified
                      ? 'text-white bg-green-600 hover:bg-green-700'
                      : 'text-gray-500 bg-gray-100 cursor-not-allowed'
                  }`}
                >
                  {allDocumentsGenerated && blockchainDocumentVerified
                    ? 'Complete Closing'
                    : 'Complete Document Setup First'}
                </button>
              </div>
            </div>
            
            {/* Documentation Progress Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Closing Checklist</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full ${allDocumentsGenerated ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <div className="ml-3">
                    <p className={`text-sm ${allDocumentsGenerated ? 'text-green-800' : 'text-gray-500'}`}>
                      1. Generate closing documents
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full ${allDocumentsSent ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <div className="ml-3">
                    <p className={`text-sm ${allDocumentsSent ? 'text-green-800' : 'text-gray-500'}`}>
                      2. Send documents for signature
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full ${blockchainVerified ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <div className="ml-3">
                    <p className={`text-sm ${blockchainVerified ? 'text-green-800' : 'text-gray-500'}`}>
                      3. Complete blockchain verification
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className={`flex-shrink-0 h-5 w-5 rounded-full ${kycVerified ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                  <div className="ml-3">
                    <p className={`text-sm ${kycVerified ? 'text-green-800' : 'text-gray-500'}`}>
                      4. Verify KYC and complete closing
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Timeline Card */}
            {currentTransaction?.id && (
              <TransactionTimeMetrics transactionId={currentTransaction.id} />
            )}
          </div>
        </div>
      )}
      
      {/* Biometric KYC Modal */}
      {showBiometricKYC && (
        <BiometricKYC 
          isOpen={showBiometricKYC}
          onClose={handleKYCClose}
          onVerificationComplete={handleKYCComplete}
          userRole="lender"
        />
      )}

      {/* PQC Verification Modal */}
      {showPQCVerification && currentTransaction && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <PQCryptographyProvider>
              <PQCTransactionVerification
                transaction={currentTransaction}
                onVerificationComplete={handlePQCVerificationComplete}
                onCancel={() => setShowPQCVerification(false)}
              />
            </PQCryptographyProvider>
          </div>
        </div>
      )}
      
      {/* Add the covenant management modal */}
      {renderCovenantManagementModal()}
    </div>
  );
};

export default Transactions;