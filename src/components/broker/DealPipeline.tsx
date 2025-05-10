import React, { useState } from 'react';

interface Deal {
  id: string;
  borrowerName: string;
  dealAmount: number;
  commissionRate: number;
  stage: 'lead' | 'application' | 'underwriting' | 'approved' | 'funded' | 'declined';
  stageDate: string;
  lenderId: string;
  lenderName: string;
  dealType: string;
  expectedFundingDate?: string;
  probability: number;
}

interface Lender {
  id: string;
  name: string;
  approvalRate: number;
  averageTurnaround: number;
  commissionRate: number;
  preferredAssetClasses: string[];
  avgDealSize: number;
}

interface DealPipelineProps {
  initialDeals?: Deal[];
  lenders?: Lender[];
  onDealUpdate?: (deal: Deal) => void;
}

const DealPipeline: React.FC<DealPipelineProps> = ({
  initialDeals = [],
  lenders = [],
  onDealUpdate,
}) => {
  const [deals, setDeals] = useState<Deal[]>(
    initialDeals.length > 0
      ? initialDeals
      : [
          {
            id: 'deal-1',
            borrowerName: 'Acme Manufacturing',
            dealAmount: 250000,
            commissionRate: 2.5,
            stage: 'application',
            stageDate: '2023-09-15',
            lenderId: 'lender-1',
            lenderName: 'First Capital Bank',
            dealType: 'Equipment Financing',
            expectedFundingDate: '2023-11-01',
            probability: 60,
          },
          {
            id: 'deal-2',
            borrowerName: 'Metro Properties',
            dealAmount: 750000,
            commissionRate: 1.8,
            stage: 'underwriting',
            stageDate: '2023-10-01',
            lenderId: 'lender-2',
            lenderName: 'Commercial Trust',
            dealType: 'Commercial Real Estate',
            expectedFundingDate: '2023-12-15',
            probability: 75,
          },
          {
            id: 'deal-3',
            borrowerName: 'Tech Innovations Inc',
            dealAmount: 150000,
            commissionRate: 3.0,
            stage: 'approved',
            stageDate: '2023-10-10',
            lenderId: 'lender-3',
            lenderName: 'Growth Capital Partners',
            dealType: 'Working Capital',
            expectedFundingDate: '2023-10-30',
            probability: 95,
          },
          {
            id: 'deal-4',
            borrowerName: 'Sunshine Retail',
            dealAmount: 80000,
            commissionRate: 2.0,
            stage: 'funded',
            stageDate: '2023-10-05',
            lenderId: 'lender-1',
            lenderName: 'First Capital Bank',
            dealType: 'Inventory Financing',
            probability: 100,
          },
          {
            id: 'deal-5',
            borrowerName: 'Green Energy Solutions',
            dealAmount: 450000,
            commissionRate: 2.2,
            stage: 'lead',
            stageDate: '2023-10-12',
            lenderId: 'lender-4',
            lenderName: 'Renewable Finance Group',
            dealType: 'Equipment Financing',
            probability: 25,
          },
          {
            id: 'deal-6',
            borrowerName: 'Downtown Bistro',
            dealAmount: 120000,
            commissionRate: 2.8,
            stage: 'declined',
            stageDate: '2023-09-28',
            lenderId: 'lender-2',
            lenderName: 'Commercial Trust',
            dealType: 'SBA Loan',
            probability: 0,
          },
        ]
  );

  const [lendersList, setLendersList] = useState<Lender[]>(
    lenders.length > 0
      ? lenders
      : [
          {
            id: 'lender-1',
            name: 'First Capital Bank',
            approvalRate: 72,
            averageTurnaround: 14,
            commissionRate: 2.5,
            preferredAssetClasses: ['Equipment', 'Inventory', 'Working Capital'],
            avgDealSize: 175000,
          },
          {
            id: 'lender-2',
            name: 'Commercial Trust',
            approvalRate: 65,
            averageTurnaround: 21,
            commissionRate: 1.8,
            preferredAssetClasses: ['Commercial Real Estate', 'Construction'],
            avgDealSize: 625000,
          },
          {
            id: 'lender-3',
            name: 'Growth Capital Partners',
            approvalRate: 58,
            averageTurnaround: 10,
            commissionRate: 3.0,
            preferredAssetClasses: ['Working Capital', 'Startup Funding', 'Technology'],
            avgDealSize: 200000,
          },
          {
            id: 'lender-4',
            name: 'Renewable Finance Group',
            approvalRate: 80,
            averageTurnaround: 17,
            commissionRate: 2.2,
            preferredAssetClasses: ['Green Energy', 'Sustainable Equipment', 'Solar'],
            avgDealSize: 350000,
          },
        ]
  );

  // Sorting and filtering
  const [sortBy, setSortBy] = useState<string>('dealAmount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [lenderFilter, setLenderFilter] = useState<string>('all');

  // Calculate stage counts for funnel
  const stageCounts = deals.reduce(
    (acc, deal) => {
      if (!acc[deal.stage]) {
        acc[deal.stage] = 0;
      }
      acc[deal.stage]++;
      return acc;
    },
    {} as Record<string, number>
  );

  const stageOrder = ['lead', 'application', 'underwriting', 'approved', 'funded', 'declined'];

  // Sort and filter deals
  const filteredDeals = deals
    .filter(deal => stageFilter === 'all' || deal.stage === stageFilter)
    .filter(deal => lenderFilter === 'all' || deal.lenderId === lenderFilter)
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === 'dealAmount') {
        comparison = a.dealAmount - b.dealAmount;
      } else if (sortBy === 'borrowerName') {
        comparison = a.borrowerName.localeCompare(b.borrowerName);
      } else if (sortBy === 'probability') {
        comparison = a.probability - b.probability;
      } else if (sortBy === 'stageDate') {
        comparison = new Date(a.stageDate).getTime() - new Date(b.stageDate).getTime();
      } else if (sortBy === 'lenderName') {
        comparison = a.lenderName.localeCompare(b.lenderName);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

  // Calculate commission forecasts
  const calculateTotalCommission = (deals: Deal[]): number => {
    return deals.reduce((total, deal) => {
      // Only include deals that are in progress or complete (not declined)
      if (deal.stage !== 'declined') {
        return total + deal.dealAmount * (deal.commissionRate / 100) * (deal.probability / 100);
      }
      return total;
    }, 0);
  };

  const totalExpectedCommission = calculateTotalCommission(deals);

  // Calculate commissions by stage
  const commissionByStage = stageOrder.reduce(
    (acc, stage) => {
      if (stage !== 'declined') {
        const stageDeals = deals.filter(deal => deal.stage === stage);
        acc[stage] = calculateTotalCommission(stageDeals);
      }
      return acc;
    },
    {} as Record<string, number>
  );

  // Calculate commissions by lender
  const commissionByLender = lendersList.reduce(
    (acc, lender) => {
      const lenderDeals = deals.filter(
        deal => deal.lenderId === lender.id && deal.stage !== 'declined'
      );
      acc[lender.id] = calculateTotalCommission(lenderDeals);
      return acc;
    },
    {} as Record<string, number>
  );

  // Handle deal stage update
  const handleStageChange = (dealId: string, newStage: Deal['stage']) => {
    const updatedDeals = deals.map(deal => {
      if (deal.id === dealId) {
        // Update probability based on stage
        let newProbability = deal.probability;
        switch (newStage) {
          case 'lead':
            newProbability = 25;
            break;
          case 'application':
            newProbability = 50;
            break;
          case 'underwriting':
            newProbability = 70;
            break;
          case 'approved':
            newProbability = 90;
            break;
          case 'funded':
            newProbability = 100;
            break;
          case 'declined':
            newProbability = 0;
            break;
        }

        const updatedDeal = {
          ...deal,
          stage: newStage,
          stageDate: new Date().toISOString().split('T')[0],
          probability: newProbability,
        };

        onDealUpdate?.(updatedDeal);
        return updatedDeal;
      }
      return deal;
    });

    setDeals(updatedDeals);
  };

  // Handle sort change
  const handleSortChange = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  // Get highest performing lender
  const getTopLender = () => {
    return lendersList.reduce(
      (top, lender) => {
        const lenderDeals = deals.filter(deal => deal.lenderId === lender.id);
        const fundedDeals = lenderDeals.filter(deal => deal.stage === 'funded').length;
        const lenderPerformance = fundedDeals / (lenderDeals.length || 1);

        return lenderPerformance > top.performance
          ? { id: lender.id, performance: lenderPerformance }
          : top;
      },
      { id: '', performance: 0 }
    );
  };

  const topLenderId = getTopLender().id;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header with summary stats */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white mb-2">Deal Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-white">
            <div className="text-sm opacity-80">Active Deals</div>
            <div className="text-2xl font-semibold mt-1">
              {deals.filter(d => d.stage !== 'declined' && d.stage !== 'funded').length}
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-white">
            <div className="text-sm opacity-80">Total Pipeline Value</div>
            <div className="text-2xl font-semibold mt-1">
              $
              {deals
                .filter(d => d.stage !== 'declined')
                .reduce((sum, deal) => sum + deal.dealAmount, 0)
                .toLocaleString()}
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-white">
            <div className="text-sm opacity-80">Est. Commission</div>
            <div className="text-2xl font-semibold mt-1">
              ${totalExpectedCommission.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-3 text-white">
            <div className="text-sm opacity-80">Conversion Rate</div>
            <div className="text-2xl font-semibold mt-1">
              {deals.length > 0
                ? ((deals.filter(d => d.stage === 'funded').length / deals.length) * 100).toFixed(
                    1
                  ) + '%'
                : '0%'}
            </div>
          </div>
        </div>
      </div>

      {/* Pipeline Funnel Visualization */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pipeline Funnel</h3>
        <div className="relative">
          <div className="flex items-end justify-between h-48 mb-2">
            {stageOrder
              .filter(stage => stage !== 'declined')
              .map((stage, index) => {
                const count = stageCounts[stage] || 0;
                const maxCount = Math.max(...Object.values(stageCounts));
                const height = maxCount > 0 ? (count / maxCount) * 100 : 0;
                const stageLabels = {
                  lead: 'Leads',
                  application: 'Applications',
                  underwriting: 'Underwriting',
                  approved: 'Approved',
                  funded: 'Funded',
                };

                return (
                  <div key={stage} className="flex flex-col items-center w-1/5">
                    <div className="mb-2 text-center">
                      <div className="text-sm font-medium">{count}</div>
                      <div className="text-xs text-gray-500">
                        $
                        {commissionByStage[stage]?.toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </div>
                    </div>
                    <div
                      className={`w-full bg-blue-${600 - index * 100} rounded-t-md transition-all duration-500`}
                      style={{ height: `${Math.max(height, 5)}%` }}
                    ></div>
                    <div className="mt-2 text-xs font-medium text-gray-700">
                      {stageLabels[stage as keyof typeof stageLabels]}
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Funnel connecting lines */}
          <div className="absolute top-0 left-0 right-0 bottom-16 flex justify-between">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex-1 relative">
                <div className="absolute bottom-0 right-0 w-full h-48 border-r-[25px] border-l-[25px] border-r-transparent border-l-transparent border-t-[15px] border-t-gray-100"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lender Performance Comparison */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Lender Comparison</h3>
          <div className="text-sm text-gray-500">Showing top metrics by lender</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {lendersList.map(lender => (
            <div
              key={lender.id}
              className={`border rounded-lg p-4 ${lender.id === topLenderId ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-medium text-gray-900">{lender.name}</div>
                {lender.id === topLenderId && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                    Top Performer
                  </span>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Approval Rate</span>
                  <span className="font-medium">{lender.approvalRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Turn-Around</span>
                  <span className="font-medium">{lender.averageTurnaround} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Commission</span>
                  <span className="font-medium">{lender.commissionRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Est. Earnings</span>
                  <span className="font-medium text-indigo-600">
                    $
                    {commissionByLender[lender.id]?.toLocaleString(undefined, {
                      maximumFractionDigits: 0,
                    }) || '0'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deal Table */}
      <div className="px-6 py-4">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-2 sm:mb-0">Active Deals</h3>

          <div className="flex flex-wrap space-x-2">
            <select
              className="rounded-md border-gray-300 py-1 pl-3 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              value={stageFilter}
              onChange={e => setStageFilter(e.target.value)}
            >
              <option value="all">All Stages</option>
              {stageOrder.map(stage => (
                <option key={stage} value={stage}>
                  {stage.charAt(0).toUpperCase() + stage.slice(1)}
                </option>
              ))}
            </select>

            <select
              className="rounded-md border-gray-300 py-1 pl-3 pr-8 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              value={lenderFilter}
              onChange={e => setLenderFilter(e.target.value)}
            >
              <option value="all">All Lenders</option>
              {lendersList.map(lender => (
                <option key={lender.id} value={lender.id}>
                  {lender.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('borrowerName')}
                >
                  <div className="flex items-center">
                    Borrower
                    {sortBy === 'borrowerName' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('dealAmount')}
                >
                  <div className="flex items-center">
                    Amount
                    {sortBy === 'dealAmount' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('lenderName')}
                >
                  <div className="flex items-center">
                    Lender
                    {sortBy === 'lenderName' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Deal Type
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSortChange('probability')}
                >
                  <div className="flex items-center">
                    Probability
                    {sortBy === 'probability' && (
                      <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Commission
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Stage
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDeals.map(deal => (
                <tr key={deal.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{deal.borrowerName}</div>
                    <div className="text-xs text-gray-500">
                      Updated: {new Date(deal.stageDate).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${deal.dealAmount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{deal.lenderName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{deal.dealType}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          deal.probability >= 75
                            ? 'bg-green-500'
                            : deal.probability >= 50
                              ? 'bg-yellow-500'
                              : deal.probability > 0
                                ? 'bg-orange-500'
                                : 'bg-red-500'
                        }`}
                        style={{ width: `${deal.probability}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{deal.probability}% chance</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${(deal.dealAmount * (deal.commissionRate / 100)).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{deal.commissionRate}% rate</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={deal.stage}
                      onChange={e => handleStageChange(deal.id, e.target.value as Deal['stage'])}
                      className="rounded-md border-gray-300 py-1 pl-2 pr-7 text-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                    >
                      {stageOrder.map(stage => (
                        <option key={stage} value={stage}>
                          {stage.charAt(0).toUpperCase() + stage.slice(1)}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}

              {filteredDeals.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No deals match your current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DealPipeline;
