import React, { useState, useEffect } from 'react';
import { AssetClass } from '../../types/AssetClassTypes';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'textarea' | 'file';
  required: boolean;
  options?: string[];
  tooltip?: string;
}

interface AssetFormProps {
  assetType: AssetClass;
  formData: any;
  onChange: (data: any) => void;
}

// Field configuration for each asset type
const assetFieldConfigurations: Record<AssetClass, FormField[]> = {
  [AssetClass.CASH_EQUIVALENTS]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'accountType', label: 'Account Type', type: 'select', options: ['Checking', 'Savings', 'Money Market', 'Certificate of Deposit'], required: true },
    { name: 'interestRate', label: 'Interest Rate (%)', type: 'number', required: false },
    { name: 'financialInstitution', label: 'Financial Institution', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
  ],
  [AssetClass.COMMERCIAL_PAPER_SECURED]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'issuer', label: 'Issuer', type: 'text', required: true },
    { name: 'maturityDate', label: 'Maturity Date', type: 'date', required: true },
    { name: 'creditRating', label: 'Credit Rating', type: 'select', options: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C', 'D'], required: true },
    { name: 'collateralType', label: 'Collateral Type', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
  ],
  [AssetClass.GOVERNMENT_BONDS]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'issuer', label: 'Issuing Government', type: 'text', required: true },
    { name: 'maturityDate', label: 'Maturity Date', type: 'date', required: true },
    { name: 'couponRate', label: 'Coupon Rate (%)', type: 'number', required: true },
    { name: 'yieldToMaturity', label: 'Yield to Maturity (%)', type: 'number', required: false },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
  ],
  [AssetClass.CORPORATE_BONDS]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'issuer', label: 'Issuing Company', type: 'text', required: true },
    { name: 'maturityDate', label: 'Maturity Date', type: 'date', required: true },
    { name: 'couponRate', label: 'Coupon Rate (%)', type: 'number', required: true },
    { name: 'creditRating', label: 'Credit Rating', type: 'select', options: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C', 'D'], required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
  ],
  [AssetClass.EQUITIES]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'ticker', label: 'Ticker Symbol', type: 'text', required: false },
    { name: 'exchange', label: 'Exchange', type: 'text', required: false },
    { name: 'shareClass', label: 'Share Class', type: 'select', options: ['Common', 'Preferred', 'Restricted', 'Other'], required: true },
    { name: 'numberOfShares', label: 'Number of Shares', type: 'number', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
  ],
  [AssetClass.MUTUAL_FUNDS]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'ticker', label: 'Ticker Symbol', type: 'text', required: false },
    { name: 'fundType', label: 'Fund Type', type: 'select', options: ['ETF', 'Index Fund', 'Mutual Fund', 'Money Market Fund', 'Other'], required: true },
    { name: 'expenseRatio', label: 'Expense Ratio (%)', type: 'number', required: false },
    { name: 'numberOfShares', label: 'Number of Shares/Units', type: 'number', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
  ],
  [AssetClass.REAL_ESTATE]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'propertyType', label: 'Property Type', type: 'select', options: ['Residential', 'Commercial', 'Industrial', 'Land', 'Mixed-Use', 'Other'], required: true },
    { name: 'address', label: 'Property Address', type: 'text', required: true },
    { name: 'squareFootage', label: 'Square Footage', type: 'number', required: false },
    { name: 'yearBuilt', label: 'Year Built', type: 'number', required: false },
    { name: 'rentalIncome', label: 'Annual Rental Income ($)', type: 'number', required: false },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
    { name: 'documents', label: 'Property Documents', type: 'file', required: false, tooltip: 'Upload deed, title, survey, or other property documents' },
  ],
  [AssetClass.COMMODITIES]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'commodityType', label: 'Commodity Type', type: 'select', options: ['Precious Metals', 'Energy', 'Agricultural', 'Industrial Metals', 'Other'], required: true },
    { name: 'quantity', label: 'Quantity', type: 'number', required: true },
    { name: 'unitOfMeasure', label: 'Unit of Measure', type: 'text', required: true },
    { name: 'storageLocation', label: 'Storage Location', type: 'text', required: false },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
  ],
  [AssetClass.CRYPTO]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'cryptoType', label: 'Cryptocurrency Type', type: 'text', required: true },
    { name: 'ticker', label: 'Ticker Symbol', type: 'text', required: true },
    { name: 'quantity', label: 'Quantity/Amount', type: 'number', required: true },
    { name: 'walletAddress', label: 'Wallet Address', type: 'text', required: false },
    { name: 'blockchain', label: 'Blockchain', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
  ],
  [AssetClass.DERIVATIVES]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'derivativeType', label: 'Derivative Type', type: 'select', options: ['Option', 'Future', 'Forward', 'Swap', 'Other'], required: true },
    { name: 'underlyingAsset', label: 'Underlying Asset', type: 'text', required: true },
    { name: 'expirationDate', label: 'Expiration Date', type: 'date', required: true },
    { name: 'contractSize', label: 'Contract Size', type: 'number', required: false },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
  ],
  [AssetClass.PRIVATE_EQUITY]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'companyName', label: 'Company/Fund Name', type: 'text', required: true },
    { name: 'ownershipPercentage', label: 'Ownership Percentage (%)', type: 'number', required: true },
    { name: 'investmentDate', label: 'Investment Date', type: 'date', required: true },
    { name: 'industryType', label: 'Industry', type: 'text', required: false },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
    { name: 'documents', label: 'Investment Documents', type: 'file', required: false },
  ],
  [AssetClass.FOREX]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'currencyPair', label: 'Currency Pair', type: 'text', required: true },
    { name: 'amount', label: 'Amount', type: 'number', required: true },
    { name: 'exchangeRate', label: 'Exchange Rate', type: 'number', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
  ],
  [AssetClass.EQUIPMENT]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'equipmentType', label: 'Equipment Type', type: 'text', required: true },
    { name: 'manufacturer', label: 'Manufacturer', type: 'text', required: true },
    { name: 'model', label: 'Model', type: 'text', required: false },
    { name: 'serialNumber', label: 'Serial Number', type: 'text', required: false },
    { name: 'purchaseDate', label: 'Purchase Date', type: 'date', required: false },
    { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Excellent', 'Good', 'Fair', 'Poor'], required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
    { name: 'documents', label: 'Equipment Documentation', type: 'file', required: false },
  ],
  [AssetClass.VEHICLES]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'vehicleType', label: 'Vehicle Type', type: 'select', options: ['Car', 'Truck', 'Aircraft', 'Boat', 'Heavy Equipment', 'Other'], required: true },
    { name: 'make', label: 'Make', type: 'text', required: true },
    { name: 'model', label: 'Model', type: 'text', required: true },
    { name: 'year', label: 'Year', type: 'number', required: true },
    { name: 'vin', label: 'VIN/Serial Number', type: 'text', required: false },
    { name: 'mileage', label: 'Mileage/Hours', type: 'number', required: false },
    { name: 'condition', label: 'Condition', type: 'select', options: ['New', 'Excellent', 'Good', 'Fair', 'Poor'], required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
    { name: 'documents', label: 'Vehicle Documentation', type: 'file', required: false },
  ],
  [AssetClass.UNSECURED_COMMERCIAL_PAPER]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'issuer', label: 'Issuer', type: 'text', required: true },
    { name: 'maturityDate', label: 'Maturity Date', type: 'date', required: true },
    { name: 'interestRate', label: 'Interest Rate (%)', type: 'number', required: true },
    { name: 'creditRating', label: 'Credit Rating', type: 'select', options: ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C', 'D'], required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
  ],
  [AssetClass.INTELLECTUAL_PROPERTY]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'ipType', label: 'IP Type', type: 'select', options: ['Patent', 'Trademark', 'Copyright', 'Trade Secret', 'Other'], required: true },
    { name: 'registrationNumber', label: 'Registration/Application Number', type: 'text', required: false },
    { name: 'filingDate', label: 'Filing Date', type: 'date', required: false },
    { name: 'expirationDate', label: 'Expiration Date', type: 'date', required: false },
    { name: 'jurisdiction', label: 'Jurisdiction', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
    { name: 'documents', label: 'IP Documentation', type: 'file', required: false },
  ],
  [AssetClass.DIGITAL_ASSETS]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'digitalAssetType', label: 'Digital Asset Type', type: 'select', options: ['Domain Name', 'NFT', 'Digital Content', 'Software', 'Other'], required: true },
    { name: 'platform', label: 'Platform/Marketplace', type: 'text', required: false },
    { name: 'identifier', label: 'Unique Identifier', type: 'text', required: false },
    { name: 'creationDate', label: 'Creation Date', type: 'date', required: false },
    { name: 'description', label: 'Description', type: 'textarea', required: false },
  ],
  [AssetClass.OTHER]: [
    { name: 'name', label: 'Asset Name', type: 'text', required: true },
    { name: 'marketValue', label: 'Market Value ($)', type: 'number', required: true },
    { name: 'assetCategory', label: 'Asset Category', type: 'text', required: true },
    { name: 'acquisitionDate', label: 'Acquisition Date', type: 'date', required: false },
    { name: 'description', label: 'Description', type: 'textarea', required: true },
    { name: 'documents', label: 'Supporting Documentation', type: 'file', required: false },
  ],
};

