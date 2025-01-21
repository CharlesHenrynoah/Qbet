import React from 'react';
import { SearchBar } from './components/SearchBar';
import { FreelancerCard } from './components/FreelancerCard';
import { AttachmentUpload } from './components/AttachmentUpload';
import { MarketStats } from './components/MarketStats';
import { AuthModal } from './components/AuthModal';
import { ConversationsList } from './components/ConversationsList';
import { ProfileModal } from './components/ProfileModal';
import { X, LogOut, Settings, MessageSquare, ChevronLeft, UserCircle } from 'lucide-react';
import type { Freelancer, Attachment, Message, User as UserType, Conversation } from './types';
import { searchFreelancers } from './services/scraper';
import { uploadAttachment } from './services/attachments';
import { playTamTam } from './services/sound';
import { login, signup, logout } from './services/auth';

function App() {
  const [searchTerms, setSearchTerms] = React.useState<string[]>([]);
  const [showConversations, setShowConversations] = React.useState(false);
  const [showUpload, setShowUpload] = React.useState(false);
  const [attachments, setAttachments] = React.useState<Attachment[]>([]);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [freelancers, setFreelancers] = React.useState<Freelancer[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState('');
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [isLoginMode, setIsLoginMode] = React.useState(true);
  const [currentUser, setCurrentUser] = React.useState<UserType | null>(null);
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = React.useState<Conversation | null>(null);
  const [showProfileModal, setShowProfileModal] = React.useState(false);

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
    const newMessage = { type: 'user', content: query } as Message;
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    // Mettre à jour la conversation sélectionnée avec le nouveau message
    if (selectedConversation) {
      const updatedConversation = {
        ...selectedConversation,
        messages: updatedMessages
      };
      setSelectedConversation(updatedConversation);
      setConversations(conversations.map(conv =>
        conv.id === selectedConversation.id ? updatedConversation : conv
      ));
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const results = await searchFreelancers(query);
      setFreelancers(results);
      
      const response = { 
        type: 'assistant', 
        content: `Based on your search "${query}", here are ${results.length} freelancers that might interest you:` 
      } as Message;
      const statsMessage = { 
        type: 'stats', 
        content: 'Market Statistics:', 
        freelancers: results 
      } as Message;

      const finalMessages = [...updatedMessages, response, statsMessage];
      setMessages(finalMessages);

      // Mettre à jour la conversation sélectionnée avec tous les nouveaux messages
      if (selectedConversation) {
        const finalConversation = {
          ...selectedConversation,
          messages: finalMessages
        };
        setSelectedConversation(finalConversation);
        setConversations(conversations.map(conv =>
          conv.id === selectedConversation.id ? finalConversation : conv
        ));
      }
    } catch (error) {
      const errorMessage = { 
        type: 'assistant', 
        content: "Sorry, an error occurred during the search. Please try again." 
      } as Message;
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);

      // Mettre à jour la conversation sélectionnée avec le message d'erreur
      if (selectedConversation) {
        const finalConversation = {
          ...selectedConversation,
          messages: finalMessages
        };
        setSelectedConversation(finalConversation);
        setConversations(conversations.map(conv =>
          conv.id === selectedConversation.id ? finalConversation : conv
        ));
      }
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
      setShowConversations(false);  // Ferme la partie conversation
      setSelectedConversation(null); // Réinitialise la conversation sélectionnée
      setConversations([]); // Vide la liste des conversations
      setMessages([]); // Vide les messages
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Implémentation de la connexion Google
      console.log('Google login clicked');
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    if (conversation.id !== selectedConversation?.id) {
      setSelectedConversation(conversation);
      setShowConversations(false);
      // Réinitialiser les messages actuels et les remplacer par ceux de la conversation sélectionnée
      setMessages([...conversation.messages]);
      // Réinitialiser les freelancers si nécessaire
      if (conversation.messages.some(msg => msg.type === 'stats')) {
        const lastStatsMessage = conversation.messages
          .filter(msg => msg.type === 'stats')
          .pop();
        if (lastStatsMessage && lastStatsMessage.freelancers) {
          setFreelancers(lastStatsMessage.freelancers);
        }
      }
    }
  };

  const handleNewConversation = () => {
    // Réinitialiser les messages et les freelancers pour une nouvelle conversation
    setMessages([]);
    setFreelancers([]);
    
    const newConv = {
      id: Date.now().toString(),
      title: 'Nouvelle conversation',
      date: new Date(),
      messages: []
    };
    setConversations([newConv, ...conversations]);
    setSelectedConversation(newConv);
    setShowConversations(false);
  };

  return (
    <div className="h-screen bg-mono-900 text-mono-50">
      <div className={`flex h-full transition-all duration-300 ${showConversations ? 'pl-80' : 'pl-0'}`}>
        {/* Panneau des conversations (uniquement si connecté) */}
        {currentUser && showConversations && (
          <div className="fixed left-0 top-0 h-screen w-80 bg-mono-900 border-r border-mono-800">
            <div className="p-4 border-b border-mono-800 flex justify-between items-center">
              <h2 className="text-lg font-orbitron text-mono-50">Conversations</h2>
              <button
                onClick={() => setShowConversations(false)}
                className="text-mono-400 hover:text-mono-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[calc(100vh-64px)] overflow-auto">
              <ConversationsList 
                conversations={conversations}
                onClose={() => setShowConversations(false)}
                onConversationSelect={(conversation) => {
                  setSelectedConversation(conversation);
                  setShowConversations(false);
                }}
                onNewConversation={handleNewConversation}
                onDelete={(id) => setConversations(conversations.filter(conv => conv.id !== id))}
                onEdit={(id, newTitle) => setConversations(conversations.map(conv => 
                  conv.id === id ? { ...conv, title: newTitle } : conv
                ))}
              />
            </div>
          </div>
        )}

        {/* Panneau principal */}
        <div className="flex-1 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center p-4 border-b border-mono-800 relative bg-mono-900">
            {/* Bouton gauche */}
            <div className="absolute left-4">
              {currentUser && (
                <>
                  {selectedConversation ? (
                    <button
                      onClick={() => setShowConversations(true)}
                      className="text-mono-400 hover:text-mono-50 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowConversations(true)}
                      className="text-mono-400 hover:text-mono-50 transition-colors"
                    >
                      <MessageSquare className="w-5 h-5" />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Titre centré */}
            <div className="flex-1 flex justify-center">
              <h1 className="text-lg font-orbitron">
                Manhattan
              </h1>
            </div>

            {/* Boutons à droite */}
            <div className="absolute right-4 flex items-center gap-4">
              {currentUser ? (
                <>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="text-mono-400 hover:text-mono-50 transition-colors"
                  >
                    <UserCircle className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-mono-400 hover:text-mono-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsLoginMode(true);
                      setShowAuthModal(true);
                    }}
                    className="px-4 py-2 text-sm text-mono-50 hover:text-mono-200 transition-colors"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setIsLoginMode(false);
                      setShowAuthModal(true);
                    }}
                    className="px-4 py-2 text-sm bg-mono-50 text-mono-900 rounded-lg hover:bg-mono-200 transition-colors"
                  >
                    Sign up
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Zone de contenu principale avec défilement */}
          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto w-full px-4">
              <div className="space-y-6 py-8">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.type === 'user'
                          ? 'bg-mono-700 mr-[15%]'  
                          : message.type === 'assistant'
                          ? 'bg-mono-800 ml-[15%]'  
                          : message.type === 'stats'
                          ? 'bg-mono-800 w-full'
                          : message.type === 'attachments'
                          ? 'bg-mono-800 border border-mono-700 w-full'
                          : 'bg-mono-800 border border-mono-700'
                      }`}
                    >
                      {message.type === 'stats' ? (
                        <>
                          <p className="text-mono-50 mb-4">{message.content}</p>
                          <MarketStats freelancers={message.freelancers || []} />
                        </>
                      ) : message.type === 'attachments' ? (
                        <>
                          <p className="text-mono-50 mb-4">{message.content}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {message.attachments?.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="flex items-center gap-3 p-3 bg-mono-700 rounded-lg"
                              >
                                <div className="flex-1 truncate">
                                  <p className="text-sm text-mono-50 truncate">
                                    {attachment.name}
                                  </p>
                                  <p className="text-xs text-mono-400">
                                    {attachment.size}
                                  </p>
                                </div>
                                <button
                                  onClick={() => handleRemoveAttachment(attachment.id)}
                                  className="p-1 text-mono-400 hover:text-mono-50"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <p className="text-mono-50">{message.content}</p>
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
            </div>
          </div>

          {/* Input de chat fixe en bas */}
          <div className="p-4 border-t border-mono-800 bg-mono-900">
            <div className="max-w-7xl mx-auto w-full">
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
      </div>

      {/* Modals */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
          onSignup={handleSignup}
          onGoogleLogin={handleGoogleLogin}
          initialMode={isLoginMode}
        />
      )}
      
      {currentUser && showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={currentUser}
        />
      )}
    </div>
  );
}

export default App;