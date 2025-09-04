import React from 'react';
import { ArrowRightCircle } from 'lucide-react';

interface HoverSidebarProps {
  setShowHistory: (show: boolean) => void;
  showHistory: boolean;
}

const HoverSidebar: React.FC<HoverSidebarProps> = ({ setShowHistory, showHistory }) => (
  !showHistory ? (
    <div
      className="fixed top-0 left-0 h-full w-8 z-[999] pointer-events-auto flex items-center cursor-pointer group"
      onMouseEnter={() => setShowHistory(true)}
      style={{ background: 'transparent' }}
    >
      <div className="ml-1 mt-2 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
        <ArrowRightCircle className="w-6 h-6 text-yellow-400" />
      </div>
    </div>
  ) : null
);

export default HoverSidebar;
