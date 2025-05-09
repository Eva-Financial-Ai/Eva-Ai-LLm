import React, { useState, useEffect, useRef } from 'react';

interface CreditRiskAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
  applicantId?: string;
}

const CreditRiskAnalysis: React.FC<CreditRiskAnalysisProps> = ({
  isOpen,
  onClose,
  applicantId,
}) => {
  const [loading, setLoading] = useState(true);
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [risk, setRisk] = useState<'low' | 'medium' | 'high' | 'very high' | null>(null);
  const [factors, setFactors] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const reportContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate loading credit risk data
    if (isOpen) {
      setLoading(true);

      // In a real implementation, this would be an API call
      setTimeout(() => {
        // Mock data for demo purposes
        setCreditScore(680);
        setRisk('medium');
        setFactors([
          'Limited credit history (less than 5 years)',
          'Recent credit inquiries (3 in last 6 months)',
          'Debt-to-income ratio exceeds optimal range (42%)',
          'Current utilization of revolving credit above 50%',
        ]);
        setRecommendations([
          'Consider requiring additional collateral',
          'Implement more frequent payment schedule',
          'Adjust interest rate to compensate for risk profile',
          'Request personal guarantee from business owners',
        ]);
        setLoading(false);
      }, 1500);
    }

    return () => {
      // Cleanup function
      setLoading(true);
      setCreditScore(null);
      setRisk(null);
      setFactors([]);
      setRecommendations([]);
    };
  }, [isOpen, applicantId]);

  // Helper function to get risk color classes
  const getRiskColorClasses = (risk: string | null) => {
    switch (risk) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'very high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get current date string for filename
  const currentDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  // Handle exporting the report to PDF
  const handleExportReport = async () => {
    if (loading || !reportContentRef.current) return;

    setIsExporting(true);

    try {
      // Dynamically import the libraries only when needed
      const jsPDFModule = await import('jspdf');
      const html2canvasModule = await import('html2canvas');

      const jsPDF = jsPDFModule.default;
      const html2canvas = html2canvasModule.default;

      // Create a filename for the export
      const filename = `Credit_Risk_Analysis_${currentDate()}_${applicantId || 'Report'}.pdf`;

      // Use html2canvas to capture the content as an image
      html2canvas(reportContentRef.current, {
        logging: false,
        useCORS: true,
        allowTaint: true,
      })
        .then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
          });

          // Calculate the width and height of the PDF page
          const imgWidth = 210; // A4 width in mm
          const pageHeight = 295; // A4 height in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;

          // Add the image to the first page
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          // Add new pages if the content is longer than one page
          while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          // Save the PDF
          pdf.save(filename);

          setTimeout(() => {
            setIsExporting(false);
          }, 500);
        })
        .catch(error => {
          console.error('Error generating PDF:', error);
          alert('There was an error exporting the report. Please try again.');
          setIsExporting(false);
        });
    } catch (error) {
      console.error('Error in PDF export process:', error);
      alert('There was an error preparing the report. Please try again.');
      setIsExporting(false);
    }
  };

  // If component is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto overflow-x-hidden flex justify-center items-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Credit Risk Analysis</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
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

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="space-y-6" ref={reportContentRef}>
              {/* Summary Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Credit Score</h3>
                  <div className="flex items-center mb-4">
                    <div className="text-3xl font-bold text-gray-900">{creditScore}</div>
                    <div className="ml-4">
                      <div
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getRiskColorClasses(risk)}`}
                      >
                        {risk ? risk.charAt(0).toUpperCase() + risk.slice(1) : 'Unknown'} Risk
                      </div>
                    </div>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
                    <div
                      className={`h-2.5 rounded-full ${
                        creditScore && creditScore >= 740
                          ? 'bg-green-500'
                          : creditScore && creditScore >= 670
                            ? 'bg-yellow-500'
                            : creditScore && creditScore >= 580
                              ? 'bg-orange-500'
                              : 'bg-red-500'
                      }`}
                      style={{
                        width: `${creditScore ? Math.min(Math.max((creditScore / 850) * 100, 10), 100) : 0}%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Poor</span>
                    <span>Fair</span>
                    <span>Good</span>
                    <span>Excellent</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Risk Assessment</h3>
                  <div className="space-y-2">
                    {factors.map((factor, index) => (
                      <div key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-red-500 mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <span className="text-sm text-gray-700">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recommendations</h3>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                  <ul className="space-y-2">
                    {recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="text-sm text-gray-700">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Additional Analysis Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Business Performance</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Cash Flow Sustainability
                        </span>
                        <span className="text-sm text-gray-500">72%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: '72%' }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Debt Service Coverage
                        </span>
                        <span className="text-sm text-gray-500">1.25x</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: '60%' }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">
                          Industry Comparison
                        </span>
                        <span className="text-sm text-gray-500">Above Average</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: '85%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Historical Performance</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 mb-4">
                      Based on 24 months of financial history, this applicant has demonstrated:
                    </p>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-700">
                          Consistent monthly revenue growth (4.2% avg)
                        </span>
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="h-5 w-5 text-green-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-700">
                          No payment defaults on existing obligations
                        </span>
                      </li>
                      <li className="flex items-center">
                        <svg
                          className="h-5 w-5 text-yellow-500 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <span className="text-sm text-gray-700">
                          Seasonal cash flow variations requiring attention
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-between">
          <div className="text-sm text-gray-500">
            Analysis generated by EVA AI on {new Date().toLocaleDateString()}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              Close
            </button>
            <button
              onClick={handleExportReport}
              disabled={isExporting || loading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Exporting...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export Report
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditRiskAnalysis;
