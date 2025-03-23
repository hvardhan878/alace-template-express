import React, { useState, useEffect } from 'react';
import { GlobeIcon, UserIcon, ShoppingBagIcon, CheckSquareIcon, BookOpenIcon, PieChartIcon } from 'lucide-react';
import ChartsDashboard from './components/charts/ChartsDashboard';

// Define interfaces for our data types
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

function App() {
  // State for storing data from the API
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCharts, setShowCharts] = useState(false);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch users
        const usersResponse = await fetch('/api/users');
        const usersData = await usersResponse.json();
        setUsers(usersData);
        
        // Fetch products
        const productsResponse = await fetch('/api/products');
        const productsData = await productsResponse.json();
        setProducts(productsData);
        
        // Fetch tasks
        const tasksResponse = await fetch('/api/tasks');
        const tasksData = await tasksResponse.json();
        setTasks(tasksData);
        
        // Fetch posts
        const postsResponse = await fetch('/api/posts');
        const postsData = await postsResponse.json();
        setPosts(postsData);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="text-red-500 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-2">Error</h2>
          <p className="text-center text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            <GlobeIcon className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
            React SSR with Express.js
          </h1>
          <p className="text-center text-gray-600 mb-8">
            This page is server-side rendered and hydrated on the client.
            Data is fetched from our backend API.
          </p>

          {/* Analytics Dashboard Toggle Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShowCharts(!showCharts)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PieChartIcon className="h-5 w-5 mr-2" />
              {showCharts ? 'Hide Analytics Dashboard' : 'Show Analytics Dashboard'}
            </button>
          </div>

          {/* Charts Dashboard */}
          {showCharts && (
            <div className="mb-12">
              <ChartsDashboard 
                users={users}
                products={products}
                tasks={tasks}
                posts={posts}
              />
            </div>
          )}

          {/* Users Section */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <UserIcon className="h-6 w-6 text-blue-500 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Users</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map(user => (
                <div key={user.id} className="border rounded-lg p-4 flex items-center">
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-12 h-12 rounded-full mr-4" 
                  />
                  <div>
                    <h3 className="font-medium text-gray-900">{user.name}</h3>
                    <p className="text-gray-500 text-sm">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products Section */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <ShoppingBagIcon className="h-6 w-6 text-green-500 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 3).map(product => (
                <div key={product.id} className="border rounded-lg overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover" 
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">{product.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-green-600">${product.price}</span>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                        Rating: {product.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks Section */}
          <div className="mb-12">
            <div className="flex items-center mb-4">
              <CheckSquareIcon className="h-6 w-6 text-purple-500 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Tasks</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Priority
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned To
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tasks.map(task => {
                    const assignedUser = users.find(user => user.id === task.assignedTo);
                    return (
                      <tr key={task.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{task.title}</div>
                          <div className="text-sm text-gray-500">{task.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${task.status === 'completed' ? 'bg-green-100 text-green-800' : 
                              task.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-gray-100 text-gray-800'}`}>
                            {task.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                              task.priority === 'medium' ? 'bg-blue-100 text-blue-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {task.dueDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {assignedUser && (
                              <>
                                <img 
                                  className="h-8 w-8 rounded-full mr-2" 
                                  src={assignedUser.avatar} 
                                  alt={assignedUser.name} 
                                />
                                <div className="text-sm text-gray-900">{assignedUser.name}</div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Posts Section */}
          <div>
            <div className="flex items-center mb-4">
              <BookOpenIcon className="h-6 w-6 text-amber-500 mr-2" />
              <h2 className="text-2xl font-semibold text-gray-800">Posts</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map(post => {
                const author = users.find(user => user.id === post.author);
                return (
                  <div key={post.id} className="border rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-600 mb-4">{post.content}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center">
                        {author && (
                          <>
                            <img 
                              src={author.avatar} 
                              alt={author.name} 
                              className="h-6 w-6 rounded-full mr-2" 
                            />
                            <span>{author.name}</span>
                          </>
                        )}
                      </div>
                      <div>{post.date}</div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
                      <div className="text-gray-500">
                        <span className="font-medium text-blue-500">{post.likes}</span> Likes
                      </div>
                      <div className="text-gray-500">
                        <span className="font-medium text-blue-500">{post.comments}</span> Comments
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;