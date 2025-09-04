import React from 'react';
import { Edit3, Trash2, RotateCcw, Play, CheckCircle, Loader } from 'lucide-react';
import EditEndpoint from './EditEndpoint';

interface EndpointCardProps {
  msg: any;
  idx: number;
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
}

const EndpointCard: React.FC<EndpointCardProps> = ({ msg, idx, editIdx, startEdit, deleteTask, saveEdit, cancelEdit, editGoal, setEditGoal, editUrl, setEditUrl, runTask, loading, url }) => (
  <div className={`border rounded-2xl p-2 sm:p-4 transition-all duration-200 bg-slate-900 border-white/10 relative group shadow-lg`}>
    {editIdx === idx ? (
      <EditEndpoint
        editGoal={editGoal}
        setEditGoal={setEditGoal}
        editUrl={editUrl}
        setEditUrl={setEditUrl}
        saveEdit={saveEdit}
        cancelEdit={cancelEdit}
        loading={loading}
      />
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
);

export default EndpointCard;
