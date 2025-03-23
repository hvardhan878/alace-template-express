import React from 'react';
import { GlobeIcon } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-6">
            <GlobeIcon className="h-12 w-12 text-blue-500" />
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-4">
            React SSR with Express.js
          </h1>
          <p className="text-center text-gray-600">
            This page is server-side rendered and hydrated on the client.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;