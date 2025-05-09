import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export interface Lien {
  id: string;
  type: 'UCC-1' | 'UCC-3' | 'Mortgage' | 'Deed of Trust' | 'Other';
  filingNumber: string;
  filingDate: string;
  expirationDate: string;
  securedParty: string;
  debtor: string;
  collateralDescription: string;
  amount: number;
  status: 'Active' | 'Pending' | 'Released' | 'Subordinated' | 'Amended';
  jurisdiction: string;
  documents: LienDocument[];
  blockchainVerified: boolean;
  blockchainTxHash?: string;
  lastUpdated: string;
}

interface LienDocument {
  id: string;
  name: string;
  type: 'Filing' | 'Amendment' | 'Continuation' | 'Termination' | 'Release' | 'Subordination';
  url: string;
  uploadDate: string;
  verified: boolean;
}

interface LienUCCManagementProps {
  businessId?: string;
  businessName?: string;
  onLienChange?: (liens: Lien[]) => void;
  readOnly?: boolean;
}

const LienUCCManagement: React.FC<LienUCCManagementProps> = ({
  businessId,
  businessName,
  onLienChange,
  readOnly = false,
}) => {
  const [liens, setLiens] = useState<Lien[]>([]);
  const [selectedLien, setSelectedLien] = useState<Lien | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<
    'create' | 'edit' | 'view' | 'release' | 'subordinate'
  >('create');
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock data for demonstration purposes
  const mockLiens: Lien[] = [
    {
      id: 'lien-1',
      type: 'UCC-1',
      filingNumber: 'UCC-1-2023-12345',
      filingDate: '2023-01-15',
      expirationDate: '2028-01-15',
      securedParty: 'First National Bank',
      debtor: 'Quantum Innovations LLC',
      collateralDescription:
        'All business assets including equipment, inventory, and accounts receivable',
      amount: 250000,
      status: 'Active',
      jurisdiction: 'California Secretary of State',
      documents: [
        {
          id: 'doc-1',
          name: 'UCC-1 Filing',
          type: 'Filing',
          url: '#',
          uploadDate: '2023-01-15',
          verified: true,
        },
      ],
      blockchainVerified: true,
      blockchainTxHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      lastUpdated: '2023-01-15',
    },
    {
      id: 'lien-2',
      type: 'Mortgage',
      filingNumber: 'MGT-2022-98765',
      filingDate: '2022-03-10',
      expirationDate: '2052-03-10',
      securedParty: 'Commercial Mortgage Co.',
      debtor: 'Quantum Innovations LLC',
      collateralDescription: 'Commercial property at 123 Innovation Drive, San Francisco, CA',
      amount: 1500000,
      status: 'Active',
      jurisdiction: 'San Francisco County Recorder',
      documents: [
        {
          id: 'doc-2',
          name: 'Mortgage Agreement',
          type: 'Filing',
          url: '#',
          uploadDate: '2022-03-10',
          verified: true,
        },
      ],
      blockchainVerified: true,
      blockchainTxHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      lastUpdated: '2022-03-10',
    },
    {
      id: 'lien-3',
      type: 'UCC-1',
      filingNumber: 'UCC-1-2021-54321',
      filingDate: '2021-09-22',
      expirationDate: '2026-09-22',
      securedParty: 'Equipment Finance Inc.',
      debtor: 'Quantum Innovations LLC',
      collateralDescription: 'Manufacturing equipment: Model XYZ123 CNC Machine, Serial #AB12345',
      amount: 75000,
      status: 'Released',
      jurisdiction: 'California Secretary of State',
      documents: [
        {
          id: 'doc-3a',
          name: 'UCC-1 Filing',
          type: 'Filing',
          url: '#',
          uploadDate: '2021-09-22',
          verified: true,
        },
        {
          id: 'doc-3b',
          name: 'UCC-3 Termination',
          type: 'Termination',
          url: '#',
          uploadDate: '2023-04-15',
          verified: true,
        },
      ],
      blockchainVerified: true,
      blockchainTxHash: '0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
      lastUpdated: '2023-04-15',
    },
  ];

  // Load initial data
  useEffect(() => {
    setIsLoading(true);

    // In a real implementation, this would fetch from an API
    setTimeout(() => {
      setLiens(mockLiens);
      setIsLoading(false);
    }, 800);
  }, []);

  // Notify parent of changes
  useEffect(() => {
    if (onLienChange) {
      onLienChange(liens);
    }
  }, [liens, onLienChange]);

  const handleCreateLien = () => {
    setModalMode('create');
    setSelectedLien(null);
    setIsModalOpen(true);
  };

  const handleEditLien = (lien: Lien) => {
    setModalMode('edit');
    setSelectedLien(lien);
    setIsModalOpen(true);
  };

  const handleViewLien = (lien: Lien) => {
    setModalMode('view');
    setSelectedLien(lien);
    setIsModalOpen(true);
  };

  const handleReleaseLien = (lien: Lien) => {
    setModalMode('release');
    setSelectedLien(lien);
    setIsModalOpen(true);
  };

  const handleSubordinateLien = (lien: Lien) => {
    setModalMode('subordinate');
    setSelectedLien(lien);
    setIsModalOpen(true);
  };

  const handleSaveLien = (lien: Lien) => {
    setIsProcessing(true);

    // Simulate API call and blockchain verification
    setTimeout(() => {
      let updatedLiens;

      if (modalMode === 'create') {
        // Add new lien with generated ID
        const newLien = {
          ...lien,
          id: `lien-${uuidv4().substring(0, 8)}`,
          blockchainVerified: true,
          blockchainTxHash: `0x${Math.random().toString(16).substring(2, 66)}`,
          lastUpdated: new Date().toISOString().split('T')[0],
        };
        updatedLiens = [...liens, newLien];
      } else if (modalMode === 'edit') {
        // Update existing lien
        updatedLiens = liens.map(l =>
          l.id === lien.id ? { ...lien, lastUpdated: new Date().toISOString().split('T')[0] } : l
        );
      } else if (modalMode === 'release') {
        // Release lien (adding termination document and changing status)
        updatedLiens = liens.map(l => {
          if (l.id === lien.id) {
            const terminationDoc = {
              id: `doc-${uuidv4().substring(0, 8)}`,
              name: 'UCC-3 Termination',
              type: 'Termination' as const,
              url: '#',
              uploadDate: new Date().toISOString().split('T')[0],
              verified: true,
            };
            return {
              ...lien,
              status: 'Released' as const,
              documents: [...lien.documents, terminationDoc],
              lastUpdated: new Date().toISOString().split('T')[0],
            };
          }
          return l;
        });
      } else if (modalMode === 'subordinate') {
        // Subordinate lien (adding subordination document and changing status)
        updatedLiens = liens.map(l => {
          if (l.id === lien.id) {
            const subordinationDoc = {
              id: `doc-${uuidv4().substring(0, 8)}`,
              name: 'Subordination Agreement',
              type: 'Subordination' as const,
              url: '#',
              uploadDate: new Date().toISOString().split('T')[0],
              verified: true,
            };
            return {
              ...lien,
              status: 'Subordinated' as const,
              documents: [...lien.documents, subordinationDoc],
              lastUpdated: new Date().toISOString().split('T')[0],
            };
          }
          return l;
        });
      } else {
        updatedLiens = liens;
      }

      setLiens(updatedLiens);
      setIsModalOpen(false);
      setIsProcessing(false);
    }, 1500);
  };

  // Render the modal based on mode
  const renderModal = () => {
    if (!isModalOpen) return null;

    const title = {
      create: 'Create New Lien/UCC Filing',
      edit: 'Edit Lien/UCC Filing',
      view: 'View Lien/UCC Details',
      release: 'Release Lien/UCC Filing',
      subordinate: 'Subordinate Lien/UCC Filing',
    }[modalMode];

    const isReadOnly =
      modalMode === 'view' || modalMode === 'release' || modalMode === 'subordinate';

    // Use the selected lien for edit/view modes, or a blank template for create mode
    const currentLien = selectedLien || {
      id: '',
      type: 'UCC-1' as const,
      filingNumber: '',
      filingDate: new Date().toISOString().split('T')[0],
      expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 5))
        .toISOString()
        .split('T')[0],
      securedParty: '',
      debtor: businessName || '',
      collateralDescription: '',
      amount: 0,
      status: 'Pending' as const,
      jurisdiction: '',
      documents: [],
      blockchainVerified: false,
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    return (
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-center min-h-screen p-4 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
            aria-hidden="true"
          ></div>

          {/* Modal panel */}
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {title}
                  </h3>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={currentLien.type}
                        disabled={isReadOnly}
                        onChange={e =>
                          setSelectedLien({
                            ...currentLien,
                            type: e.target.value as any,
                          })
                        }
                      >
                        <option value="UCC-1">UCC-1</option>
                        <option value="UCC-3">UCC-3</option>
                        <option value="Mortgage">Mortgage</option>
                        <option value="Deed of Trust">Deed of Trust</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filing Number
                      </label>
                      <input
                        type="text"
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={currentLien.filingNumber}
                        disabled={isReadOnly}
                        onChange={e =>
                          setSelectedLien({
                            ...currentLien,
                            filingNumber: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filing Date
                      </label>
                      <input
                        type="date"
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={currentLien.filingDate}
                        disabled={isReadOnly}
                        onChange={e =>
                          setSelectedLien({
                            ...currentLien,
                            filingDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration Date
                      </label>
                      <input
                        type="date"
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={currentLien.expirationDate}
                        disabled={isReadOnly}
                        onChange={e =>
                          setSelectedLien({
                            ...currentLien,
                            expirationDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Secured Party
                      </label>
                      <input
                        type="text"
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={currentLien.securedParty}
                        disabled={isReadOnly}
                        onChange={e =>
                          setSelectedLien({
                            ...currentLien,
                            securedParty: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Debtor</label>
                      <input
                        type="text"
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm bg-gray-50"
                        value={currentLien.debtor}
                        disabled={true}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 sm:text-sm">$</span>
                        </div>
                        <input
                          type="number"
                          className="block w-full pl-7 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                          value={currentLien.amount}
                          disabled={isReadOnly}
                          onChange={e =>
                            setSelectedLien({
                              ...currentLien,
                              amount: parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jurisdiction
                      </label>
                      <input
                        type="text"
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={currentLien.jurisdiction}
                        disabled={isReadOnly}
                        onChange={e =>
                          setSelectedLien({
                            ...currentLien,
                            jurisdiction: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Collateral Description
                      </label>
                      <textarea
                        rows={3}
                        className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={currentLien.collateralDescription}
                        disabled={isReadOnly}
                        onChange={e =>
                          setSelectedLien({
                            ...currentLien,
                            collateralDescription: e.target.value,
                          })
                        }
                      />
                    </div>

                    {modalMode === 'view' && currentLien.blockchainVerified && (
                      <div className="col-span-1 md:col-span-2 mt-2">
                        <div className="flex items-center bg-blue-50 p-3 rounded-md">
                          <svg
                            className="h-5 w-5 text-blue-500 mr-2"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-blue-800">Blockchain Verified</p>
                            <p className="text-xs text-blue-600 mt-1">
                              Transaction Hash: {currentLien.blockchainTxHash}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {modalMode === 'release' && (
                      <div className="col-span-1 md:col-span-2 mt-2">
                        <div className="bg-yellow-50 p-4 rounded-md">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-5 w-5 text-yellow-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-yellow-800">
                                Releasing this lien/UCC filing
                              </h3>
                              <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                  This action will mark this filing as released and create an
                                  immutable blockchain record. This action cannot be undone.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {modalMode === 'subordinate' && (
                      <div className="col-span-1 md:col-span-2 mt-2">
                        <div className="bg-yellow-50 p-4 rounded-md">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <svg
                                className="h-5 w-5 text-yellow-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <div className="ml-3">
                              <h3 className="text-sm font-medium text-yellow-800">
                                Subordinating this lien/UCC filing
                              </h3>
                              <div className="mt-2 text-sm text-yellow-700">
                                <p>
                                  This will record a subordination agreement for this lien, giving
                                  priority to another secured party. Please upload a signed
                                  subordination agreement to proceed.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              {(modalMode === 'create' || modalMode === 'edit') && (
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
                  onClick={() => handleSaveLien(currentLien)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Processing...
                    </>
                  ) : (
                    'Save'
                  )}
                </button>
              )}

              {modalMode === 'release' && (
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
                  onClick={() => handleSaveLien(currentLien)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Processing...
                    </>
                  ) : (
                    'Confirm Release'
                  )}
                </button>
              )}

              {modalMode === 'subordinate' && (
                <button
                  type="button"
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-yellow-600 text-base font-medium text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 sm:ml-3 sm:w-auto sm:text-sm ${isProcessing ? 'opacity-75 cursor-not-allowed' : ''}`}
                  onClick={() => handleSaveLien(currentLien)}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                      Processing...
                    </>
                  ) : (
                    'Confirm Subordination'
                  )}
                </button>
              )}

              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setIsModalOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-800">Lien & UCC Management</h3>

          {!readOnly && (
            <button
              type="button"
              onClick={handleCreateLien}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg
                className="h-4 w-4 mr-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add New Lien/UCC
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        ) : liens.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No liens or UCC filings</h3>
            <p className="mt-1 text-sm text-gray-500">
              {readOnly
                ? 'There are no liens or UCC filings associated with this business.'
                : 'Get started by adding a new lien or UCC filing.'}
            </p>
            {!readOnly && (
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleCreateLien}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Add New Lien/UCC
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
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
                    Filing/Details
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Secured Party
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Blockchain
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
                {liens.map(lien => (
                  <tr key={lien.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {lien.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lien.filingNumber}</div>
                      <div className="text-xs text-gray-500">Filed: {lien.filingDate}</div>
                      <div className="text-xs text-gray-500">Expires: {lien.expirationDate}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lien.securedParty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${lien.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          lien.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : lien.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : lien.status === 'Released'
                                ? 'bg-gray-100 text-gray-800'
                                : lien.status === 'Subordinated'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {lien.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {lien.blockchainVerified ? (
                        <span className="inline-flex items-center text-green-600">
                          <svg
                            className="h-4 w-4 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-yellow-600">
                          <svg
                            className="h-4 w-4 mr-1"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        type="button"
                        onClick={() => handleViewLien(lien)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        View
                      </button>

                      {!readOnly && lien.status === 'Active' && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleEditLien(lien)}
                            className="text-primary-600 hover:text-primary-900 mr-3"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReleaseLien(lien)}
                            className="text-red-600 hover:text-red-900 mr-3"
                          >
                            Release
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSubordinateLien(lien)}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            Subordinate
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Render modal for create/edit/view/release/subordinate */}
      {renderModal()}
    </div>
  );
};

export default LienUCCManagement;
