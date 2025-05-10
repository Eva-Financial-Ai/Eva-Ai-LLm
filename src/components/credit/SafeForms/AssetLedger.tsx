import React, { useState } from 'react';

interface AssetItem {
  id: string;
  assetName: string;
  assetType: string;
  purchaseDate: string;
  purchasePrice: number;
  currentValue: number;
  depreciation: number;
  location: string;
  serialNumber: string;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  notes: string;
}

interface AssetLedgerProps {
  onSubmit: (data: AssetItem[]) => void;
  onSave: (data: AssetItem[]) => void;
}

const AssetLedger: React.FC<AssetLedgerProps> = ({ onSubmit, onSave }) => {
  const [assetItems, setAssetItems] = useState<AssetItem[]>([
    {
      id: '1',
      assetName: '',
      assetType: '',
      purchaseDate: '',
      purchasePrice: 0,
      currentValue: 0,
      depreciation: 0,
      location: '',
      serialNumber: '',
      condition: 'Good',
      notes: '',
    },
  ]);

  const addAssetItem = () => {
    const newItem: AssetItem = {
      id: `${assetItems.length + 1}`,
      assetName: '',
      assetType: '',
      purchaseDate: '',
      purchasePrice: 0,
      currentValue: 0,
      depreciation: 0,
      location: '',
      serialNumber: '',
      condition: 'Good',
      notes: '',
    };
    setAssetItems([...assetItems, newItem]);
  };

  const removeAssetItem = (idToRemove: string) => {
    if (assetItems.length > 1) {
      setAssetItems(assetItems.filter(item => item.id !== idToRemove));
    }
  };

  const updateAssetItem = (id: string, field: keyof AssetItem, value: any) => {
    setAssetItems(assetItems.map(item => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const getTotalAssetValue = () => {
    return assetItems.reduce((sum, item) => sum + item.currentValue, 0);
  };

  const assetTypeOptions = [
    { value: 'equipment', label: 'Equipment' },
    { value: 'vehicle', label: 'Vehicle' },
    { value: 'furniture', label: 'Furniture' },
    { value: 'technology', label: 'Technology' },
    { value: 'property', label: 'Property' },
    { value: 'leasehold_improvement', label: 'Leasehold Improvement' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'intangible', label: 'Intangible Asset' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Asset Ledger</h2>

      <div className="mb-4">
        <p className="text-sm text-gray-700">
          Use this form to document all significant business assets. This helps establish collateral
          value and provides a comprehensive overview of your business assets.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Asset Name
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Asset Type
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Purchase Date
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Purchase Price
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Current Value
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Condition
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {assetItems.map(asset => (
              <tr key={asset.id}>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={asset.assetName}
                    onChange={e => updateAssetItem(asset.id, 'assetName', e.target.value)}
                    placeholder="Asset name"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <select
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={asset.assetType}
                    onChange={e => updateAssetItem(asset.id, 'assetType', e.target.value)}
                  >
                    <option value="">Select Type</option>
                    {assetTypeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={asset.purchaseDate}
                    onChange={e => updateAssetItem(asset.id, 'purchaseDate', e.target.value)}
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-xs">$</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-md pl-5 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={asset.purchasePrice || ''}
                      onChange={e =>
                        updateAssetItem(asset.id, 'purchasePrice', parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-xs">$</span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 rounded-md pl-5 px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={asset.currentValue || ''}
                      onChange={e =>
                        updateAssetItem(asset.id, 'currentValue', parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={asset.location}
                    onChange={e => updateAssetItem(asset.id, 'location', e.target.value)}
                    placeholder="Asset location"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <select
                    className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={asset.condition}
                    onChange={e =>
                      updateAssetItem(
                        asset.id,
                        'condition',
                        e.target.value as 'Excellent' | 'Good' | 'Fair' | 'Poor'
                      )
                    }
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => removeAssetItem(asset.id)}
                    className="text-red-600 hover:text-red-800"
                    disabled={assetItems.length === 1}
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50">
              <td colSpan={4} className="px-4 py-2 text-sm font-medium text-right">
                Total Asset Value
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                <div className="text-sm font-medium">${getTotalAssetValue().toFixed(2)}</div>
              </td>
              <td colSpan={3}></td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={addAssetItem}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          <span className="text-sm font-medium">Add Asset</span>
        </button>
      </div>

      {/* Asset Details Modal - Shown when clicking "Edit" on an asset */}
      <div className="hidden">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <h3 className="text-lg font-medium leading-6 text-gray-900">Asset Details</h3>

                <div className="mt-4 grid grid-cols-1 gap-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Asset Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Serial Number / VIN
                    </label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documentation Upload */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Asset Documentation (Optional)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
              >
                <span>Upload proof of ownership</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">
              Receipts, titles, registrations, photos (PDF, PNG, JPG up to 10MB each)
            </p>
          </div>
        </div>
      </div>

      {/* Certification */}
      <div className="mt-6">
        <div className="flex items-start">
          <input
            id="certification"
            type="checkbox"
            className="h-4 w-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            required
          />
          <label htmlFor="certification" className="ml-2 text-sm text-gray-700">
            I certify that the information provided in this asset ledger is true, accurate, and
            complete to the best of my knowledge. I understand that these assets may be used as
            collateral for the requested financing.
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => onSave(assetItems)}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Save as Draft
        </button>
        <button
          type="button"
          onClick={() => onSubmit(assetItems)}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AssetLedger;
