import React, { useState } from 'react';

// Define interface for commitment data
export interface CommitmentData {
  id: string;
  partnerName: string;
  partnerType: 'broker' | 'lender' | 'vendor';
  commitmentPeriod: 'monthly' | 'quarterly' | 'yearly';
  minDealCount: number;
  minDealVolume: number;
  startDate: Date;
  endDate?: Date;
  currentProgress: {
    dealCount: number;
    dealVolume: number;
    lastUpdated: Date;
  };
  notes?: string;
}

interface RelationshipCommitmentProps {
  userRole: string;
  initialCommitments?: CommitmentData[];
}

const RelationshipCommitment: React.FC<RelationshipCommitmentProps> = ({
  userRole,
  initialCommitments = []
}) => {
  const [commitments, setCommitments] = useState<CommitmentData[]>(initialCommitments);
  const [showAddCommitment, setShowAddCommitment] = useState(false);
  const [editingCommitmentId, setEditingCommitmentId] = useState<string | null>(null);
  
  // New commitment form state
  const [newCommitment, setNewCommitment] = useState<Omit<CommitmentData, 'id' | 'currentProgress'>>({
    partnerName: '',
    partnerType: 'broker',
    commitmentPeriod: 'monthly',
    minDealCount: 0,
    minDealVolume: 0,
    startDate: new Date(),
  });
  
  // Calculate progress percentage
  const calculateProgress = (commitment: CommitmentData): number => {
    // Can calculate based on either deal count or volume, here using the better of the two
    const countProgress = (commitment.currentProgress.dealCount / commitment.minDealCount) * 100;
    const volumeProgress = (commitment.currentProgress.dealVolume / commitment.minDealVolume) * 100;
    
    return Math.max(countProgress, volumeProgress);
  };
  
  // Get status color based on progress
  const getStatusColor = (progress: number): string => {
    if (progress >= 100) return 'text-green-600';
    if (progress >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // Handle adding new commitment
  const handleAddCommitment = () => {
    const newCommitmentItem: CommitmentData = {
      id: `commitment-${Date.now()}`,
      ...newCommitment,
      currentProgress: {
        dealCount: 0,
        dealVolume: 0,
        lastUpdated: new Date()
      }
    };
    
    setCommitments([...commitments, newCommitmentItem]);
    setNewCommitment({
      partnerName: '',
      partnerType: 'broker',
      commitmentPeriod: 'monthly',
      minDealCount: 0,
      minDealVolume: 0,
      startDate: new Date(),
    });
    setShowAddCommitment(false);
  };
  
  // Handle updating commitment progress
  const handleUpdateProgress = (commitmentId: string, newCount: number, newVolume: number) => {
    setCommitments(commitments.map(commitment => 
      commitment.id === commitmentId 
        ? {
            ...commitment,
            currentProgress: {
              dealCount: newCount,
              dealVolume: newVolume,
              lastUpdated: new Date()
            }
          }
        : commitment
    ));
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Relationship Commitments</h2>
          <button
            onClick={() => setShowAddCommitment(true)}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Add Commitment
          </button>
        </div>
        
        <div className="bg-amber-50 p-3 rounded-md mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                Track minimum deal flow commitments with your business relationships. Regular check-ins help maintain strong partnerships.
              </p>
            </div>
          </div>
        </div>
        
        {commitments.length === 0 ? (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No commitments set up</h3>
            <p className="mt-1 text-sm text-gray-500">
              Add your first relationship commitment to track deal flow targets.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddCommitment(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add New Commitment
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {commitments.map((commitment) => {
              const progress = calculateProgress(commitment);
              const statusColor = getStatusColor(progress);
              
              return (
                <div key={commitment.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">{commitment.partnerName}</h3>
                        <p className="text-sm text-gray-500">
                          {commitment.partnerType.charAt(0).toUpperCase() + commitment.partnerType.slice(1)} • 
                          {commitment.commitmentPeriod === 'monthly' ? ' Monthly' : 
                           commitment.commitmentPeriod === 'quarterly' ? ' Quarterly' : ' Yearly'} Commitment
                        </p>
                      </div>
                      <div className={`text-base font-semibold ${statusColor}`}>
                        {Math.round(progress)}% Complete
                      </div>
                    </div>
                  </div>
                  
                  <div className="px-4 py-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500">Minimum Deal Count</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium">{commitment.currentProgress.dealCount} of {commitment.minDealCount}</p>
                          <span className={`text-xs font-medium ${statusColor}`}>
                            {Math.round((commitment.currentProgress.dealCount / commitment.minDealCount) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`${
                              progress >= 100 ? 'bg-green-500' : progress >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            } h-2 rounded-full`} 
                            style={{ width: `${Math.min((commitment.currentProgress.dealCount / commitment.minDealCount) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Minimum Deal Volume</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium">
                            ${(commitment.currentProgress.dealVolume/1000).toFixed(1)}k of ${(commitment.minDealVolume/1000).toFixed(1)}k
                          </p>
                          <span className={`text-xs font-medium ${statusColor}`}>
                            {Math.round((commitment.currentProgress.dealVolume / commitment.minDealVolume) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className={`${
                              progress >= 100 ? 'bg-green-500' : progress >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            } h-2 rounded-full`} 
                            style={{ width: `${Math.min((commitment.currentProgress.dealVolume / commitment.minDealVolume) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                      <div>
                        Period: {new Date(commitment.startDate).toLocaleDateString()} - 
                        {commitment.endDate ? new Date(commitment.endDate).toLocaleDateString() : 'Ongoing'}
                      </div>
                      <div>
                        Last Updated: {new Date(commitment.currentProgress.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-4 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => {
                          // Open a prompt or modal to update progress
                          const newCount = Number(prompt('Enter new deal count:', String(commitment.currentProgress.dealCount)));
                          const newVolume = Number(prompt('Enter new deal volume ($):', String(commitment.currentProgress.dealVolume)));
                          
                          if (!isNaN(newCount) && !isNaN(newVolume)) {
                            handleUpdateProgress(commitment.id, newCount, newVolume);
                          }
                        }}
                        className="text-xs text-primary-600 font-medium hover:text-primary-700"
                      >
                        Update Progress
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Add Commitment Modal */}
      {showAddCommitment && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      New Relationship Commitment
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="partner-name" className="block text-sm font-medium text-gray-700">
                          Partner Name
                        </label>
                        <input
                          type="text"
                          name="partner-name"
                          id="partner-name"
                          value={newCommitment.partnerName}
                          onChange={(e) => setNewCommitment({...newCommitment, partnerName: e.target.value})}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="partner-type" className="block text-sm font-medium text-gray-700">
                          Partner Type
                        </label>
                        <select
                          name="partner-type"
                          id="partner-type"
                          value={newCommitment.partnerType}
                          onChange={(e) => setNewCommitment({...newCommitment, partnerType: e.target.value as any})}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="broker">Broker</option>
                          <option value="lender">Lender</option>
                          <option value="vendor">Vendor</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="commitment-period" className="block text-sm font-medium text-gray-700">
                          Commitment Period
                        </label>
                        <select
                          name="commitment-period"
                          id="commitment-period"
                          value={newCommitment.commitmentPeriod}
                          onChange={(e) => setNewCommitment({...newCommitment, commitmentPeriod: e.target.value as any})}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="min-deal-count" className="block text-sm font-medium text-gray-700">
                          Minimum Deal Count
                        </label>
                        <input
                          type="number"
                          name="min-deal-count"
                          id="min-deal-count"
                          min="1"
                          value={newCommitment.minDealCount}
                          onChange={(e) => setNewCommitment({...newCommitment, minDealCount: Number(e.target.value)})}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="min-deal-volume" className="block text-sm font-medium text-gray-700">
                          Minimum Deal Volume ($)
                        </label>
                        <input
                          type="number"
                          name="min-deal-volume"
                          id="min-deal-volume"
                          min="0"
                          step="1000"
                          value={newCommitment.minDealVolume}
                          onChange={(e) => setNewCommitment({...newCommitment, minDealVolume: Number(e.target.value)})}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="start-date"
                          id="start-date"
                          value={new Date(newCommitment.startDate).toISOString().split('T')[0]}
                          onChange={(e) => setNewCommitment({...newCommitment, startDate: new Date(e.target.value)})}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                          End Date (Optional)
                        </label>
                        <input
                          type="date"
                          name="end-date"
                          id="end-date"
                          value={newCommitment.endDate ? new Date(newCommitment.endDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => setNewCommitment({
                            ...newCommitment, 
                            endDate: e.target.value ? new Date(e.target.value) : undefined
                          })}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Notes (Optional)
                        </label>
                        <textarea
                          name="notes"
                          id="notes"
                          rows={3}
                          value={newCommitment.notes || ''}
                          onChange={(e) => setNewCommitment({...newCommitment, notes: e.target.value})}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddCommitment}
                  disabled={!newCommitment.partnerName || newCommitment.minDealCount <= 0}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    !newCommitment.partnerName || newCommitment.minDealCount <= 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'
                  }`}
                >
                  Create Commitment
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddCommitment(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelationshipCommitment; 