'use client';
import React, { useState, useRef, useEffect } from 'react';
import { 
  Trash2, 
  Edit3, 
  Save, 
  X, 
  RotateCcw, 
  Play, 
  Globe, 
  Zap,
  Terminal,
  CheckCircle,
  AlertCircle,
  Loader,
  Send,
  ArrowRightCircle
  } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'bot';
  text: string;
  endpoint?: string;
  taskId?: string;
  result?: string;
  status?: 'created' | 'running' | 'completed' | 'error';
  goal?: string;
  url?: string;
}

export default function ScraperPage() {
  const [showHistory, setShowHistory] = useState(false);
  const [url, setUrl] = useState('');
  const [goal, setGoal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [editIdx, setEditIdx] = useState<number|null>(null);
  const [editGoal, setEditGoal] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const router = useRouter();

  const chatEndRef = useRef<HTMLDivElement>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Scroll to bottom on new message
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

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
          status: 'created',
          url: url
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

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'running':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Terminal className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col relative">
      {/* Chat History Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out ${showHistory ? 'translate-x-0' : '-translate-x-full'} w-64 sm:w-72 bg-slate-950 border-r border-white/10 shadow-xl flex flex-col items-center pt-24 px-6`}
        onMouseLeave={() => setShowHistory(false)}
        style={{ pointerEvents: showHistory ? 'auto' : 'none' }}
      >
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="bg-gradient-to-r from-pink-500 to-yellow-400 rounded-full p-4 animate-bounce">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white">Chat History</h2>
          <p className="text-sm text-gray-400 text-center">Coming Soon...</p>
        </div>
      </div>
      {/* Hover Area to Show Sidebar */}
      {!showHistory && (
        <div
          className="fixed top-0 left-0 h-full w-8 z-50 flex items-center cursor-pointer group"
          onMouseEnter={() => setShowHistory(true)}
          style={{ background: 'transparent' }}
        >
          <div className="ml-1 mt-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
            <ArrowRightCircle className="w-6 h-6 text-yellow-400" />
          </div>
        </div>
      )}
  {/* Header */}
  <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4 bg-slate-900 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <Zap className="w-6 h-6 text-white cursor-pointer" onClick = {()=>(router.push('/'))} />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer" onClick={() => router.push("/")}>Promptly</h1>
            <p className="text-sm text-gray-300">Intelligent web scraping with natural language</p>
          </div>
        </div>
      </div>

    {/* Main Content */}
  <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full pt-[72px] px-2 sm:px-0">
        {/* Chat Messages */}
  <div className="flex-1 p-2 sm:p-6 overflow-y-auto">
          {messages.length === 0 && (
            <div className="text-center py-10 sm:py-16 space-y-4">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Terminal className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Ready to scrape</h3>
              <p className="text-gray-300 max-w-md mx-auto">
                Enter a URL and describe what you want to extract to get started
              </p>
            </div>
          )}
          
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-6 flex animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                <div className="max-w-full sm:max-w-[75%] bg-slate-800 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-2xl rounded-br-md shadow-lg text-base sm:text-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="text-xs font-medium text-blue-100">You</div>
                  </div>
                  <div className="font-medium">{msg.text}</div>
                </div>
              ) : (
                <div className="max-w-full sm:max-w-[85%] space-y-3">
                  <div className="bg-slate-900 border border-white/10 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-2xl rounded-bl-md shadow-lg text-base sm:text-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-xs font-medium text-purple-300">Assistant</div>
                      {msg.status && getStatusIcon(msg.status)}
                    </div>
                    <div className="font-medium">{msg.text}</div>
                  </div>

                  {msg.endpoint && (
                    <div className={`border rounded-2xl p-2 sm:p-4 transition-all duration-200 bg-slate-900 border-white/10 relative group shadow-lg`}> 
                      {editIdx === idx ? (
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Goal</label>
                              <input
                                type="text"
                                className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                value={editGoal}
                                onChange={e => setEditGoal(e.target.value)}
                                placeholder="Edit goal"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                              <input
                                type="text"
                                className="w-full p-3 rounded-lg border border-gray-300 text-gray-900 text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
                                value={editUrl}
                                onChange={e => setEditUrl(e.target.value)}
                                placeholder="Edit URL"
                              />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={saveEdit}
                              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500/50"
                              disabled={loading}
                            >
                              <Save className="w-4 h-4" />
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500/50"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="absolute top-2 right-2 flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 opacity-100 transition-opacity duration-200">
                            <button
                              onClick={() => startEdit(idx)}
                              className="p-2 bg-white hover:bg-gray-50 rounded-lg text-gray-600 hover:text-blue-600 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500/50 shadow-sm border border-gray-200"
                              title="Edit endpoint"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteTask(idx)}
                              className="p-2 bg-white hover:bg-red-50 rounded-lg text-gray-600 hover:text-red-600 transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500/50 shadow-sm border border-gray-200"
                              title="Delete endpoint"
                              disabled={loading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                                <div>
                                  <div className="text-xs font-semibold text-blue-300 uppercase tracking-wide mb-1">Endpoint</div>
                                  <div className="font-mono text-xs sm:text-sm text-blue-200 bg-slate-800 p-2 sm:p-3 rounded-lg border border-blue-800 break-all">
                                    {msg.endpoint}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-xs font-semibold text-blue-300 uppercase tracking-wide mb-1">Task ID</div>
                                  <div className="font-mono text-xs sm:text-sm text-blue-200 bg-slate-800 p-2 sm:p-3 rounded-lg border border-blue-800 break-all">
                                    {msg.taskId}
                                  </div>
                                </div>
                              </div>
                            <div>
                              <div className="text-xs font-semibold text-blue-300 uppercase tracking-wide mb-2">Configuration</div>
                              <div className="bg-slate-800 p-2 sm:p-4 rounded-lg border border-white/10 space-y-3">
                                <div>
                                  <span className="text-xs text-blue-300 font-medium">Goal:</span>
                                  <p className="text-white mt-1">{msg.goal}</p>
                                </div>
                                <div>
                                  <span className="text-xs text-blue-300 font-medium">URL:</span>
                                  <p className="text-white mt-1 font-mono text-sm break-all">{msg.url || url}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                              <button
                                onClick={() => runTask(idx)}
                                className={`flex-1 flex items-center justify-center gap-2 sm:gap-3 font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg transition-all duration-200 transform focus:outline-none focus:ring-2 ${
                                  msg.status === 'completed'
                                    ? 'bg-slate-800 border border-green-700 text-green-400 cursor-default'
                                    : loading && msg.status === 'running'
                                    ? 'bg-slate-800 border border-blue-700 text-blue-400 cursor-wait'
                                    : 'bg-green-700 hover:bg-green-800 border border-green-700 text-white hover:scale-105 hover:shadow-lg focus:ring-green-500/50'
                                }`}
                                disabled={loading}
                              >
                                {loading && msg.status === 'running' ? (
                                  <>
                                    <Loader className="w-5 h-5 animate-spin" />
                                    <span className="hidden sm:inline">Running...</span>
                                  </>
                                ) : msg.status === 'completed' ? (
                                  <>
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="hidden sm:inline">Completed</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-5 h-5" />
                                    <span className="hidden sm:inline">Execute</span>
                                  </>
                                )}
                              </button>
                              {msg.status === 'completed' && (
                                <button
                                  onClick={() => runTask(idx)}
                                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-slate-800 border border-blue-700 text-blue-400 font-semibold rounded-lg flex items-center justify-center sm:justify-start gap-2 transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                  disabled={loading}
                                  title="Run again"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                  <span className="hidden sm:inline">Rerun</span>
                                </button>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  
                  {msg.result && (
                    <div className="bg-slate-900 border border-green-700 rounded-2xl p-2 sm:p-4 shadow-lg">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-400" />
                        <h3 className="text-lg font-bold text-green-400">Execution Result</h3>
                      </div>
                      <div className="bg-slate-800 rounded-lg p-2 sm:p-4 border border-green-700">
                        <pre className="text-green-300 overflow-auto max-h-64 text-sm whitespace-pre-wrap font-mono leading-relaxed">
                          {msg.result}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Section - Fixed at bottom */}
  <div className="bg-slate-900 border-t border-white/10 p-4 sm:p-6 backdrop-blur-xl">
          <div className="space-y-4">
            {/* URL Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-white">
                <Globe className="w-4 h-4 text-blue-400" />
                Target URL
              </label>
              <input
                type="text"
                placeholder="https://example.com"
                className="w-full p-2 sm:p-3 rounded-lg border border-white/10 bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 font-mono text-xs sm:text-sm"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            {/* Goal Input */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-white">
                <Terminal className="w-4 h-4 text-blue-400" />
                Extraction Goal
              </label>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="text"
                  placeholder="Describe what you want to extract..."
                  className="flex-1 p-2 sm:p-3 rounded-lg border border-white/10 bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-xs sm:text-sm"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && goal.trim() && url.trim() && !loading) {
                      createTask(goal.trim());
                      setGoal('');
                    }
                  }}
                  disabled={!url || loading}
                />
                <button
                  onClick={() => { 
                    if (goal.trim() && url.trim()) {
                      createTask(goal.trim());
                      setGoal('');
                    }
                  }}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none flex items-center gap-2 min-w-[80px] sm:min-w-[100px] justify-center"
                  disabled={loading || !url || !goal}
                >
                  {loading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span className="hidden sm:inline">Send</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-slate-800 border border-red-700 text-red-300 p-4 rounded-lg animate-fade-in flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <p className="font-medium flex-1">{error}</p>
                <button 
                  onClick={() => setError('')}
                  className="p-1 hover:bg-red-900 rounded transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}