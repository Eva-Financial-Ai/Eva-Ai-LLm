import React, { useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Define the LegalDocument interface
interface LegalDocument {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  dateUploaded: string;
  documentType: string;
  expirationDate?: string;
  verified: boolean;
}

interface BusinessLegalDocumentsProps {
  applicationId: string;
  businessType?: string;
  initialDocuments?: LegalDocument[];
  onDocumentUpload?: (document: LegalDocument) => void;
  onDocumentDelete?: (documentId: string) => void;
}

const BusinessLegalDocuments: React.FC<BusinessLegalDocumentsProps> = ({
  applicationId,
  businessType = 'llc',
  initialDocuments = [],
  onDocumentUpload,
  onDocumentDelete,
}) => {
  const [documents, setDocuments] = useState<LegalDocument[]>(initialDocuments);
  const [documentType, setDocumentType] = useState('articles_of_organization');
  const [expirationDate, setExpirationDate] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Document types by business type
  const getDocumentTypes = () => {
    const commonTypes = [
      { value: 'business_license', label: 'Business License' },
      { value: 'tax_id_verification', label: 'Tax ID Verification (EIN Letter)' },
      { value: 'dba_certificate', label: 'DBA Certificate' },
      { value: 'business_insurance', label: 'Business Insurance' },
      { value: 'lease_agreement', label: 'Lease Agreement' },
    ];

    switch (businessType) {
      case 'llc':
        return [
          { value: 'articles_of_organization', label: 'Articles of Organization' },
          { value: 'operating_agreement', label: 'Operating Agreement' },
          ...commonTypes,
        ];
      case 'corporation':
        return [
          { value: 'articles_of_incorporation', label: 'Articles of Incorporation' },
          { value: 'bylaws', label: 'Corporate Bylaws' },
          { value: 'board_resolution', label: 'Board Resolution' },
          ...commonTypes,
        ];
      case 'partnership':
        return [{ value: 'partnership_agreement', label: 'Partnership Agreement' }, ...commonTypes];
      case 'sole_proprietorship':
        return [
          { value: 'fictitious_name_registration', label: 'Fictitious Name Registration' },
          ...commonTypes,
        ];
      default:
        return commonTypes;
    }
  };

  const documentTypes = getDocumentTypes();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real app, we would upload the files to a server
      // Here we're just creating an object with file info
      Array.from(e.target.files).forEach(file => {
        const newDocument: LegalDocument = {
          id: uuidv4(),
          fileName: file.name,
          fileUrl: URL.createObjectURL(file), // Create a local URL for preview
          fileSize: file.size,
          dateUploaded: new Date().toISOString(),
          documentType,
          expirationDate: expirationDate || undefined,
          verified: false,
        };

        setDocuments(prevDocuments => [...prevDocuments, newDocument]);

        if (onDocumentUpload) {
          onDocumentUpload(newDocument);
        }
      });

      // Reset fields after upload
      setExpirationDate('');

      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    setDocuments(prevDocuments => prevDocuments.filter(doc => doc.id !== documentId));

    if (onDocumentDelete) {
      onDocumentDelete(documentId);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getDocumentTypeLabel = (value: string) => {
    return documentTypes.find(type => type.value === value)?.label || value;
  };

  // Group documents by type
  const documentsByType = documents.reduce(
    (acc, doc) => {
      if (!acc[doc.documentType]) {
        acc[doc.documentType] = [];
      }
      acc[doc.documentType].push(doc);
      return acc;
    },
    {} as { [key: string]: LegalDocument[] }
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Upload Business Legal Documents</h3>
        <p className="text-sm text-gray-600 mb-4">
          Upload legal documents related to your business entity structure, licenses, and
          authorizations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="documentType">
              Document Type
            </label>
            <select
              id="documentType"
              value={documentType}
              onChange={e => setDocumentType(e.target.value)}
              className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="expirationDate"
            >
              Expiration Date (if applicable)
            </label>
            <input
              type="date"
              id="expirationDate"
              value={expirationDate}
              onChange={e => setExpirationDate(e.target.value)}
              className="block w-full rounded-md border border-gray-300 shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="border border-dashed border-gray-300 rounded-md p-6 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">Drag and drop files here, or click to browse</p>
          <p className="mt-1 text-xs text-gray-500">PDF, JPG, PNG, or DOC files up to 10MB</p>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            multiple
            onChange={handleFileUpload}
            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Upload Files
          </button>
        </div>
      </div>

      {Object.keys(documentsByType).length > 0 && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-medium text-gray-800 mb-4">Uploaded Business Documents</h3>

          {Object.entries(documentsByType).map(([type, docs]) => (
            <div key={type} className="mb-6">
              <h4 className="text-md font-medium text-gray-700 mb-2">
                {getDocumentTypeLabel(type)}
              </h4>
              <div className="overflow-hidden border border-gray-200 rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        File Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date Uploaded
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Expiration
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Size
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {docs.map(doc => (
                      <tr key={doc.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex items-center">
                            <svg
                              className="h-5 w-5 text-gray-400 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                            <span>{doc.fileName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(doc.dateUploaded).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {doc.expirationDate
                            ? new Date(doc.expirationDate).toLocaleDateString()
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatFileSize(doc.fileSize)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {doc.verified ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Verified
                            </span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Pending Verification
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => window.open(doc.fileUrl, '_blank')}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessLegalDocuments;
