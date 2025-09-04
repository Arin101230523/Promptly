'use client';
import { useState, useRef, useEffect } from 'react';
import { FaTrash, FaEdit, FaSave, FaTimes, FaRedo } from 'react-icons/fa';

export default function ScraperPage() {
  const [url, setUrl] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<any[]>([]); // {role: 'user'|'bot', text, endpoint?, taskId?, result?, status?, editing?}
  const [editIdx, setEditIdx] = useState<number|null>(null);
  const [editGoal, setEditGoal] = useState('');
  const [editUrl, setEditUrl] = useState('');
  // Delete endpoint
  const deleteTask = async (msgIdx: number) => {
    const msg = messages[msgIdx];
    if (!msg.taskId) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${backendUrl}/delete-task/${msg.taskId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMessages(prev => prev.filter((_, idx) => idx !== msgIdx));
      } else {
        setError('Failed to delete endpoint');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Start editing endpoint
  const startEdit = (msgIdx: number) => {
    const msg = messages[msgIdx];
    setEditIdx(msgIdx);
    setEditGoal(msg.goal || '');
    setEditUrl(msg.url || url);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditIdx(null);
    setEditGoal('');
    setEditUrl('');
  };

  // Save edit (PATCH)
  const saveEdit = async () => {
    if (editIdx === null) return;
    const msg = messages[editIdx];
    setLoading(true);
    setError('');
    try {
      const body: any = {};
      if (editGoal !== msg.goal) body.goal = editGoal;
      if (editUrl !== (msg.url || url)) body.url = editUrl;
      const response = await fetch(`${backendUrl}/update-task/${msg.taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        setMessages(prev => prev.map((m, idx) => idx === editIdx ? { ...m, goal: editGoal, url: editUrl } : m));
        cancelEdit();
      } else {
        setError('Failed to update endpoint');
      }
    } catch (err: any) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };
  const chatEndRef = useRef<HTMLDivElement>(null);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  const createTask = async (goalText: string) => {
    setLoading(true);
    setError('');
    setMessages(prev => [...prev, { role: 'user', text: goalText }]);
    try {
      console.log('Sending create-task request...');
      const response = await fetch(`${backendUrl}/create-task/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, goal: goalText }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [...prev, {
          role: 'bot',
          text: `Created endpoint for goal: "${goalText}"`,
          endpoint: data.endpoint,
          taskId: data.task_id,
          goal: goalText,
          status: 'created'
        }]);
      } else {
        const errorMsg = data.detail && Array.isArray(data.detail)
          ? data.detail.map((err: any) => err.msg).join('; ')
          : (data.detail || 'Failed to create task: Unknown error');
        setMessages(prev => [...prev, { role: 'bot', text: `Error: ${errorMsg}` }]);
        setError(errorMsg);
      }
    } catch (err: any) {
      setMessages(prev => [...prev, { role: 'bot', text: `Error: ${err.message || 'Network error occurred'}` }]);
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
      console.log('Create-task request completed');
    }
  };

  const runTask = async (msgIdx: number) => {
    setLoading(true);
    setError('');
    try {
      const msg = messages[msgIdx];
      setMessages(prev => prev.map((m, idx) => idx === msgIdx ? { ...m, status: 'running' } : m));
      const response = await fetch(`${backendUrl}${msg.endpoint}`);
      const data = await response.json();
      if (response.ok) {
        setMessages(prev => [
          ...prev,
          {
            role: 'bot',
            text: `Result for "${msg.goal}":`,
            result: JSON.stringify(data, null, 2),
            status: 'completed'
          }
        ]);
        setMessages(prev => prev.map((m, idx) => idx === msgIdx ? { ...m, status: 'completed' } : m));
      } else {
        const errorMsg = data.detail && Array.isArray(data.detail)
          ? data.detail.map((err: any) => err.msg).join('; ')
          : (data.error || data.detail || 'Failed to run task: Unknown error');
        setMessages(prev => [
          ...prev,
          {
            role: 'bot',
            text: `Error running "${msg.goal}": ${errorMsg}`,
            status: 'error'
          }
        ]);
        setMessages(prev => prev.map((m, idx) => idx === msgIdx ? { ...m, status: 'error' } : m));
        setError(errorMsg);
      }
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'bot',
          text: `Error running "${messages[msgIdx].goal}": ${err.message || 'Network error occurred'}`,
          status: 'error'
        }
      ]);
      setMessages(prev => prev.map((m, idx) => idx === msgIdx ? { ...m, status: 'error' } : m));
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 flex flex-col items-center justify-center p-4">
      <h1 className="text-5xl font-extrabold text-white mb-8 animate-fade-in">Promptly Chat Scraper</h1>
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-2xl p-8 flex flex-col space-y-6 animate-scale-in">
        <div className="flex flex-col space-y-4 mb-2">
          <input
            type="text"
            placeholder="Enter URL (e.g., https://news.ycombinator.com/)"
            className="p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <div className="flex flex-col space-y-2 mb-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Describe your goal (e.g., List top 5 story titles)"
              className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && goal.trim() && url.trim()) {
                  createTask(goal.trim());
                }
              }}
              disabled={!url}
            />
            <button
              onClick={() => { if (goal.trim() && url.trim()) createTask(goal.trim()); }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={loading || !url || !goal}
            >
              {loading ? '...' : 'Send'}
            </button>
          </div>
        </div>
        {/* Chat conversation */}
        <div className="bg-gray-900 p-4 rounded-xl mb-4 max-h-[32rem] overflow-y-auto animate-fade-in-up border border-gray-700 shadow-inner" style={{ minHeight: '20rem' }}>
          {messages.length === 0 && (
            <p className="text-gray-400">Start by entering a URL and describing your first goal.</p>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div className="px-5 py-3 rounded-2xl bg-blue-600 text-white max-w-[70%] shadow-lg">
                  <span className="font-semibold">You:</span> {msg.text}
                </div>
              ) : (
                <div className="max-w-[80%]">
                  <div className="px-5 py-3 rounded-2xl bg-gray-700 text-green-300 shadow-lg">
                    <span className="font-semibold">Bot:</span> {msg.text}
                  </div>
                  {msg.endpoint && (
                    <div className="mt-2 bg-gray-800 rounded-lg p-3 border border-blue-700 relative">
                      {editIdx === idx ? (
                        <div className="mb-2 flex flex-col gap-2">
                          <input
                            type="text"
                            className="p-2 rounded bg-gray-700 text-white mb-1"
                            value={editGoal}
                            onChange={e => setEditGoal(e.target.value)}
                            placeholder="Edit goal"
                          />
                          <input
                            type="text"
                            className="p-2 rounded bg-gray-700 text-white mb-1"
                            value={editUrl}
                            onChange={e => setEditUrl(e.target.value)}
                            placeholder="Edit URL"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={saveEdit}
                              className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-3 rounded flex items-center gap-1"
                              disabled={loading}
                            >
                              <FaSave /> Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded flex items-center gap-1"
                            >
                              <FaTimes /> Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="absolute top-2 right-2 flex gap-2">
                            <button
                              onClick={() => startEdit(idx)}
                              className="text-blue-400 hover:text-blue-600"
                              title="Edit endpoint"
                            >
                              <FaEdit size={18} />
                            </button>
                            <button
                              onClick={() => deleteTask(idx)}
                              className="text-red-400 hover:text-red-600"
                              title="Delete endpoint"
                              disabled={loading}
                            >
                              <FaTrash size={18} />
                            </button>
                          </div>
                          <div className="text-xs text-gray-400 mb-1">Endpoint:</div>
                          <div className="font-mono text-blue-400 break-all mb-1">{msg.endpoint}</div>
                          <div className="text-xs text-gray-400 mb-1">Task ID:</div>
                          <div className="font-mono text-green-400 break-all mb-2">{msg.taskId}</div>
                          <div className="text-xs text-gray-400 mb-1">Goal:</div>
                          <div className="text-white mb-1">{msg.goal}</div>
                          <div className="text-xs text-gray-400 mb-1">URL:</div>
                          <div className="text-white mb-2">{msg.url || url}</div>
                          <div className="flex gap-2 items-center">
                            <button
                              onClick={() => runTask(idx)}
                              className={`bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${msg.status === 'completed' ? 'opacity-60 cursor-not-allowed' : ''}`}
                              disabled={loading || msg.status === 'completed'}
                            >
                              {loading && msg.status === 'running' ? 'Running...' : (msg.status === 'completed' ? 'Completed' : 'Run Endpoint')}
                            </button>
                            {msg.status === 'completed' && (
                              <button
                                onClick={() => runTask(idx)}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg flex items-center gap-1 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                disabled={loading}
                                title="Rerun Endpoint"
                              >
                                <FaRedo /> Rerun
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {msg.result && (
                    <div className="mt-2 bg-gray-900 rounded-lg p-4 border border-green-700">
                      <h2 className="text-white text-lg font-bold mb-2">Result:</h2>
                      <pre className="text-green-300 overflow-auto max-h-64 text-sm whitespace-pre-wrap">{msg.result}</pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        {error && (
          <div className="bg-red-600 p-4 rounded-lg text-white animate-fade-in-down">
            <p>Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  );
}