const AssetForm: React.FC<AssetFormProps> = ({ assetType, formData, onChange }) => {
  const [localFormData, setLocalFormData] = useState(formData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});

  // Get fields for the selected asset type
  const fields = assetFieldConfigurations[assetType] || [];

  useEffect(() => {
    // Initialize form data with default values if not present
    const initialData = { ...formData };
    fields.forEach(field => {
      if (initialData[field.name] === undefined) {
        if (field.type === 'select' && field.options && field.options.length > 0) {
          initialData[field.name] = field.options[0];
        } else if (field.type === 'number') {
          initialData[field.name] = 0;
        } else if (field.type === 'text' || field.type === 'textarea') {
          initialData[field.name] = '';
        }
      }
    });
    setLocalFormData(initialData);
  }, [assetType, fields, formData]);

  const validateField = (name: string, value: any): string => {
    const field = fields.find(f => f.name === name);
    if (!field) return '';

    if (field.required && (value === undefined || value === null || value === '')) {
      return `${field.label} is required`;
    }

    if (field.type === 'number' && isNaN(Number(value))) {
      return `${field.label} must be a number`;
    }

    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    const newValue = type === 'number' ? parseFloat(value) || 0 : value;
    const error = validateField(name, newValue);

    setLocalFormData(prev => ({ ...prev, [name]: newValue }));
    setErrors(prev => ({ ...prev, [name]: error }));

    // Only update parent if no error
    if (!error) {
      onChange({ [name]: newValue });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    setUploadedFiles(prev => ({ ...prev, [fieldName]: fileList }));

    // Update form data with file names
    const fileNames = fileList.map(file => file.name);
    setLocalFormData(prev => ({ ...prev, [fieldName]: fileNames }));
    onChange({ [fieldName]: fileNames });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => {
          const commonProps = {
            id: field.name,
            name: field.name,
            required: field.required,
            className: `w-full px-3 py-2 border ${errors[field.name] ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500`,
          };

          // Skip documents field for special handling
          if (field.type === 'file') {
            return (
              <div key={field.name} className="col-span-1 md:col-span-2">
                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                  {field.tooltip && (
                    <span className="ml-1 cursor-help text-gray-400 hover:text-gray-600" title={field.tooltip}>
                      ⓘ
                    </span>
                  )}
                </label>
                <input
                  type="file"
                  id={field.name}
                  name={field.name}
                  onChange={(e) => handleFileChange(e, field.name)}
                  multiple
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                />
                {uploadedFiles[field.name]?.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Selected files:</p>
                    <ul className="text-xs text-gray-600 list-disc list-inside">
                      {uploadedFiles[field.name].map((file, index) => (
                        <li key={index}>{file.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {errors[field.name] && <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>}
              </div>
            );
          }

          return (
            <div key={field.name} className={field.type === 'textarea' ? 'col-span-1 md:col-span-2' : 'col-span-1'}>
              <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
                {field.tooltip && (
                  <span className="ml-1 cursor-help text-gray-400 hover:text-gray-600" title={field.tooltip}>
                    ⓘ
                  </span>
                )}
              </label>
              
              {field.type === 'text' && (
                <input
                  type="text"
                  value={localFormData[field.name] || ''}
                  onChange={handleChange}
                  {...commonProps}
                />
              )}
              
              {field.type === 'number' && (
                <input
                  type="number"
                  value={localFormData[field.name] || 0}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  {...commonProps}
                />
              )}
              
              {field.type === 'date' && (
                <input
                  type="date"
                  value={localFormData[field.name] || ''}
                  onChange={handleChange}
                  {...commonProps}
                />
              )}
              
              {field.type === 'select' && (
                <select
                  value={localFormData[field.name] || ''}
                  onChange={handleChange}
                  {...commonProps}
                >
                  {field.options?.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              
              {field.type === 'textarea' && (
                <textarea
                  value={localFormData[field.name] || ''}
                  onChange={handleChange}
                  rows={3}
                  {...commonProps}
                />
              )}
              
              {errors[field.name] && <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AssetForm; 