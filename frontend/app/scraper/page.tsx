'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatHistorySidebar from '../../components/ChatHistorySidebar';
import Header from '../../components/Header';
import HoverSidebar from '../../components/HoverSidebar';
import ChatMessages from '../../components/ChatMessages';
import InputSection from '../../components/InputSection';
import { Terminal, CheckCircle, Loader, AlertCircle } from 'lucide-react';

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
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);
  useEffect(() => {
    if (shouldScrollToBottom && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
      setShouldScrollToBottom(false);
    }
  }, [messages, shouldScrollToBottom]);

  const chatEndRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


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
    setEditGoal(msg.goal ?? '');
    setEditUrl(msg.url ?? url);
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
      if (editUrl !== (msg.url ?? url)) body.url = editUrl;
      const response = await fetch(`${backendUrl}/update-task/${msg.taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (response.ok) {
        // Update the message in state and exit edit mode only after state is updated
        setMessages(prev => prev.map((m, idx) => idx === editIdx ? { ...m, goal: editGoal, url: editUrl } : m));
        setEditIdx(null);
        setEditGoal('');
        setEditUrl('');
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
  setShouldScrollToBottom(true);
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
        setShouldScrollToBottom(true);
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
        setShouldScrollToBottom(true);
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
        setShouldScrollToBottom(true);
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
      setShouldScrollToBottom(true);
    } finally {
      setLoading(false);
    }
  };

  // Status icon logic for ChatMessages
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
      <ChatHistorySidebar showHistory={showHistory} setShowHistory={setShowHistory} />
      <Header />
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full pt-[72px] px-2 sm:px-0 pb-[175px] md:pb-[160px] lg:pb-[145px]">
        <ChatMessages
          messages={messages}
          editIdx={editIdx}
          startEdit={startEdit}
          deleteTask={deleteTask}
          saveEdit={saveEdit}
          cancelEdit={cancelEdit}
          editGoal={editGoal}
          setEditGoal={setEditGoal}
          editUrl={editUrl}
          setEditUrl={setEditUrl}
          runTask={runTask}
          loading={loading}
          url={url}
          chatEndRef={chatEndRef}
          getStatusIcon={getStatusIcon}
        />
      </div>
      <div className={`fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl z-30${showHistory ? ' pointer-events-none' : ''}`}>
        <InputSection
          url={url}
          setUrl={setUrl}
          goal={goal}
          setGoal={setGoal}
          loading={loading}
          createTask={createTask}
          error={error}
          setError={setError}
        />
      </div>
      <HoverSidebar showHistory={showHistory} setShowHistory={setShowHistory} />
    </div>
  );
}