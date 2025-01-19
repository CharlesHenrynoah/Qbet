import React from 'react';
import { SearchBar } from './components/SearchBar';
import { FreelancerCard } from './components/FreelancerCard';
import { Filters } from './components/Filters';
import { AttachmentUpload } from './components/AttachmentUpload';
import { MarketStats } from './components/MarketStats';
import { AuthModal } from './components/AuthModal';
import { Sliders, X, User, LogOut, Settings, MessageSquare, ChevronLeft } from 'lucide-react';
import type { Freelancer, SearchFilters, Attachment, Message, User as UserType } from './types';
import { searchFreelancers } from './services/scraper';
import { uploadAttachment } from './services/attachments';
import { playTamTam } from './services/sound';
import { login, signup, logout } from './services/auth';

function App() {
  const [searchTerms, setSearchTerms] = React.useState<string[]>([]);
  const [showFilters, setShowFilters] = React.useState(false);
  const [showUpload, setShowUpload] = React.useState(false);
  const [showConversations, setShowConversations] = React.useState(false);
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [filters, setFilters] = React.useState<SearchFilters>({
    minRate: 0,
    maxRate: 200,
    minRating: 4,
    immediateAvailability: false,
    location: '',
  });
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [freelancers, setFreelancers] = React.useState<Freelancer[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState('');
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [isLoginMode, setIsLoginMode] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<UserType | null>(null);

  React.useEffect(() => {
    if (isLoading) {
      const text = 'Manhattan.search';
      let index = 0;
      const interval = setInterval(() => {
        setLoadingText(text.substring(0, index + 1));
        if (index < text.length) {
          playTamTam();
        }
        index = (index + 1) % (text.length + 1);
        if (index === 0) setLoadingText('');
      }, 100);
      return () => clearInterval(interval);
    } else {
      setLoadingText('');
    }
  }, [isLoading]);

  const handleSearch = async (query: string) => {
    setSearchTerms(query.toLowerCase().split(' '));
    setMessages(prev => [...prev, { type: 'user', content: query }]);
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const results = await searchFreelancers(query);
      setFreelancers(results);
      
      const response = `Based on your search "${query}", here are ${results.length} freelancers that might interest you:`;
      setMessages(prev => [
        ...prev,
        { type: 'assistant', content: response },
        { type: 'stats', content: 'Market Statistics:', freelancers: results }
      ]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: "Sorry, an error occurred during the search. Please try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (attachments.length + files.length > 6) {
      alert("You cannot upload more than 6 documents.");
      return;
    }

    try {
      const newAttachments = await Promise.all(
        files.map(file => uploadAttachment(file))
      );
      
      setAttachments(prev => [...prev, ...newAttachments]);
      setMessages(prev => [...prev, {
        type: 'attachments',
        content: 'Uploaded documents:',
        attachments: newAttachments
      }]);
      setShowUpload(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "An error occurred during upload");
    }
  };

  const handleRemoveAttachment = (attachmentId: string) => {
    setAttachments(prev => prev.filter(att => att.id !== attachmentId));
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const user = await login(email, password);
      setCurrentUser(user);
      setShowAuthModal(false);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSignup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    company: string,
    phone: string,
    plan: string
  ) => {
    try {
      const user = await signup(email, password, firstName, lastName, company, phone, plan);
      setCurrentUser(user);
      setShowAuthModal(false);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-mono-900 flex">
      {/* Panneau des conversations */}
      <div 
        className={`fixed inset-y-0 left-0 bg-mono-800 border-r border-mono-700 transition-all duration-300 z-50 ${
          showConversations ? 'w-80 translate-x-0' : '-translate-x-full w-80'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-mono-700">
            <h2 className="text-lg font-orbitron text-mono-50">Conversations</h2>
            <button
              onClick={() => setShowConversations(false)}
              className="p-2 text-mono-300 hover:text-mono-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-auto p-4">
            {messages.length > 0 ? (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-mono-700 ml-8'
                        : 'bg-mono-900 mr-8'
                    }`}
                  >
                    <p className="text-sm text-mono-50">{message.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-mono-400 text-sm">No conversations yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bouton pour afficher les conversations */}
      <button
        onClick={() => setShowConversations(true)}
        className={`fixed left-4 top-4 p-2 bg-mono-800 text-mono-400 hover:text-mono-50 rounded-lg transition-all z-40 ${
          showConversations ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      {/* Contenu principal */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${
        showConversations ? 'ml-80' : 'ml-0'
      }`}>
        <header className="bg-mono-800 border-b border-mono-700">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-orbitron text-mono-50">Manhattan<span className="text-mono-400">.ai</span></h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 text-mono-300 hover:text-mono-50 transition-colors"
              >
                <Sliders className="w-4 h-4" />
                <span className="font-orbitron">Filters</span>
              </button>
              {currentUser ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleLogout}
                    className="p-2 text-mono-300 hover:text-mono-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-mono-300 hover:text-mono-50 transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setIsLoginMode(true);
                    setShowAuthModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-mono-50 text-mono-900 rounded-lg hover:bg-mono-200 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="font-orbitron">Login</span>
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-4">
          <div className="space-y-6 py-8 pb-36">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.type === 'user'
                      ? 'bg-mono-800 text-mono-50'
                      : message.type === 'attachments'
                      ? 'bg-mono-800 border border-mono-700 w-full'
                      : message.type === 'stats'
                      ? 'w-full'
                      : 'bg-mono-800 border border-mono-700'
                  }`}
                >
                  <p className="text-mono-50">{message.content}</p>
                  {message.attachments && (
                    <div className="mt-3 space-y-2">
                      {message.attachments.map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-mono-300 hover:text-mono-50"
                        >
                          <span className="truncate">{attachment.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                  {message.type === 'stats' && message.freelancers && (
                    <div className="mt-4">
                      <MarketStats freelancers={message.freelancers} />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-center items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mono-50"></div>
                <span className="text-mono-50 font-orbitron">{loadingText}</span>
              </div>
            )}
            
            {!isLoading && messages.length > 0 && freelancers.length > 0 && (
              <div className="space-y-4">
                {freelancers.map((freelancer) => (
                  <FreelancerCard
                    key={freelancer.id}
                    freelancer={freelancer}
                    searchTerms={searchTerms}
                  />
                ))}
              </div>
            )}
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-mono-900 via-mono-900 to-transparent pt-6 pb-8">
          <div className="max-w-7xl mx-auto px-4">
            <SearchBar 
              onSearch={handleSearch} 
              onUpload={() => setShowUpload(!showUpload)} 
            />
            {showUpload && (
              <div className="mt-4 bg-mono-800 rounded-lg shadow-lg border border-mono-700 p-4">
                <AttachmentUpload
                  onUpload={handleFileUpload}
                  attachments={attachments}
                  onRemove={handleRemoveAttachment}
                />
                <div className="text-xs text-mono-300 mt-2">
                  Maximum 6 documents allowed
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panneau des filtres */}
      {showFilters && (
        <div className="fixed inset-y-0 right-0 w-80 bg-mono-800 shadow-xl border-l border-mono-700 overflow-hidden z-40">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-lg font-medium text-mono-50">Filters</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 text-mono-300 hover:text-mono-50 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <Filters filters={filters} onFiltersChange={setFilters} />
        </div>
      )}

      {/* Modal d'authentification */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
        initialMode={isLoginMode}
      />
    </div>
  );
}

export default App;