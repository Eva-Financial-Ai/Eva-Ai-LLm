import React, { useState, useEffect, useRef } from 'react';
import { FileItem } from './FilelockDriveApp';

interface SignatureWorkflowProps {
  file: FileItem;
  onBack: () => void;
  onComplete: (status: 'completed' | 'rejected') => void;
}

interface SignatureField {
  id: string;
  type: 'signature' | 'initial' | 'date' | 'text';
  page: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  required: boolean;
  label: string;
  value: string;
  assignedTo: string;
}

// Mock component for signature canvas
// In a real app, you would use a library like react-signature-canvas
const SignatureCanvas = React.forwardRef<
  { isEmpty: () => boolean; clear: () => void; toDataURL: (type: string) => string }, 
  { canvasProps: React.HTMLProps<HTMLCanvasElement>; penColor: string }
>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  
  // Add drawing functionality
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    setIsDrawing(true);
    setIsEmpty(false);
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = props.penColor;
    
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const endDrawing = () => {
    setIsDrawing(false);
  };
  
  // Expose methods through ref
  React.useImperativeHandle(ref, () => ({
    isEmpty: () => isEmpty,
    clear: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setIsEmpty(true);
    },
    toDataURL: (type: string) => {
      const canvas = canvasRef.current;
      return canvas ? canvas.toDataURL(type) : '';
    }
  }));
  
  return (
    <canvas
      ref={canvasRef}
      {...props.canvasProps}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={endDrawing}
      onMouseLeave={endDrawing}
    />
  );
});

