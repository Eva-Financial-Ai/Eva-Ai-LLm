import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import Modal from '../common/Modal/Modal';
import { Input } from '../common/Input';
import Card from '../common/Card';
import { FormWrapper } from '../common/Form';

// Types for team members and tasks
interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar?: string;
  department?: string;
}

interface TaskDependency {
  id: string;
  name: string;
  completionStatus: 'pending' | 'completed' | 'blocked';
}

interface TaskResponse {
  id: string;
  status: 'accepted' | 'declined';
  reason?: string;
  timestamp: Date;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: TeamMember | null;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'new' | 'assigned' | 'in-progress' | 'completed' | 'declined';
  dependencies: TaskDependency[];
  responses: TaskResponse[];
  createdAt: Date;
  completedAt?: Date;
  createdBy: string;
  createdByAI: boolean;
}

// Mock team members data (would come from DB in a real implementation)
const mockTeamMembers: TeamMember[] = [
  { id: 'tm1', name: 'John Doe', role: 'Project Manager', email: 'john@example.com' },
  { id: 'tm2', name: 'Jane Smith', role: 'Lead Developer', email: 'jane@example.com' },
  { id: 'tm3', name: 'Mike Johnson', role: 'UI/UX Designer', email: 'mike@example.com' },
  { id: 'tm4', name: 'Sarah Williams', role: 'Data Scientist', email: 'sarah@example.com' },
  { id: 'tm5', name: 'Alex Brown', role: 'Backend Developer', email: 'alex@example.com' },
  { id: 'tm6', name: 'Eva Risk', role: 'AI Assistant', email: 'eva@example.com' },
];

// Mock tasks data (would come from DB in a real implementation)
const mockTasks: Task[] = [
  {
    id: 'task1',
    title: 'Implement search functionality',
    description:
      'Add search functionality to the dashboard that searches across all features and users',
    assignedTo: mockTeamMembers[1],
    priority: 'high',
    status: 'in-progress',
    dependencies: [],
    responses: [
      {
        id: 'resp1',
        status: 'accepted',
        timestamp: new Date(Date.now() - 86400000),
      },
    ],
    createdAt: new Date(Date.now() - 172800000),
    createdBy: 'tm1',
    createdByAI: false,
  },
  {
    id: 'task2',
    title: 'Design new logo options',
    description: 'Create 3-5 design options for the new company logo',
    assignedTo: mockTeamMembers[2],
    dueDate: new Date(Date.now() + 604800000),
    priority: 'medium',
    status: 'declined',
    dependencies: [],
    responses: [
      {
        id: 'resp2',
        status: 'declined',
        reason: 'Currently allocated to higher priority project',
        timestamp: new Date(Date.now() - 43200000),
      },
    ],
    createdAt: new Date(Date.now() - 86400000),
    createdBy: 'tm1',
    createdByAI: true,
  },
];

interface TaskManagementProps {
  onClose?: () => void;
}

