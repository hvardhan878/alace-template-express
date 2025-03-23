import React, { useState, useEffect } from 'react';
import UserRoleChart from './UserRoleChart';
import ProductRatingChart from './ProductRatingChart';
import TaskStatusChart from './TaskStatusChart';
import PostEngagementChart from './PostEngagementChart';
import { TrendingUpIcon } from 'lucide-react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}

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

interface Task {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: number;
}

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

interface ChartsDashboardProps {
  users: User[];
  products: Product[];
  tasks: Task[];
  posts: Post[];
}

const ChartsDashboard: React.FC<ChartsDashboardProps> = ({
  users,
  products,
  tasks,
  posts,
}) => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate loading time for charts
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading charts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 rounded-lg">
      <div className="flex items-center mb-6">
        <TrendingUpIcon className="h-7 w-7 text-indigo-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UserRoleChart users={users} />
        <ProductRatingChart products={products} />
        <TaskStatusChart tasks={tasks} />
        <PostEngagementChart posts={posts} />
      </div>

      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Dashboard Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-indigo-50 p-4 rounded-lg">
            <p className="text-sm text-indigo-600 font-medium">Total Users</p>
            <p className="text-2xl font-bold text-indigo-800">{users.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-600 font-medium">Total Products</p>
            <p className="text-2xl font-bold text-green-800">{products.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <p className="text-sm text-yellow-600 font-medium">Total Tasks</p>
            <p className="text-2xl font-bold text-yellow-800">{tasks.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-sm text-purple-600 font-medium">Total Posts</p>
            <p className="text-2xl font-bold text-purple-800">{posts.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartsDashboard; 