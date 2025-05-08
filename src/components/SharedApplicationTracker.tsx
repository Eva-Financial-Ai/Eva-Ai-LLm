import React, { useState, useEffect } from 'react';

// Interfaces for shared applications
export interface SharedApplication {
  id: string;
  applicationId: string;
  businessName: string;
  sharedWith: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  sharedDate: string;
  expirationDate: string; 
  status: 'sent' | 'viewed' | 'in_progress' | 'completed' | 'expired';
  lastViewed?: string;
  completionDate?: string;
  linkUrl: string;
}

interface SharedApplicationTrackerProps {
  applicationId?: string;
  showTitle?: boolean;
}

const SharedApplicationTracker: React.FC<SharedApplicationTrackerProps> = ({ 
  applicationId,
  showTitle = true
}) => {
  const [sharedApplications, setSharedApplications] = useState<SharedApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchSharedApplications = async () => {
      setLoading(true);
      try {
        // In a real implementation, this would call an API
        // Simulating API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data
        const mockApplications: SharedApplication[] = [
          {
            id: 'share-001',
            applicationId: applicationId || 'app-123',
            businessName: 'Quantum Innovations LLC',
            sharedWith: {
              id: 'rec-001',
              name: 'John Smith',
              email: 'john.smith@financialbrokers.com',
              role: 'broker'
            },
            sharedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
            expirationDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000).toISOString(), // 11 days from now
            status: 'in_progress',
            lastViewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            linkUrl: `https://app.example.com/shared/app-123?token=abc123`
          },
          {
            id: 'share-002',
            applicationId: applicationId || 'app-123',
            businessName: 'Quantum Innovations LLC',
            sharedWith: {
              id: 'rec-002',
              name: 'Maria Rodriguez',
              email: 'maria@loanorigination.com',
              role: 'originator'
            },
            sharedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            expirationDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(), // 9 days from now
            status: 'completed',
            lastViewed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
            completionDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            linkUrl: `https://app.example.com/shared/app-123?token=def456`
          },
          {
            id: 'share-003',
            applicationId: applicationId || 'app-123',
            businessName: 'Quantum Innovations LLC',
            sharedWith: {
              id: 'rec-005',
              name: 'Thomas Johnson',
              email: 'tjohnson@mortgagepro.com',
              role: 'broker'
            },
            sharedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
            expirationDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Expired 1 day ago
            status: 'expired',
            lastViewed: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
            linkUrl: `https://app.example.com/shared/app-123?token=ghi789`
          },
          {
            id: 'share-004',
            applicationId: applicationId || 'app-123',
            businessName: 'Quantum Innovations LLC',
            sharedWith: {
              id: 'rec-003',
              name: 'Robert Chen',
              email: 'robert.chen@capitallenders.com',
              role: 'lender'
            },
            sharedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
            expirationDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000).toISOString(), // 13 days from now
            status: 'sent',
            linkUrl: `https://app.example.com/shared/app-123?token=jkl012`
          }
        ];
        
        // If applicationId is provided, filter for just that application
        const filteredApplications = applicationId 
          ? mockApplications.filter(app => app.applicationId === applicationId)
          : mockApplications;
        
        setSharedApplications(filteredApplications);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching shared applications:', error);
        setLoading(false);
      }
    };
    
    fetchSharedApplications();
  }, [applicationId]);

  // Toggle expanding a row
  const toggleExpandRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate days remaining for expiration
  const getDaysRemaining = (expirationDate: string) => {
    const expDate = new Date(expirationDate);
    const today = new Date();
    
    // Return 0 if already expired
    if (expDate < today) return 0;
    
    const diffTime = expDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Resend application link
  const resendApplicationLink = (id: string) => {
    // In a real implementation, this would call an API to resend the link
    alert(`Link resent for application ${id}`);
  };
  
  // Revoke access to shared application
  const revokeAccess = (id: string) => {
    // In a real implementation, this would call an API to revoke access
    alert(`Access revoked for shared application ${id}`);
    
    // Update UI optimistically
    setSharedApplications(prev => 
      prev.map(app => 
        app.id === id 
          ? {...app, status: 'expired', expirationDate: new Date().toISOString()}
          : app
      )
    );
  };
  
  // Extend expiration date
  const extendExpiration = (id: string, days: number) => {
    // In a real implementation, this would call an API to extend the expiration
    alert(`Expiration extended by ${days} days for application ${id}`);
    
    // Update UI optimistically
    setSharedApplications(prev => 
      prev.map(app => {
        if (app.id === id) {
          const expDate = new Date(app.expirationDate);
          expDate.setDate(expDate.getDate() + days);
          return {
            ...app, 
            expirationDate: expDate.toISOString(),
            status: app.status === 'expired' ? 'sent' : app.status
          };
        }
        return app;
      })
    );
  };

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        {showTitle && <h3 className="text-lg font-medium text-gray-900 mb-4">Shared Applications</h3>}
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (sharedApplications.length === 0) {
    return (
      <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        {showTitle && <h3 className="text-lg font-medium text-gray-900 mb-4">Shared Applications</h3>}
        <div className="text-center p-8">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Shared Applications</h3>
          <p className="mt-1 text-sm text-gray-500">
            You haven't shared this application with anyone yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {showTitle && (
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Shared Applications</h3>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Recipient
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Shared
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expiration
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sharedApplications.map(application => (
              <React.Fragment key={application.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {application.sharedWith.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {application.sharedWith.email}
                        </div>
                        <div className="text-xs text-gray-400 capitalize">
                          {application.sharedWith.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(application.sharedDate)}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(application.expirationDate)}</div>
                    {application.status !== 'expired' && application.status !== 'completed' && (
                      <div className="text-xs text-gray-500">
                        {getDaysRemaining(application.expirationDate)} days remaining
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      application.status === 'completed' ? 'bg-green-100 text-green-800' :
                      application.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                      application.status === 'viewed' ? 'bg-indigo-100 text-indigo-800' :
                      application.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status === 'in_progress' ? 'In Progress' :
                       application.status === 'sent' ? 'Sent' :
                       application.status === 'viewed' ? 'Viewed' :
                       application.status === 'completed' ? 'Completed' :
                       'Expired'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      type="button"
                      onClick={() => toggleExpandRow(application.id)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      Details
                    </button>
                  </td>
                </tr>
                
                {/* Expanded details row */}
                {expandedRows.has(application.id) && (
                  <tr className="bg-gray-50">
                    <td colSpan={5} className="px-4 py-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Details</h4>
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <dt className="text-gray-500">Application</dt>
                            <dd className="text-gray-900">{application.businessName}</dd>
                            
                            <dt className="text-gray-500">Last Viewed</dt>
                            <dd className="text-gray-900">
                              {application.lastViewed ? formatDate(application.lastViewed) : 'Not viewed yet'}
                            </dd>
                            
                            {application.status === 'completed' && application.completionDate && (
                              <>
                                <dt className="text-gray-500">Completed On</dt>
                                <dd className="text-gray-900">{formatDate(application.completionDate)}</dd>
                              </>
                            )}
                            
                            <dt className="text-gray-500">Link</dt>
                            <dd className="text-gray-900 truncate max-w-xs">
                              <a href={application.linkUrl} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                                View shared link
                              </a>
                            </dd>
                          </dl>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Actions</h4>
                          <div className="space-y-2">
                            {application.status !== 'completed' && (
                              <button
                                type="button"
                                onClick={() => resendApplicationLink(application.id)}
                                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                              >
                                <svg className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Resend Link
                              </button>
                            )}
                            
                            {application.status !== 'expired' && application.status !== 'completed' && (
                              <button
                                type="button"
                                onClick={() => revokeAccess(application.id)}
                                className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none"
                              >
                                <svg className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                                Revoke Access
                              </button>
                            )}
                            
                            {application.status === 'expired' && (
                              <button
                                type="button"
                                onClick={() => extendExpiration(application.id, 14)}
                                className="inline-flex items-center px-3 py-1.5 border border-green-300 shadow-sm text-xs font-medium rounded text-green-700 bg-white hover:bg-green-50 focus:outline-none"
                              >
                                <svg className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Extend (14 days)
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SharedApplicationTracker; 