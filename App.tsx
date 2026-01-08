
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Role, ChatMessage as ChatMessageType } from './types';
import { geminiService } from './services/geminiService';
import { PRESET_ISSUES } from './constants';
import ChatMessage from './components/ChatMessage';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    // Welcome message
    setMessages([
      {
        role: Role.MODEL,
        text: "Hello! I'm your WP-FixIt Assistant. 👋\n\nWordPress acting up? Whether it's a plugin conflict, a broken layout, or a login issue, I'm here to help you troubleshoot. What's happening with your site today?",
        timestamp: new Date()
      }
    ]);
  }, []);

  const handleSend = useCallback(async (textOverride?: string) => {
    const messageText = textOverride || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: ChatMessageType = {
      role: Role.USER,
      text: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const response = await geminiService.troubleshoot(messageText, history);

      const aiMessage: ChatMessageType = {
        role: Role.MODEL,
        text: response.text,
        timestamp: new Date(),
        groundingSources: response.sources
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessageType = {
        role: Role.MODEL,
        text: "I encountered an error while trying to help. Please try again in a moment.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages]);

  const handlePresetClick = (issueLabel: string) => {
    handleSend(`I'm experiencing: ${issueLabel}`);
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar - Desktop */}
      <aside className={`fixed md:relative z-40 h-full w-72 bg-white border-r border-slate-200 transition-transform duration-300 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-lg float-animation">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">WP-FixIt AI</h1>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Common Issues</h2>
            <div className="space-y-2">
              {PRESET_ISSUES.map((issue) => (
                <button
                  key={issue.id}
                  onClick={() => handlePresetClick(issue.label)}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{issue.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-slate-700 group-hover:text-blue-600">{issue.label}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">{issue.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">Support Tools</h2>
              <div className="grid grid-cols-2 gap-2">
                <a href="https://wordpress.org/support/" target="_blank" className="p-3 text-center bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors">
                  WP Forums
                </a>
                <a href="https://developer.wordpress.org/" target="_blank" className="p-3 text-center bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition-colors">
                  Dev Hub
                </a>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <div className="bg-slate-50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold text-slate-600">AI Expert Online</span>
              </div>
              <p className="text-[10px] text-slate-500 italic">"Helping thousands of WordPress sites stay live and healthy."</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow flex flex-col relative min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-700">Troubleshooting Console</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">V2.0</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <button className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">Documentation</button>
            <button 
              onClick={() => setMessages([messages[0]])}
              className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
            >
              Reset Session
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-4 md:p-8 custom-scrollbar bg-slate-50/50">
          <div className="max-w-4xl mx-auto">
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex flex-row items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-slate-700 text-white text-sm font-bold animate-pulse">
                    AI
                  </div>
                  <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 md:p-8 bg-white border-t border-slate-200 shrink-0">
          <div className="max-w-4xl mx-auto">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="relative flex items-center gap-4"
            >
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe your WordPress issue (e.g. 'I see a 500 error after installing Jetpack')"
                  className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm placeholder:text-slate-400 shadow-inner"
                  disabled={isLoading}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                  <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:bg-slate-300 transition-all shadow-md active:scale-95"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-3 flex justify-center gap-4">
              <p className="text-[10px] text-slate-400 text-center">
                Press Enter to send. Always keep a site backup before applying changes.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default App;
