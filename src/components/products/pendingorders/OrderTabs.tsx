import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SellerOrderFilter, OrderTab, OrderCounts } from './types';

interface OrderTabsProps {
  activeTab: SellerOrderFilter;
  onTabChange: (tab: SellerOrderFilter) => void;
  orderCounts: OrderCounts;
  loading?: boolean;
}

const OrderTabs: React.FC<OrderTabsProps> = ({
  activeTab,
  onTabChange,
  orderCounts,
  loading = false
}) => {
  const tabs: OrderTab[] = [
    { 
      key: 'all', 
      label: 'Todas', 
      badgeStyle: 'bg-gray-100 text-gray-800 border-gray-200',
      count: orderCounts.all 
    },
    { 
      key: 'pending', 
      label: 'Pendientes', 
      badgeStyle: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      count: orderCounts.pending 
    },
    { 
      key: 'confirmed', 
      label: 'Aprobadas', 
      badgeStyle: 'bg-green-100 text-green-800 border-green-200',
      count: orderCounts.confirmed 
    },
    { 
      key: 'cancelled', 
      label: 'Rechazadas', 
      badgeStyle: 'bg-red-100 text-red-800 border-red-200',
      count: orderCounts.cancelled 
    }
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => !loading && onTabChange(tab.key)}
            disabled={loading}
            className={`
              flex items-center py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors
              ${activeTab === tab.key 
                ? 'border-green-500 text-green-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
              ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <Badge 
                variant="outline" 
                className={`ml-2 text-xs ${tab.badgeStyle}`}
              >
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default OrderTabs; 