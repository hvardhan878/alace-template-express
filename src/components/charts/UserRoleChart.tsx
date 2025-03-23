import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface UserRoleChartProps {
  users: User[];
}

const UserRoleChart: React.FC<UserRoleChartProps> = ({ users }) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (users.length > 0) {
      // Count users by role
      const roleCount: Record<string, number> = {};
      users.forEach(user => {
        if (roleCount[user.role]) {
          roleCount[user.role]++;
        } else {
          roleCount[user.role] = 1;
        }
      });

      // Prepare data for chart
      const labels = Object.keys(roleCount);
      const data = Object.values(roleCount);

      // Generate random colors for each role
      const backgroundColors = labels.map(() => 
        `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.7)`
      );

      setChartData({
        labels,
        datasets: [
          {
            label: 'Number of Users',
            data,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
            borderWidth: 1,
          },
        ],
      });
    }
  }, [users]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">User Roles Distribution</h3>
      <div className="relative h-64">
        {users.length > 0 ? (
          <Pie 
            data={chartData} 
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const label = context.label || '';
                      const value = context.raw as number || 0;
                      const percentage = Math.round((value / users.length) * 100);
                      return `${label}: ${value} (${percentage}%)`;
                    }
                  }
                }
              }
            }} 
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">No user data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRoleChart; 