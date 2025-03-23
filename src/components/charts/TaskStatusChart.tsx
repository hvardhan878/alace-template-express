import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: number;
}

interface TaskStatusChartProps {
  tasks: Task[];
}

const TaskStatusChart: React.FC<TaskStatusChartProps> = ({ tasks }) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (tasks.length > 0) {
      // Count tasks by status
      const statusCount: Record<string, number> = {
        pending: 0,
        'in-progress': 0,
        completed: 0
      };
      
      tasks.forEach(task => {
        statusCount[task.status]++;
      });

      // Prepare data for chart
      const labels = Object.keys(statusCount).map(key => 
        key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' ')
      );
      const data = Object.values(statusCount);

      // Set colors for each status
      const backgroundColors = [
        'rgba(255, 159, 64, 0.7)',   // Pending - orange
        'rgba(54, 162, 235, 0.7)',    // In-progress - blue
        'rgba(75, 192, 192, 0.7)',    // Completed - green
      ];

      setChartData({
        labels,
        datasets: [
          {
            label: 'Number of Tasks',
            data,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
            borderWidth: 1,
          },
        ],
      });
    }
  }, [tasks]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
      <div className="relative h-64">
        {tasks.length > 0 ? (
          <Doughnut 
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
                      const percentage = Math.round((value / tasks.length) * 100);
                      return `${label}: ${value} (${percentage}%)`;
                    }
                  }
                }
              },
              cutout: '50%'
            }} 
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">No task data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskStatusChart; 