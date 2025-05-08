import React, { createContext, useState, useContext, useEffect } from 'react';

// Define types for participants
export type ParticipantRole = 'lender' | 'broker' | 'vendor' | 'lessor' | 'bank' | 'borrower';
export type ParticipantStatus = 'invited' | 'participating' | 'declined';

export interface Participant {
  id: string;
  name: string;
  role: ParticipantRole;
  allocation?: number;
  status: ParticipantStatus;
  contactEmail?: string;
  contactPhone?: string;
  company?: string;
}

// Define types for documents
export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface Document {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  uploadDate: string;
  status: DocumentStatus;
  url?: string;
  comments?: string[];
}

// Define types for tasks
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'blocked';

export interface Task {
  id: string;
  description: string;
  assignedTo: string;
  createdBy: string;
  createdAt: string;
  dueDate: string;
  status: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  comments?: string[];
}

// Define types for notes
export interface Note {
  id: string;
  text: string;
  createdBy: string;
  createdAt: string;
  isPrivate?: boolean;
}

// Timeline event
export interface TimelineEvent {
  id: string;
  date: string;
  event: string;
  user: string;
  details?: string;
  relatedEntityId?: string;
  relatedEntityType?: 'document' | 'task' | 'participant' | 'note';
}

// Deal type
export type DealType = 'syndication' | 'origination' | 'participation' | 'refinance' | 'acquisition';

// Deal status
export type DealStatus = 
  'prospect' | 
  'submitted' | 
  'underwriting' | 
  'approved' | 
  'commitment_issued' |
  'closing' |
  'funded' | 
  'closed' | 
  'declined';

// Deal interface
export interface Deal {
  id: string;
  name: string;
  type: DealType;
  status: DealStatus;
  amount: number;
  term?: number; // in months
  rate?: number; // interest rate
  createdAt: string;
  createdBy: string;
  closingDate?: string;
  borrower: {
    id: string;
    name: string;
    type: string;
    contactInfo?: {
      name: string;
      email: string;
      phone: string;
    };
  };
  property?: {
    address: string;
    city: string;
    state: string;
    zip: string;
    type: string;
    units?: number;
    squareFeet?: number;
  };
  participants: Participant[];
  timeline: TimelineEvent[];
  documents: Document[];
  tasks: Task[];
  notes: Note[];
  tags?: string[];
}

// Context interface
interface DealContextType {
  deals: Deal[];
  selectedDeal: Deal | null;
  loading: boolean;
  error: string | null;
  fetchDeals: () => Promise<void>;
  getDeal: (id: string) => Deal | null;
  createDeal: (dealData: Partial<Deal>) => Promise<Deal>;
  updateDeal: (id: string, dealData: Partial<Deal>) => Promise<Deal>;
  deleteDeal: (id: string) => Promise<boolean>;
  selectDeal: (deal: Deal | null) => void;
  
  // Participant methods
  addParticipant: (dealId: string, participant: Omit<Participant, 'id'>) => Promise<Participant>;
  updateParticipant: (dealId: string, participantId: string, data: Partial<Participant>) => Promise<Participant>;
  removeParticipant: (dealId: string, participantId: string) => Promise<boolean>;
  
  // Document methods
  addDocument: (dealId: string, document: Omit<Document, 'id'>) => Promise<Document>;
  updateDocument: (dealId: string, documentId: string, data: Partial<Document>) => Promise<Document>;
  removeDocument: (dealId: string, documentId: string) => Promise<boolean>;
  
  // Task methods
  addTask: (dealId: string, task: Omit<Task, 'id'>) => Promise<Task>;
  updateTask: (dealId: string, taskId: string, data: Partial<Task>) => Promise<Task>;
  completeTask: (dealId: string, taskId: string) => Promise<Task>;
  removeTask: (dealId: string, taskId: string) => Promise<boolean>;
  
  // Note methods
  addNote: (dealId: string, note: Omit<Note, 'id'>) => Promise<Note>;
  updateNote: (dealId: string, noteId: string, text: string) => Promise<Note>;
  removeNote: (dealId: string, noteId: string) => Promise<boolean>;
  
