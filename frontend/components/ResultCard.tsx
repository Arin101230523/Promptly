import React from 'react';
import { CheckCircle } from 'lucide-react';

interface ResultCardProps {
  result: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => (
  <div className="bg-slate-900 border border-green-700 rounded-2xl p-2 sm:p-4 shadow-lg">
    <div className="flex items-center gap-2 mb-3">
      <CheckCircle className="w-5 h-5 text-green-400" />
      <h3 className="text-lg font-bold text-green-400">Execution Result</h3>
    </div>
    <div className="bg-slate-800 rounded-lg p-2 sm:p-4 border border-green-700">
      <pre className="text-green-300 overflow-auto max-h-64 text-sm whitespace-pre-wrap font-mono leading-relaxed">
        {result}
      </pre>
    </div>
  </div>
);

export default ResultCard;
