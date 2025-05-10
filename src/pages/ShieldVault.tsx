import React, { useState, useEffect } from 'react';
import PageLayout from '../components/layout/PageLayout';

interface SecureDocument {
  id: string;
  name: string;
  type: string;
  loanId?: string;
  dateAdded: string;
  size: string;
  documentStatus: 'pending' | 'verified' | 'rejected' | 'expired';
  encryptionStatus: 'encrypted' | 'decrypting' | 'decrypted';
  escrowStatus: 'locked' | 'released' | 'pending-release';
  sharedWith: string[];
  expiryDate?: string;
}

const ShieldVault: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<SecureDocument[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterEscrowStatus, setFilterEscrowStatus] = useState('all');

  // Mock data for escrow vault
  const mockDocuments: SecureDocument[] = [
    {
      id: 'doc-001',
      name: 'Commercial Loan Agreement - XYZ Corp',
      type: 'Loan',
      loanId: 'L-2023-042',
      dateAdded: '2023-04-15',
      size: '2.4 MB',
      documentStatus: 'verified',
      encryptionStatus: 'encrypted',
      escrowStatus: 'locked',
      sharedWith: ['Finance Team', 'Loan Officers'],
      expiryDate: '2028-04-15',
    },
    {
      id: 'doc-002',
      name: 'Commercial Property Lease - Retail Space 233',
      type: 'Lease',
      loanId: 'L-2023-037',
      dateAdded: '2023-04-10',
      size: '1.8 MB',
      documentStatus: 'verified',
      encryptionStatus: 'encrypted',
      escrowStatus: 'locked',
      sharedWith: ['Legal Department', 'Property Management'],
      expiryDate: '2030-01-10',
    },
    {
      id: 'doc-003',
      name: 'Equipment Financing Agreement - Heavy Machinery',
      type: 'Asset',
      loanId: 'L-2023-029',
      dateAdded: '2023-04-05',
      size: '3.2 MB',
      documentStatus: 'verified',
      encryptionStatus: 'encrypted',
      escrowStatus: 'locked',
      sharedWith: ['Asset Management', 'Lending Team'],
      expiryDate: '2027-04-05',
    },
    {
      id: 'doc-004',
      name: 'Small Business Credit Line - ABC Enterprises',
      type: 'Credit',
      loanId: 'L-2023-018',
      dateAdded: '2023-03-28',
      size: '1.5 MB',
      documentStatus: 'verified',
      encryptionStatus: 'encrypted',
      escrowStatus: 'released',
      sharedWith: ['Credit Department', 'Risk Assessment'],
      expiryDate: '2025-03-28',
    },
    {
      id: 'doc-005',
      name: 'Construction Loan Agreement - New Office Complex',
      type: 'Loan',
      loanId: 'L-2023-012',
      dateAdded: '2023-03-20',
      size: '4.7 MB',
      documentStatus: 'verified',
      encryptionStatus: 'encrypted',
      escrowStatus: 'locked',
      sharedWith: ['Construction Finance', 'Project Management'],
      expiryDate: '2026-03-20',
    },
    {
      id: 'doc-006',
      name: 'Unsecured Business Loan - Tech Startup Inc.',
      type: 'Unsecured',
      loanId: 'L-2023-008',
      dateAdded: '2023-03-15',
      size: '1.3 MB',
      documentStatus: 'verified',
      encryptionStatus: 'encrypted',
      escrowStatus: 'pending-release',
      sharedWith: ['Venture Finance', 'Underwriting'],
      expiryDate: '2025-09-15',
    },
    {
      id: 'doc-007',
      name: 'Fleet Vehicle Lease Agreement - Logistics Co.',
      type: 'Lease',
      loanId: 'L-2023-005',
      dateAdded: '2023-02-28',
      size: '2.8 MB',
      documentStatus: 'verified',
      encryptionStatus: 'encrypted',
      escrowStatus: 'locked',
      sharedWith: ['Vehicle Asset Management', 'Leasing Department'],
      expiryDate: '2028-02-28',
    },
    {
      id: 'doc-008',
      name: 'Commercial Mortgage - Downtown Property',
      type: 'Mortgage',
      loanId: 'L-2023-002',
      dateAdded: '2023-02-15',
      size: '5.1 MB',
      documentStatus: 'verified',
      encryptionStatus: 'encrypted',
      escrowStatus: 'locked',
      sharedWith: ['Mortgage Department', 'Real Estate Portfolio'],
      expiryDate: '2053-02-15',
    },
  ];

  // Load documents
  useEffect(() => {
    setTimeout(() => {
      setDocuments(mockDocuments);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter documents
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesEscrowStatus =
      filterEscrowStatus === 'all' || doc.escrowStatus === filterEscrowStatus;
    return matchesSearch && matchesType && matchesEscrowStatus;
  });

  // Get document types for filter
  const documentTypes = ['all', ...Array.from(new Set(documents.map(doc => doc.type)))];
  const escrowStatuses = ['all', 'locked', 'released', 'pending-release'];

  const handleDecrypt = (docId: string) => {
    setDocuments(docs =>
      docs.map(doc => (doc.id === docId ? { ...doc, encryptionStatus: 'decrypting' } : doc))
    );

    // Simulate decryption process
    setTimeout(() => {
      setDocuments(docs =>
        docs.map(doc =>
          doc.id === docId && doc.encryptionStatus === 'decrypting'
            ? { ...doc, encryptionStatus: 'decrypted' }
            : doc
        )
      );
    }, 2000);
  };

  const handleEncrypt = (docId: string) => {
    setDocuments(docs =>
      docs.map(doc => (doc.id === docId ? { ...doc, encryptionStatus: 'encrypted' } : doc))
    );
  };

  const handleReleaseFromEscrow = (docId: string) => {
    setDocuments(docs =>
      docs.map(doc => (doc.id === docId ? { ...doc, escrowStatus: 'pending-release' } : doc))
    );

    // Simulate release process
    setTimeout(() => {
      setDocuments(docs =>
        docs.map(doc =>
          doc.id === docId && doc.escrowStatus === 'pending-release'
            ? { ...doc, escrowStatus: 'released' }
            : doc
        )
      );
    }, 3000);
  };

  const handleReturnToEscrow = (docId: string) => {
    setDocuments(docs =>
      docs.map(doc => (doc.id === docId ? { ...doc, escrowStatus: 'locked' } : doc))
    );
  };

  // Function to get styles based on document status
  const getDocumentStatusStyles = (status: 'pending' | 'verified' | 'rejected' | 'expired') => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get styles based on escrow status
  const getEscrowStatusStyles = (status: 'locked' | 'released' | 'pending-release') => {
    switch (status) {
      case 'locked':
        return 'bg-blue-100 text-blue-800';
      case 'released':
        return 'bg-green-100 text-green-800';
      case 'pending-release':
        return 'bg-yellow-100 text-yellow-800 animate-pulse';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get styles based on encryption status
  const getEncryptionStyles = (status: 'encrypted' | 'decrypting' | 'decrypted') => {
    switch (status) {
      case 'encrypted':
        return 'bg-green-100 text-green-800';
      case 'decrypting':
        return 'bg-yellow-100 text-yellow-800 animate-pulse';
      case 'decrypted':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <PageLayout title="Shield Document Escrow Vault">
        <div className="flex flex-col h-full">
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-lg text-gray-700">Loading Document Escrow Vault...</span>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="Shield Document Escrow Vault">
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-gray-600">
                Secure escrow management for commercial financial documents and contracts
              </p>
            </div>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-md shadow hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
              Upload To Escrow
            </button>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="w-full md:w-64">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search Documents
                </label>
                <input
                  type="text"
                  id="search"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search by name or loan ID..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="filter-type"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Document Type
                </label>
                <select
                  id="filter-type"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                >
                  {documentTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="filter-escrow-status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Escrow Status
                </label>
                <select
                  id="filter-escrow-status"
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  value={filterEscrowStatus}
                  onChange={e => setFilterEscrowStatus(e.target.value)}
                >
                  {escrowStatuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'all'
                        ? 'All Statuses'
                        : status.replace('-', ' ').replace(/^\w/, c => c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterType('all');
                    setFilterEscrowStatus('all');
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Escrow Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Escrow Documents</h3>
              <p className="text-2xl font-semibold text-gray-900">{documents.length}</p>
              <div className="mt-1 text-sm text-gray-500">
                {documents.filter(d => d.escrowStatus === 'locked').length} currently locked
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Value Secured</h3>
              <p className="text-2xl font-semibold text-gray-900">$12.8M</p>
              <div className="mt-1 text-sm text-gray-500">
                Across {documents.length} loan documents
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Escrow Security Status</h3>
              <p className="text-2xl font-semibold text-green-600">Active</p>
              <div className="mt-1 text-sm text-gray-500">
                Last verification: {new Date().toLocaleDateString()}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Pending Actions</h3>
              <p className="text-2xl font-semibold text-amber-600">
                {documents.filter(d => d.escrowStatus === 'pending-release').length}
              </p>
              <div className="mt-1 text-sm text-gray-500">Documents requiring attention</div>
            </div>
          </div>

          {/* Documents Table */}
          <div className="bg-white shadow overflow-hidden rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Escrow Documents</h3>
              <span className="text-sm text-gray-500">{filteredDocuments.length} documents</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Document
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Loan ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Date Added
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Expires
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Escrow Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Security
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map(document => (
                    <tr key={document.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-lg">
                            <svg
                              className="h-6 w-6 text-gray-500"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{document.name}</div>
                            <div className="text-sm text-gray-500">{document.size}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{document.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{document.loanId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{document.dateAdded}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{document.expiryDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEscrowStatusStyles(document.escrowStatus)}`}
                        >
                          {document.escrowStatus
                            .replace('-', ' ')
                            .replace(/^\w/, c => c.toUpperCase())}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEncryptionStyles(document.encryptionStatus)}`}
                        >
                          {document.encryptionStatus.charAt(0).toUpperCase() +
                            document.encryptionStatus.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {document.escrowStatus === 'locked' ? (
                          <button
                            onClick={() => handleReleaseFromEscrow(document.id)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            Release
                          </button>
                        ) : document.escrowStatus === 'released' ? (
                          <button
                            onClick={() => handleReturnToEscrow(document.id)}
                            className="text-green-600 hover:text-green-900 mr-3"
                          >
                            Return to Escrow
                          </button>
                        ) : (
                          <span className="text-yellow-500 mr-3">Processing...</span>
                        )}
                        <button className="text-primary-600 hover:text-primary-900">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ShieldVault;
