import React, { useState, useEffect } from 'react';
import { useDeal, Deal } from '../../contexts/DealContext';

const DealManagement: React.FC = () => {
  const {
    deals,
    selectedDeal,
    loading,
    error,
    fetchDeals,
    selectDeal,
    createDeal,
    addParticipant,
    addDocument,
    addTask,
    addNote
  } = useDeal();
  const [activeTab, setActiveTab] = useState<'overview' | 'participants' | 'documents' | 'tasks' | 'notes'>('overview');

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const handleCreateNewDeal = () => {
    alert('Create new deal form/modal would open here');
  };

  const handleSelectDeal = (deal: Deal) => {
    selectDeal(deal);
    setActiveTab('overview');
  };

  const renderTabContent = () => {
    if (!selectedDeal) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <h4 className="text-lg font-medium mb-3 text-light-text">Deal Overview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-light-bg-alt p-3 rounded-md border border-light-border">
                <div className="text-sm text-light-text-secondary">Deal Type</div>
                <div className="font-medium text-light-text">{selectedDeal.type.charAt(0).toUpperCase() + selectedDeal.type.slice(1)}</div>
              </div>
              <div className="bg-light-bg-alt p-3 rounded-md border border-light-border">
                <div className="text-sm text-light-text-secondary">Amount</div>
                <div className="font-medium text-light-text">${selectedDeal.amount.toLocaleString()}</div>
              </div>
              <div className="bg-light-bg-alt p-3 rounded-md border border-light-border">
                <div className="text-sm text-light-text-secondary">Borrower</div>
                <div className="font-medium text-light-text">{selectedDeal.borrower.name}</div>
              </div>
              <div className="bg-light-bg-alt p-3 rounded-md border border-light-border">
                <div className="text-sm text-light-text-secondary">Status</div>
                <div className="font-medium text-light-text">{selectedDeal.status.charAt(0).toUpperCase() + selectedDeal.status.slice(1)}</div>
              </div>
            </div>

            <h4 className="text-lg font-medium mb-3 text-light-text">Timeline</h4>
            <div className="border-l-2 border-light-border ml-3 pl-4 space-y-6">
              {selectedDeal.timeline.map((event, index) => (
                <div key={event.id || index} className="relative">
                  <div className="absolute -left-7 mt-1 w-3 h-3 rounded-full bg-primary-500"></div>
                  <div className="text-sm text-light-text-secondary">
                    {new Date(event.date).toLocaleDateString()} • {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                  <div className="font-medium text-light-text">{event.event}</div>
                  <div className="text-sm text-light-text-secondary">{event.user}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'participants':
         return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-light-text">Deal Participants</h4>
              <button className="text-primary-600 text-sm font-medium hover:text-primary-700">+ Invite Participant</button>
            </div>
            <div className="overflow-x-auto border border-light-border rounded-md">
              <table className="min-w-full divide-y divide-light-border">
                <thead className="bg-light-bg-alt">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-light-text-secondary uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-light-text-secondary uppercase tracking-wider">Role</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-light-text-secondary uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-light-text-secondary uppercase tracking-wider">Allocation</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-light-text-secondary uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-light-border">
                  {selectedDeal.participants.map(participant => (
                    <tr key={participant.id}>
                      <td className="px-4 py-3 whitespace-nowrap text-light-text">{participant.name}</td>
                      <td className="px-4 py-3 whitespace-nowrap capitalize text-light-text">{participant.role}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          participant.status === 'participating'
                            ? 'bg-green-100 text-green-800'
                            : participant.status === 'declined'
                            ? 'bg-red-100 text-risk-red'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-light-text">
                        {participant.allocation 
                          ? `$${participant.allocation.toLocaleString()}` 
                          : 'N/A'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <button className="text-primary-600 text-sm font-medium hover:text-primary-700">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'documents':
        return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-light-text">Documents</h4>
              <button className="text-primary-600 text-sm font-medium hover:text-primary-700">+ Upload Document</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedDeal.documents.map(doc => (
                <div key={doc.id} className="border border-light-border rounded-md p-3 flex bg-white">
                  <div className="mr-3 pt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-light-text">{doc.name}</div>
                    <div className="text-xs text-light-text-secondary mt-0.5">
                      Uploaded by {doc.uploadedBy} on {new Date(doc.uploadDate).toLocaleDateString()}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        doc.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : doc.status === 'rejected'
                          ? 'bg-red-100 text-risk-red'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                      </span>
                      <button className="text-primary-600 text-sm hover:text-primary-700">Download</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'tasks':
         return (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-medium text-light-text">Tasks</h4>
              <button className="text-primary-600 text-sm font-medium hover:text-primary-700">+ Add Task</button>
            </div>
            <div className="space-y-3">
              {selectedDeal.tasks.map(task => (
                <div key={task.id} className="border border-light-border rounded-md p-3 bg-white">
                  <div className="flex items-start">
                    <input 
                      type="checkbox" 
                      checked={task.status === 'completed'} 
                      className="mt-1 mr-3 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" 
                      readOnly
                    />
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${task.status === 'completed' ? 'line-through text-light-text-secondary' : 'text-light-text'}`}>
                        {task.description}
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-light-text-secondary">
                          Assigned to: {task.assignedTo}
                        </span>
                        <span className="text-xs text-light-text-secondary">
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'notes':
        return (
          <div>
            <div className="mb-4">
              <h4 className="text-lg font-medium mb-2 text-light-text">Add Note</h4>
              <textarea 
                className="w-full border border-light-border rounded-md p-2 text-sm text-light-text focus:ring-primary-500 focus:border-primary-500" 
                rows={3} 
                placeholder="Add a note about this deal..."
              ></textarea>
              <div className="flex justify-end mt-2">
                <button className="bg-primary-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-primary-700">
                  Add Note
                </button>
              </div>
            </div>
            
            <h4 className="text-lg font-medium mb-3 text-light-text">Existing Notes</h4>
            <div className="space-y-4">
              {selectedDeal.notes.map(note => (
                <div key={note.id} className="bg-light-bg-alt border border-light-border rounded-md p-3">
                  <div className="text-xs text-light-text-secondary mb-1">
                    {note.createdBy} • {new Date(note.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-light-text">{note.text}</div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div className="bg-light-bg rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-light-text">Deal Management</h2>
        <button
          onClick={handleCreateNewDeal}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm font-medium"
        >
          New Deal
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-risk-red text-risk-red p-4 rounded-md text-center">
          <p className="font-medium">Error Loading Deals</p>
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => fetchDeals()} 
            className="mt-3 bg-primary-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="bg-white rounded-lg border border-light-border p-4">
              <h3 className="text-lg font-medium mb-4 text-light-text">Active Deals</h3>
              <div className="space-y-2">
                {deals.map(deal => (
                  <div
                    key={deal.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors border ${
                      selectedDeal?.id === deal.id
                        ? 'bg-primary-50 border-primary-300'
                        : 'bg-white border-light-border hover:bg-light-bg-alt'
                    }`}
                    onClick={() => handleSelectDeal(deal)}
                  >
                    <div className="font-medium text-light-text">{deal.name}</div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-light-text-secondary">${deal.amount.toLocaleString()}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        deal.status === 'approved' || deal.status === 'funded' || deal.status === 'closed'
                          ? 'bg-green-100 text-green-800'
                          : deal.status === 'declined'
                          ? 'bg-red-100 text-risk-red'
                          : deal.status === 'underwriting'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {deal.status.charAt(0).toUpperCase() + deal.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-xs text-light-text-secondary mt-1">
                      {deal.type.charAt(0).toUpperCase() + deal.type.slice(1)} • {deal.borrower.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {selectedDeal ? (
            <div className="w-full md:w-2/3 lg:w-3/4">
              <div className="bg-white border border-light-border rounded-lg">
                <div className="p-4 border-b border-light-border">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-medium text-light-text">{selectedDeal.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedDeal.status === 'approved' || selectedDeal.status === 'funded' || selectedDeal.status === 'closed'
                          ? 'bg-green-100 text-green-800'
                          : selectedDeal.status === 'declined'
                          ? 'bg-red-100 text-risk-red'
                          : selectedDeal.status === 'underwriting'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                     }`}>
                      {selectedDeal.status.charAt(0).toUpperCase() + selectedDeal.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-2 text-light-text-secondary">
                    ${selectedDeal.amount.toLocaleString()} • {selectedDeal.borrower.name}
                  </div>
                </div>

                <div className="border-b border-light-border">
                  <nav className="flex">
                    {['overview', 'participants', 'documents', 'tasks', 'notes'].map((tab) => (
                      <button
                        key={tab}
                        className={`px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                          activeTab === tab
                            ? 'border-b-2 border-primary-500 text-primary-600'
                            : 'text-light-text-secondary hover:text-light-text border-b-2 border-transparent'
                        }`}
                        onClick={() => setActiveTab(tab as any)}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="p-4">
                  {renderTabContent()}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full md:w-2/3 lg:w-3/4 bg-light-bg-alt border border-light-border rounded-lg p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-medium mb-2 text-light-text">No Deal Selected</h3>
              <p className="text-light-text-secondary mb-4">Select a deal from the list or create a new one</p>
              <button 
                onClick={handleCreateNewDeal}
                className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 text-sm font-medium"
              >
                Create New Deal
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DealManagement; 