  // Timeline methods
  addTimelineEvent: (dealId: string, event: Omit<TimelineEvent, 'id'>) => Promise<TimelineEvent>;
}

// Create context
const DealContext = createContext<DealContextType | undefined>(undefined);

// Provider component
export const DealProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Load deals on first mount
  useEffect(() => {
    fetchDeals();
  }, []);

  // Helper to generate IDs
  const generateId = () => `id-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  // Fetch all deals
  const fetchDeals = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data
      const mockDeals: Deal[] = [
        {
          id: 'deal-1',
          name: 'Office Complex Refinancing',
          type: 'syndication',
          status: 'underwriting',
          amount: 5500000,
          term: 60,
          rate: 5.75,
          createdAt: '2023-04-15T14:30:00Z',
          createdBy: 'John Broker',
          borrower: {
            id: 'borrower-1',
            name: 'Acme Commercial Properties',
            type: 'LLC',
            contactInfo: {
              name: 'James Smith',
              email: 'james@acmeproperties.com',
              phone: '(555) 123-4567'
            }
          },
          property: {
            address: '123 Business Park Ave',
            city: 'Chicago',
            state: 'IL',
            zip: '60601',
            type: 'Office',
            units: 3,
            squareFeet: 45000
          },
          participants: [
            {
              id: 'participant-1',
              name: 'First National Bank',
              role: 'lender',
              allocation: 3000000,
              status: 'participating',
              contactEmail: 'loans@fnb.com',
              company: 'First National Bank'
            },
            {
              id: 'participant-2',
              name: 'Regional Credit Union',
              role: 'lender',
              allocation: 2000000,
              status: 'participating',
              contactEmail: 'commercial@rcu.com',
              company: 'Regional Credit Union'
            },
            {
              id: 'participant-3',
              name: 'ABC Brokerage',
              role: 'broker',
              status: 'participating',
              contactEmail: 'deals@abcbrokerage.com',
              company: 'ABC Brokerage'
            }
          ],
          timeline: [
            {
              id: 'timeline-1',
              date: '2023-04-15T14:30:00Z',
              event: 'Deal created',
              user: 'John Broker'
            },
            {
              id: 'timeline-2',
              date: '2023-04-18T10:15:00Z',
              event: 'Initial submission complete',
              user: 'John Broker'
            },
            {
              id: 'timeline-3',
              date: '2023-04-22T16:45:00Z',
              event: 'Underwriting started',
              user: 'Sarah Underwriter'
            }
          ],
          documents: [
            {
              id: 'doc-1',
              name: 'Property Appraisal',
              type: 'pdf',
              uploadedBy: 'John Broker',
              uploadDate: '2023-04-16T09:20:00Z',
              status: 'approved'
            },
            {
              id: 'doc-2',
              name: 'Financial Statements',
              type: 'xlsx',
              uploadedBy: 'Acme Commercial Properties',
              uploadDate: '2023-04-17T11:30:00Z',
              status: 'approved'
            },
            {
              id: 'doc-3',
              name: 'Environmental Report',
              type: 'pdf',
              uploadedBy: 'John Broker',
              uploadDate: '2023-04-19T14:10:00Z',
              status: 'pending'
            }
          ],
          tasks: [
            {
              id: 'task-1',
              description: 'Complete property inspection',
              assignedTo: 'Sarah Underwriter',
              createdBy: 'John Broker',
              createdAt: '2023-04-15T15:00:00Z',
              dueDate: '2023-04-25T00:00:00Z',
              status: 'pending',
              priority: 'high'
            },
            {
              id: 'task-2',
              description: 'Review financial statements',
              assignedTo: 'Mike Analyst',
              createdBy: 'Sarah Underwriter',
              createdAt: '2023-04-22T17:00:00Z',
              dueDate: '2023-04-26T00:00:00Z',
              status: 'pending',
              priority: 'medium'
            }
          ],
          notes: [
            {
              id: 'note-1',
              text: 'Borrower has expressed interest in increasing the loan amount if terms are favorable.',
              createdBy: 'John Broker',
              createdAt: '2023-04-16T10:30:00Z'
            }
          ],
          tags: ['Office', 'Refinance', 'Chicago']
        },
        {
          id: 'deal-2',
          name: 'Retail Center Acquisition',
          type: 'origination',
          status: 'submitted',
          amount: 8200000,
          term: 84,
          rate: 6.25,
          createdAt: '2023-04-10T09:00:00Z',
          createdBy: 'Lisa Agent',
          borrower: {
            id: 'borrower-2',
            name: 'Vista Retail Group',
            type: 'Corporation'
          },
          property: {
            address: '789 Shopping Center Blvd',
            city: 'Atlanta',
            state: 'GA',
            zip: '30328',
            type: 'Retail',
            units: 12,
            squareFeet: 65000
          },
          participants: [
            {
              id: 'participant-4',
              name: 'Commerce Bank',
              role: 'lender',
              allocation: 8200000,
              status: 'participating'
            },
            {
              id: 'participant-5',
              name: 'XYZ Commercial Brokers',
              role: 'broker',
              status: 'participating'
            }
          ],
          timeline: [
            {
              id: 'timeline-4',
              date: '2023-04-10T09:00:00Z',
              event: 'Deal created',
              user: 'Lisa Agent'
            },
            {
              id: 'timeline-5',
              date: '2023-04-14T16:20:00Z',
              event: 'Submission complete',
              user: 'Lisa Agent'
            }
          ],
          documents: [
            {
              id: 'doc-4',
              name: 'Purchase Agreement',
              type: 'pdf',
              uploadedBy: 'Lisa Agent',
              uploadDate: '2023-04-11T13:45:00Z',
              status: 'approved'
            },
            {
              id: 'doc-5',
              name: 'Property Appraisal',
              type: 'pdf',
              uploadedBy: 'Lisa Agent',
              uploadDate: '2023-04-12T10:30:00Z',
              status: 'approved'
            }
          ],
          tasks: [
            {
              id: 'task-3',
              description: 'Schedule property inspection',
              assignedTo: 'David Inspector',
              createdBy: 'Lisa Agent',
              createdAt: '2023-04-11T10:00:00Z',
              dueDate: '2023-04-22T00:00:00Z',
              status: 'completed',
              priority: 'medium'
            }
          ],
          notes: [
            {
              id: 'note-2',
              text: 'Seller is motivated to close quickly. May consider price reduction for fast closing.',
              createdBy: 'Lisa Agent',
              createdAt: '2023-04-11T14:20:00Z'
            }
          ],
          tags: ['Retail', 'Acquisition', 'Atlanta']
        }
      ];
      
      setDeals(mockDeals);
    } catch (err) {
      console.error("Error fetching deals:", err);
      setError("Failed to fetch deals. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Get a single deal by ID
  const getDeal = (id: string): Deal | null => {
    return deals.find(deal => deal.id === id) || null;
  };

  // Create a new deal
  const createDeal = async (dealData: Partial<Deal>): Promise<Deal> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const now = new Date().toISOString();
      const newDeal: Deal = {
        id: generateId(),
        name: dealData.name || 'New Deal',
        type: dealData.type || 'origination',
        status: dealData.status || 'prospect',
        amount: dealData.amount || 0,
        createdAt: now,
        createdBy: dealData.createdBy || 'Current User',
        borrower: dealData.borrower || {
          id: generateId(),
          name: 'TBD',
          type: 'Unknown'
        },
        participants: dealData.participants || [],
        timeline: dealData.timeline || [
          {
            id: generateId(),
            date: now,
            event: 'Deal created',
            user: dealData.createdBy || 'Current User'
          }
        ],
        documents: dealData.documents || [],
        tasks: dealData.tasks || [],
        notes: dealData.notes || [],
        ...dealData
      };
      
      setDeals(prev => [...prev, newDeal]);
      return newDeal;
    } catch (err) {
      console.error("Error creating deal:", err);
      setError("Failed to create deal. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update an existing deal
  const updateDeal = async (id: string, dealData: Partial<Deal>): Promise<Deal> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const dealIndex = deals.findIndex(deal => deal.id === id);
      if (dealIndex === -1) {
        throw new Error(`Deal with ID ${id} not found`);
      }
      
      const updatedDeal = {
        ...deals[dealIndex],
        ...dealData
      };
      
      const newDeals = [...deals];
      newDeals[dealIndex] = updatedDeal;
      setDeals(newDeals);
      
      // If this is the selected deal, update it
      if (selectedDeal && selectedDeal.id === id) {
        setSelectedDeal(updatedDeal);
      }
      
      return updatedDeal;
    } catch (err) {
      console.error("Error updating deal:", err);
      setError("Failed to update deal. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a deal
  const deleteDeal = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const dealIndex = deals.findIndex(deal => deal.id === id);
      if (dealIndex === -1) {
        throw new Error(`Deal with ID ${id} not found`);
      }
      
      const newDeals = deals.filter(deal => deal.id !== id);
      setDeals(newDeals);
      
      // If this is the selected deal, clear it
      if (selectedDeal && selectedDeal.id === id) {
        setSelectedDeal(null);
      }
      
      return true;
    } catch (err) {
      console.error("Error deleting deal:", err);
      setError("Failed to delete deal. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Set the selected deal
  const selectDeal = (deal: Deal | null) => {
    setSelectedDeal(deal);
  };

  // Participant methods
  const addParticipant = async (dealId: string, participant: Omit<Participant, 'id'>): Promise<Participant> => {
    const dealIndex = deals.findIndex(deal => deal.id === dealId);
    if (dealIndex === -1) {
      throw new Error(`Deal with ID ${dealId} not found`);
    }
    
    const newParticipant: Participant = {
      id: generateId(),
      ...participant
    };
    
    const updatedDeal = {
      ...deals[dealIndex],
      participants: [...deals[dealIndex].participants, newParticipant]
    };
    
    const newDeals = [...deals];
    newDeals[dealIndex] = updatedDeal;
    setDeals(newDeals);
    
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal(updatedDeal);
    }
    
    // Add timeline event
    await addTimelineEvent(dealId, {
      date: new Date().toISOString(),
      event: `Added ${participant.name} as ${participant.role}`,
      user: 'Current User',
      relatedEntityId: newParticipant.id,
      relatedEntityType: 'participant'
    });
    
    return newParticipant;
  };
  
  const updateParticipant = async (dealId: string, participantId: string, data: Partial<Participant>): Promise<Participant> => {
    const dealIndex = deals.findIndex(deal => deal.id === dealId);
    if (dealIndex === -1) {
      throw new Error(`Deal with ID ${dealId} not found`);
    }
    
    const participantIndex = deals[dealIndex].participants.findIndex(p => p.id === participantId);
    if (participantIndex === -1) {
      throw new Error(`Participant with ID ${participantId} not found in deal ${dealId}`);
    }
    
    const updatedParticipant = {
      ...deals[dealIndex].participants[participantIndex],
      ...data
    };
    
    const updatedParticipants = [...deals[dealIndex].participants];
    updatedParticipants[participantIndex] = updatedParticipant;
    
    const updatedDeal = {
      ...deals[dealIndex],
      participants: updatedParticipants
    };
    
    const newDeals = [...deals];
    newDeals[dealIndex] = updatedDeal;
    setDeals(newDeals);
    
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal(updatedDeal);
    }
    
    return updatedParticipant;
  };
  
  const removeParticipant = async (dealId: string, participantId: string): Promise<boolean> => {
    const dealIndex = deals.findIndex(deal => deal.id === dealId);
    if (dealIndex === -1) {
      throw new Error(`Deal with ID ${dealId} not found`);
    }
    
    const participant = deals[dealIndex].participants.find(p => p.id === participantId);
    if (!participant) {
      throw new Error(`Participant with ID ${participantId} not found in deal ${dealId}`);
    }
    
    const updatedDeal = {
      ...deals[dealIndex],
      participants: deals[dealIndex].participants.filter(p => p.id !== participantId)
    };
    
    const newDeals = [...deals];
    newDeals[dealIndex] = updatedDeal;
    setDeals(newDeals);
    
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal(updatedDeal);
    }
    
    // Add timeline event
    await addTimelineEvent(dealId, {
      date: new Date().toISOString(),
      event: `Removed ${participant.name} as ${participant.role}`,
      user: 'Current User',
      relatedEntityType: 'participant'
    });
    
    return true;
  };

  // Document methods
  const addDocument = async (dealId: string, document: Omit<Document, 'id'>): Promise<Document> => {
    const dealIndex = deals.findIndex(deal => deal.id === dealId);
    if (dealIndex === -1) {
      throw new Error(`Deal with ID ${dealId} not found`);
    }
    
    const newDocument: Document = {
      id: generateId(),
      ...document
    };
    
    const updatedDeal = {
      ...deals[dealIndex],
      documents: [...deals[dealIndex].documents, newDocument]
    };
    
    const newDeals = [...deals];
    newDeals[dealIndex] = updatedDeal;
    setDeals(newDeals);
    
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal(updatedDeal);
    }
    
    // Add timeline event
    await addTimelineEvent(dealId, {
      date: new Date().toISOString(),
      event: `Added document: ${document.name}`,
      user: document.uploadedBy,
      relatedEntityId: newDocument.id,
      relatedEntityType: 'document'
    });
    
    return newDocument;
  };
  
  const updateDocument = async (dealId: string, documentId: string, data: Partial<Document>): Promise<Document> => {
    const dealIndex = deals.findIndex(deal => deal.id === dealId);
    if (dealIndex === -1) {
      throw new Error(`Deal with ID ${dealId} not found`);
    }
    
    const documentIndex = deals[dealIndex].documents.findIndex(d => d.id === documentId);
    if (documentIndex === -1) {
      throw new Error(`Document with ID ${documentId} not found in deal ${dealId}`);
    }
    
    const updatedDocument = {
      ...deals[dealIndex].documents[documentIndex],
      ...data
    };
    
    const updatedDocuments = [...deals[dealIndex].documents];
    updatedDocuments[documentIndex] = updatedDocument;
    
    const updatedDeal = {
      ...deals[dealIndex],
      documents: updatedDocuments
    };
    
    const newDeals = [...deals];
    newDeals[dealIndex] = updatedDeal;
    setDeals(newDeals);
    
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal(updatedDeal);
    }
    
    // If status changed, add timeline event
    if (data.status && data.status !== deals[dealIndex].documents[documentIndex].status) {
      await addTimelineEvent(dealId, {
        date: new Date().toISOString(),
        event: `Document ${updatedDocument.name} marked as ${data.status}`,
        user: 'Current User',
        relatedEntityId: documentId,
        relatedEntityType: 'document'
      });
    }
    
    return updatedDocument;
  };
  
  const removeDocument = async (dealId: string, documentId: string): Promise<boolean> => {
    const dealIndex = deals.findIndex(deal => deal.id === dealId);
    if (dealIndex === -1) {
      throw new Error(`Deal with ID ${dealId} not found`);
    }
    
    const document = deals[dealIndex].documents.find(d => d.id === documentId);
    if (!document) {
      throw new Error(`Document with ID ${documentId} not found in deal ${dealId}`);
    }
    
    const updatedDeal = {
      ...deals[dealIndex],
      documents: deals[dealIndex].documents.filter(d => d.id !== documentId)
    };
    
    const newDeals = [...deals];
    newDeals[dealIndex] = updatedDeal;
    setDeals(newDeals);
    
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal(updatedDeal);
    }
    
    // Add timeline event
    await addTimelineEvent(dealId, {
      date: new Date().toISOString(),
      event: `Removed document: ${document.name}`,
      user: 'Current User',
      relatedEntityType: 'document'
    });
    
    return true;
  };

  // Task methods
  const addTask = async (dealId: string, task: Omit<Task, 'id'>): Promise<Task> => {
    const dealIndex = deals.findIndex(deal => deal.id === dealId);
    if (dealIndex === -1) {
      throw new Error(`Deal with ID ${dealId} not found`);
    }
    
    const newTask: Task = {
      id: generateId(),
      ...task
    };
    
    const updatedDeal = {
      ...deals[dealIndex],
      tasks: [...deals[dealIndex].tasks, newTask]
    };
    
    const newDeals = [...deals];
    newDeals[dealIndex] = updatedDeal;
    setDeals(newDeals);
    
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal(updatedDeal);
    }
    
    // Add timeline event
    await addTimelineEvent(dealId, {
      date: new Date().toISOString(),
      event: `Task created: ${task.description}`,
      user: task.createdBy,
      relatedEntityId: newTask.id,
      relatedEntityType: 'task'
    });
    
    return newTask;
  };
  
  const updateTask = async (dealId: string, taskId: string, data: Partial<Task>): Promise<Task> => {
    const dealIndex = deals.findIndex(deal => deal.id === dealId);
    if (dealIndex === -1) {
      throw new Error(`Deal with ID ${dealId} not found`);
    }
    
    const taskIndex = deals[dealIndex].tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`Task with ID ${taskId} not found in deal ${dealId}`);
    }
    
    const updatedTask = {
      ...deals[dealIndex].tasks[taskIndex],
      ...data
    };
    
    const updatedTasks = [...deals[dealIndex].tasks];
    updatedTasks[taskIndex] = updatedTask;
    
    const updatedDeal = {
      ...deals[dealIndex],
      tasks: updatedTasks
    };
    
    const newDeals = [...deals];
    newDeals[dealIndex] = updatedDeal;
    setDeals(newDeals);
    
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal(updatedDeal);
    }
    
    // If status changed, add timeline event
    if (data.status && data.status !== deals[dealIndex].tasks[taskIndex].status) {
      await addTimelineEvent(dealId, {
        date: new Date().toISOString(),
        event: `Task "${updatedTask.description}" status changed to ${data.status}`,
        user: 'Current User',
        relatedEntityId: taskId,
        relatedEntityType: 'task'
      });
    }
    
    return updatedTask;
  };
  
  const completeTask = async (dealId: string, taskId: string): Promise<Task> => {
    return updateTask(dealId, taskId, { status: 'completed' });
  };
  
  const removeTask = async (dealId: string, taskId: string): Promise<boolean> => {
    const dealIndex = deals.findIndex(deal => deal.id === dealId);
    if (dealIndex === -1) {
      throw new Error(`Deal with ID ${dealId} not found`);
    }
    
    const task = deals[dealIndex].tasks.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found in deal ${dealId}`);
    }
    
    const updatedDeal = {
      ...deals[dealIndex],
      tasks: deals[dealIndex].tasks.filter(t => t.id !== taskId)
    };
    
    const newDeals = [...deals];
    newDeals[dealIndex] = updatedDeal;
    setDeals(newDeals);
    
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal(updatedDeal);
    }
    
    // Add timeline event
    await addTimelineEvent(dealId, {
      date: new Date().toISOString(),
      event: `Removed task: ${task.description}`,
      user: 'Current User',
      relatedEntityType: 'task'
    });
    
    return true;
  };

  // Note methods
  const addNote = async (dealId: string, note: Omit<Note, 'id'>): Promise<Note> => {
    const dealIndex = deals.findIndex(deal => deal.id === dealId);
    if (dealIndex === -1) {
      throw new Error(`Deal with ID ${dealId} not found`);
    }
    
    const newNote: Note = {
      id: generateId(),
      ...note
    };
    
    const updatedDeal = {
      ...deals[dealIndex],
      notes: [...deals[dealIndex].notes, newNote]
    };
    
    const newDeals = [...deals];
    newDeals[dealIndex] = updatedDeal;
    setDeals(newDeals);
    
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal(updatedDeal);
    }
    
    // Add timeline event if note is not private
    if (!note.isPrivate) {
      await addTimelineEvent(dealId, {
        date: new Date().toISOString(),
        event: `Note added by ${note.createdBy}`,
        user: note.createdBy,
        relatedEntityId: newNote.id,
        relatedEntityType: 'note'
      });
    }
    
    return newNote;
  };
  
  const updateNote = async (dealId: string, noteId: string, text: string): Promise<Note> => {
    const dealIndex = deals.findIndex(deal => deal.id === dealId);
    if (dealIndex === -1) {
      throw new Error(`Deal with ID ${dealId} not found`);
    }
    
    const noteIndex = deals[dealIndex].notes.findIndex(n => n.id === noteId);
    if (noteIndex === -1) {
      throw new Error(`Note with ID ${noteId} not found in deal ${dealId}`);
    }
    
    const updatedNote = {
      ...deals[dealIndex].notes[noteIndex],
      text,
      // Add an "edited" indicator
      createdAt: `${deals[dealIndex].notes[noteIndex].createdAt} (edited)`
    };
    
    const updatedNotes = [...deals[dealIndex].notes];
    updatedNotes[noteIndex] = updatedNote;
    
    const updatedDeal = {
      ...deals[dealIndex],
      notes: updatedNotes
    };
    
    const newDeals = [...deals];
    newDeals[dealIndex] = updatedDeal;
    setDeals(newDeals);
    
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal(updatedDeal);
    }
    
    return updatedNote;
  };
  
  const removeNote = async (dealId: string, noteId: string): Promise<boolean> => {
    const dealIndex = deals.findIndex(deal => deal.id === dealId);
    if (dealIndex === -1) {
      throw new Error(`Deal with ID ${dealId} not found`);
    }
    
    const updatedDeal = {
      ...deals[dealIndex],
      notes: deals[dealIndex].notes.filter(n => n.id !== noteId)
    };
    
    const newDeals = [...deals];
    newDeals[dealIndex] = updatedDeal;
    setDeals(newDeals);
    
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal(updatedDeal);
    }
    
    return true;
  };

  // Timeline methods
  const addTimelineEvent = async (dealId: string, event: Omit<TimelineEvent, 'id'>): Promise<TimelineEvent> => {
    const dealIndex = deals.findIndex(deal => deal.id === dealId);
    if (dealIndex === -1) {
      throw new Error(`Deal with ID ${dealId} not found`);
    }
    
    const newEvent: TimelineEvent = {
      id: generateId(),
      ...event
    };
    
    const updatedDeal = {
      ...deals[dealIndex],
      timeline: [...deals[dealIndex].timeline, newEvent]
    };
    
    const newDeals = [...deals];
    newDeals[dealIndex] = updatedDeal;
    setDeals(newDeals);
    
    if (selectedDeal && selectedDeal.id === dealId) {
      setSelectedDeal(updatedDeal);
    }
    
    return newEvent;
  };

  // Provide the context value
  const contextValue: DealContextType = {
    deals,
    selectedDeal,
    loading,
    error,
    fetchDeals,
    getDeal,
    createDeal,
    updateDeal,
    deleteDeal,
    selectDeal,
    
    // Participant methods
    addParticipant,
    updateParticipant,
    removeParticipant,
    
    // Document methods
    addDocument,
    updateDocument,
    removeDocument,
    
    // Task methods
    addTask,
    updateTask,
    completeTask,
    removeTask,
    
    // Note methods
    addNote,
    updateNote,
    removeNote,
    
    // Timeline methods
    addTimelineEvent
  };

  return (
    <DealContext.Provider value={contextValue}>
      {children}
    </DealContext.Provider>
  );
};

// Custom hook to use the deal context
export const useDeal = (): DealContextType => {
  const context = useContext(DealContext);
  if (context === undefined) {
    throw new Error('useDeal must be used within a DealProvider');
  }
  return context;
};

export default DealContext; 