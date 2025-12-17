import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'

const Header: React.FC = () => {
  const router = useRouter();
  return (
    <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 px-4 py-3 sm:px-6 sm:py-4 bg-slate-900 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        <div className="p-2 bg-gradient-to-r from-pink-500 to-yellow-400 rounded-lg">
        <Image src='/favicon.ico' alt="Logo" width={32} height={32} className="object-contain" />
        </div>
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-orange-600 bg-clip-text text-transparent cursor-pointer" onClick={() => router.push("/")}>Promptly</h1>
          <p className="text-sm text-gray-300">Intelligent web scraping with natural language</p>
        </div>
      </div>
    </div>
  );
};

export default Header;
