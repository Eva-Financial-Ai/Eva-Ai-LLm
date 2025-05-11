import React from 'react';
import { motion } from 'framer-motion';

interface AIDocumentAssistantProps {
  onImportFromCloud: () => void;
}

const AIDocumentAssistant: React.FC<AIDocumentAssistantProps> = ({ onImportFromCloud }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M14.243 5.757a6 6 0 10-.986 9.284 1 1 0 111.087 1.678A8 8 0 1118 10a3 3 0 01-4.8 2.401A4 4 0 1114 10a1 1 0 102 0c0-1.537-.586-3.07-1.757-4.243zM12 10a2 2 0 10-4 0 2 2 0 004 0z"
              clipRule="evenodd"
            />
          </svg>
          AI Document Assistant
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get help with document preparation and verification from EVA AI
        </p>
      </div>

      <div className="p-5">
        <div className="space-y-5">
          {/* Cloud Import Feature */}
          <motion.div
            className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100 relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
          >
            <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
              <svg className="h-full w-full" viewBox="0 0 100 100" fill="currentColor">
                <path d="M65.8,26.2c-0.5-6.5-5.9-11.6-12.5-11.6c-5.3,0-9.9,3.3-11.7,8c-1-0.4-2.2-0.6-3.3-0.6c-5.2,0-9.3,4.2-9.3,9.3 c0,0.4,0,0.7,0.1,1.1C24.9,34.5,22,39,22,44c0,7.7,6.2,14,14,14h30c7.7,0,14-6.2,14-14C80,36.7,74.3,30.7,65.8,26.2z M58,47 L45,47V34h13V47z" />
              </svg>
            </div>

            <h4 className="text-md font-medium text-indigo-800 mb-2">Import from Cloud Storage</h4>
            <p className="text-sm text-indigo-700 mb-3">
              Import documents directly from Google Drive, Microsoft OneDrive, or Apple iCloud.
              Connect securely using your single sign-on credentials.
            </p>

            <button
              onClick={onImportFromCloud}
              className="px-4 py-2 bg-white text-indigo-700 rounded-md text-sm font-medium shadow-sm border border-indigo-200 hover:bg-indigo-50 transition-colors"
            >
              Import Documents
              <svg className="ml-1 w-4 h-4 inline-block" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </motion.div>

          {/* Document Analysis */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="text-md font-medium text-gray-800 mb-2">Document Analysis</h4>
            <p className="text-sm text-gray-600 mb-3">
              EVA AI can analyze, summarize, and extract key information from your documents
              regardless of source.
            </p>

            <div className="flex flex-col space-y-2">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-500">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="ml-2 text-sm text-gray-600">Summarize lengthy documents</span>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-500">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="ml-2 text-sm text-gray-600">Extract key financial data</span>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-5 w-5 text-green-500">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="ml-2 text-sm text-gray-600">Validate document completeness</span>
              </div>
            </div>
          </div>

          {/* Conversation Feature */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h4 className="text-md font-medium text-gray-800 mb-2">Chat with Your Documents</h4>
            <p className="text-sm text-gray-600 mb-1">
              Have a conversation with EVA about any document in your FileLock drive:
            </p>

            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 mt-2">
              <div className="flex">
                <div className="h-6 w-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-medium">
                  E
                </div>
                <div className="ml-2 text-xs text-gray-700 bg-white p-2 rounded-md shadow-sm">
                  I can help you understand the details of any document, including those imported
                  from cloud storage.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDocumentAssistant;
