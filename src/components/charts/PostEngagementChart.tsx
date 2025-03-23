import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Post {
  id: number;
  title: string;
  content: string;
  author: number;
  date: string;
  tags: string[];
  likes: number;
  comments: number;
}

interface PostEngagementChartProps {
  posts: Post[];
}

const PostEngagementChart: React.FC<PostEngagementChartProps> = ({ posts }) => {
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    if (posts.length > 0) {
      // Sort posts by date
      const sortedPosts = [...posts].sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      
      const labels = sortedPosts.map(post => {
        const date = new Date(post.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      });
      
      const likes = sortedPosts.map(post => post.likes);
      const comments = sortedPosts.map(post => post.comments);
      
      setChartData({
        labels,
        datasets: [
          {
            label: 'Likes',
            data: likes,
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Comments',
            data: comments,
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      });
    }
  }, [posts]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Post Engagement Over Time</h3>
      <div className="relative h-80">
        {posts.length > 0 ? (
          <Line 
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
                    title: function(context) {
                      const index = context[0].dataIndex;
                      return posts[index].title;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Count'
                  }
                },
                x: {
                  title: {
                    display: true,
                    text: 'Date'
                  }
                }
              }
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">No post data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostEngagementChart; 