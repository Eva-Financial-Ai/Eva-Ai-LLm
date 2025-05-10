import React, { useState, useRef } from 'react';

interface Asset {
  id: string;
  name: string;
  category: string;
  price: number;
  status: 'available' | 'pending' | 'sold' | 'financing';
  interest: number;
  description: string;
  imageUrl?: string;
  dateAdded: string;
  condition: 'new' | 'excellent' | 'good' | 'fair' | 'poor';
}

interface AssetInventoryManagerProps {
  initialAssets?: Asset[];
  onAssetUpdated?: (asset: Asset) => void;
  onAssetCreated?: (asset: Asset) => void;
  onBulkOperation?: (assetIds: string[], operation: string) => void;
}

const AssetInventoryManager: React.FC<AssetInventoryManagerProps> = ({
  initialAssets = [],
  onAssetUpdated,
  onAssetCreated,
  onBulkOperation,
}) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [filter, setFilter] = useState<{
    status: string;
    category: string;
    priceMin: string;
    priceMax: string;
    search: string;
  }>({
    status: '',
    category: '',
    priceMin: '',
    priceMax: '',
    search: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkOptions, setShowBulkOptions] = useState(false);
  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    name: '',
    category: '',
    price: 0,
    status: 'available',
    interest: 0,
    description: '',
    condition: 'new',
    dateAdded: new Date().toISOString().split('T')[0],
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(assets.map(asset => asset.category)));

  // Apply filters to assets
  const filteredAssets = assets.filter(asset => {
    // Status filter
    if (filter.status && asset.status !== filter.status) {
      return false;
    }

    // Category filter
    if (filter.category && asset.category !== filter.category) {
      return false;
    }

    // Price range filter
    if (filter.priceMin && asset.price < parseFloat(filter.priceMin)) {
      return false;
    }

    if (filter.priceMax && asset.price > parseFloat(filter.priceMax)) {
      return false;
    }

    // Search filter (name and description)
    if (
      filter.search &&
      !asset.name.toLowerCase().includes(filter.search.toLowerCase()) &&
      !asset.description?.toLowerCase().includes(filter.search.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Handle selecting all assets
  const handleSelectAll = () => {
    if (selectedAssets.length === filteredAssets.length) {
      setSelectedAssets([]);
    } else {
      setSelectedAssets(filteredAssets.map(asset => asset.id));
    }
  };

  // Handle selecting individual asset
  const handleSelectAsset = (assetId: string) => {
    if (selectedAssets.includes(assetId)) {
      setSelectedAssets(selectedAssets.filter(id => id !== assetId));
    } else {
      setSelectedAssets([...selectedAssets, assetId]);
    }
  };

  // Handle bulk operations
  const handleBulkOperation = (operation: string) => {
    if (selectedAssets.length === 0) return;

    if (operation === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${selectedAssets.length} assets?`)) {
        setAssets(assets.filter(asset => !selectedAssets.includes(asset.id)));
        setSelectedAssets([]);
        onBulkOperation?.(selectedAssets, operation);
      }
    } else {
      onBulkOperation?.(selectedAssets, operation);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    setFilter({
      status: '',
      category: '',
      priceMin: '',
      priceMax: '',
      search: '',
    });
  };

  // Handle new asset form input changes
  const handleNewAssetChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewAsset({
      ...newAsset,
      [name]: name === 'price' ? parseFloat(value) : value,
    });
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real application, you would upload the file to a server
    // For this demo, we'll create a local URL
    const imageUrl = URL.createObjectURL(file);
    setNewAsset({
      ...newAsset,
      imageUrl,
    });
  };

  // Handle form submission to add new asset
  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();

    const newId = `asset-${Date.now()}`;
    const createdAsset = {
      ...newAsset,
      id: newId,
      price: newAsset.price || 0,
      interest: newAsset.interest || 0,
      dateAdded: newAsset.dateAdded || new Date().toISOString().split('T')[0],
    } as Asset;

    setAssets([...assets, createdAsset]);
    onAssetCreated?.(createdAsset);

    // Reset form
    setNewAsset({
      name: '',
      category: '',
      price: 0,
      status: 'available',
      interest: 0,
      description: '',
      condition: 'new',
      dateAdded: new Date().toISOString().split('T')[0],
    });
    setShowAddForm(false);
  };

  // Handle updating asset status
  const handleStatusChange = (assetId: string, newStatus: Asset['status']) => {
    const updatedAssets = assets.map(asset =>
      asset.id === assetId ? { ...asset, status: newStatus } : asset
    );

    setAssets(updatedAssets);
    const updatedAsset = updatedAssets.find(a => a.id === assetId);
    if (updatedAsset) {
      onAssetUpdated?.(updatedAsset);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Heading and actions */}
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Asset Inventory Management</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Asset
          </button>
          <button
            onClick={() => setShowBulkOptions(!showBulkOptions)}
            className={`inline-flex items-center px-3 py-2 border text-sm leading-4 font-medium rounded-md 
              ${
                selectedAssets.length > 0
                  ? 'text-white bg-indigo-600 hover:bg-indigo-700 border-transparent'
                  : 'text-gray-700 bg-white hover:bg-gray-50 border-gray-300'
              } 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            disabled={selectedAssets.length === 0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Bulk Actions ({selectedAssets.length})
          </button>
        </div>
      </div>

      {/* Bulk options dropdown */}
      {showBulkOptions && selectedAssets.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <div className="flex space-x-2">
            <button
              onClick={() => handleBulkOperation('mark-available')}
              className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
            >
              Mark Available
            </button>
            <button
              onClick={() => handleBulkOperation('mark-pending')}
              className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-md text-sm hover:bg-yellow-200"
            >
              Mark Pending
            </button>
            <button
              onClick={() => handleBulkOperation('create-financing')}
              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200"
            >
              Create Financing
            </button>
            <button
              onClick={() => handleBulkOperation('export')}
              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200"
            >
              Export
            </button>
            <button
              onClick={() => handleBulkOperation('delete')}
              className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Filter section */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              name="search"
              value={filter.search}
              onChange={handleFilterChange}
              placeholder="Name or description"
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filter.category}
              onChange={handleFilterChange}
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filter.status}
              onChange={handleFilterChange}
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="financing">Financing</option>
              <option value="sold">Sold</option>
            </select>
          </div>
          <div>
            <label htmlFor="priceMin" className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <input
              type="number"
              id="priceMin"
              name="priceMin"
              value={filter.priceMin}
              onChange={handleFilterChange}
              placeholder="Min price"
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="priceMax" className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <input
              type="number"
              id="priceMax"
              name="priceMax"
              value={filter.priceMax}
              onChange={handleFilterChange}
              placeholder="Max price"
              className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleClearFilters}
            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Asset table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                    checked={
                      selectedAssets.length === filteredAssets.length && filteredAssets.length > 0
                    }
                    onChange={handleSelectAll}
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Asset
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Price
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Interest
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No assets found matching your filters. Try adjusting your search criteria.
                </td>
              </tr>
            ) : (
              filteredAssets.map(asset => (
                <tr
                  key={asset.id}
                  className={selectedAssets.includes(asset.id) ? 'bg-blue-50' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      checked={selectedAssets.includes(asset.id)}
                      onChange={() => handleSelectAsset(asset.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {asset.imageUrl ? (
                        <div className="flex-shrink-0 h-10 w-10 mr-4">
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={asset.imageUrl}
                            alt={asset.name}
                          />
                        </div>
                      ) : (
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-md mr-4 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                        <div className="text-xs text-gray-500">
                          Added: {new Date(asset.dateAdded).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {asset.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${asset.price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${asset.status === 'available' ? 'bg-green-100 text-green-800' : ''}
                      ${asset.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${asset.status === 'financing' ? 'bg-blue-100 text-blue-800' : ''}
                      ${asset.status === 'sold' ? 'bg-gray-100 text-gray-800' : ''}
                    `}
                    >
                      {asset.status.charAt(0).toUpperCase() + asset.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {asset.interest} {asset.interest === 1 ? 'inquiry' : 'inquiries'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <select
                        className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        value={asset.status}
                        onChange={e =>
                          handleStatusChange(asset.id, e.target.value as Asset['status'])
                        }
                      >
                        <option value="available">Available</option>
                        <option value="pending">Pending</option>
                        <option value="financing">Financing</option>
                        <option value="sold">Sold</option>
                      </select>
                      <button
                        className="text-primary-600 hover:text-primary-900"
                        title="View Details"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">1</span> to{' '}
              <span className="font-medium">{filteredAssets.length}</span> of{' '}
              <span className="font-medium">{filteredAssets.length}</span> results
            </p>
          </div>
          <div>
            <nav
              className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
              aria-label="Pagination"
            >
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                aria-current="page"
                className="z-10 bg-primary-50 border-primary-500 text-primary-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium"
              >
                1
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Add new asset modal */}
      {showAddForm && (
        <div className="fixed inset-0 overflow-y-auto z-10">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddAsset}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Asset</h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                            Asset Name *
                          </label>
                          <input
                            type="text"
                            name="name"
                            id="name"
                            required
                            value={newAsset.name}
                            onChange={handleNewAssetChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="category"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Category *
                          </label>
                          <input
                            type="text"
                            name="category"
                            id="category"
                            required
                            value={newAsset.category}
                            onChange={handleNewAssetChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            list="categories"
                          />
                          <datalist id="categories">
                            {categories.map(category => (
                              <option key={category} value={category} />
                            ))}
                          </datalist>
                        </div>
                        <div>
                          <label
                            htmlFor="price"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Price *
                          </label>
                          <div className="mt-1 relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <input
                              type="number"
                              name="price"
                              id="price"
                              required
                              value={newAsset.price}
                              onChange={handleNewAssetChange}
                              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div>
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Description
                          </label>
                          <textarea
                            id="description"
                            name="description"
                            rows={3}
                            value={newAsset.description}
                            onChange={handleNewAssetChange}
                            className="mt-1 focus:ring-primary-500 focus:border-primary-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="condition"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Condition
                          </label>
                          <select
                            id="condition"
                            name="condition"
                            value={newAsset.condition}
                            onChange={handleNewAssetChange}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
                          >
                            <option value="new">New</option>
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                            <option value="poor">Poor</option>
                          </select>
                        </div>
                        <div>
                          <label
                            htmlFor="image"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Asset Image
                          </label>
                          <div className="mt-1 flex items-center">
                            {newAsset.imageUrl ? (
                              <div className="relative">
                                <img
                                  src={newAsset.imageUrl}
                                  alt="Preview"
                                  className="h-24 w-24 object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                                  onClick={() => setNewAsset({ ...newAsset, imageUrl: undefined })}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 mr-2 -ml-1 text-gray-400"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                Upload
                              </button>
                            )}
                            <input
                              type="file"
                              className="hidden"
                              ref={fileInputRef}
                              onChange={handleImageUpload}
                              accept="image/*"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Add Asset
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetInventoryManager;
