import React, { useState, useEffect, useRef } from 'react';
import { useWorkflow } from '../contexts/WorkflowContext';

// Define the deal lifecycle stages
enum DealStage {
  INQUIRY = 'Inquiry',
  DOCUMENT_COLLECTION = 'Document Collection',
  CREDIT_ASSESSMENT = 'Credit Assessment',
  DEAL_STRUCTURING = 'Deal Structuring',
  UNDERWRITING = 'Underwriting',
  APPROVAL = 'Approval',
  CLOSING = 'Closing',
}

// Define user roles
enum UserRole {
  LENDER = 'Lender',
  BROKER = 'Broker',
  BORROWER = 'Borrower',
}

// Define information request types
interface InfoRequest {
  id: string;
  type: string;
  description: string;
  status: 'pending' | 'received' | 'overdue';
  dueDate: Date;
  createdAt: Date;
  followupCount: number;
  lastFollowupDate?: Date;
}

interface AILifecycleAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId?: string;
}

const AILifecycleAssistant: React.FC<AILifecycleAssistantProps> = ({
  isOpen,
  onClose,
  transactionId,
}) => {
  const { currentTransaction } = useWorkflow();
  const [currentStage, setCurrentStage] = useState<DealStage>(DealStage.INQUIRY);
  const [infoRequests, setInfoRequests] = useState<InfoRequest[]>([]);
  const [showProgressBar, setShowProgressBar] = useState<boolean>(true);
  const [progressPercentage, setProgressPercentage] = useState<number>(15);
  const [activeFollowup, setActiveFollowup] = useState<InfoRequest | null>(null);
  const [minimized, setMinimized] = useState<boolean>(false);
  const [expandedInfo, setExpandedInfo] = useState<boolean>(false);
  const [actionTaken, setActionTaken] = useState<boolean>(false);
  const [followupMode, setFollowupMode] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.LENDER);

  const panelRef = useRef<HTMLDivElement>(null);
  const followupTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize with sample data
  useEffect(() => {
    // Create sample information requests based on the current stage
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const sampleRequests: InfoRequest[] = [
      {
        id: '1',
        type: 'Financial Statement',
        description:
          'Last 2 years of business financial statements including P&L and balance sheet',
        status: 'pending',
        dueDate: tomorrow,
        createdAt: today,
        followupCount: 2,
        lastFollowupDate: today,
      },
      {
        id: '2',
        type: 'Bank Statements',
        description: 'Last 3 months of business banking statements',
        status: 'pending',
        dueDate: tomorrow,
        createdAt: today,
        followupCount: 1,
      },
      {
        id: '3',
        type: 'Tax Returns',
        description: 'Last 2 years of business tax returns (including all schedules)',
        status: 'overdue',
        dueDate: new Date(today.setDate(today.getDate() - 2)),
        createdAt: new Date(today.setDate(today.getDate() - 5)),
        followupCount: 3,
        lastFollowupDate: new Date(today.setDate(today.getDate() - 1)),
      },
    ];

    setInfoRequests(sampleRequests);

    // Set current stage based on mock progress
    determineCurrentStage();

    // Schedule persistent followups
    scheduleFollowups();

    return () => {
      if (followupTimerRef.current) {
        clearTimeout(followupTimerRef.current);
      }
    };
  }, []);

  // Role-specific suggestions
  const getRoleSuggestions = (role: UserRole) => {
    switch (role) {
      case UserRole.LENDER:
        return [
          "Verify borrower's credit history and financial stability",
          'Review collateral documentation and valuation reports',
          'Ensure compliance with lending regulations and internal policies',
        ];
      case UserRole.BROKER:
        return [
          'Coordinate document collection between borrower and lender',
          'Help borrower prepare financial statements in required format',
          'Facilitate communication to keep all parties aligned on timeline',
        ];
      case UserRole.BORROWER:
        return [
          'Prepare and submit all requested financial documentation',
          'Respond promptly to queries about business operations',
          'Review proposed loan terms and prepare questions for clarification',
        ];
      default:
        return [];
    }
  };

  // Role-specific next steps
  const getRoleNextSteps = (role: UserRole) => {
    if (infoRequests.some(r => r.status !== 'received')) {
      switch (role) {
        case UserRole.LENDER:
          return 'Send follow-up reminders for outstanding documentation';
        case UserRole.BROKER:
          return 'Assist borrower with collecting and submitting required documents';
        case UserRole.BORROWER:
          return 'Submit all requested documentation as soon as possible';
        default:
          return 'Collect all outstanding information requests';
      }
    } else {
      switch (role) {
        case UserRole.LENDER:
          return 'Begin underwriting process with complete documentation';
        case UserRole.BROKER:
          return 'Prepare borrower for next steps in the approval process';
        case UserRole.BORROWER:
          return 'Review proposed terms and prepare for credit assessment';
        default:
          return 'Proceed to credit assessment';
      }
    }
  };

  // Determine the current stage based on transaction info
  const determineCurrentStage = () => {
    // In a real implementation, this would use actual transaction data
    // For demo purposes, we'll simulate a deal in document collection
    setCurrentStage(DealStage.DOCUMENT_COLLECTION);

    // Set progress percentage based on stage and completed documents
    const completedDocs = infoRequests.filter(req => req.status === 'received').length;
    const totalDocs = infoRequests.length;
    const docsProgress = totalDocs > 0 ? (completedDocs / totalDocs) * 100 : 0;

    // Calculate overall progress (each stage is worth ~16.6% of total progress)
    // Document collection is the second stage, so base progress is ~16.6%
    const stageProgress = Object.values(DealStage).indexOf(currentStage) * 16.6;
    const totalProgress = stageProgress + (docsProgress * 16.6) / 100;

    setProgressPercentage(Math.min(Math.round(totalProgress), 100));
  };

  // Schedule persistent followups for missing information
  const scheduleFollowups = () => {
    // Clear any existing timer
    if (followupTimerRef.current) {
      clearTimeout(followupTimerRef.current);
    }

    // Get pending or overdue requests
    const pendingRequests = infoRequests.filter(
      req => req.status === 'pending' || req.status === 'overdue'
    );

    if (pendingRequests.length > 0) {
      // Sort by priority (overdue first, then by follow-up count)
      pendingRequests.sort((a, b) => {
        if (a.status === 'overdue' && b.status !== 'overdue') return -1;
        if (a.status !== 'overdue' && b.status === 'overdue') return 1;
        return b.followupCount - a.followupCount;
      });

      const nextRequest = pendingRequests[0];

      // Set a timer for followup (in a real app, this would be much longer than 30 seconds)
      followupTimerRef.current = setTimeout(() => {
        setActiveFollowup(nextRequest);
        setFollowupMode(true);

        // Play notification sound if supported
        try {
          const audio = new Audio('/notification.mp3');
          audio.play();
        } catch (e) {
          console.log('Notification sound not supported');
        }

        // If minimized, maximize
        if (minimized) {
          setMinimized(false);
        }
      }, 30000); // 30 seconds for demo purposes
    }
  };

  // Handle followup action
  const handleFollowup = (requestId: string, action: 'email' | 'sms' | 'call') => {
    // Update the request with a new followup count
    const updatedRequests = infoRequests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          followupCount: req.followupCount + 1,
          lastFollowupDate: new Date(),
        };
      }
      return req;
    });

    setInfoRequests(updatedRequests);
    setActiveFollowup(null);
    setActionTaken(true);
    setFollowupMode(false);

    // Show success message briefly
    setTimeout(() => {
      setActionTaken(false);
    }, 3000);

    // Reschedule followups
    scheduleFollowups();
  };

  // Handle document received
  const handleDocumentReceived = (requestId: string) => {
    const updatedRequests = infoRequests.map(req => {
      if (req.id === requestId) {
        return {
          ...req,
          status: 'received' as const,
        };
      }
      return req;
    });

    setInfoRequests(updatedRequests);

    // Recalculate progress
    const completedDocs = updatedRequests.filter(req => req.status === 'received').length;
    const totalDocs = updatedRequests.length;
    const docsProgress = totalDocs > 0 ? (completedDocs / totalDocs) * 100 : 0;

    // If all documents received, move to next stage
    if (completedDocs === totalDocs) {
      const nextStageIndex = Object.values(DealStage).indexOf(currentStage) + 1;
      if (nextStageIndex < Object.values(DealStage).length) {
        setCurrentStage(Object.values(DealStage)[nextStageIndex]);
      }
    }

    // Recalculate progress percentage
    const stageProgress = Object.values(DealStage).indexOf(currentStage) * 16.6;
    const totalProgress = stageProgress + (docsProgress * 16.6) / 100;
    setProgressPercentage(Math.min(Math.round(totalProgress), 100));
  };

  // Toggle minimized state
  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  // Expand or collapse detailed information
  const toggleExpandInfo = () => {
    setExpandedInfo(!expandedInfo);
  };

  // Handle role change
  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRole(e.target.value as UserRole);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={panelRef}
      className={`fixed z-30 right-6 transition-all duration-300 shadow-xl rounded-lg overflow-hidden ${
        minimized ? 'bottom-24 w-96 h-14 bg-primary-600' : 'bottom-24 w-120 bg-white'
      }`}
      style={{
        height: minimized ? '3.5rem' : expandedInfo ? '54rem' : '42rem',
        width: minimized ? '24rem' : '32rem', // Increased width by 150%
      }}
    >
      {/* Header */}
      <div
        className={`${minimized ? 'h-full bg-primary-600' : 'bg-primary-600'} text-white py-3 px-4 flex justify-between items-center`}
      >
        <div className="flex items-center space-x-2">
          {followupMode ? (
            <div className="animate-pulse bg-red-500 p-1 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
          ) : (
            <div className="bg-primary-500 p-1 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
          )}

          <div>
            <span className="font-medium text-sm">
              {followupMode ? 'Action Required' : 'Deal Lifecycle Assistant'}
            </span>
            {!minimized && !followupMode && (
              <p className="text-xs text-primary-100">Transaction #{transactionId || 'TX-102'}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-1">
          {!minimized && (
            <div className="mr-4">
              <select
                value={selectedRole}
                onChange={handleRoleChange}
                className="bg-primary-700 text-white text-sm rounded-md border-primary-500 focus:ring-primary-300 focus:border-primary-300 py-1 px-2"
              >
                <option value={UserRole.LENDER}>{UserRole.LENDER}</option>
                <option value={UserRole.BROKER}>{UserRole.BROKER}</option>
                <option value={UserRole.BORROWER}>{UserRole.BORROWER}</option>
              </select>
            </div>
          )}

          <button
            onClick={toggleMinimize}
            className="p-1 hover:bg-primary-500 rounded-md transition-colors"
            aria-label={minimized ? 'Expand' : 'Minimize'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={minimized ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
              />
            </svg>
          </button>

          {!minimized && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-primary-500 rounded-md transition-colors"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content (only shown when not minimized) */}
      {!minimized && (
        <div className="overflow-y-auto h-full">
          {/* Role indicator */}
          <div className="bg-gray-100 px-4 py-2 border-b">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600">Viewing as:</span>
              <span className="ml-2 text-sm font-semibold text-primary-700">{selectedRole}</span>
            </div>
          </div>

          {/* Success notification for action taken */}
          {actionTaken && (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 mt-2 mx-3 rounded shadow-sm">
              <div className="flex">
                <svg
                  className="h-5 w-5 text-green-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Follow-up request sent successfully!</span>
              </div>
            </div>
          )}

          {/* Follow-up mode */}
          {followupMode && activeFollowup && (
            <div className="p-4">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded-md">
                <h3 className="text-red-800 font-medium mb-1">Action Required</h3>
                <p className="text-sm text-gray-800 mb-3">
                  Information request for <strong>{activeFollowup.type}</strong> is
                  {activeFollowup.status === 'overdue' ? ' overdue' : ' pending'} and requires
                  follow-up to close this deal.
                </p>
                <div className="text-xs text-gray-600 mb-3">
                  <div>Due date: {activeFollowup.dueDate.toLocaleDateString()}</div>
                  <div>Previous follow-ups: {activeFollowup.followupCount}</div>
                </div>
              </div>

              <h4 className="font-medium mb-2">Select follow-up method:</h4>

              <div className="space-y-2 mb-4">
                <button
                  onClick={() => handleFollowup(activeFollowup.id, 'email')}
                  className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-md hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-blue-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium">Email Follow-up</span>
                  </div>
                  <span className="text-sm text-gray-500">Recommended</span>
                </button>

                <button
                  onClick={() => handleFollowup(activeFollowup.id, 'sms')}
                  className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-md hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                    <span className="font-medium">SMS Reminder</span>
                  </div>
                  <span className="text-sm text-gray-500">Immediate</span>
                </button>

                <button
                  onClick={() => handleFollowup(activeFollowup.id, 'call')}
                  className="flex items-center justify-between w-full p-3 border border-gray-300 rounded-md hover:bg-purple-50 hover:border-purple-300 transition-colors"
                >
                  <div className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-purple-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498.913a1 1 0 01.684.949l.072 1.385a1 1 0 01-.685.949l-1.388.486a1 1 0 00-.65.736L8 14h3l2-2 1 1 1-1v4"
                      />
                    </svg>
                    <span className="font-medium">Schedule Call</span>
                  </div>
                  <span className="text-sm text-gray-500">High Touch</span>
                </button>

                <button
                  onClick={() => {
                    setFollowupMode(false);
                    scheduleFollowups();
                  }}
                  className="w-full p-2 text-sm text-gray-600 hover:text-gray-800 mt-2"
                >
                  Remind me later
                </button>
              </div>
            </div>
          )}

          {/* Standard view (when not in followup mode) */}
          {!followupMode && (
            <div className="p-4">
              {/* Progress bar */}
              {showProgressBar && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-sm font-medium">Deal Progress</h3>
                    <span className="text-xs text-gray-500">{progressPercentage}% Complete</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary-600 h-2.5 rounded-full"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Current stage: {currentStage}</p>
                </div>
              )}

              {/* Role-specific suggestions */}
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="text-sm font-medium text-blue-700 mb-2">
                  {selectedRole} Suggestions
                </h3>
                <ul className="space-y-1">
                  {getRoleSuggestions(selectedRole).map((suggestion, index) => (
                    <li key={index} className="text-sm text-blue-800 flex items-start">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-600 mr-1 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Outstanding information requests */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-medium">Outstanding Requests</h3>
                  <button
                    onClick={toggleExpandInfo}
                    className="text-xs text-primary-600 hover:text-primary-800"
                  >
                    {expandedInfo ? 'Show less' : 'Show more'}
                  </button>
                </div>

                <div className="space-y-2">
                  {infoRequests
                    .filter(req => req.status !== 'received')
                    .map(request => (
                      <div
                        key={request.id}
                        className={`p-3 rounded-md border ${
                          request.status === 'overdue'
                            ? 'border-red-300 bg-red-50'
                            : 'border-yellow-300 bg-yellow-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-sm">{request.type}</h4>
                            <p className="text-xs text-gray-600">{request.description}</p>
                            <div className="mt-1 flex items-center text-xs">
                              <span
                                className={`font-medium ${
                                  request.status === 'overdue' ? 'text-red-700' : 'text-yellow-700'
                                }`}
                              >
                                {request.status === 'overdue' ? 'Overdue' : 'Due'}:
                              </span>
                              <span className="ml-1 text-gray-600">
                                {request.dueDate.toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleFollowup(request.id, 'email')}
                              className="p-1.5 bg-primary-100 text-primary-700 rounded-full hover:bg-primary-200"
                              title="Send follow-up"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                              </svg>
                            </button>

                            <button
                              onClick={() => handleDocumentReceived(request.id)}
                              className="p-1.5 bg-green-100 text-green-700 rounded-full hover:bg-green-200"
                              title="Mark as received"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {expandedInfo && (
                          <div className="mt-2 text-xs text-gray-600 border-t border-gray-200 pt-2">
                            <div>Created: {request.createdAt.toLocaleDateString()}</div>
                            <div>Follow-ups sent: {request.followupCount}</div>
                            {request.lastFollowupDate && (
                              <div>
                                Last follow-up: {request.lastFollowupDate.toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Completed information */}
              {expandedInfo && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Completed Requests</h3>

                  <div className="space-y-2">
                    {infoRequests
                      .filter(req => req.status === 'received')
                      .map(request => (
                        <div
                          key={request.id}
                          className="p-3 rounded-md border border-green-300 bg-green-50"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium text-sm">{request.type}</h4>
                              <p className="text-xs text-gray-600">{request.description}</p>
                              <div className="mt-1 text-xs text-green-700 font-medium">
                                Received
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                    {infoRequests.filter(req => req.status === 'received').length === 0 && (
                      <p className="text-sm text-gray-500 italic">No completed requests yet</p>
                    )}
                  </div>
                </div>
              )}

              {/* Next steps */}
              <div className="mb-2">
                <h3 className="text-sm font-medium mb-2">Next Steps to Close Deal</h3>

                <ol className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="bg-primary-100 text-primary-800 w-5 h-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                      1
                    </span>
                    <span>{getRoleNextSteps(selectedRole)}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-gray-100 text-gray-800 w-5 h-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                      2
                    </span>
                    <span>Complete deal structuring and confirm terms with client</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-gray-100 text-gray-800 w-5 h-5 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                      3
                    </span>
                    <span>Submit for final approval and prepare closing documents</span>
                  </li>
                </ol>
              </div>

              {/* Deal acceleration tips (only when expanded) */}
              {expandedInfo && (
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <h3 className="text-sm font-medium mb-2">Deal Acceleration Tips</h3>

                  <ul className="space-y-2 text-xs text-gray-700">
                    <li className="flex">
                      <svg
                        className="h-4 w-4 text-primary-600 mr-1 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>
                        Send personalized follow-ups highlighting specific benefits of closing
                        quickly
                      </span>
                    </li>
                    <li className="flex">
                      <svg
                        className="h-4 w-4 text-primary-600 mr-1 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>
                        Offer document collection assistance to streamline information gathering
                      </span>
                    </li>
                    <li className="flex">
                      <svg
                        className="h-4 w-4 text-primary-600 mr-1 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span>
                        Use automatic reminders for all overdue documents to keep deal moving
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AILifecycleAssistant;
