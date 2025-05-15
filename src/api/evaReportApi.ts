import axios from 'axios';
import { RiskCategory } from '../components/risk/RiskMapOptimized';
import { RiskMapType } from '../components/risk/RiskMapNavigator';

// Define API response types
export interface MetricData {
  name: string;
  value: string | number;
  status: 'good' | 'average' | 'negative';
  source?: string;
  description?: string;
}

export interface CategoryData {
  title: string;
  description: string;
  metrics: MetricData[];
}

export interface EvaReportData {
  transactionId: string;
  categories: Record<RiskCategory, CategoryData>;
  riskScores: Record<RiskCategory, number>;
  lastUpdated: string;
}

// For demo purposes, we'll use a simulated API call with mock data
// In a production environment, this would connect to your actual API endpoint
const API_ENDPOINT = process.env.REACT_APP_API_URL || 'https://api.example.com/v1';

// Mock data for each category
const MOCK_DATA: Record<RiskCategory, Omit<CategoryData, 'metrics'> & { metrics: Record<RiskMapType, MetricData[]> }> = {
  credit: {
    title: 'Creditworthiness Assessment',
    description: 'Analysis of credit history, payment behavior, and overall credit profile',
    metrics: {
      unsecured: [
        { name: 'Credit Score', value: '745', status: 'good', source: 'Equifax One Score', description: 'Range: 720-850 (Good)' },
        { name: 'Payment History', value: '0 missed payments', status: 'good', source: 'Experian', description: 'No missed payments in last 24 months' },
        { name: 'Credit Utilization', value: '26%', status: 'good', source: 'D&B', description: 'Less than 30% utilization' },
        { name: 'Public Records', value: '0 issues', status: 'good', source: 'LexisNexis', description: 'No public records found' },
        { name: 'Age of Credit History', value: '12 years', status: 'good', source: 'Paynet API', description: 'More than 10 years (Good)' },
        { name: 'Recent Inquiries', value: '1 inquiry', status: 'good', source: 'Equifax', description: 'Less than 2 inquiries in last 6 months' }
      ],
      equipment: [
        { name: 'Credit Score', value: '732', status: 'good', source: 'Equifax One Score', description: 'Range: 720-850 (Good)' },
        { name: 'Equipment Loan History', value: '3 previous loans', status: 'good', source: 'Equifax', description: 'Good payment history on equipment loans' },
        { name: 'Credit Utilization', value: '31%', status: 'average', source: 'D&B', description: '30%-50% utilization (Average)' },
        { name: 'Public Records', value: '0 issues', status: 'good', source: 'LexisNexis', description: 'No public records found' },
        { name: 'Industry Credit Rating', value: 'A-', status: 'good', source: 'Paynet API', description: 'Above average for industry' }
      ],
      realestate: [
        { name: 'Credit Score', value: '758', status: 'good', source: 'Equifax One Score', description: 'Range: 720-850 (Good)' },
        { name: 'Mortgage History', value: '1 active mortgage', status: 'good', source: 'Experian', description: 'Excellent payment history' },
        { name: 'Credit Utilization', value: '22%', status: 'good', source: 'D&B', description: 'Less than 30% utilization' },
        { name: 'Public Records', value: '0 issues', status: 'good', source: 'LexisNexis', description: 'No public records found' },
        { name: 'Real Estate Experience', value: '8 years', status: 'good', source: 'Application Data', description: 'Significant experience in real estate' }
      ]
    }
  },
  capacity: {
    title: 'Cash Flow Analysis',
    description: 'Assessment of cash flow health, working capital, and debt service capacity',
    metrics: {
      unsecured: [
        { name: 'Operating Cash Flow', value: '+6.8% annual increase', status: 'good', source: 'Cash Flow Statement', description: 'Greater than 5% annual increase (Good)' },
        { name: 'Free Cash Flow', value: '+4.5%', status: 'good', source: 'Cash Flow Statement', description: 'Greater than 3% (Good)' },
        { name: 'Cash Flow Coverage Ratio', value: '1.65', status: 'good', source: 'Cash Flow Statement', description: 'Greater than 1.5 (Good)' },
        { name: 'Cash Conversion Cycle', value: '28 days', status: 'good', source: 'Financial Statements', description: 'Less than 30 days (Good)' },
        { name: 'Days Sales Outstanding', value: '32 days', status: 'average', source: 'Financial Statements', description: '30-60 days (Average)' }
      ],
      equipment: [
        { name: 'Equipment Cash Generation', value: '+8.2% annual increase', status: 'good', source: 'Cash Flow Statement', description: 'Strong cash generation from equipment' },
        { name: 'Equipment Maintenance Costs', value: '$28,500/year', status: 'average', source: 'Expense Reports', description: 'Average maintenance costs' },
        { name: 'Cash Flow Coverage Ratio', value: '1.72', status: 'good', source: 'Cash Flow Statement', description: 'Greater than 1.5 (Good)' },
        { name: 'Equipment Utilization', value: '82%', status: 'good', source: 'Operations Report', description: 'High utilization rate (>80%)' },
        { name: 'ROI on Equipment', value: '18%', status: 'good', source: 'Financial Analysis', description: 'Strong return on investment' }
      ],
      realestate: [
        { name: 'Rental Income', value: '+5.4% annual increase', status: 'good', source: 'Income Statement', description: 'Growing rental income' },
        { name: 'Occupancy Rate', value: '94%', status: 'good', source: 'Property Management System', description: 'High occupancy rate (>90%)' },
        { name: 'Net Operating Income', value: '$275,000/year', status: 'good', source: 'Income Statement', description: 'Strong operating income' },
        { name: 'Debt Service Coverage Ratio', value: '1.45', status: 'good', source: 'Financial Analysis', description: 'DSCR > 1.40 is considered good' },
        { name: 'CAP Rate', value: '6.8%', status: 'average', source: 'Market Analysis', description: 'Average CAP rate for property type' }
      ]
    }
  },
  collateral: {
    title: 'Collateral Evaluation',
    description: 'Assessment of assets pledged as security for the loan',
    metrics: {
      unsecured: [
        { name: 'Collateral Available', value: 'Limited', status: 'average', source: 'Application Data', description: 'Limited collateral for unsecured loan' },
        { name: 'Business Assets', value: '$1.2M', status: 'good', source: 'Balance Sheet', description: 'Substantial business assets' },
        { name: 'Liquid Assets', value: '$320,000', status: 'good', source: 'Financial Statements', description: 'Strong liquidity position' },
        { name: 'Asset Quality', value: 'Good', status: 'good', source: 'Asset Valuation', description: 'High quality business assets' },
        { name: 'Asset Depreciation Rate', value: '12% annual', status: 'average', source: 'Financial Analysis', description: 'Average depreciation rate' }
      ],
      equipment: [
        { name: 'Equipment Type Demand', value: 'High demand', status: 'good', source: 'EquipmentWatch', description: 'Essential equipment with high demand' },
        { name: 'Equipment Age', value: '1.5 years', status: 'good', source: 'Purchase Records', description: 'New/Recent (0-2.66 years)' },
        { name: 'Resale Value', value: '85% of purchase price', status: 'good', source: 'EquipmentWatch', description: 'High resale value above industry average' },
        { name: 'Depreciation Rate', value: '8 years', status: 'good', source: 'IRS Guidelines', description: 'Favorable depreciation schedule (>6 years)' },
        { name: 'Replacement Cost', value: '$225,000', status: 'good', source: 'Machine Trader API', description: 'Higher than average replacement cost' }
      ],
      realestate: [
        { name: 'Loan-to-Value Ratio', value: '62%', status: 'good', source: 'Appraisal Report', description: 'Less than 65% (Good)' },
        { name: 'Property Class', value: 'Class A', status: 'good', source: 'Property Assessment', description: 'Top-tier property classification' },
        { name: 'Building Condition', value: 'Excellent', status: 'good', source: 'Property Inspection', description: 'Building in excellent condition' },
        { name: 'Property Location', value: 'Prime Location', status: 'good', source: 'Market Analysis', description: 'Property in high-demand location' },
        { name: 'Liens & Foreclosures', value: 'No liens or foreclosures', status: 'good', source: 'Public Records', description: 'Clean title with no encumbrances' }
      ]
    }
  },
  capital: {
    title: 'Capital Structure',
    description: 'Evaluation of business equity, investments, and financial ratios',
    metrics: {
      unsecured: [
        { name: 'Debt-to-Equity Ratio', value: '0.85', status: 'good', source: 'Financial Statements', description: 'Less than 1.0 (Good)' },
        { name: 'Current Ratio', value: '2.3', status: 'good', source: 'Balance Sheet', description: 'Greater than 2.0 (Good)' },
        { name: 'Quick Ratio', value: '1.2', status: 'good', source: 'Balance Sheet', description: 'Greater than 1.0 (Good)' },
        { name: 'Gross Margin', value: '42%', status: 'average', source: 'Income Statement', description: '30%-50% (Average)' },
        { name: 'Net Margin', value: '8%', status: 'average', source: 'Income Statement', description: '5%-15% (Average)' }
      ],
      equipment: [
        { name: 'Equipment Financing Ratio', value: '0.72', status: 'good', source: 'Financial Analysis', description: 'Less than 0.8 (Good)' },
        { name: 'Current Ratio', value: '2.1', status: 'good', source: 'Balance Sheet', description: 'Greater than 2.0 (Good)' },
        { name: 'Quick Ratio', value: '1.1', status: 'good', source: 'Balance Sheet', description: 'Greater than 1.0 (Good)' },
        { name: 'Return on Equipment', value: '15%', status: 'good', source: 'Financial Analysis', description: 'Strong return on equipment investment' },
        { name: 'Owner Equity Stake', value: '45%', status: 'good', source: 'Financial Statements', description: 'Strong equity position' }
      ],
      realestate: [
        { name: 'Real Estate Leverage', value: '0.65', status: 'good', source: 'Financial Analysis', description: 'Less than 0.7 (Good)' },
        { name: 'Current Ratio', value: '2.5', status: 'good', source: 'Balance Sheet', description: 'Greater than 2.0 (Good)' },
        { name: 'Equity Position', value: '38%', status: 'good', source: 'Financial Statements', description: 'Strong equity in the property' },
        { name: 'Portfolio Diversification', value: 'Moderate', status: 'average', source: 'Asset Management Report', description: 'Somewhat diversified portfolio' },
        { name: 'Real Estate Capital Reserves', value: '$350,000', status: 'good', source: 'Financial Statements', description: 'Strong capital reserves' }
      ]
    }
  },
  conditions: {
    title: 'Market & Industry Conditions',
    description: 'Analysis of market conditions, industry trends, and economic factors',
    metrics: {
      unsecured: [
        { name: 'Industry Growth Rate', value: '+5.8% annually', status: 'good', source: 'Industry Reports', description: 'Strong industry growth trend' },
        { name: 'Market Stability', value: 'Stable', status: 'good', source: 'Economic Indicators', description: 'Market shows stable growth patterns' },
        { name: 'Competitive Position', value: 'Strong', status: 'good', source: 'Market Analysis', description: 'Business has strong competitive position' },
        { name: 'Economic Outlook', value: 'Positive', status: 'good', source: 'Economic Forecasts', description: 'Positive economic indicators for next 12-24 months' },
        { name: 'Regulatory Changes', value: 'No significant changes', status: 'good', source: 'Regulatory Tracking', description: 'No major regulatory changes expected' }
      ],
      equipment: [
        { name: 'Equipment Industry Growth', value: '+6.2% annually', status: 'good', source: 'Industry Reports', description: 'Strong growth in equipment sector' },
        { name: 'Technology Obsolescence Risk', value: 'Low', status: 'good', source: 'Technology Assessment', description: 'Low risk of technology becoming obsolete' },
        { name: 'Supply Chain Stability', value: 'Stable', status: 'good', source: 'Supply Chain Analysis', description: 'Stable supply chain for parts and service' },
        { name: 'Market Demand Forecast', value: 'Increasing', status: 'good', source: 'Market Research', description: 'Growing demand for this equipment type' },
        { name: 'Regulatory Compliance', value: 'Fully Compliant', status: 'good', source: 'Regulatory Assessment', description: 'Meets all current and pending regulations' }
      ],
      realestate: [
        { name: 'Real Estate Market Trend', value: '+4.7% annually', status: 'good', source: 'Market Reports', description: 'Positive trend in commercial real estate' },
        { name: 'Local Market Vacancy Rates', value: '4.8%', status: 'good', source: 'Market Analysis', description: 'Low vacancy rates in the area' },
        { name: 'Interest Rate Forecast', value: 'Stable', status: 'good', source: 'Economic Forecasts', description: 'Stable interest rate environment expected' },
        { name: 'Regional Economic Growth', value: 'Strong', status: 'good', source: 'Economic Indicators', description: 'Strong regional economic performance' },
        { name: 'Zoning/Regulatory Issues', value: 'None', status: 'good', source: 'Local Government Assessment', description: 'No zoning or regulatory issues identified' }
      ]
    }
  },
  character: {
    title: 'Management & Compliance Assessment',
    description: 'Evaluation of business management, legal standing, and regulatory compliance',
    metrics: {
      unsecured: [
        { name: 'Compliance History', value: '0 Issues', status: 'good', source: 'Regulatory Records', description: 'No compliance issues identified' },
        { name: 'Legal Disputes', value: 'No Disputes', status: 'good', source: 'Public Records', description: 'No legal disputes found' },
        { name: 'Licensing Requirements', value: 'Met (compliant)', status: 'good', source: 'Regulatory Database', description: 'All licensing requirements are met' },
        { name: 'Industry-Specific Regulations', value: 'Compliant', status: 'good', source: 'Regulatory Audit', description: 'Fully compliant with industry regulations' },
        { name: 'Regulatory Audits', value: 'Clean (compliant)', status: 'good', source: 'Audit Reports', description: 'Clean audit reports with no issues' }
      ],
      equipment: [
        { name: 'Compliance History', value: '0 Issues', status: 'good', source: 'Regulatory Records', description: 'No compliance issues identified' },
        { name: 'Equipment Certifications', value: 'All Current', status: 'good', source: 'Certification Records', description: 'All required certifications are current' },
        { name: 'Safety Record', value: 'Excellent', status: 'good', source: 'Safety Records', description: 'Excellent safety record with equipment' },
        { name: 'Management Experience', value: '14+ years', status: 'good', source: 'Management Profiles', description: 'Extensive industry and equipment experience' },
        { name: 'Operator Training', value: 'Comprehensive', status: 'good', source: 'Training Records', description: 'Comprehensive operator training program' }
      ],
      realestate: [
        { name: 'Property Management History', value: 'Excellent', status: 'good', source: 'Management Records', description: 'Excellent property management history' },
        { name: 'Legal Disputes', value: 'No Disputes', status: 'good', source: 'Public Records', description: 'No legal disputes related to real estate' },
        { name: 'Compliance with Building Codes', value: 'Fully Compliant', status: 'good', source: 'Building Inspection Reports', description: 'Fully compliant with all building codes' },
        { name: 'Environmental Compliance', value: 'Compliant', status: 'good', source: 'Environmental Assessment', description: 'No environmental issues identified' },
        { name: 'Insurance Coverage', value: 'Comprehensive', status: 'good', source: 'Insurance Records', description: 'Comprehensive insurance coverage in place' }
      ]
    }
  },
  all: {
    title: 'Overview of All Risk Categories',
    description: 'Summary of all risk assessment categories',
    metrics: {
      unsecured: [
        { name: 'Overall Risk Score', value: '87/100', status: 'good', source: 'EVA Analysis', description: 'Strong overall risk profile' },
        { name: 'Highest Risk Category', value: 'Capacity (78/100)', status: 'average', source: 'EVA Analysis', description: 'Capacity shows some areas for improvement' },
        { name: 'Lowest Risk Category', value: 'Character (95/100)', status: 'good', source: 'EVA Analysis', description: 'Character assessment shows excellent compliance and management' },
        { name: 'Risk Trend', value: 'Improving', status: 'good', source: 'EVA Trend Analysis', description: 'Risk profile has improved 5% over last 6 months' },
        { name: 'Recommended Action', value: 'Approve with Standard Terms', status: 'good', source: 'EVA Recommendation Engine', description: 'Eligible for standard loan terms' }
      ],
      equipment: [
        { name: 'Overall Risk Score', value: '85/100', status: 'good', source: 'EVA Analysis', description: 'Strong overall risk profile for equipment financing' },
        { name: 'Highest Risk Category', value: 'Capital (82/100)', status: 'good', source: 'EVA Analysis', description: 'Capital structure is solid but could be improved' },
        { name: 'Lowest Risk Category', value: 'Collateral (92/100)', status: 'good', source: 'EVA Analysis', description: 'Equipment collateral assessment is excellent' },
        { name: 'Risk Trend', value: 'Stable', status: 'good', source: 'EVA Trend Analysis', description: 'Risk profile has remained stable over last 6 months' },
        { name: 'Recommended Action', value: 'Approve with Equipment-Specific Terms', status: 'good', source: 'EVA Recommendation Engine', description: 'Eligible for equipment-specific financing terms' }
      ],
      realestate: [
        { name: 'Overall Risk Score', value: '89/100', status: 'good', source: 'EVA Analysis', description: 'Excellent overall risk profile for real estate financing' },
        { name: 'Highest Risk Category', value: 'Capacity (84/100)', status: 'good', source: 'EVA Analysis', description: 'Capacity is strong but slightly below other categories' },
        { name: 'Lowest Risk Category', value: 'Collateral (94/100)', status: 'good', source: 'EVA Analysis', description: 'Real estate collateral assessment is outstanding' },
        { name: 'Risk Trend', value: 'Improving', status: 'good', source: 'EVA Trend Analysis', description: 'Risk profile has improved 3% over last 6 months' },
        { name: 'Recommended Action', value: 'Approve with Preferred Terms', status: 'good', source: 'EVA Recommendation Engine', description: 'Eligible for preferred loan terms' }
      ]
    }
  },
  customer_retention: {
    title: 'Customer Retention Analysis',
    description: 'Evaluation of customer retention strategies and history',
    metrics: {
      unsecured: [
        { name: 'Customer Retention Rate', value: '92%', status: 'good', source: 'Customer Records', description: 'Excellent customer retention' },
        { name: 'Average Customer Lifetime', value: '4.5 years', status: 'good', source: 'Customer Analysis', description: 'Strong customer lifetime value' },
        { name: 'Customer Satisfaction', value: '4.7/5', status: 'good', source: 'Customer Surveys', description: 'High customer satisfaction ratings' },
        { name: 'Customer Growth Rate', value: '+8.5% annually', status: 'good', source: 'Customer Records', description: 'Strong customer growth' },
        { name: 'Churn Rate', value: '8%', status: 'average', source: 'Customer Analysis', description: 'Acceptable churn rate, but room for improvement' }
      ],
      equipment: [
        { name: 'Equipment Customer Retention', value: '94%', status: 'good', source: 'Customer Records', description: 'Excellent equipment customer retention' },
        { name: 'Service Contract Renewal', value: '87%', status: 'good', source: 'Service Records', description: 'Strong service contract renewal rate' },
        { name: 'Equipment Upgrade Rate', value: '45%', status: 'good', source: 'Sales Records', description: 'Good rate of equipment upgrades by existing customers' },
        { name: 'Customer Satisfaction', value: '4.5/5', status: 'good', source: 'Customer Surveys', description: 'High customer satisfaction with equipment' },
        { name: 'Customer Support Rating', value: '4.8/5', status: 'good', source: 'Support Metrics', description: 'Excellent customer support ratings' }
      ],
      realestate: [
        { name: 'Tenant Retention Rate', value: '82%', status: 'good', source: 'Leasing Records', description: 'Strong tenant retention' },
        { name: 'Average Lease Duration', value: '3.8 years', status: 'good', source: 'Lease Analysis', description: 'Above average lease duration' },
        { name: 'Tenant Satisfaction', value: '4.3/5', status: 'good', source: 'Tenant Surveys', description: 'Good tenant satisfaction ratings' },
        { name: 'Lease Renewal Rate', value: '75%', status: 'average', source: 'Leasing Records', description: 'Average lease renewal rate' },
        { name: 'Property Management Rating', value: '4.5/5', status: 'good', source: 'Management Metrics', description: 'Strong property management performance' }
      ]
    }
  }
};

