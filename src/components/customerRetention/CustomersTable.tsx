import React, { useState } from 'react';
import { Table, Badge, Button } from '../../../design-system';
import { formatDate } from '../../utils/dateUtils';

interface Customer {
  id: string;
  name: string;
  company: string;
  type: string;
  lastContact: string;
  nextFollowUp: string;
  products: string[];
  riskLevel: 'low' | 'medium' | 'high';
  riskPercentage: number;
}

interface CustomersTableProps {
  customers: Customer[];
  onViewDetails: (customerId: string) => void;
  onSchedule: (customerId: string) => void;
  loading?: boolean;
  darkMode?: boolean;
}

/**
 * CustomersTable component that uses the design system Table component
 * for a consistent data display experience
 */
const CustomersTable: React.FC<CustomersTableProps> = ({
  customers,
  onViewDetails,
  onSchedule,
  loading = false,
  darkMode = false,
}) => {
  // State for sorting
  const [sortedColumn, setSortedColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Risk level mapping to badge variants
  const riskVariantMap: Record<string, 'success' | 'warning' | 'danger'> = {
    low: 'success',
    medium: 'warning',
    high: 'danger'
  };

  // Handle sort column change
  const handleSort = (column: string) => {
    if (sortedColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortedColumn(column);
      setSortDirection('asc');
    }
  };

  // Sort the data based on current sort settings
  const sortedData = [...customers].sort((a, b) => {
    const aValue = (a as any)[sortedColumn];
    const bValue = (b as any)[sortedColumn];

    if (sortedColumn === 'riskPercentage') {
      // Numeric sort
      return sortDirection === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    } else if (sortedColumn === 'lastContact' || sortedColumn === 'nextFollowUp') {
      // Date sort
      const aDate = new Date(aValue || 0).getTime();
      const bDate = new Date(bValue || 0).getTime();
      return sortDirection === 'asc' 
        ? aDate - bDate 
        : bDate - aDate;
    } else {
      // String sort
      if (!aValue) return sortDirection === 'asc' ? 1 : -1;
      if (!bValue) return sortDirection === 'asc' ? -1 : 1;
      
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
  });

  // Create handler functions outside the render to avoid type errors
  const handleDetailClick = (customerId: string) => () => {
    onViewDetails(customerId);
  };

  const handleScheduleClick = (customerId: string) => () => {
    onSchedule(customerId);
  };

  // Table columns configuration
  const columns = [
    {
      key: 'name',
      header: 'Customer',
      sortable: true,
      render: (customer: Customer) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-gray-100">{customer.name}</div>
          <div className="text-gray-500 dark:text-gray-400 text-xs">{customer.company}</div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      render: (customer: Customer) => (
        <Badge 
          variant="default" 
          size="sm"
          outlined
        >
          {customer.type}
        </Badge>
      )
    },
    {
      key: 'lastContact',
      header: 'Last Contact',
      sortable: true,
      render: (customer: Customer) => formatDate(customer.lastContact)
    },
    {
      key: 'nextFollowUp',
      header: 'Next Follow-up',
      sortable: true,
      render: (customer: Customer) => customer.nextFollowUp 
        ? formatDate(customer.nextFollowUp) 
        : <span className="text-gray-400">Not scheduled</span>
    },
    {
      key: 'products',
      header: 'Products',
      render: (customer: Customer) => (
        <div className="flex flex-wrap gap-1">
          {customer.products.map((product, index) => (
            <Badge
              key={index}
              variant="default"
              size="xs"
              outlined
            >
              {product}
            </Badge>
          ))}
        </div>
      )
    },
    {
      key: 'riskPercentage',
      header: 'Risk',
      align: 'center' as const,
      sortable: true,
      render: (customer: Customer) => (
        <Badge
          variant={riskVariantMap[customer.riskLevel]}
          size="sm"
          pill
        >
          {customer.riskPercentage}%
        </Badge>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right' as const,
      render: (customer: Customer) => (
        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDetailClick(customer.id)}
          >
            Details
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleScheduleClick(customer.id)}
          >
            Schedule
          </Button>
        </div>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      data={sortedData}
      rowKey="id"
      striped
      hoverable
      bordered={false}
      darkMode={darkMode}
      loading={loading}
      emptyText="No customers found"
      onRowClick={(customer) => onViewDetails(customer.id)}
      sortedColumn={sortedColumn}
      sortDirection={sortDirection}
      onSort={handleSort}
    />
  );
};

export default CustomersTable; 