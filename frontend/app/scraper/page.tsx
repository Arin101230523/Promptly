'use client';
import { useState } from 'react';

export default function ScraperPage() {
  const [url, setUrl] = useState('');
  const [goal, setGoal] = useState('');
  const [taskId, setTaskId] = useState('');
  const [endpoint, setEndpoint] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const createTask = async () => {
    setLoading(true);
    setError('');
    setResult('');
    try {
      const response = await fetch(`http://localhost:8000/create-task/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, goal }),
      });
      const data = await response.json();
      if (response.ok) {
        setTaskId(data.task_id);
        setEndpoint(data.endpoint);
      } else {
        if (data.detail && Array.isArray(data.detail)) {
          const errorMessages = data.detail.map((err: any) => err.msg).join('; ');
          setError(errorMessages);
        } else {
          setError(data.detail || 'Failed to create task: Unknown error');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const runTask = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`http://localhost:8000${endpoint}`);
      const data = await response.json();
      if (response.ok) {
        setResult(JSON.stringify(data, null, 2));
      } else {
        if (data.detail && Array.isArray(data.detail)) {
          const errorMessages = data.detail.map((err: any) => err.msg).join('; ');
          setError(errorMessages);
        } else if (data.error) {
          setError(data.error);
          setResult(JSON.stringify(data, null, 2));
        } else {
          setError(data.detail || 'Failed to run task: Unknown error');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-extrabold text-white mb-8 animate-fade-in">Promptly</h1>
      
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg shadow-xl p-8 space-y-6 animate-scale-in">
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter URL (e.g., https://news.ycombinator.com/)"
            className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <textarea
            placeholder="Enter your goal (e.g., List the top 5 story titles with their links in JSON.)"
            rows={4}
            className="p-3 rounded-md bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <button
            onClick={createTask}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={loading}
          >
            {loading ? 'Creating Task...' : 'Create Scrape Task'}
          </button>
        </div>

        {taskId && (
          <div className="bg-gray-700 p-6 rounded-md space-y-4 animate-slide-up">
            <p className="text-white">
              Task ID: <span className="font-mono text-blue-400">{taskId}</span>
            </p>
            <p className="text-white">
              Endpoint: <span className="font-mono text-green-400">{endpoint}</span>
            </p>
            <button
              onClick={runTask}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
              disabled={loading}
            >
              {loading ? 'Running Task...' : 'Run Scrape Task'}
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-600 p-4 rounded-md text-white animate-fade-in-down">
            <p>Error: {error}</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-700 p-6 rounded-md animate-fade-in-up">
            <h2 className="text-white text-2xl font-bold mb-4">Result:</h2>
            <pre className="bg-gray-900 p-4 rounded-md text-green-300 overflow-auto max-h-96 text-sm">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}