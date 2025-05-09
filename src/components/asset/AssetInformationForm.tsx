import React, { useState, useEffect } from 'react';

interface AssetInformationFormProps {
  onSave: (assetData: AssetData) => void;
  onCancel: () => void;
  initialData?: Partial<AssetData>;
}

interface AssetData {
  name: string;
  marketValue: string | number;
  propertyType: string;
  propertyAddress: string;
  squareFootage: string | number;
  yearBuilt: string | number;
  annualRentalIncome: string | number;
  description: string;
  documents?: File[];
}

interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  fullAddress: string;
}

const AssetInformationForm: React.FC<AssetInformationFormProps> = ({
  onSave,
  onCancel,
  initialData,
}) => {
  const [assetData, setAssetData] = useState<AssetData>({
    name: initialData?.name || '',
    marketValue: initialData?.marketValue || '',
    propertyType: initialData?.propertyType || '',
    propertyAddress: initialData?.propertyAddress || '',
    squareFootage: initialData?.squareFootage || '',
    yearBuilt: initialData?.yearBuilt || '',
    annualRentalIncome: initialData?.annualRentalIncome || '',
    description: initialData?.description || '',
    documents: initialData?.documents || [],
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      street: '123 Downtown Ave',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      fullAddress: '123 Downtown Ave, New York, NY 10001',
    },
    {
      id: '2',
      street: '456 Manufacturing St',
      city: 'Chicago',
      state: 'IL',
      zip: '60007',
      fullAddress: '456 Manufacturing St, Chicago, IL 60007',
    },
    {
      id: '3',
      street: '789 Treasury Way',
      city: 'Boston',
      state: 'MA',
      zip: '02108',
      fullAddress: '789 Treasury Way, Boston, MA 02108',
    },
  ]);

  const [isTangibleAsset, setIsTangibleAsset] = useState(true);

  // Determine if this is a tangible asset type that requires an address
  useEffect(() => {
    const tangibleTypes = ['Residential', 'Commercial', 'Manufacturing', 'Treasury'];
    setIsTangibleAsset(tangibleTypes.includes(assetData.propertyType));
  }, [assetData.propertyType]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === 'marketValue' || name === 'annualRentalIncome') {
      // Only allow number inputs for currency fields (remove non-numeric characters except decimal point)
      const numericValue = value.replace(/[^0-9.]/g, '');
      setAssetData({ ...assetData, [name]: numericValue });
    } else if (name === 'squareFootage' || name === 'yearBuilt') {
      // Only allow integers
      const numericValue = value.replace(/[^0-9]/g, '');
      setAssetData({ ...assetData, [name]: numericValue });
    } else {
      setAssetData({ ...assetData, [name]: value });
    }
  };

  const formatCurrency = (value: string | number): string => {
    if (!value && value !== 0) return '';

    // Convert to number, round to 2 decimal places
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '';

    // Format with commas and 2 decimal places
    return numValue.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...newFiles]);
      setAssetData({ ...assetData, documents: [...(assetData.documents || []), ...newFiles] });
    }
  };

  const handleAddressSelect = (address: Address) => {
    setAssetData({ ...assetData, propertyAddress: address.fullAddress });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Convert string numeric values to numbers
    const formattedData = {
      ...assetData,
      marketValue: assetData.marketValue ? parseFloat(assetData.marketValue.toString()) : 0,
      squareFootage: assetData.squareFootage ? parseInt(assetData.squareFootage.toString()) : 0,
      yearBuilt: assetData.yearBuilt ? parseInt(assetData.yearBuilt.toString()) : 0,
      annualRentalIncome: assetData.annualRentalIncome
        ? parseFloat(assetData.annualRentalIncome.toString())
        : 0,
    };

    onSave(formattedData);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-center">Asset Information</h2>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name</label>
            <input
              type="text"
              name="name"
              value={assetData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Market Value ($)</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                $
              </span>
              <input
                type="text"
                name="marketValue"
                value={assetData.marketValue}
                onChange={handleInputChange}
                className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                placeholder="0.00"
              />
            </div>
            {assetData.marketValue && (
              <p className="text-xs text-gray-500 mt-1">${formatCurrency(assetData.marketValue)}</p>
            )}
          </div>

          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <select
              name="propertyType"
              value={assetData.propertyType}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select property type</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Manufacturing">Manufacturing/Industrial</option>
              <option value="Treasury">Treasury/Fixed Income</option>
              <option value="Equity">Equity/Stocks</option>
              <option value="Intangible">Intangible/IP</option>
            </select>
          </div>

          {isTangibleAsset && (
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Address
              </label>
              <select
                name="propertyAddress"
                value={assetData.propertyAddress}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select existing address</option>
                {addresses.map(address => (
                  <option key={address.id} value={address.fullAddress}>
                    {address.fullAddress}
                  </option>
                ))}
                <option value="custom">Enter custom address...</option>
              </select>

              {assetData.propertyAddress === 'custom' && (
                <input
                  type="text"
                  name="propertyAddress"
                  value=""
                  onChange={handleInputChange}
                  placeholder="Enter full address"
                  className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              )}
            </div>
          )}

          {(assetData.propertyType === 'Residential' ||
            assetData.propertyType === 'Commercial' ||
            assetData.propertyType === 'Manufacturing') && (
            <>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Square Footage
                </label>
                <input
                  type="text"
                  name="squareFootage"
                  value={assetData.squareFootage}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0"
                />
              </div>

              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Built</label>
                <input
                  type="text"
                  name="yearBuilt"
                  value={assetData.yearBuilt}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="YYYY"
                />
              </div>
            </>
          )}

          {(assetData.propertyType === 'Residential' ||
            assetData.propertyType === 'Commercial') && (
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Annual Rental Income ($)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  $
                </span>
                <input
                  type="text"
                  name="annualRentalIncome"
                  value={assetData.annualRentalIncome}
                  onChange={handleInputChange}
                  className="w-full p-2 pl-8 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="0.00"
                />
              </div>
              {assetData.annualRentalIncome && (
                <p className="text-xs text-gray-500 mt-1">
                  ${formatCurrency(assetData.annualRentalIncome)}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            name="description"
            value={assetData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Property Documents</label>
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
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF, PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">Selected files:</p>
              <ul className="mt-1 text-sm text-gray-500 list-disc list-inside">
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Save Asset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AssetInformationForm;
