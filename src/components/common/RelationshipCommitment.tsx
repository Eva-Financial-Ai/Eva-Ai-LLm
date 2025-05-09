import React, { useState, useEffect } from 'react';

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
  userId?: string; // Add userId to associate commitments with users
}

// Define User interface
interface User {
  id: string;
  name: string;
  type: 'broker' | 'lender' | 'vendor';
  email?: string;
}

interface RelationshipCommitmentProps {
  userRole: string;
  initialCommitments?: CommitmentData[];
}

// Mock users for the demo
const mockUsers: User[] = [
  { id: 'user-1', name: 'John Smith', type: 'broker', email: 'john@example.com' },
  { id: 'user-2', name: 'Sara Johnson', type: 'lender', email: 'sara@example.com' },
  { id: 'user-3', name: 'Michael Chen', type: 'vendor', email: 'michael@example.com' },
  { id: 'user-4', name: 'All Users', type: 'broker' },
];

const RelationshipCommitment: React.FC<RelationshipCommitmentProps> = ({
  userRole,
  initialCommitments = [],
}) => {
  const [commitments, setCommitments] = useState<CommitmentData[]>(initialCommitments);
  const [filteredCommitments, setFilteredCommitments] =
    useState<CommitmentData[]>(initialCommitments);
  const [showAddCommitment, setShowAddCommitment] = useState(false);
  const [editingCommitmentId, setEditingCommitmentId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(
    mockUsers.find(u => u.id === 'user-4') || null
  );
  const [searchTerm, setSearchTerm] = useState('');

  // New commitment form state
  const [newCommitment, setNewCommitment] = useState<
    Omit<CommitmentData, 'id' | 'currentProgress'>
  >({
    partnerName: '',
    partnerType: 'broker',
    commitmentPeriod: 'monthly',
    minDealCount: 0,
    minDealVolume: 0,
    startDate: new Date(),
  });

  // Filter commitments based on selected user
  useEffect(() => {
    if (!selectedUser || selectedUser.id === 'user-4') {
      // "All Users" is selected or no user selected
      setFilteredCommitments(commitments);
    } else {
      // Filter by selected user
      setFilteredCommitments(
        commitments.filter(
          commitment =>
            commitment.userId === selectedUser.id ||
            commitment.partnerName.toLowerCase().includes(selectedUser.name.toLowerCase())
        )
      );
    }
  }, [selectedUser, commitments]);

  // Filter users based on search term
  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      userId: selectedUser?.id !== 'user-4' ? selectedUser?.id : undefined,
      currentProgress: {
        dealCount: 0,
        dealVolume: 0,
        lastUpdated: new Date(),
      },
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
    setCommitments(
      commitments.map(commitment =>
        commitment.id === commitmentId
          ? {
              ...commitment,
              currentProgress: {
                dealCount: newCount,
                dealVolume: newVolume,
                lastUpdated: new Date(),
              },
            }
          : commitment
      )
    );
  };

  // Handle selecting a user
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
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

        {/* User Management Section */}
        <div className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h3 className="text-md font-medium text-gray-800 mb-3">User Management</h3>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-3 md:space-y-0">
            <div className="flex-1">
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex-shrink-0">
              <label className="block text-sm font-medium text-gray-700 mb-1">Selected User</label>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    selectedUser?.type === 'broker'
                      ? 'bg-blue-100 text-blue-800'
                      : selectedUser?.type === 'lender'
                        ? 'bg-green-100 text-green-800'
                        : selectedUser?.type === 'vendor'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {selectedUser?.name || 'All Users'}
                </span>
                <button
                  onClick={() => setSelectedUser(mockUsers.find(u => u.id === 'user-4') || null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* User list */}
          {searchTerm && (
            <div className="mt-3 max-h-40 overflow-y-auto border border-gray-200 rounded-md bg-white">
              <ul className="divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <li key={user.id}>
                    <button
                      onClick={() => handleUserSelect(user)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 flex justify-between items-center"
                    >
                      <div>
                        <span className="font-medium">{user.name}</span>
                        {user.email && <p className="text-xs text-gray-500">{user.email}</p>}
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          user.type === 'broker'
                            ? 'bg-blue-100 text-blue-800'
                            : user.type === 'lender'
                              ? 'bg-green-100 text-green-800'
                              : user.type === 'vendor'
                                ? 'bg-purple-100 text-purple-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.type}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-amber-50 p-3 rounded-md mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                Track minimum deal flow commitments with your business relationships. Regular
                check-ins help maintain strong partnerships.
              </p>
            </div>
          </div>
        </div>

        {filteredCommitments.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="mx-auto h-12 w-12 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {selectedUser && selectedUser.id !== 'user-4'
                ? `No commitments found for ${selectedUser.name}`
                : 'No commitments set up'}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Add your first relationship commitment to track deal flow targets.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddCommitment(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add New Commitment
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCommitments.map(commitment => {
              const progress = calculateProgress(commitment);
              const statusColor = getStatusColor(progress);

              return (
                <div
                  key={commitment.id}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                >
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          {commitment.partnerName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {commitment.partnerType.charAt(0).toUpperCase() +
                            commitment.partnerType.slice(1)}{' '}
                          •
                          {commitment.commitmentPeriod === 'monthly'
                            ? ' Monthly'
                            : commitment.commitmentPeriod === 'quarterly'
                              ? ' Quarterly'
                              : ' Yearly'}{' '}
                          Commitment
                        </p>
                      </div>
                      <div className={`text-base font-semibold ${statusColor}`}>
                        {Math.round(progress)}% Complete
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs text-gray-500">Minimum Deal Count</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium">
                            {commitment.currentProgress.dealCount} of {commitment.minDealCount}{' '}
                            deals
                          </p>
                          <span className={`text-xs font-medium ${statusColor}`}>
                            {Math.round(
                              (commitment.currentProgress.dealCount / commitment.minDealCount) * 100
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`${
                              progress >= 100
                                ? 'bg-green-500'
                                : progress >= 70
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                            } h-2 rounded-full`}
                            style={{
                              width: `${Math.min((commitment.currentProgress.dealCount / commitment.minDealCount) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">Minimum Deal Volume</p>
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium">
                            ${(commitment.currentProgress.dealVolume / 1000).toFixed(1)}k of $
                            {(commitment.minDealVolume / 1000).toFixed(1)}k
                          </p>
                          <span className={`text-xs font-medium ${statusColor}`}>
                            {Math.round(
                              (commitment.currentProgress.dealVolume / commitment.minDealVolume) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div
                            className={`${
                              progress >= 100
                                ? 'bg-green-500'
                                : progress >= 70
                                  ? 'bg-yellow-500'
                                  : 'bg-red-500'
                            } h-2 rounded-full`}
                            style={{
                              width: `${Math.min((commitment.currentProgress.dealVolume / commitment.minDealVolume) * 100, 100)}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
                      <div>
                        Period: {new Date(commitment.startDate).toLocaleDateString()} -
                        {commitment.endDate
                          ? new Date(commitment.endDate).toLocaleDateString()
                          : 'Ongoing'}
                      </div>
                      <div>
                        Last Updated:{' '}
                        {new Date(commitment.currentProgress.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>

                    {commitment.notes && (
                      <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                        <p className="text-xs font-medium text-gray-700">Notes</p>
                        <p className="mt-1 text-sm text-gray-600">{commitment.notes}</p>
                      </div>
                    )}

                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          const newCount = Number(
                            prompt(
                              'Enter new deal count:',
                              commitment.currentProgress.dealCount.toString()
                            )
                          );
                          const newVolume = Number(
                            prompt(
                              'Enter new deal volume ($):',
                              commitment.currentProgress.dealVolume.toString()
                            )
                          );
                          if (!isNaN(newCount) && !isNaN(newVolume)) {
                            handleUpdateProgress(commitment.id, newCount, newVolume);
                          }
                        }}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
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

      {showAddCommitment && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-blue-600"
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
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      New Relationship Commitment
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label
                          htmlFor="partner-name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Partner Name
                        </label>
                        <input
                          type="text"
                          name="partner-name"
                          id="partner-name"
                          value={newCommitment.partnerName}
                          onChange={e =>
                            setNewCommitment({ ...newCommitment, partnerName: e.target.value })
                          }
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="partner-type"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Partner Type
                        </label>
                        <select
                          name="partner-type"
                          id="partner-type"
                          value={newCommitment.partnerType}
                          onChange={e =>
                            setNewCommitment({
                              ...newCommitment,
                              partnerType: e.target.value as any,
                            })
                          }
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="broker">Broker</option>
                          <option value="lender">Lender</option>
                          <option value="vendor">Vendor</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="commitment-period"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Commitment Period
                        </label>
                        <select
                          name="commitment-period"
                          id="commitment-period"
                          value={newCommitment.commitmentPeriod}
                          onChange={e =>
                            setNewCommitment({
                              ...newCommitment,
                              commitmentPeriod: e.target.value as any,
                            })
                          }
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="min-deal-count"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Minimum Deal Count
                        </label>
                        <input
                          type="number"
                          name="min-deal-count"
                          id="min-deal-count"
                          min="1"
                          value={newCommitment.minDealCount}
                          onChange={e =>
                            setNewCommitment({
                              ...newCommitment,
                              minDealCount: Number(e.target.value),
                            })
                          }
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="min-deal-volume"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Minimum Deal Volume ($)
                        </label>
                        <input
                          type="number"
                          name="min-deal-volume"
                          id="min-deal-volume"
                          min="1000"
                          step="1000"
                          value={newCommitment.minDealVolume}
                          onChange={e =>
                            setNewCommitment({
                              ...newCommitment,
                              minDealVolume: Number(e.target.value),
                            })
                          }
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="start-date"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Start Date
                        </label>
                        <input
                          type="date"
                          name="start-date"
                          id="start-date"
                          value={new Date(newCommitment.startDate).toISOString().split('T')[0]}
                          onChange={e =>
                            setNewCommitment({
                              ...newCommitment,
                              startDate: new Date(e.target.value),
                            })
                          }
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="end-date"
                          className="block text-sm font-medium text-gray-700"
                        >
                          End Date (Optional)
                        </label>
                        <input
                          type="date"
                          name="end-date"
                          id="end-date"
                          value={
                            newCommitment.endDate
                              ? new Date(newCommitment.endDate).toISOString().split('T')[0]
                              : ''
                          }
                          onChange={e =>
                            setNewCommitment({
                              ...newCommitment,
                              endDate: e.target.value ? new Date(e.target.value) : undefined,
                            })
                          }
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
                          onChange={e =>
                            setNewCommitment({ ...newCommitment, notes: e.target.value })
                          }
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
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Add Commitment
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
