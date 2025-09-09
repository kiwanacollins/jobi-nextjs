'use client';

import { useState } from 'react';

export default function AdminSetupPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleInitializeAdmins = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'initialize' })
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handlePromoteUser = async () => {
    const email = prompt('Enter email to promote to admin:');
    const clerkId = prompt('Enter Clerk ID:');
    
    if (!email || !clerkId) return;

    setLoading(true);
    try {
      const response = await fetch('/api/admin-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'promote', 
          email, 
          clerkId 
        })
      });
      const data = await response.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Setup Utility</h1>
      
      <div className="space-y-4 mb-6">
        <button
          onClick={handleInitializeAdmins}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Initialize Admin Users'}
        </button>
        
        <button
          onClick={handlePromoteUser}
          disabled={loading}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 ml-4"
        >
          {loading ? 'Processing...' : 'Promote Specific User'}
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">Configuration:</h2>
        <p><strong>Admin Emails:</strong> {process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'Not configured'}</p>
      </div>

      {result && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-800 text-green-400 p-4 rounded overflow-auto">
            {result}
          </pre>
        </div>
      )}

      <div className="mt-8 bg-yellow-100 p-4 rounded">
        <h2 className="text-xl font-semibold mb-2">How it works:</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>Admin emails are configured in environment variables (ADMIN_EMAILS)</li>
          <li>Users with admin emails are automatically promoted when they sign up</li>
          <li>Existing users are promoted when they next sign in</li>
          <li>You can manually trigger initialization or promote specific users</li>
        </ul>
      </div>
    </div>
  );
}