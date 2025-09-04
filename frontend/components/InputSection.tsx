import React from 'react';
import { Globe, Terminal, Loader, Send, AlertCircle, X } from 'lucide-react';

interface InputSectionProps {
  url: string;
  setUrl: (url: string) => void;
  goal: string;
  setGoal: (goal: string) => void;
  loading: boolean;
  createTask: (goalText: string) => void;
  error: string;
  setError: (err: string) => void;
}

const InputSection: React.FC<InputSectionProps> = ({ url, setUrl, goal, setGoal, loading, createTask, error, setError }) => (
  <div className="bg-slate-900 border-t border-white/10 p-2.5 sm:p-3.5 backdrop-blur-xl">
  <div className="space-y-2.5">
      {/* URL Input */}
  <div className="space-y-1.5">
  <label className="flex items-center gap-1.5 text-[0.93rem] font-semibold text-white">
          <Globe className="w-4 h-4 text-blue-400" />
          Target URL
        </label>
        <input
          type="text"
          placeholder="https://example.com"
          className="w-full p-1.5 sm:p-2.5 rounded-lg border border-white/10 bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 font-mono text-[0.93rem]"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={false}
        />
      </div>
      {/* Goal Input */}
  <div className="space-y-1.5">
  <label className="flex items-center gap-1.5 text-[0.93rem] font-semibold text-white">
          <Terminal className="w-4 h-4 text-blue-400" />
          Extraction Goal
        </label>
  <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2.5">
          <input
            type="text"
            placeholder="Describe what you want to extract..."
            className="flex-1 p-1.5 sm:p-2.5 rounded-lg border border-white/10 bg-slate-800 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-[0.93rem]"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && goal.trim() && url.trim() && !loading) {
                createTask(goal.trim());
                setGoal('');
              }
            }}
            disabled={loading}
          />
          <button
            onClick={() => {
              if (goal.trim() && url.trim()) {
                createTask(goal.trim());
                setGoal('');
              }
            }}
            className="flex-1 px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none flex items-center gap-1.5 min-w-[70px] sm:min-w-[90px] justify-center text-[0.93rem]"
            disabled={loading || !url || !goal}
          >
            {loading ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Send</span>
              </>
            )}
          </button>
        </div>
      </div>
      {/* Error Display */}
      {error && (
        <div className="bg-slate-800 border border-red-700 text-red-300 p-2.5 rounded-lg animate-fade-in flex items-center gap-1.5">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="font-medium flex-1 text-[0.93rem]">{error}</p>
          <button
            onClick={() => setError('')}
            className="p-0.5 hover:bg-red-900 rounded transition-colors duration-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  </div>
);

export default InputSection;
