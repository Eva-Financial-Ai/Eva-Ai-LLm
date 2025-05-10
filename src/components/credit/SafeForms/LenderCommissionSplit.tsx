import React, { useState } from 'react';

interface LenderCommissionSplitProps {
  onSubmit: (data: any) => void;
  onSave: (data: any) => void;
}

const LenderCommissionSplit: React.FC<LenderCommissionSplitProps> = ({ onSubmit, onSave }) => {
  const [participants, setParticipants] = useState([
    { name: '', role: '', percentage: '', institutionName: '', email: '' },
  ]);

  const addParticipant = () => {
    setParticipants([
      ...participants,
      { name: '', role: '', percentage: '', institutionName: '', email: '' },
    ]);
  };

  const removeParticipant = (index: number) => {
    const updated = [...participants];
    updated.splice(index, 1);
    setParticipants(updated);
  };

  const updateParticipant = (index: number, field: string, value: string) => {
    const updated = [...participants];
    updated[index] = { ...updated[index], [field]: value };
    setParticipants(updated);
  };

  const calculateTotalPercentage = () => {
    return participants.reduce((total, participant) => {
      const percentage = parseFloat(participant.percentage) || 0;
      return total + percentage;
    }, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Lender Commission Split</h2>
      <p className="text-sm text-gray-600 mb-6">
        Document how lender commissions should be divided among multiple participating institutions
        in syndicated loans.
      </p>

      <form>
        {/* Deal Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">Deal Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deal/Loan Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Deal or Loan Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deal/Loan Number
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Deal or Loan ID"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Borrower Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Primary Borrower Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Amount</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. $1,000,000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loan Type</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Loan Type</option>
                <option value="commercial">Commercial Real Estate</option>
                <option value="business">Business/SBA</option>
                <option value="construction">Construction</option>
                <option value="syndicated">Syndicated</option>
                <option value="bridge">Bridge</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interest Structure
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Interest Structure</option>
                <option value="fixed">Fixed</option>
                <option value="variable">Variable</option>
                <option value="hybrid">Hybrid</option>
                <option value="stepped">Stepped</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lead Lender Information */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">
            Lead Lender Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution Name
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Lead Lender Institution Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Institution Type
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Institution Type</option>
                <option value="bank">Commercial Bank</option>
                <option value="credit_union">Credit Union</option>
                <option value="cdfi">CDFI</option>
                <option value="private">Private Lender</option>
                <option value="fund">Investment Fund</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Primary Contact
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Primary Contact Name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="contact@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="(XXX) XXX-XXXX"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lead Lender Share
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 50.0"
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Participating Lenders */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">
            Participating Lenders
          </h3>

          <div className="space-y-6">
            {participants.map((participant, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-medium text-gray-700">
                    Participating Lender #{index + 1}
                  </h4>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Participating Institution Name"
                      value={participant.institutionName}
                      onChange={e => updateParticipant(index, 'institutionName', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <select
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={participant.role}
                      onChange={e => updateParticipant(index, 'role', e.target.value)}
                      required
                    >
                      <option value="">Select Role</option>
                      <option value="participant">Participant Lender</option>
                      <option value="agent">Administrative Agent</option>
                      <option value="collateral">Collateral Agent</option>
                      <option value="documentation">Documentation Agent</option>
                      <option value="arranger">Arranger</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Primary Contact"
                      value={participant.name}
                      onChange={e => updateParticipant(index, 'name', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@example.com"
                      value={participant.email}
                      onChange={e => updateParticipant(index, 'email', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Participation Percentage
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g. 25.0"
                        value={participant.percentage}
                        onChange={e => updateParticipant(index, 'percentage', e.target.value)}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-500">%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={addParticipant}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Participating Lender
              </button>

              <div
                className={`text-sm font-medium ${calculateTotalPercentage() <= 100 ? 'text-green-600' : 'text-red-600'}`}
              >
                Total Participation: {calculateTotalPercentage()}%{' '}
                {calculateTotalPercentage() <= 100 ? '✓' : '(exceeds 100%)'}
              </div>
            </div>
          </div>
        </div>

        {/* Fee Structure */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">Fee Structure</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Origination Fee
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 1.0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Servicing Fee</label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 0.25"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Late Payment Fee
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 5.0"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-gray-500">%</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fee Distribution
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Select Distribution Method</option>
                <option value="lead_only">Lead Lender Only</option>
                <option value="pro_rata">Pro-Rata Based on Participation</option>
                <option value="custom">Custom Distribution</option>
              </select>
            </div>
          </div>
        </div>

        {/* Special Terms */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">Special Terms</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Any special terms or conditions regarding the participation agreement or fee distribution"
            ></textarea>
          </div>
        </div>

        {/* Certification */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-gray-700 mb-4 pb-2 border-b">Certification</h3>

          <div className="flex items-start mb-4">
            <input
              id="certification"
              type="checkbox"
              className="h-4 w-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label htmlFor="certification" className="ml-2 text-sm text-gray-700">
              I certify that all lenders listed above have agreed to this participation arrangement
              and that I am authorized to submit this information.
            </label>
          </div>

          <div className="flex items-start">
            <input
              id="agreement"
              type="checkbox"
              className="h-4 w-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <label htmlFor="agreement" className="ml-2 text-sm text-gray-700">
              I understand that this participation structure will be formalized in a participation
              agreement that all parties must sign before loan closing.
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => onSave(participants)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            onClick={e => {
              e.preventDefault();
              onSubmit(participants);
            }}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LenderCommissionSplit;
