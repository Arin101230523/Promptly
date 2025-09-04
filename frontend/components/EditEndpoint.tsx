import React from 'react';
import { Save, X } from 'lucide-react';

interface EditEndpointProps {
  editGoal: string;
  setEditGoal: (goal: string) => void;
  editUrl: string;
  setEditUrl: (url: string) => void;
  saveEdit: () => void;
  cancelEdit: () => void;
  loading: boolean;
}

const EditEndpoint: React.FC<EditEndpointProps> = ({ editGoal, setEditGoal, editUrl, setEditUrl, saveEdit, cancelEdit, loading }) => (
  <div className="space-y-4">
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-white mb-1">Goal</label>
        <input
          type="text"
          className="w-full p-3 rounded-lg border border-white/10 bg-slate-800 text-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
          value={editGoal}
          onChange={e => setEditGoal(e.target.value)}
          placeholder="Edit goal"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-white mb-1">URL</label>
        <input
          type="text"
          className="w-full p-3 rounded-lg border border-white/10 bg-slate-800 text-white text-sm font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
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
);

export default EditEndpoint;
