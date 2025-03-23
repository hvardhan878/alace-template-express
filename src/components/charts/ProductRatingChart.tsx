import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  stock: number;
}

interface ProductRatingChartProps {
  products: Product[];
}

const ProductRatingChart: React.FC<ProductRatingChartProps> = ({ products }) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (products.length > 0) {
      // Sort products by rating (highest to lowest)
      const sortedProducts = [...products].sort((a, b) => b.rating - a.rating);
      
      // Take top 10 products or all if less than 10
      const topProducts = sortedProducts.slice(0, 10);
      
      const labels = topProducts.map(product => product.name);
      const ratings = topProducts.map(product => product.rating);
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Product Ratings',
            data: ratings,
            backgroundColor: 'rgba(53, 162, 235, 0.7)',
            borderColor: 'rgba(53, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      });
    }
  }, [products]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Product Ratings</h3>
      <div className="relative h-80">
        {products.length > 0 ? (
          <Bar 
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.dataset.label || '';
                      const value = context.raw as number;
                      return `${label}: ${value.toFixed(1)}/5`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: false,
                  min: Math.max(0, Math.min(...products.map(p => p.rating)) - 0.5),
                  max: 5,
                  title: {
                    display: true,
                    text: 'Rating (out of 5)'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Product'
                  }
                }
              }
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">No product data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductRatingChart; 