const TaskManagement: React.FC<TaskManagementProps> = ({ onClose }) => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isRespondingToTask, setIsRespondingToTask] = useState(false);

  // Form state for creating a new task
  const [newTask, setNewTask] = useState<Partial<Task>>({
    title: '',
    description: '',
    assignedTo: null,
    priority: 'medium',
    dependencies: [],
    createdByAI: false,
  });

  // Response state for declining a task
  const [taskResponse, setTaskResponse] = useState({
    status: 'declined',
    reason: '',
  });

  const navigate = useNavigate();

  // Load tasks from DB (mock for now)
  useEffect(() => {
    // In a real implementation, we would fetch from API here
    // For now, we're using mock data initialized above
  }, []);

  // Create a new task
  const handleCreateTask = () => {
    if (!newTask.title || !newTask.description) {
      alert('Please provide a title and description for the task');
      return;
    }

    const createdTask: Task = {
      id: `task${tasks.length + 1}`,
      title: newTask.title || '',
      description: newTask.description || '',
      assignedTo: newTask.assignedTo || null,
      dueDate: newTask.dueDate,
      priority: newTask.priority as 'low' | 'medium' | 'high' | 'urgent',
      status: newTask.assignedTo ? 'assigned' : 'new',
      dependencies: newTask.dependencies || [],
      responses: [],
      createdAt: new Date(),
      createdBy: 'currentUser', // Would be from auth context in real app
      createdByAI: newTask.createdByAI || false,
    };

    setTasks([...tasks, createdTask]);
    setIsCreatingTask(false);
    setNewTask({
      title: '',
      description: '',
      assignedTo: null,
      priority: 'medium',
      dependencies: [],
      createdByAI: false,
    });
  };

  // Respond to a task (accept or decline)
  const handleTaskResponse = (task: Task) => {
    if (!selectedTask) return;

    const updatedTasks = tasks.map(t => {
      if (t.id === selectedTask.id) {
        const newStatus =
          taskResponse.status === 'accepted' ? ('in-progress' as const) : ('declined' as const);
        return {
          ...t,
          status: newStatus,
          responses: [
            ...t.responses,
            {
              id: `resp${t.responses.length + 1}`,
              status: taskResponse.status as 'accepted' | 'declined',
              reason: taskResponse.status === 'declined' ? taskResponse.reason : undefined,
              timestamp: new Date(),
            },
          ],
        };
      }
      return t;
    });

    setTasks(updatedTasks);
    setIsRespondingToTask(false);
    setSelectedTask(null);
    setTaskResponse({
      status: 'declined',
      reason: '',
    });
  };

  // Update task completion status
  const handleTaskCompletion = (taskId: string, isCompleted: boolean) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newStatus = isCompleted ? ('completed' as const) : ('in-progress' as const);
        return {
          ...task,
          status: newStatus,
          completedAt: isCompleted ? new Date() : undefined,
        };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  // Add team members (would connect to DB in real implementation)
  const handleAddTeamMember = (member: Partial<TeamMember>) => {
    if (!member.name || !member.role || !member.email) {
      alert('Please provide name, role and email for the team member');
      return;
    }

    const newMember: TeamMember = {
      id: `tm${teamMembers.length + 1}`,
      name: member.name,
      role: member.role,
      email: member.email,
      department: member.department,
    };

    setTeamMembers([...teamMembers, newMember]);
  };

  // Close the task management modal
  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-primary-600 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">AI Task Management</h2>
          <Button
            variant="outline"
            className="text-white hover:text-gray-200 border-none focus:ring-white"
            onClick={handleClose}
            aria-label="Close task management"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Tasks section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Tasks</h3>
              <Button variant="primary" onClick={() => setIsCreatingTask(true)}>
                Create New Task
              </Button>
            </div>

            {/* Task list */}
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <p className="text-gray-500">No tasks yet. Create your first task!</p>
              ) : (
                tasks.map(task => (
                  <Card
                    key={task.id}
                    variant="default"
                    className="hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between">
                      <h4 className="font-medium">{task.title}</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          task.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : task.status === 'declined'
                              ? 'bg-red-100 text-red-800'
                              : task.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {task.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Assigned to:</span>
                        {task.assignedTo ? (
                          <span className="text-sm font-medium">{task.assignedTo.name}</span>
                        ) : (
                          <span className="text-sm text-gray-400">Unassigned</span>
                        )}
                      </div>

                      <div className="flex space-x-2">
                        {task.status !== 'completed' && task.status !== 'declined' && (
                          <Button
                            variant="outline"
                            size="small"
                            className="text-green-600 hover:text-green-800"
                            onClick={() => handleTaskCompletion(task.id, true)}
                          >
                            Mark Complete
                          </Button>
                        )}

                        {task.status === 'assigned' && (
                          <Button
                            variant="outline"
                            size="small"
                            onClick={() => {
                              setSelectedTask(task);
                              setIsRespondingToTask(true);
                            }}
                          >
                            Respond
                          </Button>
                        )}
                      </div>
                    </div>

                    {task.dependencies.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm text-gray-500">Dependencies:</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {task.dependencies.map(dep => (
                            <span
                              key={dep.id}
                              className={`text-xs px-2 py-1 rounded-full ${
                                dep.completionStatus === 'completed'
                                  ? 'bg-green-100 text-green-800'
                                  : dep.completionStatus === 'blocked'
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}
                            >
                              {dep.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {task.createdByAI && (
                      <div className="mt-2">
                        <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                          Created by AI
                        </span>
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Team Members section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Team Members</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {teamMembers.map(member => (
                <Card
                  key={member.id}
                  variant="default"
                  padding="small"
                  className="hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-medium mr-3">
                      {member.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-medium">{member.name}</h4>
                      <p className="text-sm text-gray-600">{member.role}</p>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Add team member button */}
              <Button
                variant="outline"
                className="h-full border-dashed flex items-center justify-center text-gray-500 hover:text-gray-700 rounded-lg p-4"
                onClick={() => {
                  // In a real app, we would open a modal or form here
                  alert('This would open a form to add a new team member in a real application');
                }}
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Add Team Member
              </Button>
            </div>
          </div>
        </div>

        {/* Create Task Modal */}
        <Modal
          isOpen={isCreatingTask}
          onClose={() => setIsCreatingTask(false)}
          title="Create New Task"
        >
          <FormWrapper
            onSubmit={e => {
              e.preventDefault();
              handleCreateTask();
            }}
            onCancel={() => setIsCreatingTask(false)}
            submitText="Create Task"
          >
            <Input
              label="Title"
              value={newTask.title || ''}
              onChange={e => setNewTask({ ...newTask, title: e.target.value })}
              placeholder="Task title"
              required
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Task description"
                rows={3}
                value={newTask.description || ''}
                onChange={e => setNewTask({ ...newTask, description: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Assign To</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={newTask.assignedTo?.id || ''}
                onChange={e => {
                  const selectedMemberId = e.target.value;
                  const selectedMember = teamMembers.find(m => m.id === selectedMemberId) || null;
                  setNewTask({ ...newTask, assignedTo: selectedMember });
                }}
              >
                <option value="">-- Select Team Member --</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.role})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                value={newTask.priority || 'medium'}
                onChange={e => setNewTask({ ...newTask, priority: e.target.value as any })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Due Date (Optional)</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                onChange={e =>
                  setNewTask({
                    ...newTask,
                    dueDate: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="ai-created"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={newTask.createdByAI || false}
                onChange={e => setNewTask({ ...newTask, createdByAI: e.target.checked })}
              />
              <label htmlFor="ai-created" className="ml-2 block text-sm text-gray-900">
                Created by AI
              </label>
            </div>
          </FormWrapper>
        </Modal>

        {/* Task Response Modal */}
        <Modal
          isOpen={isRespondingToTask && !!selectedTask}
          onClose={() => setIsRespondingToTask(false)}
          title="Respond to Task"
        >
          {selectedTask && (
            <FormWrapper
              onSubmit={e => {
                e.preventDefault();
                handleTaskResponse(selectedTask);
              }}
              onCancel={() => setIsRespondingToTask(false)}
              submitText="Submit Response"
            >
              <p className="mb-4">{selectedTask.title}</p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Response</label>
                  <div className="flex space-x-4">
                    <Button
                      type="button"
                      variant={taskResponse.status === 'accepted' ? 'success' : 'outline'}
                      onClick={() => setTaskResponse({ ...taskResponse, status: 'accepted' })}
                    >
                      Accept
                    </Button>
                    <Button
                      type="button"
                      variant={taskResponse.status === 'declined' ? 'danger' : 'outline'}
                      onClick={() => setTaskResponse({ ...taskResponse, status: 'declined' })}
                    >
                      Decline
                    </Button>
                  </div>
                </div>

                {taskResponse.status === 'declined' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reason for declining
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Provide a reason for declining this task"
                      rows={3}
                      value={taskResponse.reason}
                      onChange={e => setTaskResponse({ ...taskResponse, reason: e.target.value })}
                    />
                  </div>
                )}
              </div>
            </FormWrapper>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default TaskManagement;
