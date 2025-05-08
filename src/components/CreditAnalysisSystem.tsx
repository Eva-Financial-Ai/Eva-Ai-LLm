import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';

interface CreditAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
  financialData?: any;
  industryCode?: string;
}

const CreditAnalysisSystem: React.FC<CreditAnalysisProps> = ({
  isOpen,
  onClose,
  financialData,
  industryCode = '45322' // Mock industry code
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ratios' | 'benchmarks' | 'insights'>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [timeFrame, setTimeFrame] = useState<'1y' | '2y' | '3y' | '5y'>('3y');
  const [adjustmentApplied, setAdjustmentApplied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Animation for modal
  const modalAnimation = useSpring({
    opacity: isOpen ? 1 : 0,
    transform: isOpen ? 'translateY(0)' : 'translateY(50px)'
  }) as any;

  // Mock financial ratios
  const mockRatios = {
    profitability: [
      { name: 'Gross Profit Margin', value: 0.32, benchmark: 0.29, status: 'good' },
      { name: 'Operating Profit Margin', value: 0.14, benchmark: 0.16, status: 'average' },
      { name: 'Net Profit Margin', value: 0.08, benchmark: 0.11, status: 'concern' },
      { name: 'Return on Assets (ROA)', value: 0.07, benchmark: 0.09, status: 'average' },
      { name: 'Return on Equity (ROE)', value: 0.13, benchmark: 0.12, status: 'good' }
    ],
    liquidity: [
      { name: 'Current Ratio', value: 1.8, benchmark: 1.5, status: 'good' },
      { name: 'Quick Ratio', value: 1.2, benchmark: 1.0, status: 'good' },
      { name: 'Cash Ratio', value: 0.4, benchmark: 0.5, status: 'average' }
    ],
    leverage: [
      { name: 'Debt to Equity', value: 1.6, benchmark: 1.1, status: 'concern' },
      { name: 'Debt to Assets', value: 0.65, benchmark: 0.5, status: 'concern' },
      { name: 'Interest Coverage', value: 4.2, benchmark: 4.0, status: 'good' },
      { name: 'Debt Service Coverage Ratio', value: 1.8, benchmark: 1.25, status: 'excellent' }
    ],
    efficiency: [
      { name: 'Inventory Turnover', value: 8.5, benchmark: 7.0, status: 'good' },
      { name: 'Accounts Receivable Turnover', value: 7.2, benchmark: 9.0, status: 'average' },
      { name: 'Asset Turnover', value: 1.4, benchmark: 1.5, status: 'average' }
    ]
  };

  // Mock insights based on ratios
  const mockInsights = [
    {
      category: 'critical',
      title: 'Debt Levels Are High',
      description: 'Debt to equity ratio is 45% above industry average, indicating higher financial risk.',
      ratios: ['Debt to Equity', 'Debt to Assets'],
      recommendation: 'Consider debt reduction strategy or equity injection.'
    },
    {
      category: 'warning',
      title: 'Declining Net Profit Margin',
      description: 'Net profit margin is below industry benchmark and shows a 2.5% decline year-over-year.',
      ratios: ['Net Profit Margin'],
      recommendation: 'Review operating expenses and pricing strategy.'
    },
    {
      category: 'positive',
      title: 'Strong Debt Service Coverage',
      description: 'DSCR is significantly above the minimum threshold, indicating strong ability to service debt.',
      ratios: ['Debt Service Coverage Ratio'],
      recommendation: 'Could support additional growth financing if needed.'
    },
    {
      category: 'info',
      title: 'Average Efficiency Metrics',
      description: 'Operational efficiency metrics are mostly in line with industry averages.',
      ratios: ['Inventory Turnover', 'Accounts Receivable Turnover'],
      recommendation: 'Monitor AR aging to prevent deterioration.'
    }
  ];

  const runFinancialAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
    
    // Simulate analysis process
    setTimeout(() => {
      setAnalysisResults({
        ratios: mockRatios,
        insights: mockInsights,
        industryBenchmarks: {
          code: industryCode,
          name: 'Commercial Equipment Financing',
          dataQuality: 'High (231 companies)',
          regionalAdjustment: true
        },
        overallRiskScore: 68, // 0-100, higher is better
        recommendations: [
          'Review capital structure to address high debt levels',
          'Implement cash flow monitoring system',
          'Consider working capital optimization strategy'
        ]
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-green-500';
      case 'average': return 'text-yellow-500';
      case 'concern': return 'text-orange-500';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-500';
    }
  };

  // Helper function to format a number as percentage
  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Helper function to get insight category styling
  const getInsightCategoryStyle = (category: string) => {
    switch (category) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  // Add this function to handle exporting the report
  const handleExportReport = () => {
    if (!analysisResults) return;
    
    setIsExporting(true);
    
    // Simulate export process
    setTimeout(() => {
      // Create a sample export data
      const exportData = {
        filename: `Financial_Analysis_${currentDate()}.pdf`,
        data: analysisResults,
        timestamp: new Date().toISOString()
      };
      
      // Log the export data (in a real implementation, this would generate and download a PDF/Excel file)
      console.log('Exporting report:', exportData);
      
      // Simulate successful export
      alert(`Report exported successfully as ${exportData.filename}`);
      setIsExporting(false);
    }, 1500);
  };
  
  // Helper function to get current date string for filename
  const currentDate = () => {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Main modal */}
      <animated.div 
        style={modalAnimation}
        className="bg-white rounded-xl shadow-2xl w-full max-w-6xl relative max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-primary-700">
            Credit Analysis System
            <span className="ml-2 text-sm font-normal text-gray-500">
              AI-powered financial analysis and risk assessment
            </span>
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'overview' ? 'border-b-2 border-primary-600 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('ratios')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'ratios' ? 'border-b-2 border-primary-600 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Financial Ratios
          </button>
          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'benchmarks' ? 'border-b-2 border-primary-600 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Industry Benchmarks
          </button>
          <button
            onClick={() => setActiveTab('insights')}
            className={`px-4 py-2 text-sm font-medium ${activeTab === 'insights' ? 'border-b-2 border-primary-600 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Insights & Red Flags
          </button>
        </div>
        
        {/* Toolbar */}
        <div className="bg-gray-50 p-2 flex justify-between items-center border-b">
          <div className="flex items-center space-x-4">
            <div>
              <label className="block text-xs font-medium text-gray-700">Time Period</label>
              <select 
                value={timeFrame}
                onChange={(e) => setTimeFrame(e.target.value as any)}
                className="mt-1 text-sm border-gray-300 rounded-md"
              >
                <option value="1y">1 Year</option>
                <option value="2y">2 Years</option>
                <option value="3y">3 Years</option>
                <option value="5y">5 Years</option>
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700">Industry</label>
              <div className="mt-1 text-sm font-medium">
                {industryCode} - Commercial Equipment Financing
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              <input 
                type="checkbox"
                id="adjustments"
                checked={adjustmentApplied}
                onChange={() => setAdjustmentApplied(!adjustmentApplied)}
                className="h-4 w-4 text-primary-600 rounded"
              />
              <label htmlFor="adjustments" className="ml-1 text-sm text-gray-700">
                Apply Adjustments
              </label>
            </div>
            
            <button
              onClick={runFinancialAnalysis}
              disabled={isAnalyzing}
              className={`px-3 py-1.5 text-sm text-white rounded-md ${
                isAnalyzing ? 'bg-primary-400' : 'bg-primary-600 hover:bg-primary-700'
              }`}
            >
              {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
            </button>
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 overflow-y-auto p-4">
          {!analysisResults ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-lg">Run the analysis to generate financial insights</p>
              <p className="text-sm">Financial data will be processed through the Advanced Ratio Calculator</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  {/* Risk Score Card */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Overall Credit Risk Assessment</h3>
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">Risk Score</span>
                      <span className="text-lg font-bold text-gray-900">{analysisResults.overallRiskScore}/100</span>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{
                          width: `${analysisResults.overallRiskScore}%`,
                          backgroundColor: analysisResults.overallRiskScore > 80 ? '#10B981' : 
                                          analysisResults.overallRiskScore > 60 ? '#6366F1' : 
                                          analysisResults.overallRiskScore > 40 ? '#F59E0B' : '#EF4444'
                        }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>High Risk</span>
                      <span>Low Risk</span>
                    </div>
                  </div>
                  
                  {/* Key Metrics Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Debt Service Coverage</h3>
                      <div className="flex items-end">
                        <span className="text-2xl font-bold text-gray-900">1.8x</span>
                        <span className="ml-1 text-xs text-green-600">+0.2 YoY</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">Industry: 1.25x</div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Debt to EBITDA</h3>
                      <div className="flex items-end">
                        <span className="text-2xl font-bold text-gray-900">3.2x</span>
                        <span className="ml-1 text-xs text-orange-600">+0.5 YoY</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">Industry: 2.8x</div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Return on Assets</h3>
                      <div className="flex items-end">
                        <span className="text-2xl font-bold text-gray-900">7.0%</span>
                        <span className="ml-1 text-xs text-yellow-600">-0.3% YoY</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">Industry: 9.0%</div>
                    </div>
                    
                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Current Ratio</h3>
                      <div className="flex items-end">
                        <span className="text-2xl font-bold text-gray-900">1.8x</span>
                        <span className="ml-1 text-xs text-green-600">+0.1 YoY</span>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">Industry: 1.5x</div>
                    </div>
                  </div>
                  
                  {/* Key Recommendations */}
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-3">Key Recommendations</h3>
                    
                    <ul className="space-y-2">
                      {analysisResults.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="flex items-start">
                          <div className="flex-shrink-0 h-5 w-5 text-primary-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <p className="ml-2 text-sm text-gray-700">{rec}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              
              {/* Ratios Tab */}
              {activeTab === 'ratios' && (
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Financial Ratios Analysis</h3>
                  
                  <div className="space-y-6">
                    {Object.entries(analysisResults.ratios).map(([category, ratios]: [string, any]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="text-md font-medium text-gray-700 capitalize">{category} Ratios</h4>
                        
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ratio</th>
                                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {ratios.map((ratio: any, index: number) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{ratio.name}</td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                                    {typeof ratio.value === 'number' && ratio.value < 0.1 ? ratio.value.toFixed(2) : typeof ratio.value === 'number' && ratio.value < 1 ? formatPercent(ratio.value) : ratio.value.toFixed(1)}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500">
                                    {typeof ratio.benchmark === 'number' && ratio.benchmark < 0.1 ? ratio.benchmark.toFixed(2) : typeof ratio.benchmark === 'number' && ratio.benchmark < 1 ? formatPercent(ratio.benchmark) : ratio.benchmark.toFixed(1)}
                                  </td>
                                  <td className="px-3 py-2 whitespace-nowrap">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ratio.status)} bg-opacity-10`}>
                                      {ratio.status.charAt(0).toUpperCase() + ratio.status.slice(1)}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Benchmarks Tab */}
              {activeTab === 'benchmarks' && (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">Industry Benchmark Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Industry</p>
                        <p className="text-md font-bold">{analysisResults.industryBenchmarks.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Industry Code</p>
                        <p className="text-md font-bold">{analysisResults.industryBenchmarks.code}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-500">Data Quality</p>
                        <p className="text-md font-bold">{analysisResults.industryBenchmarks.dataQuality}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start pt-2 border-t border-gray-200">
                      <input 
                        type="checkbox"
                        id="regional"
                        checked={analysisResults.industryBenchmarks.regionalAdjustment}
                        className="mt-1 h-4 w-4 text-primary-600 rounded"
                        readOnly
                      />
                      <div className="ml-2">
                        <p className="text-sm font-medium">Regional Adjustment Applied</p>
                        <p className="text-xs text-gray-500">Benchmarks adjusted for regional economic factors</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Peer Comparison</h3>
                    
                    {/* This would be a chart in a real implementation */}
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">Peer comparison chart would appear here</p>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Revenue Range</p>
                        <p className="text-sm font-medium">$25M - $100M</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Company Age</p>
                        <p className="text-sm font-medium">5-15 years</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Geographic Region</p>
                        <p className="text-sm font-medium">North Central</p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Peer Group Size</p>
                        <p className="text-sm font-medium">42 companies</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Insights & Red Flags Tab */}
              {activeTab === 'insights' && (
                <div className="space-y-4">
                  {analysisResults.insights.map((insight: any, index: number) => (
                    <div 
                      key={index} 
                      className={`bg-white p-4 rounded-lg border ${getInsightCategoryStyle(insight.category)}`}
                    >
                      <div className="flex items-start">
                        <div className={`p-2 rounded-full ${
                          insight.category === 'critical' ? 'bg-red-100 text-red-600' :
                          insight.category === 'warning' ? 'bg-orange-100 text-orange-600' :
                          insight.category === 'positive' ? 'bg-green-100 text-green-600' :
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {insight.category === 'critical' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          )}
                          {insight.category === 'warning' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {insight.category === 'positive' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                          {insight.category === 'info' && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          )}
                        </div>
                        
                        <div className="ml-3 flex-1">
                          <h3 className="text-md font-medium">{insight.title}</h3>
                          <p className="text-sm mt-1">{insight.description}</p>
                          
                          <div className="mt-2 flex flex-wrap gap-2">
                            {insight.ratios.map((ratio: string, i: number) => (
                              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {ratio}
                              </span>
                            ))}
                          </div>
                          
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-sm font-medium">Recommendation:</p>
                            <p className="text-sm">{insight.recommendation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">
              Powered by <span className="font-medium">EVA AI</span> Advanced Ratio Calculator
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
            {analysisResults && (
              <button
                onClick={handleExportReport}
                disabled={isExporting}
                className="px-4 py-2 text-sm text-white bg-primary-600 rounded-md hover:bg-primary-700"
              >
                <span className="flex items-center">
                  {isExporting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Exporting...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Export Report
                    </>
                  )}
                </span>
              </button>
            )}
          </div>
        </div>
      </animated.div>
    </div>
  );
};

export default CreditAnalysisSystem; 