const SignatureWorkflow: React.FC<SignatureWorkflowProps> = ({
  file,
  onBack,
  onComplete
}) => {
  const [currentStep, setCurrentStep] = useState<'create' | 'preview' | 'applying' | 'completed'>('create');
  const [signatureType, setSignatureType] = useState<'draw' | 'type' | 'upload'>('draw');
  const [signature, setSignature] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [signers, setSigners] = useState([
    { id: '1', name: 'Borrower', email: 'borrower@example.com', role: 'Signer', status: 'Pending' },
    { id: '2', name: 'Co-Signer', email: 'cosigner@example.com', role: 'Signer', status: 'Pending' },
    { id: '3', name: 'Lender', email: 'lender@example.com', role: 'Signer', status: 'Pending' }
  ]);
  const [signatureFields, setSignatureFields] = useState<SignatureField[]>([
    { 
      id: 'sig1', 
      type: 'signature', 
      page: 3, 
      position: { x: 100, y: 400 }, 
      size: { width: 200, height: 50 },
      required: true,
      label: 'Signature',
      value: '',
      assignedTo: 'Borrower'
    },
    { 
      id: 'init1', 
      type: 'initial', 
      page: 1, 
      position: { x: 450, y: 200 }, 
      size: { width: 100, height: 50 },
      required: true,
      label: 'Initial',
      value: '',
      assignedTo: 'Borrower'
    },
    { 
      id: 'sig2', 
      type: 'signature', 
      page: 3, 
      position: { x: 100, y: 500 }, 
      size: { width: 200, height: 50 },
      required: true,
      label: 'Signature',
      value: '',
      assignedTo: 'Co-Signer'
    },
    { 
      id: 'sig3', 
      type: 'signature', 
      page: 5, 
      position: { x: 400, y: 500 }, 
      size: { width: 200, height: 50 },
      required: true,
      label: 'Signature',
      value: '',
      assignedTo: 'Lender'
    }
  ]);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Simulate loading document pages
  const [documentPages, setDocumentPages] = useState<string[]>([]);
  
  useEffect(() => {
    // Simulate loading document pages
    const mockPages: string[] = [];
    for (let i = 1; i <= totalPages; i++) {
      mockPages.push(`/documents/preview/${file.id}/page-${i}.jpg`);
    }
    setDocumentPages(mockPages);
    
    // Initialize canvas for drawing
    if (signatureType === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'black';
      }
    }
  }, [file.id, signatureType, totalPages]);
  
  // Drawing functions for canvas signature
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };
  
  const draw = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.closePath();
    setIsDrawing(false);
    
    // Save signature as data URL
    setSignature(canvas.toDataURL());
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignature('');
  };
  
  const applySignature = () => {
    if (!signature) {
      alert('Please create your signature first');
      return;
    }
    
    setCurrentStep('preview');
  };
  
  const completeSignature = () => {
    setCurrentStep('applying');
    
    // Simulate processing time
    setTimeout(() => {
      // Update signature fields
      const updatedFields = signatureFields.map(field => {
        if (field.assignedTo === 'Borrower') {
          return { ...field, value: signature };
        }
        return field;
      });
      
      setSignatureFields(updatedFields);
      
      // Update signers status
      const updatedSigners = signers.map(signer => {
        if (signer.name === 'Borrower') {
          return { ...signer, status: 'Signed' };
        }
        return signer;
      });
      
      setSigners(updatedSigners);
      setCurrentStep('completed');
    }, 1500);
  };
  
  const renderSignatureCreate = () => (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-6">Create Your Signature</h2>
      
      <div className="mb-6">
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setSignatureType('draw')}
            className={`px-4 py-2 rounded ${signatureType === 'draw' 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Draw
          </button>
          <button
            onClick={() => setSignatureType('type')}
            className={`px-4 py-2 rounded ${signatureType === 'type' 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Type
          </button>
          <button
            onClick={() => setSignatureType('upload')}
            className={`px-4 py-2 rounded ${signatureType === 'upload' 
              ? 'bg-primary-500 text-white' 
              : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Upload
          </button>
        </div>
        
        {signatureType === 'draw' && (
          <div className="border border-gray-300 rounded p-2">
            <div className="text-sm text-gray-500 mb-2">
              Draw your signature using your mouse or touch screen
            </div>
            <canvas
              ref={canvasRef}
              width={500}
              height={200}
              className="border border-gray-200 w-full bg-white"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            />
            <div className="mt-2 flex justify-end">
              <button 
                onClick={clearCanvas}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100"
              >
                Clear
              </button>
            </div>
          </div>
        )}
        
        {signatureType === 'type' && (
          <div className="border border-gray-300 rounded p-4">
            <div className="text-sm text-gray-500 mb-2">
              Type your name and select a font for your signature
            </div>
            <input
              type="text"
              placeholder="Type your name"
              className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
              onChange={(e) => setSignature(e.target.value)}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {['Brush Script', 'Satisfy', 'Dancing Script', 'Parisienne'].map(font => (
                <button
                  key={font}
                  className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-100"
                  style={{ fontFamily: font }}
                  onClick={() => {
                    // In a real app, would apply the font to the signature
                    console.log(`Selected ${font} font`);
                  }}
                >
                  {font}
                </button>
              ))}
            </div>
            {signature && (
              <div className="mt-4 p-4 border border-gray-200 flex justify-center">
                <span className="text-2xl" style={{ fontFamily: 'Dancing Script' }}>{signature}</span>
              </div>
            )}
          </div>
        )}
        
        {signatureType === 'upload' && (
          <div className="border border-gray-300 rounded p-4">
            <div className="text-sm text-gray-500 mb-2">
              Upload an image of your signature
            </div>
            <div className="flex items-center justify-center w-full">
              <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-50">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span className="mt-2 text-base leading-normal">Select a file</span>
                <input type='file' className="hidden" accept="image/*" />
              </label>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between mt-8">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={applySignature}
          disabled={!signature}
          className={`px-4 py-2 rounded ${signature 
            ? 'bg-primary-600 text-white hover:bg-primary-700' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Apply Signature
        </button>
      </div>
    </div>
  );
  
  const renderSignaturePreview = () => (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Document Preview with Signature Placements</h2>
      <p className="text-gray-600 mb-6">
        Review where your signature will be applied in the document
      </p>
      
      <div className="bg-gray-100 p-4 rounded mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-1 rounded-full ${currentPage === 1 ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="mx-4">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className={`p-1 rounded-full ${currentPage === totalPages ? 'text-gray-400' : 'text-gray-700 hover:bg-gray-200'}`}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {file.name}
          </span>
        </div>
        
        <div className="bg-white rounded shadow-lg border border-gray-300 relative" style={{ height: '70vh', overflow: 'auto' }}>
          {/* Mock document with signature fields overlay */}
          <div className="relative">
            {/* Document page */}
            <div className="w-full h-full bg-white p-8">
              {/* This would be the actual PDF rendering in a real implementation */}
              <div className="border-b pb-4 mb-4">
                <h3 className="text-xl font-bold mb-2">Loan Agreement</h3>
                <p className="text-gray-700">
                  This loan agreement ("Agreement") is made and entered into as of [Date], by and between
                  [Lender Name] ("Lender") and [Borrower Name] ("Borrower").
                </p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">TERMS AND CONDITIONS</h4>
                <p className="text-gray-700 mb-2">
                  1. LOAN AMOUNT. Lender agrees to loan Borrower the sum of $[Amount].
                </p>
                <p className="text-gray-700 mb-2">
                  2. INTEREST RATE. The loan shall bear interest at the rate of [Rate]% per annum.
                </p>
                <p className="text-gray-700 mb-2">
                  3. REPAYMENT. Borrower shall repay the loan in full, together with accrued interest,
                  on or before [Date].
                </p>
                <p className="text-gray-700 mb-2">
                  4. LATE PAYMENT. If any payment is not made within [Days] days of the due date, Borrower
                  shall pay a late fee of $[Amount].
                </p>
                <p className="text-gray-700 mb-2">
                  5. DEFAULT. If Borrower fails to make any payment when due, Lender may declare the
                  entire unpaid principal balance, together with accrued interest, immediately due and payable.
                </p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">SIGNATURES</h4>
                <p className="text-gray-700 mb-4">
                  IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first above written.
                </p>
                
                <div className="flex justify-between mt-12">
                  <div>
                    <p className="mb-1 text-gray-600">Lender:</p>
                    <div className="border-b border-gray-400 w-48"></div>
                    <p className="mt-1 text-gray-600">Date:</p>
                    <div className="border-b border-gray-400 w-48"></div>
                  </div>
                  
                  <div>
                    <p className="mb-1 text-gray-600">Borrower:</p>
                    <div className="border-b border-gray-400 w-48"></div>
                    <p className="mt-1 text-gray-600">Date:</p>
                    <div className="border-b border-gray-400 w-48"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Overlay signature fields that are on the current page */}
            {signatureFields
              .filter(field => field.page === currentPage)
              .map(field => (
                <div
                  key={field.id}
                  className="absolute border-2 border-blue-400 bg-blue-50 bg-opacity-30 rounded"
                  style={{
                    left: `${field.position.x}px`,
                    top: `${field.position.y}px`,
                    width: `${field.size.width}px`,
                    height: `${field.size.height}px`,
                  }}
                >
                  <div className="absolute -top-7 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-t">
                    {field.label} ({field.assignedTo})
                  </div>
                  
                  {field.assignedTo === 'Borrower' && field.type === 'signature' && signature && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      {signatureType === 'draw' ? (
                        <img src={signature} alt="Signature" className="max-w-full max-h-full" />
                      ) : (
                        <span className="text-lg" style={{ fontFamily: 'Dancing Script' }}>{signature}</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep('create')}
          className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
        >
          Back
        </button>
        <button
          onClick={completeSignature}
          className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
        >
          Complete Signing
        </button>
      </div>
    </div>
  );
  
  const renderApplying = () => (
    <div className="max-w-md mx-auto py-16 flex flex-col items-center">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600 mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Applying your signature</h2>
      <p className="text-gray-500">Please wait while we securely apply your signature to the document...</p>
    </div>
  );
  
  const renderCompleted = () => (
    <div className="max-w-md mx-auto py-16 flex flex-col items-center">
      <div className="bg-green-100 rounded-full p-3 mb-4">
        <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Signature Complete!</h2>
      <p className="text-gray-500 text-center mb-6">
        Your signature has been successfully applied. Other parties will be notified to complete their signatures.
      </p>
      
      <div className="w-full bg-gray-100 rounded-lg p-4 mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Signature Status</h3>
        <div className="space-y-3">
          {signers.map(signer => (
            <div key={signer.id} className="flex justify-between items-center">
              <div>
                <p className="font-medium">{signer.name}</p>
                <p className="text-sm text-gray-500">{signer.email}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                signer.status === 'Signed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {signer.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={() => onComplete('completed')}
        className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700"
      >
        Return to Document
      </button>
    </div>
  );
  
  return (
    <div className="h-full bg-white rounded-lg shadow-md overflow-auto">
      {currentStep === 'create' && renderSignatureCreate()}
      {currentStep === 'preview' && renderSignaturePreview()}
      {currentStep === 'applying' && renderApplying()}
      {currentStep === 'completed' && renderCompleted()}
    </div>
  );
};

export default SignatureWorkflow; 