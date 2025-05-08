import React, { useState } from 'react';
import { FileItem } from './FilelockDriveApp';

interface PDFEditorProps {
  file: FileItem;
  onSave: (file: FileItem) => void;
  onCancel: () => void;
}

const PDFEditor: React.FC<PDFEditorProps> = ({ file, onSave, onCancel }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10); // In a real app, get this from the PDF
  const [annotations, setAnnotations] = useState<Array<{
    id: string;
    type: 'highlight' | 'text' | 'drawing' | 'shape';
    content?: string;
    position: { page: number; x: number; y: number };
    dimensions?: { width: number; height: number };
    color: string;
    createdAt: string;
  }>>([
    {
      id: 'anno-1',
      type: 'highlight',
      position: { page: 1, x: 150, y: 200 },
      dimensions: { width: 300, height: 50 },
      color: 'rgba(255, 255, 0, 0.3)',
      createdAt: new Date().toISOString()
    },
    {
      id: 'anno-2',
      type: 'text',
      content: 'This needs revision',
      position: { page: 2, x: 250, y: 350 },
      color: 'rgba(255, 0, 0, 0.7)',
      createdAt: new Date().toISOString()
    }
  ]);
  
  const [activeToolbar, setActiveToolbar] = useState<'text' | 'draw' | 'shapes' | 'highlight' | null>(null);
  const [isAddingText, setIsAddingText] = useState(false);
  const [newTextPosition, setNewTextPosition] = useState<{ x: number; y: number } | null>(null);
  const [newTextContent, setNewTextContent] = useState('');
  const [selectedColor, setSelectedColor] = useState('#ff0000');
  
  // Navigation between pages
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Handle adding text annotation
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeToolbar === 'text') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setNewTextPosition({ x, y });
      setIsAddingText(true);
    }
  };
  
  const handleTextAdd = () => {
    if (newTextContent && newTextPosition) {
      const newAnnotation = {
        id: `anno-${Date.now()}`,
        type: 'text' as const,
        content: newTextContent,
        position: { page: currentPage, x: newTextPosition.x, y: newTextPosition.y },
        color: selectedColor,
        createdAt: new Date().toISOString()
      };
      
      setAnnotations([...annotations, newAnnotation]);
      setNewTextContent('');
      setNewTextPosition(null);
      setIsAddingText(false);
    }
  };
  
  // Remove annotation
  const handleRemoveAnnotation = (id: string) => {
    setAnnotations(annotations.filter(anno => anno.id !== id));
  };
  
  // Handle save
  const handleSave = () => {
    // In a real app, you would actually save the annotations to the PDF
    // Here we're just updating the file metadata
    const updatedFile = {
      ...file,
      lastModified: new Date().toISOString()
    };
    
    onSave(updatedFile);
  };
  
  // Filter annotations for current page
  const currentPageAnnotations = annotations.filter(anno => anno.position.page === currentPage);
  
  return (
    <div className="h-full flex flex-col">
      {/* Top toolbar */}
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={onCancel}
            className="inline-flex items-center px-2 py-1 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100"
          >
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Cancel
          </button>
          
          <h2 className="text-lg font-medium text-gray-900">Edit: {file.name}</h2>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleSave}
            className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </button>
        </div>
      </div>
      
      {/* Editing toolbar */}
      <div className="px-4 py-2 border-b border-gray-200 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveToolbar(activeToolbar === 'text' ? null : 'text')}
            className={`p-2 rounded-md ${
              activeToolbar === 'text' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Add Text"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 2h-3a2 2 0 00-2 2v12a2 2 0 002 2h3a2 2 0 002-2V4a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 6h.01" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h.01" />
            </svg>
          </button>
          
          <button
            onClick={() => setActiveToolbar(activeToolbar === 'draw' ? null : 'draw')}
            className={`p-2 rounded-md ${
              activeToolbar === 'draw' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Draw"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          
          <button
            onClick={() => setActiveToolbar(activeToolbar === 'shapes' ? null : 'shapes')}
            className={`p-2 rounded-md ${
              activeToolbar === 'shapes' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Add Shapes"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          
          <button
            onClick={() => setActiveToolbar(activeToolbar === 'highlight' ? null : 'highlight')}
            className={`p-2 rounded-md ${
              activeToolbar === 'highlight' ? 'bg-primary-100 text-primary-700' : 'hover:bg-gray-100 text-gray-700'
            }`}
            title="Highlight"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
        
        <div className="border-l border-gray-300 h-6"></div>
        
        <div className="flex items-center space-x-2">
          <div className="text-sm text-gray-700">Color:</div>
          {['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#000000'].map(color => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-6 h-6 rounded-full border ${selectedColor === color ? 'border-gray-800 border-2' : 'border-gray-300'}`}
              style={{ backgroundColor: color }}
              title={color}
            ></button>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto relative bg-gray-100">
        <div className="flex justify-center p-4">
          <div 
            className="bg-white rounded-lg shadow-md relative" 
            style={{ width: '8.5in', height: '11in' }}
            onClick={handleCanvasClick}
          >
            {/* Placeholder for PDF content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-500 mb-4">PDF Edit Mode - Page {currentPage} of {totalPages}</p>
                <img 
                  src={file.thumbnailUrl || "https://via.placeholder.com/600x800?text=PDF+Preview"} 
                  alt="PDF Preview" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
            
            {/* Render annotations */}
            {currentPageAnnotations.map(anno => {
              if (anno.type === 'highlight' && anno.dimensions) {
                return (
                  <div
                    key={anno.id}
                    className="absolute"
                    style={{
                      left: anno.position.x,
                      top: anno.position.y,
                      width: anno.dimensions.width,
                      height: anno.dimensions.height,
                      backgroundColor: anno.color,
                      position: 'absolute',
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Remove this highlight?')) {
                        handleRemoveAnnotation(anno.id);
                      }
                    }}
                  ></div>
                );
              } else if (anno.type === 'text') {
                return (
                  <div
                    key={anno.id}
                    className="absolute px-2 py-1 bg-white border border-gray-200 rounded shadow-sm"
                    style={{
                      left: anno.position.x,
                      top: anno.position.y,
                      color: anno.color,
                      cursor: 'pointer'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Remove this text annotation?')) {
                        handleRemoveAnnotation(anno.id);
                      }
                    }}
                  >
                    {anno.content}
                  </div>
                );
              }
              return null;
            })}
            
            {/* Text input for new annotation */}
            {isAddingText && newTextPosition && (
              <div
                className="absolute"
                style={{
                  left: newTextPosition.x,
                  top: newTextPosition.y,
                  zIndex: 10
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <textarea
                  value={newTextContent}
                  onChange={(e) => setNewTextContent(e.target.value)}
                  className="p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter text annotation"
                  autoFocus
                  rows={2}
                  style={{ color: selectedColor }}
                />
                <div className="mt-1 flex space-x-2">
                  <button
                    onClick={handleTextAdd}
                    className="px-2 py-1 text-xs font-medium rounded bg-primary-600 text-white"
                    disabled={!newTextContent}
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingText(false);
                      setNewTextPosition(null);
                      setNewTextContent('');
                    }}
                    className="px-2 py-1 text-xs font-medium rounded bg-gray-300 text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom toolbar */}
      <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Page navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`p-1 rounded-md ${
                currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{currentPage}</span> of <span className="font-medium">{totalPages}</span>
            </span>
            
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`p-1 rounded-md ${
                currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {annotations.length} annotation{annotations.length !== 1 ? 's' : ''} in document, {currentPageAnnotations.length} on this page
          </span>
        </div>
      </div>
    </div>
  );
};

export default PDFEditor; 