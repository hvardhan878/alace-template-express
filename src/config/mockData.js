// Mock data for the server-side

// User data
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Admin',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'User',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: 3,
    name: 'Michael Johnson',
    email: 'michael.johnson@example.com',
    role: 'User',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    role: 'Manager',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: 5,
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    role: 'User',
    avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
  }
];

// Product data
const products = [
  {
    id: 1,
    name: 'Smartphone X',
    description: 'Latest smartphone with advanced features',
    price: 999,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.8,
    stock: 50
  },
  {
    id: 2,
    name: 'Laptop Pro',
    description: 'High-performance laptop for professionals',
    price: 1499,
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.9,
    stock: 30
  },
  {
    id: 3,
    name: 'Wireless Headphones',
    description: 'Noise-cancelling wireless headphones',
    price: 299,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.7,
    stock: 100
  },
  {
    id: 4,
    name: 'Smart Watch',
    description: 'Fitness and health tracking smartwatch',
    price: 249,
    category: 'Wearables',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.5,
    stock: 75
  },
  {
    id: 5,
    name: 'Wireless Earbuds',
    description: 'True wireless earbuds with great sound',
    price: 149,
    category: 'Audio',
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    rating: 4.6,
    stock: 120
  }
];

// Task data
const tasks = [
  {
    id: 1,
    title: 'Complete project proposal',
    description: 'Finalize the project proposal document',
    status: 'completed',
    priority: 'high',
    dueDate: '2023-05-15',
    assignedTo: 1
  },
  {
    id: 2,
    title: 'Design UI mockups',
    description: 'Create mockups for the new dashboard',
    status: 'in-progress',
    priority: 'medium',
    dueDate: '2023-05-20',
    assignedTo: 2
  },
  {
    id: 3,
    title: 'Implement authentication',
    description: 'Set up user authentication system',
    status: 'pending',
    priority: 'high',
    dueDate: '2023-05-25',
    assignedTo: 3
  },
  {
    id: 4,
    title: 'Database optimization',
    description: 'Optimize database queries for better performance',
    status: 'pending',
    priority: 'medium',
    dueDate: '2023-05-30',
    assignedTo: 4
  },
  {
    id: 5,
    title: 'Testing and bug fixes',
    description: 'Run tests and fix identified bugs',
    status: 'pending',
    priority: 'high',
    dueDate: '2023-06-05',
    assignedTo: 5
  }
];

// Posts data
const posts = [
  {
    id: 1,
    title: 'Getting Started with React',
    content: 'React is a JavaScript library for building user interfaces...',
    author: 1,
    date: '2023-01-15',
    tags: ['React', 'JavaScript', 'Frontend'],
    likes: 45,
    comments: 12
  },
  {
    id: 2,
    title: 'Express.js Best Practices',
    content: 'Express is a minimal and flexible Node.js web application framework...',
    author: 3,
    date: '2023-02-22',
    tags: ['Express', 'Node.js', 'Backend'],
    likes: 32,
    comments: 8
  },
  {
    id: 3,
    title: 'TypeScript for React Developers',
    content: 'TypeScript adds static typing to JavaScript, which can help prevent errors...',
    author: 2,
    date: '2023-03-10',
    tags: ['TypeScript', 'React', 'JavaScript'],
    likes: 67,
    comments: 21
  },
  {
    id: 4,
    title: 'Server-Side Rendering with React',
    content: 'Server-side rendering (SSR) allows you to render React components on the server...',
    author: 4,
    date: '2023-04-05',
    tags: ['SSR', 'React', 'Performance'],
    likes: 28,
    comments: 6
  }
];

export default {
  users,
  products,
  tasks,
  posts
}; 