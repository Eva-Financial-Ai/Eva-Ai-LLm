import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import TopNavigation from '../components/layout/TopNavigation';

// Equipment category options
const EQUIPMENT_CATEGORIES = [
  'Manufacturing', 'Construction', 'Transportation', 'Medical', 
  'Food Service', 'Logistics', 'Technology', 'Office', 'Agriculture',
  'Other'
];

// Condition options
const CONDITION_OPTIONS = [
  'New', 'Like New', 'Excellent', 'Good', 'Fair', 'Requires Repair'
];

interface AssetListingForm {
  equipmentName: string;
  description: string;
  category: string;
  condition: string;
  price: string;
  serialNumber: string;
  manufacturer: string;
  manufactureYear: string;
  photos: File[];
  financingAvailable: boolean;
  leaseAvailable: boolean;
}

const AssetListing: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Check if we're creating a new listing
  const isNewListing = location.state?.isNew || false;
  
  // Form state
  const [formData, setFormData] = useState<AssetListingForm>({
    equipmentName: '',
    description: '',
    category: '',
    condition: 'New',
    price: '',
    serialNumber: '',
    manufacturer: '',
    manufactureYear: new Date().getFullYear().toString(),
    photos: [],
    financingAvailable: true,
    leaseAvailable: true
  });
  
  // Validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([]);
  
  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    // Clear error when field is filled
    if (errors[name] && value.trim()) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle checkbox changes
  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  // Handle photo uploads
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const fileArray = Array.from(e.target.files);
      
      // Limit to 5 photos total
      const combinedPhotos = [...formData.photos, ...fileArray].slice(0, 5);
      setFormData(prev => ({ ...prev, photos: combinedPhotos }));
      
      // Create preview URLs
      const newPhotoUrls = combinedPhotos.map(file => URL.createObjectURL(file));
      setPhotoPreviewUrls(newPhotoUrls);
    }
  };
  
  // Remove a photo
  const handleRemovePhoto = (index: number) => {
    const updatedPhotos = [...formData.photos];
    updatedPhotos.splice(index, 1);
    setFormData(prev => ({ ...prev, photos: updatedPhotos }));
    
    // Update preview URLs
    const updatedPreviewUrls = [...photoPreviewUrls];
    URL.revokeObjectURL(updatedPreviewUrls[index]);
    updatedPreviewUrls.splice(index, 1);
    setPhotoPreviewUrls(updatedPreviewUrls);
  };
  
  // Validate the form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.equipmentName.trim()) {
      newErrors.equipmentName = 'Equipment name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSaving(true);
    
    try {
      // Mock API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send formData to the backend
      console.log('Listing saved:', formData);
      
      // Navigate to success page
      navigate('/dashboard', { state: { success: true, message: 'Equipment listed successfully!' } });
    } catch (error) {
      console.error('Error saving listing:', error);
      alert('There was an error saving your listing. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      photoPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [photoPreviewUrls]);
  
  return (
    <div className="bg-gray-100 min-h-screen">
      <TopNavigation title={isNewListing ? 'New Equipment Listing' : 'Edit Equipment Listing'} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {isNewListing ? 'List New Equipment for Sale' : 'Edit Equipment Listing'}
          </h1>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Equipment Details Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Equipment Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="equipmentName" className="block text-sm font-medium text-gray-700">
                      Equipment Name*
                    </label>
                    <input
                      type="text"
                      id="equipmentName"
                      name="equipmentName"
                      value={formData.equipmentName}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${errors.equipmentName ? 'border-red-500' : ''}`}
                    />
                    {errors.equipmentName && (
                      <p className="mt-1 text-sm text-red-600">{errors.equipmentName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category*
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${errors.category ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select a category</option>
                      {EQUIPMENT_CATEGORIES.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Price (USD)*
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="text"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className={`block w-full pl-7 pr-12 rounded-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${errors.price ? 'border-red-500' : ''}`}
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
                      Condition
                    </label>
                    <select
                      id="condition"
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    >
                      {CONDITION_OPTIONS.map(condition => (
                        <option key={condition} value={condition}>{condition}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700">
                      Manufacturer
                    </label>
                    <input
                      type="text"
                      id="manufacturer"
                      name="manufacturer"
                      value={formData.manufacturer}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="manufactureYear" className="block text-sm font-medium text-gray-700">
                      Year Manufactured
                    </label>
                    <input
                      type="number"
                      id="manufactureYear"
                      name="manufactureYear"
                      value={formData.manufactureYear}
                      onChange={handleChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="serialNumber" className="block text-sm font-medium text-gray-700">
                      Serial Number
                    </label>
                    <input
                      type="text"
                      id="serialNumber"
                      name="serialNumber"
                      value={formData.serialNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              
              {/* Description Section */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description*
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm ${errors.description ? 'border-red-500' : ''}`}
                    placeholder="Provide detailed information about the equipment including specifications, features, and condition"
                  />
                </div>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
              
              {/* Photos Section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Photos (Up to 5)</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {photoPreviewUrls.map((url, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={url} 
                        alt={`Equipment preview ${index+1}`} 
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <button 
                        type="button" 
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  
                  {formData.photos.length < 5 && (
                    <div className="h-24 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center">
                      <label htmlFor="photo-upload" className="cursor-pointer text-center px-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="mt-1 block text-xs font-medium text-gray-700">Add Photo</span>
                        <input 
                          id="photo-upload" 
                          name="photos" 
                          type="file" 
                          accept="image/*"
                          multiple 
                          onChange={handlePhotoUpload}
                          className="hidden" 
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Financing Options */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Financing Options</h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="financingAvailable"
                        name="financingAvailable"
                        type="checkbox"
                        checked={formData.financingAvailable}
                        onChange={handleCheckbox}
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="financingAvailable" className="font-medium text-gray-700">
                        Offer Financing Through EVA Network
                      </label>
                      <p className="text-gray-500">Allow buyers to apply for financing through our lending partners</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="leaseAvailable"
                        name="leaseAvailable"
                        type="checkbox"
                        checked={formData.leaseAvailable}
                        onChange={handleCheckbox}
                        className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="leaseAvailable" className="font-medium text-gray-700">
                        Available for Lease
                      </label>
                      <p className="text-gray-500">Make this equipment available for lease agreements</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      'Save Listing'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AssetListing; 