import React, { useState, useRef, useEffect } from 'react';
import { CustomAgentConfig } from './EVAAssistantWithCustomAgents';

interface Participant {
  id: string;
  fullName: string;
  shortName: string;
  avatar: string;
  isCustom?: boolean;
}

interface Message {
  id: string;
  text: string;
  sender: Participant;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  preview: string;
  isSelected: boolean;
  messages: Message[];
  participantId: string;
  taskId?: string; // Reference to associated task
}

interface EVAAssistantChatProps {
  customAgents?: CustomAgentConfig[];
  selectedAgentId?: string | null;
  onSelectAgent?: (agentId: string) => void;
  onCreateCustomAgent?: () => void;
  onClose: () => void;
  onCreateTask?: () => void;
}

const EVAAssistantChat: React.FC<EVAAssistantChatProps> = ({
  customAgents = [],
  selectedAgentId = null,
  onSelectAgent = () => {},
  onCreateCustomAgent = () => {},
  onClose,
}) => {
  // Define participants with their full names as requested
  const defaultParticipants: Participant[] = [
    {
      id: 'eva-risk',
      fullName: 'EVA Risk',
      shortName: 'EVA Risk',
      avatar: '/icons/agents/eva-brain-icon.svg',
    },
    {
      id: 'doc-easy',
      fullName: 'Doc Easy',
      shortName: 'Doc Easy',
      avatar: '/icons/document-icon.svg',
    },
    {
      id: 'steve-branding',
      fullName: 'Steve Branding',
      shortName: 'Steve Branding',
      avatar: '/icons/brand-icon.svg',
    },
    {
      id: 'neo',
      fullName: 'Neo Matrix Master',
      shortName: 'Neo Matrix Master',
      avatar: '/icons/dev-icon.svg',
    },
    {
      id: 'del-spooner',
      fullName: 'Del Spooner',
      shortName: 'Del Spooner',
      avatar: '/icons/security-icon.svg',
    },
    {
      id: 'john-conner',
      fullName: 'John Conner',
      shortName: 'John Conner',
      avatar: '/icons/admin-icon.svg',
    },
    {
      id: 'mira-sales',
      fullName: 'Mira Sales',
      shortName: 'Mira Sales',
      avatar: '/icons/sales-icon.svg',
    },
    {
      id: 'ben',
      fullName: 'Ben The Accountant',
      shortName: 'Ben The Accountant',
      avatar: '/icons/finance-icon.svg',
    },
    { id: 'leo', fullName: 'Leo Wolf', shortName: 'Leo Wolf', avatar: '/icons/advisor-icon.svg' },
  ];

  // Combine default and custom participants
  const participants: Participant[] = [
    ...defaultParticipants,
    ...customAgents.map(agent => ({
      id: agent.id,
      fullName: agent.fullName,
      shortName: agent.name,
      avatar: agent.icon || '/brain-icon.svg',
      isCustom: true,
    })),
  ];

  // Find the currently selected agent
  const selectedAgent = selectedAgentId
    ? participants.find(p => p.id === selectedAgentId) || participants[0]
    : participants[0];

  const defaultWelcomeMessage = (participant: Participant): Message => ({
    id: `welcome-${Date.now()}`,
    text: `Welcome to a new conversation with ${participant.fullName}.`,
    sender: participant,
    timestamp: new Date(),
  });

  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      title: `Conversation with ${selectedAgent.fullName}`,
      preview: `Welcome to a new conversation with ${selectedAgent.fullName}...`,
      isSelected: true,
      messages: [defaultWelcomeMessage(selectedAgent)],
      participantId: selectedAgent.id,
    },
    {
      id: 'conv-2',
      title: 'Conversation with EVA Risk',
      preview: 'Welcome to a new conversation with EVA Risk...',
      isSelected: false,
      messages: [
        defaultWelcomeMessage(participants.find(p => p.id === 'eva-risk') || participants[0]),
      ],
      participantId: 'eva-risk',
    },
    {
      id: 'conv-3',
      title: 'Loan Portfolio Analysis',
      preview: 'Overview of loan portfolio performance...',
      isSelected: false,
      messages: [defaultWelcomeMessage(participants.find(p => p.id === 'ben') || participants[0])],
      participantId: 'ben',
    },
    {
      id: 'conv-4',
      title: 'Document Verification',
      preview: 'Analysis of financial statements and...',
      isSelected: false,
      messages: [
        defaultWelcomeMessage(participants.find(p => p.id === 'doc-easy') || participants[0]),
      ],
      participantId: 'doc-easy',
    },
    {
      id: 'conv-5',
      title: 'Risk Assessment',
      preview: 'Detailed risk factors and mitigation...',
      isSelected: false,
      messages: [
        defaultWelcomeMessage(participants.find(p => p.id === 'eva-risk') || participants[0]),
      ],
      participantId: 'eva-risk',
    },
  ]);

  // Get the currently active conversation
  const activeConversation = conversations.find(conv => conv.isSelected) || conversations[0];

  // Get messages from the active conversation
  const messages = activeConversation.messages;

  // Get the agent for the active conversation
  const conversationAgent =
    participants.find(p => p.id === activeConversation.participantId) || selectedAgent;

  // Handle conversation selection
  const selectConversation = (id: string) => {
    setConversations(prevConversations =>
      prevConversations.map(conv => ({
        ...conv,
        isSelected: conv.id === id,
      }))
    );
  };

  // Update when selected agent changes
  useEffect(() => {
    // Only update the first conversation when the selected agent changes
    setConversations(prevConversations => {
      const updatedConversations = [...prevConversations];
      // Find the currently selected conversation
      const selectedIndex = updatedConversations.findIndex(conv => conv.isSelected);

      if (selectedIndex >= 0) {
        // Update the selected conversation with the new agent
        updatedConversations[selectedIndex] = {
          ...updatedConversations[selectedIndex],
          title: `Conversation with ${selectedAgent.fullName}`,
          preview: `Welcome to a new conversation with ${selectedAgent.fullName}...`,
          participantId: selectedAgent.id,
          messages: [defaultWelcomeMessage(selectedAgent)],
        };
      }

      return updatedConversations;
    });
  }, [selectedAgent]);

  const [inputValue, setInputValue] = useState('');
  const [currentTab, setCurrentTab] = useState('conversations');
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Add state for suggested next prompts
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>([]);

  // Function to scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Draggable functionality
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth - 420,
    y: window.innerHeight / 2 - 300,
  });
  const [initialMousePos, setInitialMousePos] = useState({ x: 0, y: 0 });
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from the header
    if ((e.target as HTMLElement).closest('.chat-header')) {
      setIsDragging(true);
      setInitialMousePos({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - initialMousePos.x,
        y: e.clientY - initialMousePos.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, initialMousePos]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: {
        id: 'user',
        fullName: 'You',
        shortName: 'You',
        avatar: '',
      },
      timestamp: new Date(),
    };

    // Update messages in the active conversation
    setConversations(prevConversations =>
      prevConversations.map(conv =>
        conv.isSelected
          ? {
              ...conv,
              messages: [...conv.messages, userMessage],
              preview: `${inputValue.substring(0, 30)}...`,
            }
          : conv
      )
    );

    setInputValue('');
    setIsProcessing(true);
    // Clear suggestions when user sends a message
    setSuggestedPrompts([]);

    // Simulate AI response after delay
    setTimeout(() => {
      // Get the active conversation after state update
      const currentConversation = conversations.find(conv => conv.isSelected);
      if (!currentConversation) return;

      // Find the agent for this conversation
      const agent =
        participants.find(p => p.id === currentConversation.participantId) || selectedAgent;

      const aiResponse = generateResponse(inputValue, agent);
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        text: aiResponse,
        sender: agent,
        timestamp: new Date(),
      };

      // Update the messages in the active conversation
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.isSelected
            ? {
                ...conv,
                messages: [...conv.messages, aiMessage],
              }
            : conv
        )
      );

      // Generate suggested follow-up prompts
      const nextPrompts = generateSuggestedPrompts(inputValue, aiResponse, agent);
      setSuggestedPrompts(nextPrompts);

      setIsProcessing(false);
    }, 1500);
  };

  // Function to generate AI response based on user input
  const generateResponse = (input: string, agent: Participant): string => {
    const inputLower = input.toLowerCase();

    // Generate specific responses based on the agent and query content
    if (agent.id === 'eva-risk') {
      if (inputLower.includes('risk') || inputLower.includes('assess')) {
        return "Based on my risk analysis, there are several factors to consider: market volatility is currently at 12% which is slightly elevated, the industry sector shows moderate risk trends, and the applicant's financial metrics indicate a B+ risk rating. Would you like me to elaborate on any specific risk aspect?";
      } else if (inputLower.includes('loan') || inputLower.includes('portfolio')) {
        return 'Your loan portfolio currently consists of 157 active loans with a total value of $42.3M. The overall risk distribution is: 62% low risk, 28% medium risk, and 10% high risk. Performance metrics show a 2.4% delinquency rate, which is below industry average.';
      }
    } else if (agent.id === 'doc-easy') {
      if (inputLower.includes('document') || inputLower.includes('verification')) {
        return "I've analyzed the submitted documents. The tax returns appear complete with all schedules included. The bank statements show consistent cash flow with average monthly deposits of $45,200. I've flagged two potential discrepancies for your review in the income reporting section.";
      }
    } else if (agent.id.includes('steve-branding')) {
      return 'From a branding perspective, this approach aligns with our core values of transparency and client empowerment. I recommend emphasizing our AI-driven risk analysis as a key differentiator in client communications.';
    }

    // Default responses based on query types
    if (inputLower.includes('analysis') || inputLower.includes('financial')) {
      return "I've analyzed the financial data and noticed several key trends: revenue growth is at 7.2% year-over-year, expenses have decreased by 3.1%, and cash reserves have increased significantly. The debt-to-income ratio remains within acceptable parameters at 1.8.";
    } else if (inputLower.includes('compare') || inputLower.includes('similar')) {
      return 'When comparing to similar cases in our portfolio, this application shows above-average financial stability and slightly better collateral coverage. The risk profile is more favorable than 72% of similar loans in the same industry sector.';
    } else if (inputLower.includes('collateral')) {
      return 'The collateral value is estimated at $2.4M, which provides a loan-to-value ratio of 65%. This is within our preferred range and offers adequate security for the requested loan amount of $1.56M.';
    } else if (inputLower.includes('cash flow') || inputLower.includes('projection')) {
      return 'The cash flow projections indicate sufficient debt service coverage with a ratio of 1.8x. The model accounts for seasonal fluctuations in the industry and includes appropriate stress testing for various economic scenarios.';
    } else if (inputLower.includes('compliance') || inputLower.includes('regulatory')) {
      return "From a compliance perspective, this transaction requires standard KYC documentation. Based on the loan amount and industry, you'll need to complete sections 3A-3C of the regulatory disclosure form and ensure the borrower certification is properly executed.";
    }

    // Generic response if no specific triggers are matched
    return `Thanks for your question. As ${agent.fullName}, I can help you with detailed analysis and insights on this matter. Could you provide more specific details about what you'd like to know?`;
  };

  // Function to generate suggested follow-up prompts based on context
  const generateSuggestedPrompts = (
    userInput: string,
    aiResponse: string,
    agent: Participant
  ): string[] => {
    const inputLower = userInput.toLowerCase();
    const responseLower = aiResponse.toLowerCase();
    const agentId = agent.id;

    // Base suggestions that are generally useful for any conversation
    const basePrompts = [
      'Can you elaborate on that point?',
      'What specific metrics should I focus on?',
      'What are the next steps you recommend?',
      'How does this compare to industry standards?',
      'Could you provide a specific example?',
      'What are the potential risks to consider?',
      'Are there any additional opportunities here?',
    ];

    // Agent-specific and context-sensitive prompts
    let contextualPrompts: string[] = [];

    if (agentId === 'eva-risk') {
      if (inputLower.includes('risk') || responseLower.includes('risk')) {
        contextualPrompts = [
          'What risk mitigation strategies do you recommend?',
          'How would you rate the overall risk level on a scale of 1-10?',
          'What additional data points would improve this risk assessment?',
        ];
      } else if (
        inputLower.includes('loan') ||
        responseLower.includes('loan') ||
        responseLower.includes('portfolio')
      ) {
        contextualPrompts = [
          "What's the delinquency trend over the past 6 months?",
          'Which loan segments are performing best/worst?',
          'How would a 1% interest rate change impact this portfolio?',
        ];
      }
    } else if (agentId === 'doc-easy') {
      if (inputLower.includes('document') || responseLower.includes('document')) {
        contextualPrompts = [
          'Are there any missing documents in this application?',
          'Can you identify any inconsistencies in these documents?',
          'What documentation is typically required for this type of transaction?',
        ];
      } else if (responseLower.includes('discrepanc') || responseLower.includes('inconsisten')) {
        contextualPrompts = [
          'How serious are these discrepancies?',
          'What additional verification would you recommend?',
          'Are these common issues in similar applications?',
        ];
      }
    } else if (agentId.includes('ben')) {
      contextualPrompts = [
        'What are the key financial ratios I should be monitoring?',
        'How does cash flow compare to projections?',
        'What tax implications should I be aware of?',
      ];
    } else if (agentId.includes('mira-sales')) {
      contextualPrompts = [
        "What's our competitive advantage with this client?",
        'How can we increase cross-selling opportunities?',
        'What customer retention strategies would work best here?',
      ];
    } else if (agentId.includes('steve-branding')) {
      contextualPrompts = [
        'How does this align with our brand values?',
        'What messaging would resonate best with this audience?',
        'How should we position this in our marketing materials?',
      ];
    } else if (responseLower.includes('compliance') || responseLower.includes('regulatory')) {
      contextualPrompts = [
        'What specific regulations apply in this case?',
        'Are there any recent regulatory changes we should be aware of?',
        'What documentation is needed for compliance?',
      ];
    } else if (responseLower.includes('analysis') || responseLower.includes('financial')) {
      contextualPrompts = [
        'Can you break down these financial trends by quarter?',
        'How reliable are these financial projections?',
        "What's driving the change in these financial metrics?",
      ];
    }

    // If we have contextual prompts, use those, otherwise use a mix of base prompts
    const promptOptions = contextualPrompts.length > 0 ? contextualPrompts : basePrompts;

    // Shuffle array and take the first 3
    return promptOptions.sort(() => 0.5 - Math.random()).slice(0, 3);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSelectParticipant = (participant: Participant) => {
    if (onSelectAgent) {
      onSelectAgent(participant.id);
    }
  };

  // Define tasks interface
  interface Task {
    id: string;
    title: string;
    description: string;
    assignedTo: string[]; // AI agent IDs
    humanAssignees: {
      id: string;
      name: string;
      email: string;
      type: 'internal' | 'external';
    }[];
    status: 'pending' | 'in-progress' | 'completed';
    dueDate?: Date;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
  }

  // Mock data for human users (in a real app, this would come from an API)
  const [internalUsers] = useState([
    {
      id: 'user-1',
      name: 'Karen Smith',
      email: 'karen.smith@company.com',
      type: 'internal' as const,
    },
    {
      id: 'user-2',
      name: 'John Davis',
      email: 'john.davis@company.com',
      type: 'internal' as const,
    },
    {
      id: 'user-3',
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      type: 'internal' as const,
    },
    {
      id: 'user-4',
      name: 'Sophia Rodriguez',
      email: 'sophia.rodriguez@company.com',
      type: 'internal' as const,
    },
  ]);

  const [externalUsers] = useState([
    { id: 'ext-1', name: 'David Miller', email: 'david@clientcorp.com', type: 'external' as const },
    {
      id: 'ext-2',
      name: 'Emily Wilson',
      email: 'emily@partnerfirm.com',
      type: 'external' as const,
    },
    {
      id: 'ext-3',
      name: 'Robert Johnson',
      email: 'robert@vendorco.com',
      type: 'external' as const,
    },
  ]);

  // Define state for tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [assigneeType, setAssigneeType] = useState<'ai' | 'human'>('ai');
  const [userType, setUserType] = useState<'internal' | 'external'>('internal');
  const [taskInput, setTaskInput] = useState({
    title: '',
    description: '',
    assignedTo: [] as string[],
    humanAssignees: [] as {
      id: string;
      name: string;
      email: string;
      type: 'internal' | 'external';
    }[],
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default due date is one week from now
  });

  // Task creation functions
  const handleTaskInputChange = (field: string, value: any) => {
    setTaskInput({
      ...taskInput,
      [field]: value,
    });
  };

  const createTask = () => {
    if (!taskInput.title) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskInput.title,
      description: taskInput.description,
      assignedTo: taskInput.assignedTo,
      humanAssignees: taskInput.humanAssignees,
      status: 'pending',
      dueDate: taskInput.dueDate,
      priority: taskInput.priority,
      createdAt: new Date(),
    };

    setTasks([...tasks, newTask]);

    // Create a conversation for the task if there are AI agents assigned
    if (taskInput.assignedTo.length > 0) {
      // Get the first assigned AI agent
      const assignedAgentId = taskInput.assignedTo[0];
      const assignedAgent = participants.find(p => p.id === assignedAgentId) || selectedAgent;

      // Initial message for the task
      const initialTaskMessage: Message = {
        id: `task-msg-${Date.now()}`,
        text: `I've created a new task: "${taskInput.title}"\n\n${taskInput.description}\n\nCan you help me refine this task?`,
        sender: {
          id: 'user',
          fullName: 'You',
          shortName: 'You',
          avatar: '',
        },
        timestamp: new Date(),
      };

      // Response from the AI
      const aiResponse: Message = {
        id: `ai-${Date.now()}`,
        text: `I'll help you refine the task "${taskInput.title}". What specific aspects would you like to improve or clarify?`,
        sender: assignedAgent,
        timestamp: new Date(Date.now() + 1000), // 1 second later
      };

      // Create the new conversation
      const newConversation: Conversation = {
        id: `conv-task-${Date.now()}`,
        title: `Task: ${taskInput.title}`,
        preview: `Refining task with ${assignedAgent.fullName}...`,
        isSelected: true,
        messages: [defaultWelcomeMessage(assignedAgent), initialTaskMessage, aiResponse],
        participantId: assignedAgent.id,
        taskId: newTask.id,
      };

      // Add the new conversation and make it selected
      setConversations(prevConversations => [
        newConversation,
        ...prevConversations.map(conv => ({ ...conv, isSelected: false })),
      ]);

      // Switch to conversations tab
      setCurrentTab('conversations');
    }

    // Reset the task form
    setShowTaskModal(false);
    setTaskInput({
      title: '',
      description: '',
      assignedTo: [],
      humanAssignees: [],
      priority: 'medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    setAssigneeType('ai');
    setUserType('internal');
  };

  // Modified New Chat button to open task creation or start a new chat
  const createNewConversation = () => {
    // Show task creation modal instead of just creating a new conversation
    setShowTaskModal(true);

    // Keep original conversation creation logic for when task modal is closed
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: `New conversation with ${selectedAgent.fullName}`,
      preview: `Welcome to a new conversation with ${selectedAgent.fullName}...`,
      isSelected: true,
      messages: [defaultWelcomeMessage(selectedAgent)],
      participantId: selectedAgent.id,
    };

    // Update conversations list - mark new one as selected, others as not selected
    setConversations(prevConversations => [
      newConversation,
      ...prevConversations.map(conv => ({ ...conv, isSelected: false })),
    ]);
  };

  // Handle clicking on a suggestion
  const handleSuggestionClick = (text: string) => {
    setInputValue(text);
    // Optional: automatically send the message
    // setTimeout(sendMessage, 100);
  };

  // Function to open a task conversation when clicking the eye icon
  const openTaskConversation = (task: Task) => {
    // Check if a conversation already exists for this task
    const existingConversation = conversations.find(conv => conv.taskId === task.id);

    if (existingConversation) {
      // Select the existing conversation
      setConversations(prevConversations =>
        prevConversations.map(conv => ({
          ...conv,
          isSelected: conv.id === existingConversation.id,
        }))
      );
    } else {
      // Find the assigned agent (use the first one or default to selected agent)
      const assignedAgentId = task.assignedTo.length > 0 ? task.assignedTo[0] : selectedAgent.id;
      const assignedAgent = participants.find(p => p.id === assignedAgentId) || selectedAgent;

      // Initial messages for the task conversation
      const initialTaskMessage: Message = {
        id: `task-msg-${Date.now()}`,
        text: `Let's discuss this task: "${task.title}"\n\n${task.description}\n\nI'd like to review the details and progress.`,
        sender: {
          id: 'user',
          fullName: 'You',
          shortName: 'You',
          avatar: '',
        },
        timestamp: new Date(),
      };

      // AI response about the task
      const aiResponse: Message = {
        id: `ai-${Date.now() + 1}`,
        text: `I'd be happy to discuss the task "${task.title}". What specific aspects would you like to focus on first? The current status is "${task.status}" and priority is "${task.priority}".`,
        sender: assignedAgent,
        timestamp: new Date(Date.now() + 1000),
      };

      // Create a new conversation for this task
      const newConversation: Conversation = {
        id: `conv-task-${Date.now()}`,
        title: `Task: ${task.title}`,
        preview: `Discussing task with ${assignedAgent.fullName}...`,
        isSelected: true,
        messages: [defaultWelcomeMessage(assignedAgent), initialTaskMessage, aiResponse],
        participantId: assignedAgent.id,
        taskId: task.id,
      };

      // Add the new conversation and make it selected
      setConversations(prevConversations => [
        newConversation,
        ...prevConversations.map(conv => ({ ...conv, isSelected: false })),
      ]);
    }

    // Switch to conversations tab
    setCurrentTab('conversations');
  };

  return (
    <div
      ref={chatContainerRef}
      className="flex h-[90vh] bg-gray-100 overflow-hidden fixed inset-0 z-50 flex items-center justify-center"
      onMouseDown={handleMouseDown}
    >
      <div
        className="bg-white rounded-lg shadow-2xl border border-gray-200 w-[min(1200px,90vw)] h-[min(800px,90vh)] flex overflow-hidden"
        style={{
          position: 'relative',
          transform: `translate(${Math.max(0, Math.min(position.x, window.innerWidth - 600))}px, ${Math.max(0, Math.min(position.y, window.innerHeight - 400))}px)`,
        }}
      >
        {/* Left sidebar */}
        <div className="w-full sm:w-80 md:w-96 bg-white border-r border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-5 border-b border-gray-200">
            <h2 className="text-2xl font-semibold">EVA Assistant</h2>

            {/* Tab navigation */}
            <div className="flex mt-4 border-b">
              <button
                className={`px-5 py-3 text-base ${currentTab === 'conversations' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setCurrentTab('conversations')}
              >
                Conversations
              </button>
              <button
                className={`px-5 py-3 text-base ${currentTab === 'tasks' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                onClick={() => setCurrentTab('tasks')}
              >
                Tasks
              </button>
            </div>

            <div className="mt-3">
              <input
                type="text"
                placeholder={
                  currentTab === 'conversations' ? 'Search conversations...' : 'Search tasks...'
                }
                className="w-full p-3 text-base border border-gray-300 rounded-md"
              />
            </div>
          </div>

          {currentTab === 'conversations' ? (
            <div className="p-4">
              <div className="font-medium text-gray-500 uppercase text-xs mb-2">TODAY</div>
              <div className="space-y-3">
                {conversations.slice(0, 5).map(conversation => (
                  <div
                    key={conversation.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors ${
                      conversation.isSelected
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => selectConversation(conversation.id)}
                  >
                    <div className="font-medium flex items-center">
                      {conversation.taskId && (
                        <span className="mr-2 px-1.5 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-md">
                          Task
                        </span>
                      )}
                      {conversation.title}
                    </div>
                    <div className="text-sm text-gray-500 truncate">{conversation.preview}</div>
                  </div>
                ))}
              </div>

              <div className="font-medium text-gray-500 uppercase text-xs mt-6 mb-2">YESTERDAY</div>
              <div className="space-y-3">
                <div
                  className="p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                  onClick={() => selectConversation('conv-6')}
                >
                  <div className="font-medium">Compliance Check</div>
                  <div className="text-sm text-gray-500 truncate">
                    Regulatory compliance verification...
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="font-medium text-gray-500 uppercase text-xs">AI TASKS</div>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="px-2 py-1 bg-blue-50 text-blue-600 rounded-md text-xs"
                >
                  New Task
                </button>
              </div>

              {tasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-3xl mb-2">📝</div>
                  <div>No tasks created yet</div>
                  <button
                    onClick={() => setShowTaskModal(true)}
                    className="mt-3 px-3 py-1.5 bg-blue-500 text-white rounded-md text-sm"
                  >
                    Create Your First Task
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.map(task => (
                    <div
                      key={task.id}
                      className="p-3 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="font-medium">{task.title}</div>
                        <div
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-800'
                              : task.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </div>
                      </div>

                      <div className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {task.description}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1">
                        {task.assignedTo.map(agentId => {
                          const agent = participants.find(p => p.id === agentId);
                          return agent ? (
                            <div
                              key={agentId}
                              className="flex items-center bg-gray-100 px-2 py-0.5 rounded-full text-xs"
                            >
                              <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                              {agent.fullName}
                            </div>
                          ) : null;
                        })}

                        {task.humanAssignees &&
                          task.humanAssignees.map(human => (
                            <div
                              key={human.id}
                              className="flex items-center bg-gray-100 px-2 py-0.5 rounded-full text-xs"
                            >
                              <span
                                className={`w-3 h-3 rounded-full ${human.type === 'internal' ? 'bg-green-500' : 'bg-orange-500'} mr-1`}
                              ></span>
                              {human.name}
                            </div>
                          ))}
                      </div>

                      <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
                        <div className="text-xs text-gray-500">
                          Created {new Date(task.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex space-x-1">
                          <button
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            onClick={e => {
                              e.stopPropagation();
                              openTaskConversation(task);
                            }}
                            title="Discuss this task"
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
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                          </button>
                          <button className="p-1 text-gray-600 hover:bg-gray-50 rounded">
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
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main chat area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-gray-200 p-4 flex items-center justify-between chat-header cursor-move">
            <div className="flex items-center">
              <button className="text-gray-500 mr-4 md:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-semibold">EVA Assistant</h1>
            </div>
            <div className="flex items-center">
              <div className="mx-2 flex items-center">
                <span className="font-medium mr-2">{conversationAgent.fullName}</span>
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Add close button */}
              <button
                onClick={onClose}
                className="ml-2 p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                aria-label="Close chat"
              >
                <svg
                  className="h-5 w-5 text-gray-500"
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
            </div>
          </div>

          <div className="p-4 text-sm text-gray-600">
            <div className="flex justify-between items-center">
              <div>
                {activeConversation.taskId ? (
                  <span className="flex items-center">
                    <span className="mr-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-md">
                      Task Conversation
                    </span>
                    {tasks.find(t => t.id === activeConversation.taskId)?.title}
                  </span>
                ) : (
                  'New Chat For Lead Vision AI'
                )}
              </div>
              <button
                onClick={createNewConversation}
                className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md text-sm flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
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
                New Chat / Task
              </button>
            </div>
          </div>

          {/* Chat participants */}
          <div className="flex px-4 py-2 overflow-x-auto">
            {participants.map(participant => (
              <div
                key={participant.id}
                className={`flex flex-col items-center mr-4 cursor-pointer transition-all duration-200 ${selectedAgentId === participant.id ? 'transform scale-110' : 'hover:scale-105'}`}
                onClick={() => handleSelectParticipant(participant)}
              >
                <div
                  className={`w-10 h-10 rounded-full ${selectedAgentId === participant.id ? 'ring-2 ring-blue-500' : ''} bg-blue-100 flex items-center justify-center text-blue-600 overflow-hidden`}
                >
                  {participant.avatar ? (
                    <img
                      src={participant.avatar}
                      alt={participant.fullName}
                      className="w-full h-full object-cover"
                      onError={e => {
                        // If image fails to load, show the first letter of the name
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).parentElement!.innerText =
                          participant.fullName.charAt(0);
                      }}
                    />
                  ) : (
                    participant.fullName.charAt(0)
                  )}
                </div>
                <div
                  className="text-xs mt-1 max-w-[80px] text-center truncate"
                  title={participant.fullName}
                >
                  {participant.fullName}
                </div>
              </div>
            ))}

            {/* Create Custom Agent button - ENLARGED */}
            <div
              className="flex flex-col items-center mr-4 cursor-pointer hover:scale-105 transition-all duration-200 ml-2"
              onClick={onCreateCustomAgent}
            >
              <div className="w-14 h-14 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white shadow-md hover:shadow-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
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
              <div className="text-sm font-medium mt-1 text-blue-600">Create Custom AI</div>
            </div>
          </div>

          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.sender.id === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender.id === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white border border-gray-200'
                  }`}
                >
                  {message.text}
                  <div
                    className={`mt-1 text-xs ${
                      message.sender.id === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {new Intl.DateTimeFormat('en-US', {
                      hour: 'numeric',
                      minute: 'numeric',
                      hour12: true,
                    }).format(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input and suggested prompts section */}
          <div className="p-5 border-t border-gray-200 bg-white">
            <div className="flex flex-col">
              <div className="flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="flex-1 p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isProcessing}
                  className={`px-6 py-4 rounded-r-lg text-white font-medium ${
                    inputValue.trim() && !isProcessing
                      ? 'bg-blue-600 hover:bg-blue-700'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
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
              </div>

              {/* Suggested prompts section */}
              {suggestedPrompts.length > 0 && !isProcessing && (
                <div className="mt-3">
                  <p className="text-sm text-gray-500 mb-2">Suggested next prompts:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(prompt)}
                        className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto mx-4">
            <h2 className="text-xl font-semibold mb-4">Create New AI Task</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={taskInput.title}
                onChange={e => handleTaskInputChange('title', e.target.value)}
                placeholder="Enter task title"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                value={taskInput.description}
                onChange={e => handleTaskInputChange('description', e.target.value)}
                placeholder="Describe the task..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Assignee Type</label>
              <div className="flex space-x-2 mb-2">
                <button
                  type="button"
                  className={`px-3 py-1 rounded ${assigneeType === 'ai' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setAssigneeType('ai')}
                >
                  AI Agent
                </button>
                <button
                  type="button"
                  className={`px-3 py-1 rounded ${assigneeType === 'human' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                  onClick={() => setAssigneeType('human')}
                >
                  Human User
                </button>
              </div>

              {assigneeType === 'ai' ? (
                <div className="grid grid-cols-3 gap-2 max-h-[150px] overflow-y-auto">
                  {participants.map(participant => (
                    <div key={participant.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`assign-${participant.id}`}
                        checked={taskInput.assignedTo.includes(participant.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            handleTaskInputChange('assignedTo', [
                              ...taskInput.assignedTo,
                              participant.id,
                            ]);
                          } else {
                            handleTaskInputChange(
                              'assignedTo',
                              taskInput.assignedTo.filter(id => id !== participant.id)
                            );
                          }
                        }}
                        className="h-4 w-4 text-blue-600"
                      />
                      <label htmlFor={`assign-${participant.id}`} className="text-sm">
                        {participant.fullName}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <div className="flex space-x-2 mb-2">
                    <button
                      type="button"
                      className={`px-3 py-1 rounded ${userType === 'internal' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                      onClick={() => setUserType('internal')}
                    >
                      Internal Users
                    </button>
                    <button
                      type="button"
                      className={`px-3 py-1 rounded ${userType === 'external' ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                      onClick={() => setUserType('external')}
                    >
                      External Users
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-2 max-h-[150px] overflow-y-auto border border-gray-200 rounded-md p-2">
                    {(userType === 'internal' ? internalUsers : externalUsers).map(user => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-2 p-1 hover:bg-gray-50 rounded"
                      >
                        <input
                          type="checkbox"
                          id={`assign-${user.id}`}
                          checked={taskInput.humanAssignees.some(a => a.id === user.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              handleTaskInputChange('humanAssignees', [
                                ...taskInput.humanAssignees,
                                user,
                              ]);
                            } else {
                              handleTaskInputChange(
                                'humanAssignees',
                                taskInput.humanAssignees.filter(a => a.id !== user.id)
                              );
                            }
                          }}
                          className="h-4 w-4 text-blue-600"
                        />
                        <div>
                          <label htmlFor={`assign-${user.id}`} className="text-sm font-medium">
                            {user.name}
                          </label>
                          <div className="text-xs text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={taskInput.priority}
                onChange={e => handleTaskInputChange('priority', e.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createTask}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EVAAssistantChat;
