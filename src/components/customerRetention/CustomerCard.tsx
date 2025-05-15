import React from 'react';
import { Card, Button, Badge } from '../../../design-system';
import { formatDate } from '../../utils/dateUtils';

// Customer type definition for TypeScript
interface Customer {
  id: string;
  name: string;
  position: string;
  company: string;
  lastContact: string;
  nextFollowUp: string;
  products: string[];
  riskLevel: 'low' | 'medium' | 'high';
  riskPercentage: number;
}

interface CustomerCardProps {
  customer: Customer;
  onSchedule: (customerId: string) => void;
  onViewDetails: (customerId: string) => void;
}

/**
 * CustomerCard component that uses the design system to ensure consistency
 */
export const CustomerCard: React.FC<CustomerCardProps> = ({ 
  customer,
  onSchedule,
  onViewDetails
}) => {
  // Map risk level to badge variant
  const riskVariantMap: Record<string, 'success' | 'warning' | 'danger'> = {
    low: 'success',
    medium: 'warning',
    high: 'danger'
  };
  
  // Format dates consistently
  const formattedLastContact = formatDate(customer.lastContact);
  const formattedNextFollowUp = customer.nextFollowUp ? formatDate(customer.nextFollowUp) : 'Not scheduled';
  
  return (
    <Card
      variant="default"
      padding="md"
      elevation="sm"
      className="mb-4"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
          <p className="text-sm text-gray-500">{customer.position} - {customer.company}</p>
        </div>
        <Badge 
          variant={riskVariantMap[customer.riskLevel]}
          size="md"
          pill
        >
          {customer.riskPercentage}%
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Last Contact</p>
          <p className="text-sm">{formattedLastContact}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Next Follow-up</p>
          <p className="text-sm">{formattedNextFollowUp}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-1">Products & Services</p>
        <div className="flex flex-wrap gap-2">
          {customer.products.map((product, index) => (
            <Badge 
              key={index}
              variant="default"
              size="sm"
              outlined
            >
              {product}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end gap-3">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onViewDetails(customer.id)}
        >
          Details
        </Button>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => onSchedule(customer.id)}
        >
          Schedule
        </Button>
      </div>
    </Card>
  );
};

export default CustomerCard; 