'use client';
import React, { useState } from 'react';
import { Book, Code, Zap, Settings, Users, Copy, CheckCircle, ExternalLink, Search, X } from 'lucide-react';

import Navigation from '../../components/landing/Navigation';
import Footer from '../../components/landing/Footer';

const CodeBlock: React.FC<{ children: string; language?: string }> = ({ children, language = 'javascript' }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gray-900/50 rounded-lg border border-white/10 text-xs sm:text-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 sm:px-4 py-2 border-b border-white/10 gap-2 sm:gap-0">
        <span className="text-xs sm:text-sm text-gray-400">{language}</span>
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-1 text-xs sm:text-sm text-gray-400 hover:text-white transition-colors"
        >
          {copied ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : <Copy className="w-3 h-3 sm:w-4 sm:h-4" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-2 sm:p-4 overflow-x-auto">
        <code className="text-xs sm:text-sm text-gray-300">{children}</code>
      </pre>
    </div>
  );
};

const Docs = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    { id: 'getting-started', title: 'Getting Started', icon: Zap },
    { id: 'authentication', title: 'Authentication', icon: Settings },
    { id: 'api-reference', title: 'API Reference', icon: Code },
    { id: 'examples', title: 'Examples', icon: Book },
    { id: 'community', title: 'Community', icon: Users },
  ];

  const filteredSections = searchTerm.trim()
    ? sections.filter(section => section.title.toLowerCase().includes(searchTerm.trim().toLowerCase()))
    : sections;

  const renderContent = () => {
    switch (activeSection) {
      case 'getting-started':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-orange-300 mb-4">Placeholder Title</h2>
              <p className="text-xl text-gray-300 mb-6">Placeholder description text for getting started section.</p>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-2xl font-semibold text-blue-200 mb-4">Placeholder Subsection</h3>
              <div className="space-y-4">
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-100 mb-2">Step 1 Placeholder</h4>
                  <p className="text-gray-300 text-sm">Placeholder instruction text.</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-100 mb-2">Step 2 Placeholder</h4>
                  <p className="text-gray-300 text-sm">Placeholder instruction text.</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-100 mb-2">Step 3 Placeholder</h4>
                  <p className="text-gray-300 text-sm">Placeholder instruction text.</p>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-2xl font-semibold text-purple-200 mb-4">Placeholder Subsection</h3>
              <p className="text-gray-300 mb-4">Placeholder paragraph text.</p>
              <div className="space-y-4">
                <CodeBlock language="bash">Placeholder code snippet</CodeBlock>
                <CodeBlock language="python">Placeholder code snippet</CodeBlock>
                <CodeBlock language="bash">Placeholder code snippet</CodeBlock>
              </div>
            </div>

            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-2xl font-semibold text-green-200 mb-4">Placeholder Subsection</h3>
              <p className="text-gray-300 mb-4">Placeholder paragraph text.</p>
              <CodeBlock language="javascript">Placeholder code snippet</CodeBlock>
            </div>
          </div>
        );

      case 'authentication':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-green-300 mb-4">Placeholder Title</h2>
              <p className="text-xl text-gray-300 mb-6">Placeholder description for authentication section.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-6">
              <h3 className="text-2xl font-semibold text-green-200 mb-4">Placeholder Subsection</h3>
              <p className="text-gray-300 mb-4">Placeholder instruction text.</p>
              <CodeBlock language="bash">Placeholder code snippet</CodeBlock>
            </div>
            <div className="border-l-4 border-orange-500 pl-6">
              <h3 className="text-2xl font-semibold text-orange-200 mb-4">Placeholder Subsection</h3>
              <p className="text-gray-300 mb-4">Placeholder paragraph text.</p>
              <CodeBlock language="bash">Placeholder code snippet</CodeBlock>
            </div>
          </div>
        );

      case 'api-reference':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-purple-300 mb-4">Placeholder Title</h2>
              <p className="text-xl text-gray-300 mb-6">Placeholder description for API reference section.</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-2xl font-semibold text-purple-200 mb-4">Placeholder Subsection</h3>
              <CodeBlock language="text">Placeholder code snippet</CodeBlock>
            </div>
          </div>
        );

      case 'examples':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-orange-300 mb-4">Placeholder Title</h2>
              <p className="text-xl text-gray-300 mb-6">Placeholder description for examples section.</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-2xl font-semibold text-blue-200 mb-4">Placeholder Subsection</h3>
              <CodeBlock language="javascript">Placeholder code snippet</CodeBlock>
            </div>
          </div>
        );

      case 'community':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-bold text-pink-300 mb-4">Placeholder Title</h2>
              <p className="text-xl text-gray-300 mb-6">Placeholder description for community section.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-pink-500 pl-6">
                <h3 className="text-2xl font-semibold text-pink-200 mb-4">Placeholder Subsection</h3>
                <div className="space-y-4">
                  <a href="#" className="flex items-center space-x-3 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-pink-100">Placeholder Link 1</h4>
                      <p className="text-sm text-gray-400">Placeholder description</p>
                    </div>
                  </a>
                  <a href="#" className="flex items-center space-x-3 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-pink-100">Placeholder Link 2</h4>
                      <p className="text-sm text-gray-400">Placeholder description</p>
                    </div>
                  </a>
                  <a href="#" className="flex items-center space-x-3 bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-pink-100">Placeholder Link 3</h4>
                      <p className="text-sm text-gray-400">Placeholder description</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="border-l-4 border-blue-500 pl-6">
                <h3 className="text-2xl font-semibold text-blue-200 mb-4">Placeholder Subsection</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <Code className="w-8 h-8 mx-auto mb-3 text-green-400" />
                    <h4 className="font-semibold text-green-100 mb-2">Placeholder Item 1</h4>
                    <p className="text-sm text-gray-300">Placeholder description</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <Book className="w-8 h-8 mx-auto mb-3 text-green-400" />
                    <h4 className="font-semibold text-green-100 mb-2">Placeholder Item 2</h4>
                    <p className="text-sm text-gray-300">Placeholder description</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 text-center">
                    <Users className="w-8 h-8 mx-auto mb-3 text-green-400" />
                    <h4 className="font-semibold text-green-100 mb-2">Placeholder Item 3</h4>
                    <p className="text-sm text-gray-300">Placeholder description</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-red-900 to-neutral-900 text-white overflow-x-hidden relative">
      <Navigation />

      <div className="flex-1 flex flex-col lg:flex-row pt-16">
        {/* Sidebar for desktop */}
        <div className="hidden lg:block lg:static lg:inset-0 w-64 bg-black/20 backdrop-blur-xl border-r border-white/10">
          <div className="p-4 sm:p-6">
            <div className="relative mb-4 sm:mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search docs..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
              />
            </div>
            <nav className="space-y-1 sm:space-y-2">
              {filteredSections.length === 0 ? (
                <div className="text-orange-400 px-3 py-2">No matching docs found.</div>
              ) : (
                filteredSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => {
                        setActiveSection(section.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-2 rounded-lg text-left transition-colors text-xs sm:text-base ${
                        activeSection === section.id
                          ? 'bg-blue-500/20 text-orange-300 border border-orange-500/30'
                          : 'text-gray-300 hover:text-orange-300 hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{section.title}</span>
                    </button>
                  );
                })
              )}
            </nav>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="fixed top-16 left-0 right-0 z-50 w-full h-[calc(100vh-4rem)] bg-black/20 backdrop-blur-xl border-r border-white/10 lg:hidden">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h2 className="text-lg font-bold text-white">Documentation</h2>
              <button onClick={() => setSidebarOpen(false)}>
                <X className="w-5 h-5 text-gray-400 cursor-pointer" />
              </button>
            </div>
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search docs..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs"
                />
              </div>
              <nav className="space-y-1">
                {filteredSections.length === 0 ? (
                  <div className="text-gray-400 px-3 py-2">No matching docs found.</div>
                ) : (
                  filteredSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => {
                          setActiveSection(section.id);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-2 py-2 rounded-lg text-left transition-colors text-xs ${
                          activeSection === section.id
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'text-gray-300 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{section.title}</span>
                      </button>
                    );
                  })
                )}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="lg:hidden p-2 sm:p-4 border-b border-white/10">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center space-x-2 text-gray-300 hover:text-white text-base cursor-pointer"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Search</span>
            </button>
          </div>

          <main className="max-w-full sm:max-w-4xl mx-auto py-4 sm:py-8 px-2 sm:px-6">
            {renderContent()}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Docs;
