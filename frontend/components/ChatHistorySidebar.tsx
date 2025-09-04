import React from 'react';
import { Zap } from 'lucide-react';

interface ChatHistorySidebarProps {
  showHistory: boolean;
  setShowHistory: (show: boolean) => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({ showHistory, setShowHistory }) => (
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
);

export default ChatHistorySidebar;
