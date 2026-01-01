'use client';

import { useState } from 'react';
import { Token } from '@/types/token';

export default function Home() {
  const [apiKey, setApiKey] = useState('');
  const [userId, setUserId] = useState('');
  const [scopes, setScopes] = useState('read,write');
  const [expiresInMinutes, setExpiresInMinutes] = useState(60);
  const [createdToken, setCreatedToken] = useState<Token | null>(null);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const createToken = async () => {
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch('/api/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          userId,
          scopes: scopes.split(',').map(s => s.trim()).filter(Boolean),
          expiresInMinutes: Number(expiresInMinutes),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to create token');
        setCreatedToken(null);
      } else {
        setCreatedToken(data);
        setError('');
      }
    } catch (err) {
      setError('Network error occurred');
      setCreatedToken(null);
    } finally {
      setLoading(false);
    }
  };

  const listTokens = async () => {
    setError('');
    setLoading(true);
    
    try {
      const response = await fetch(`/api/tokens?userId=${encodeURIComponent(userId)}`, {
        headers: {
          'x-api-key': apiKey,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to list tokens');
        setTokens([]);
      } else {
        setTokens(data);
        setError('');
      }
    } catch (err) {
      setError('Network error occurred');
      setTokens([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Token Management System</h1>
        <p className="text-gray-600 mb-8">Create and manage user access tokens</p>

        {/* API Key Input */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your API key"
          />
          <p className="text-xs text-gray-500 mt-1">Required for authentication</p>
        </div>

        {/* Create Token Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Token</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scopes (comma-separated)
              </label>
              <input
                type="text"
                value={scopes}
                onChange={(e) => setScopes(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., read, write, admin"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expires In (minutes)
              </label>
              <input
                type="number"
                value={expiresInMinutes}
                onChange={(e) => setExpiresInMinutes(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="60"
                min="1"
              />
            </div>

            <button
              onClick={createToken}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Token'}
            </button>
          </div>

          {createdToken && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Token Created Successfully!</h3>
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">ID:</span> {createdToken.id}</p>
                <p><span className="font-medium">Token:</span> <code className="bg-green-100 px-2 py-1 rounded">{createdToken.token}</code></p>
                <p><span className="font-medium">Expires:</span> {new Date(createdToken.expiresAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* List Tokens Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">List Tokens</h2>
          
          <button
            onClick={listTokens}
            disabled={loading || !userId}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'List Tokens for User'}
          </button>

          {tokens.length > 0 && (
            <div className="mt-4 space-y-3">
              {tokens.map((token) => (
                <div key={token.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <p><span className="font-medium">ID:</span> {token.id}</p>
                    <p><span className="font-medium">User:</span> {token.userId}</p>
                    <p><span className="font-medium">Scopes:</span> {token.scopes.join(', ')}</p>
                    <p><span className="font-medium">Expires:</span> {new Date(token.expiresAt).toLocaleString()}</p>
                    <p className="col-span-2"><span className="font-medium">Token:</span> <code className="bg-gray-100 px-2 py-1 rounded text-xs">{token.token}</code></p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tokens.length === 0 && userId && !loading && (
            <p className="mt-4 text-gray-500 text-center">No active tokens found for this user</p>
          )}
        </div>

        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}