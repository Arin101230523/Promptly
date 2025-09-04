import React from 'react';
import { Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const router = useRouter();
  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4 bg-slate-900 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <Zap className="w-6 h-6 text-white cursor-pointer" onClick={() => router.push('/')} />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent cursor-pointer" onClick={() => router.push("/")}>Promptly</h1>
          <p className="text-sm text-gray-300">Intelligent web scraping with natural language</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