// Mock risk scores for each category
const MOCK_RISK_SCORES: Record<RiskCategory, number> = {
  credit: 85,
  capacity: 78,
  collateral: 82,
  capital: 90,
  conditions: 94,
  character: 95,
  all: 87,
  customer_retention: 88
};

/**
 * API client for fetching EVA report data
 */
class EvaReportApi {
  /**
   * Fetch risk category data for a specific transaction and category
   */
  async fetchCategoryData(
    transactionId: string,
    category: RiskCategory,
    riskMapType: RiskMapType = 'unsecured'
  ): Promise<CategoryData> {
    // In a real app, this would be a real API call
    // For demo purposes, we're simulating a network request with setTimeout
    return new Promise((resolve) => {
      setTimeout(() => {
        const categoryData = MOCK_DATA[category];
        
        // Get metrics based on the risk map type
        const metrics = categoryData.metrics[riskMapType] || categoryData.metrics.unsecured;
        
        resolve({
          title: categoryData.title,
          description: categoryData.description,
          metrics
        });
      }, 500); // Simulate network delay
    });
  }

  /**
   * Fetch all risk scores for a transaction
   */
  async fetchRiskScores(transactionId: string): Promise<Record<RiskCategory, number>> {
    // Simulate network request
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would fetch from your API
        resolve(MOCK_RISK_SCORES);
      }, 300);
    });
  }

  /**
   * Fetch the complete EVA report for a transaction
   */
  async fetchFullReport(
    transactionId: string,
    riskMapType: RiskMapType = 'unsecured'
  ): Promise<EvaReportData> {
    // Simulate network request
    return new Promise((resolve) => {
      setTimeout(() => {
        // In a real app, this would fetch the complete report from your API
        const categories: Record<RiskCategory, CategoryData> = {} as any;
        
        // Populate categories with data
        (Object.keys(MOCK_DATA) as RiskCategory[]).forEach(category => {
          const data = MOCK_DATA[category];
          categories[category] = {
            title: data.title,
            description: data.description,
            metrics: data.metrics[riskMapType] || data.metrics.unsecured
          };
        });
        
        resolve({
          transactionId,
          categories,
          riskScores: MOCK_RISK_SCORES,
          lastUpdated: new Date().toISOString()
        });
      }, 800);
    });
  }
  
  /**
   * Generate and download a PDF report
   * 
   * In a real application, this would call an API endpoint that generates
   * a PDF report server-side and returns it for download.
   * 
   * For demo purposes, we're simulating the download with a setTimeout.
   */
  async generatePdfReport(
    transactionId: string,
    riskMapType: RiskMapType = 'unsecured'
  ): Promise<boolean> {
    console.log(`Generating PDF report for transaction ${transactionId} with type ${riskMapType}`);
    
    // In a real app, we would:
    // 1. Call an API endpoint to generate the PDF
    // 2. Receive a blob or download URL
    // 3. Trigger download using that URL
    
    // Simulate network request and processing time
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('PDF report generation completed');
        
        // In a real implementation, we would trigger the download here
        // For the demo, we'll just simulate success
        
        // You could use the following code in a real implementation:
        /*
        fetch(`${API_ENDPOINT}/reports/${transactionId}/pdf?type=${riskMapType}`)
          .then(response => response.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `EVA_Risk_Report_${transactionId}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            resolve(true);
          })
          .catch(error => {
            console.error('Error downloading PDF:', error);
            resolve(false);
          });
        */
        
        resolve(true);
      }, 1500);
    });
  }
}

export default new EvaReportApi(); 