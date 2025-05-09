import React from 'react';
import { AssetClass } from '../../types/AssetClassTypes';
import AssetInformationForm from '../asset/AssetInformationForm';

interface AssetFormProps {
  assetType: AssetClass;
  formData: any;
  onChange: (data: any) => void;
}

// Map from AssetClass to tangible/intangible property type
const assetClassToPropertyType = {
  [AssetClass.REAL_ESTATE]: 'Residential',
  [AssetClass.EQUIPMENT]: 'Commercial',
  [AssetClass.VEHICLES]: 'Manufacturing',
  [AssetClass.CORPORATE_BONDS]: 'Treasury',
  [AssetClass.EQUITIES]: 'Equity',
  [AssetClass.CRYPTO]: 'Intangible',
  [AssetClass.INTELLECTUAL_PROPERTY]: 'Intangible',
  [AssetClass.OTHER]: 'Other',
};

const AssetForm: React.FC<AssetFormProps> = ({ assetType, formData, onChange }) => {
  // Handle saving from the AssetInformationForm component
  const handleSave = (assetData: any) => {
    onChange({
      name: assetData.name,
      description: assetData.description,
      marketValue: assetData.marketValue,
      propertyType: assetData.propertyType,
      propertyAddress: assetData.propertyAddress,
      squareFootage: assetData.squareFootage,
      yearBuilt: assetData.yearBuilt,
      annualRentalIncome: assetData.annualRentalIncome,
      documents: assetData.documents,
    });
  };

  return (
    <AssetInformationForm
      initialData={{
        name: formData.name || '',
        marketValue: formData.marketValue || '',
        propertyType: formData.propertyType || assetClassToPropertyType[assetType] || '',
        propertyAddress: formData.propertyAddress || '',
        squareFootage: formData.squareFootage || '',
        yearBuilt: formData.yearBuilt || '',
        annualRentalIncome: formData.annualRentalIncome || '',
        description: formData.description || '',
        documents: formData.documents || [],
      }}
      onSave={handleSave}
      onCancel={() => {}} // This is needed for the interface but we don't want to cancel from here
    />
  );
};

export default AssetForm;
