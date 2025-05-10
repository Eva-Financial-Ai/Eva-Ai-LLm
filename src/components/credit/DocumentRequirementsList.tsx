import React, { useState, useEffect, useCallback } from 'react';
import {
  DocumentRequirement,
  DocumentRequirementsService,
  ApplicationType,
} from '../../services/DocumentRequirements';

interface DocumentRequirementsListProps {
  applicationType: ApplicationType;
  onDocumentStatusChange?: (requirements: DocumentRequirement[]) => void;
}

const DocumentRequirementsList: React.FC<DocumentRequirementsListProps> = ({
  applicationType,
  onDocumentStatusChange,
}) => {
  const [documentRequirements, setDocumentRequirements] = useState<DocumentRequirement[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<DocumentRequirement | null>(null);

  // Load document requirements when application type changes
  useEffect(() => {
    if (applicationType) {
      const requirements = DocumentRequirementsService.getRequiredDocuments(applicationType);
      setDocumentRequirements(requirements);
      onDocumentStatusChange?.(requirements);
    }
  }, [applicationType, onDocumentStatusChange]);

  // Handle document upload request
  const handleRequestUpload = (document: DocumentRequirement) => {
    setCurrentDocument(document);
    setUploadModalOpen(true);
  };

  // Handle document upload completion
  const handleUploadComplete = useCallback(
    (documentId: string, fileId: string) => {
      const updatedRequirements = DocumentRequirementsService.updateDocumentStatus(
        documentRequirements,
        documentId,
        'uploaded',
        fileId
      );

      setDocumentRequirements(updatedRequirements);
      onDocumentStatusChange?.(updatedRequirements);
      setUploadModalOpen(false);
      setCurrentDocument(null);
    },
    [documentRequirements, onDocumentStatusChange]
  );

  // Get all unique categories
  const categories = React.useMemo(() => {
    const categorySet = new Set<string>();
    categorySet.add('all');

    documentRequirements.forEach(doc => {
      categorySet.add(doc.category);
    });

    return Array.from(categorySet);
  }, [documentRequirements]);

  // Filter documents by selected category
  const filteredRequirements = React.useMemo(() => {
    if (activeCategory === 'all') {
      return documentRequirements;
    }
    return documentRequirements.filter(doc => doc.category === activeCategory);
  }, [documentRequirements, activeCategory]);

  // Calculate document completion progress
  const progress = DocumentRequirementsService.getDocumentProgress(documentRequirements);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Required Documents</h3>
          <div className="flex items-center">
            <div className="mr-2 text-sm font-medium text-gray-700">{progress}% Complete</div>
            <div className="w-32 bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          Upload all required documents to proceed with your application
        </p>
      </div>

      {/* Document Categories */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto py-3 px-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`whitespace-nowrap px-3 py-1.5 mr-2 text-sm font-medium rounded-md ${
                activeCategory === category
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Document List */}
      <div className="p-4">
        <ul className="divide-y divide-gray-200">
          {filteredRequirements.map(doc => (
            <li key={doc.id} className="py-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    {doc.required && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-800">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{doc.description}</p>
                  <p className="mt-1 text-xs text-gray-500">
                    Accepted formats: {doc.fileTypes.map(type => type.toUpperCase()).join(', ')}
                  </p>
                </div>
                <div className="ml-4">
                  {doc.status === 'pending' ? (
                    <button
                      onClick={() => handleRequestUpload(doc)}
                      className="px-3 py-1.5 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                    >
                      Upload
                    </button>
                  ) : doc.status === 'uploaded' ? (
                    <div className="flex items-center">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 mr-2">
                        Uploaded
                      </span>
                      <button
                        onClick={() => handleRequestUpload(doc)}
                        className="text-primary-600 hover:text-primary-800 text-sm"
                      >
                        Replace
                      </button>
                    </div>
                  ) : doc.status === 'verified' ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Verified
                    </span>
                  ) : (
                    <div className="flex items-center">
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 mr-2">
                        Rejected
                      </span>
                      <button
                        onClick={() => handleRequestUpload(doc)}
                        className="text-primary-600 hover:text-primary-800 text-sm"
                      >
                        Upload Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Document Upload Modal - In a real implementation, this would integrate with FilelockDriveApp */}
      {uploadModalOpen && currentDocument && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Upload {currentDocument.name}</h3>
              <button
                onClick={() => {
                  setUploadModalOpen(false);
                  setCurrentDocument(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-500 mb-4">{currentDocument.description}</p>

            <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4h-12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none"
                  >
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  {currentDocument.fileTypes.map(type => type.toUpperCase()).join(', ')}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setUploadModalOpen(false);
                  setCurrentDocument(null);
                }}
                className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  handleUploadComplete(currentDocument.id, `mock-file-id-${Date.now()}`)
                }
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentRequirementsList;
