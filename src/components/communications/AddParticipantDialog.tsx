import React, { useState } from 'react';

interface AddParticipantDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (email: string) => void;
}

const AddParticipantDialog: React.FC<AddParticipantDialogProps> = ({ isOpen, onClose, onAdd }) => {
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (email.trim()) {
      onAdd(email.trim());
      setEmail('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6">
        <h2 className="text-lg font-medium mb-4">Add Participant</h2>
        <input
          type="email"
          placeholder="Enter participant email"
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-md text-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddParticipantDialog;
