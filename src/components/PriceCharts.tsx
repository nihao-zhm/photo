import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { Product, PLATFORMS } from '../../shared/types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface PriceChartsProps {
  products: Product[];
}

export const PriceCharts: React.FC<PriceChartsProps> = ({ products }) => {
  const priceDistributionData = React.useMemo(() => {
    if (products.length === 0) return null;

    const prices = products.map(p => p.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const range = max - min;
    const bucketSize = Math.max(500, Math.ceil(range / 8));
    
    const buckets: Record<string, number> = {};
    for (let i = 0; i < 8; i++) {
      const start = min + i * bucketSize;
      const end = start + bucketSize;
      buckets[`¥${start.toLocaleString()}-¥${end.toLocaleString()}`] = 0;
    }

    prices.forEach(price => {
      const bucketIndex = Math.min(Math.floor((price - min) / bucketSize), 7);
      const start = min + bucketIndex * bucketSize;
      const end = start + bucketSize;
      const key = `¥${start.toLocaleString()}-¥${end.toLocaleString()}`;
      buckets[key] = (buckets[key] || 0) + 1;
    });

    return {
      labels: Object.keys(buckets),
      datasets: [
        {
          label: '商品数量',
          data: Object.values(buckets),
          backgroundColor: 'rgba(37, 99, 235, 0.7)',
          borderColor: 'rgba(37, 99, 235, 1)',
          borderWidth: 2,
          borderRadius: 8,
        },
      ],
    };
  }, [products]);

  const platformDistributionData = React.useMemo(() => {
    if (products.length === 0) return null;

    const counts: Record<string, number> = {};
    products.forEach(p => {
      counts[p.platform] = (counts[p.platform] || 0) + 1;
    });

    return {
      labels: Object.keys(counts).map(k => PLATFORMS[k]?.name || k),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: Object.keys(counts).map(k => PLATFORMS[k]?.color || '#999'),
          borderWidth: 2,
          borderColor: '#fff',
        },
      ],
    };
  }, [products]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 价格分布</h3>
        {priceDistributionData && (
          <div className="h-64">
            <Bar data={priceDistributionData} options={chartOptions} />
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">🏪 平台分布</h3>
        {platformDistributionData && (
          <div className="h-64">
            <Pie data={platformDistributionData} options={pieOptions} />
          </div>
        )}
      </div>
    </div>
  );
};
