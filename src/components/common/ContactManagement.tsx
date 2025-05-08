import React, { useState, useEffect } from 'react';

// Define interface for a contact
export interface Contact {
  id: string;
  name: string;
  role: string;
  organization?: string;
  email: string;
  phone?: string;
  type: 'internal' | 'client' | 'vendor' | 'partner';
  notes?: string;
  assignedTasks: Task[];
}

// Define interface for a task
export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date | null;
  status: 'todo' | 'in_progress' | 'completed' | 'deferred';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string; // Contact ID
  createdAt: Date;
}

// Prop types for the component
interface ContactManagementProps {
  userRole: string;
  onContactSelect?: (contact: Contact) => void;
  initialContacts?: Contact[];
}

const ContactManagement: React.FC<ContactManagementProps> = ({ 
  userRole, 
  onContactSelect,
  initialContacts = []
}) => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [currentContact, setCurrentContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // New contact form state
  const [newContact, setNewContact] = useState<Omit<Contact, 'id' | 'assignedTasks'>>({
    name: '',
    role: '',
    email: '',
    type: 'client'
  });
  
  // New task form state
  const [newTask, setNewTask] = useState<Omit<Task, 'id' | 'createdAt'>>({
    title: '',
    description: '',
    dueDate: null,
    status: 'todo',
    priority: 'medium',
    assignedTo: ''
  });

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (contact.organization && contact.organization.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Handle adding a new contact
  const handleAddContact = () => {
    const newContactItem: Contact = {
      id: `contact-${Date.now()}`,
      ...newContact,
      assignedTasks: []
    };
    
    setContacts([...contacts, newContactItem]);
    setNewContact({
      name: '',
      role: '',
      email: '',
      type: 'client'
    });
    setShowAddContact(false);
  };

  // Handle adding a new task
  const handleAddTask = () => {
    const newTaskItem: Task = {
      id: `task-${Date.now()}`,
      ...newTask,
      createdAt: new Date()
    };
    
    setTasks([...tasks, newTaskItem]);
    
    // If the task is assigned to a contact, update that contact's tasks
    if (newTask.assignedTo) {
      setContacts(prevContacts => 
        prevContacts.map(contact => 
          contact.id === newTask.assignedTo 
            ? { ...contact, assignedTasks: [...contact.assignedTasks, newTaskItem] }
            : contact
        )
      );
    }
    
    setNewTask({
      title: '',
      description: '',
      dueDate: null,
      status: 'todo',
      priority: 'medium',
      assignedTo: ''
    });
    setShowAddTask(false);
  };

  // Handle selecting a contact
  const handleSelectContact = (contact: Contact) => {
    setCurrentContact(contact);
    if (onContactSelect) {
      onContactSelect(contact);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Contact Management</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowAddContact(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Add Contact
            </button>
            <button
              onClick={() => setShowAddTask(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Create Task
            </button>
          </div>
        </div>
        
        <div className="mb-4">
          <label htmlFor="search" className="sr-only">
            Search Contacts
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              id="search"
              name="search"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              placeholder="Search contacts"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {filteredContacts.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No contacts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding your first contact.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowAddContact(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Add Contact
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-hidden border border-gray-200 rounded-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email / Phone
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tasks
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} onClick={() => handleSelectContact(contact)} className="cursor-pointer hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                          <span className="font-medium text-sm">{contact.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                          <div className="text-sm text-gray-500">{contact.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        contact.type === 'client' 
                          ? 'bg-green-100 text-green-800' 
                          : contact.type === 'internal' 
                            ? 'bg-blue-100 text-blue-800' 
                            : contact.type === 'vendor' 
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{contact.email}</div>
                      <div className="text-sm text-gray-500">{contact.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {contact.assignedTasks.length > 0 ? (
                        <span className="bg-gray-100 px-2 py-1 rounded-full text-xs font-medium">
                          {contact.assignedTasks.length} assigned
                        </span>
                      ) : (
                        <span className="text-gray-400">No tasks</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Set new task assigned to
                          setNewTask({...newTask, assignedTo: contact.id});
                          setShowAddTask(true);
                        }}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        Assign Task
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit contact functionality here
                        }}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {/* Add Contact Modal */}
      {showAddContact && (
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
                      Add New Contact
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          value={newContact.name}
                          onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          value={newContact.email}
                          onChange={(e) => setNewContact({...newContact, email: e.target.value})}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                          Role / Job Title
                        </label>
                        <input
                          type="text"
                          name="role"
                          id="role"
                          value={newContact.role}
                          onChange={(e) => setNewContact({...newContact, role: e.target.value})}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                          Contact Type
                        </label>
                        <select
                          name="type"
                          id="type"
                          value={newContact.type}
                          onChange={(e) => setNewContact({...newContact, type: e.target.value as any})}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="client">Client</option>
                          <option value="internal">Internal (Team Member)</option>
                          <option value="vendor">Vendor</option>
                          <option value="partner">Partner</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                          Phone Number (Optional)
                        </label>
                        <input
                          type="text"
                          name="phone"
                          id="phone"
                          value={newContact.phone || ''}
                          onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="organization" className="block text-sm font-medium text-gray-700">
                          Organization (Optional)
                        </label>
                        <input
                          type="text"
                          name="organization"
                          id="organization"
                          value={newContact.organization || ''}
                          onChange={(e) => setNewContact({...newContact, organization: e.target.value})}
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
                  onClick={handleAddContact}
                  disabled={!newContact.name || !newContact.email}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    !newContact.name || !newContact.email ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-700'
                  }`}
                >
                  Add Contact
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddContact(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Task Modal */}
      {showAddTask && (
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
                      Create New Task
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="task-title" className="block text-sm font-medium text-gray-700">
                          Task Title
                        </label>
                        <input
                          type="text"
                          name="task-title"
                          id="task-title"
                          value={newTask.title}
                          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="task-description" className="block text-sm font-medium text-gray-700">
                          Description (Optional)
                        </label>
                        <textarea
                          name="task-description"
                          id="task-description"
                          rows={3}
                          value={newTask.description || ''}
                          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="due-date" className="block text-sm font-medium text-gray-700">
                          Due Date (Optional)
                        </label>
                        <input
                          type="date"
                          name="due-date"
                          id="due-date"
                          value={newTask.dueDate ? new Date(newTask.dueDate).toISOString().split('T')[0] : ''}
                          onChange={(e) => setNewTask({...newTask, dueDate: e.target.value ? new Date(e.target.value) : null})}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                          Priority
                        </label>
                        <select
                          name="priority"
                          id="priority"
                          value={newTask.priority}
                          onChange={(e) => setNewTask({...newTask, priority: e.target.value as any})}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="assigned-to" className="block text-sm font-medium text-gray-700">
                          Assign To
                        </label>
                        <select
                          name="assigned-to"
                          id="assigned-to"
                          value={newTask.assignedTo || ''}
                          onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value || undefined})}
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Select a contact</option>
                          {contacts.map(contact => (
                            <option key={contact.id} value={contact.id}>
                              {contact.name} ({contact.type})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleAddTask}
                  disabled={!newTask.title}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm ${
                    !newTask.title ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'
                  }`}
                >
                  Create Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
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

export default ContactManagement; 