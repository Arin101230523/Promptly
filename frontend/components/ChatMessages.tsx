import React from 'react';
import EndpointCard from './EndpointCard';
import ResultCard from './ResultCard';
import EmptyMessages from './EmptyMessages';

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

interface ChatMessagesProps {
  messages: Message[];
  editIdx: number | null;
  startEdit: (idx: number) => void;
  deleteTask: (idx: number) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  editGoal: string;
  setEditGoal: (goal: string) => void;
  editUrl: string;
  setEditUrl: (url: string) => void;
  runTask: (idx: number) => void;
  loading: boolean;
  url: string;
  chatEndRef: React.RefObject<HTMLDivElement>;
  getStatusIcon: (status?: string) => React.ReactNode;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, editIdx, startEdit, deleteTask, saveEdit, cancelEdit, editGoal, setEditGoal, editUrl, setEditUrl, runTask, loading, url, chatEndRef, getStatusIcon }) => (
  <div className="flex-1 p-2 sm:p-6 overflow-y-auto">
    {messages.length === 0 && <EmptyMessages />}
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
              <EndpointCard
                msg={msg}
                idx={idx}
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
              />
            )}
            {msg.result && <ResultCard result={msg.result} />}
          </div>
        )}
      </div>
    ))}
    <div ref={chatEndRef} />
  </div>
);

export default ChatMessages;
