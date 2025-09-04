import React from 'react';
import { Terminal } from 'lucide-react';

const EmptyMessages: React.FC = () => (
  <div className="text-center py-10 sm:py-16 space-y-4">
    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
      <Terminal className="w-8 h-8 text-blue-400" />
    </div>
    <h3 className="text-xl font-semibold text-white">Ready to scrape</h3>
    <p className="text-gray-300 max-w-md mx-auto">
      Enter a URL and describe what you want to extract to get started
    </p>
  </div>
);

export default EmptyMessages;
