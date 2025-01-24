import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';
import Signup from './pages/Signup';
import { Login } from './pages/Login';
import { SearchBar } from './components/SearchBar';
import { FreelancerCard } from './components/FreelancerCard';
import { AttachmentUpload } from './components/AttachmentUpload';
import { MarketStats } from './components/MarketStats';
import { AuthModal } from './components/AuthModal';
import { ConversationsList } from './components/ConversationsList';
import { ProfileModal } from './components/ProfileModal';
import {
  X,
  LogOut,
  Settings,
  MessageSquare,
  ChevronLeft,
  UserCircle,
  LogIn,
  UserPlus,
  Paperclip
} from 'lucide-react';
import {
  Freelancer,
  Attachment,
  Message,
  User as UserType,
  Conversation
} from './types';
import { searchFreelancers } from './services/scraper';
import { uploadAttachment } from './services/attachments';
import { playTamTam } from './services/sound';
import { login, signup, logout } from './services/auth';

function MainApp() {
  const navigate = useNavigate();

  const [searchTerms, setSearchTerms] = useState<string[]>([]);
  const [showConversations, setShowConversations] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [freelancers, setFreelancers] = useState<Freelancer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [error, setError] = useState('');

  // Simple onConfirm function to avoid reference errors
  const onConfirm = () => {
    console.log('Confirm button clicked');
  };

  useEffect(() => {
    if (isLoading) {
      const text = 'Qbet.search';
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
    const newMessage: Message = { type: 'user', content: query };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);

    if (selectedConversation) {
      const updatedConversation: Conversation = {
        ...selectedConversation,
        messages: updatedMessages
      };
      setSelectedConversation(updatedConversation);
      setConversations(
        conversations.map(conv =>
          conv.id === selectedConversation.id ? updatedConversation : conv
        )
      );
    }

    setIsLoading(true);

    try {
      // Simulate an API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const results = await searchFreelancers(query);
      setFreelancers(results);

      const response: Message = {
        type: 'assistant',
        content: `Based on your search "${query}", here are ${results.length} freelancers that might interest you:`
      };
      const statsMessage: Message = {
        type: 'stats',
        content: 'Market Statistics:',
        freelancers: results
      };

      const finalMessages = [...updatedMessages, response, statsMessage];
      setMessages(finalMessages);

      if (selectedConversation) {
        const finalConversation: Conversation = {
          ...selectedConversation,
          messages: finalMessages
        };
        setSelectedConversation(finalConversation);
        setConversations(
          conversations.map(conv =>
            conv.id === selectedConversation.id ? finalConversation : conv
          )
        );
      }
    } catch (error) {
      const errorMessage: Message = {
        type: 'assistant',
        content: 'Sorry, an error occurred during the search. Please try again.'
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);

      if (selectedConversation) {
        const finalConversation: Conversation = {
          ...selectedConversation,
          messages: finalMessages
        };
        setSelectedConversation(finalConversation);
        setConversations(
          conversations.map(conv =>
            conv.id === selectedConversation.id ? finalConversation : conv
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (files: File[]) => {
    if (attachments.length + files.length > 6) {
      alert('You cannot upload more than 6 documents.');
      return;
    }

    try {
      const newAttachments = await Promise.all(
        files.map(file => uploadAttachment(file))
      );

      setAttachments(prev => [...prev, ...newAttachments]);
      setMessages(prev => [
        ...prev,
        {
          type: 'attachments',
          content: 'Uploaded documents:',
          attachments: newAttachments
        }
      ]);
      setShowUpload(false);
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : 'An error occurred during upload'
      );
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
    sector: string,
    phone: string,
    plan: string,
    profilePicture?: File
  ) => {
    try {
      await signup({
        email,
        password,
        firstName,
        lastName,
        company,
        sector,
        phone,
        plan,
        profilePicture
      });
      navigate('/');
    } catch (error) {
      console.error('Signup failed:', error);
      setError('Signup failed. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setShowConversations(false);
      setSelectedConversation(null);
      setConversations([]);
      setMessages([]);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      console.log('Google login clicked');
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleConversationSelect = (conversation: Conversation) => {
    if (conversation.id !== selectedConversation?.id) {
      setSelectedConversation(conversation);
      setShowConversations(false);
      setMessages([...conversation.messages]);
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
    setMessages([]);
    setFreelancers([]);

    const newConv: Conversation = {
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
      <div
        className={`flex h-full transition-all duration-300 ${
          showConversations ? 'pl-80' : 'pl-0'
        }`}
      >
        {currentUser && showConversations && (
          <div className="fixed left-0 top-0 h-screen w-80 bg-mono-900 border-r border-mono-800">
            <div className="p-4 border-b border-mono-800 flex justify-between items-center">
              <h2 className="text-lg font-orbitron text-mono-50">
                Conversations
              </h2>
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
                onConversationSelect={conversation => {
                  setSelectedConversation(conversation);
                  setShowConversations(false);
                }}
                onNewConversation={handleNewConversation}
                onDelete={id =>
                  setConversations(conversations.filter(conv => conv.id !== id))
                }
                onEdit={(id, newTitle) =>
                  setConversations(
                    conversations.map(conv =>
                      conv.id === id ? { ...conv, title: newTitle } : conv
                    )
                  )
                }
              />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col h-full">
          <div className="flex items-center p-4 border-b border-mono-800 relative bg-mono-900">
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

            <div className="flex-1 flex justify-center">
              <h1 className="text-lg font-orbitron">Qbet</h1>
            </div>

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
                    onClick={() => navigate('/login')}
                    className="text-mono-400 hover:text-mono-50 transition-colors"
                  >
                    <span className="hidden sm:inline">Login</span>
                    <LogIn className="w-5 h-5 sm:hidden" />
                  </button>
                  <button
                    onClick={() => navigate('/signup')}
                    className="text-mono-400 hover:text-mono-50 transition-colors"
                  >
                    <span className="hidden sm:inline">Signup</span>
                    <UserPlus className="w-5 h-5 sm:hidden" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="max-w-7xl mx-auto w-full px-4">
              <div className="space-y-6 py-8">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.type === 'user'
                          ? 'bg-mono-700 mr-[15%]'
                          : message.type === 'assistant'
                          ? 'bg-mono-800 ml-[15%]'
                          : message.type === 'stats'
                          ? 'bg-mono-800 w-full'
                          : 'bg-mono-800 border border-mono-700'
                      }`}
                    >
                      {message.type === 'stats' ? (
                        <>
                          <p className="text-mono-50 mb-4">{message.content}</p>
                          <MarketStats
                            freelancers={message.freelancers || []}
                          />
                        </>
                      ) : message.type === 'attachments' ? (
                        <div className="flex flex-wrap gap-2">
                          {message.attachments?.map((attachment, idx) => (
                            <div
                              key={idx}
                              className="bg-mono-700 rounded p-2 flex items-center"
                            >
                              <Paperclip className="w-4 h-4 mr-2" />
                              <span>{attachment.name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-mono-50">{message.content}</p>
                      )}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-center items-center space-x-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-mono-50"></div>
                    <span className="text-mono-50 font-orbitron">
                      {loadingText}
                    </span>
                  </div>
                )}

                {!isLoading && messages.length > 0 && freelancers.length > 0 && (
                  <div className="space-y-4">
                    {freelancers.map(freelancer => (
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

          <div className="p-4 border-t border-mono-800 bg-mono-900">
            <div className="max-w-7xl mx-auto w-full">
              <SearchBar onSearch={handleSearch} onUpload={handleFileUpload} />

              {attachments.length > 0 && (
                <div className="mt-4 bg-mono-800 rounded-lg shadow-lg border border-mono-700 p-4">
                  <h3 className="text-mono-50 font-semibold mb-2">
                    Attachments
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {attachments.map(attachment => (
                      <div
                        key={attachment.id}
                        className="bg-mono-700 rounded p-2 flex items-center"
                      >
                        <Paperclip className="w-4 h-4 mr-2" />
                        <span>{attachment.name}</span>
                        <button
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          className="ml-2 text-mono-400 hover:text-mono-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <button
                onClick={onConfirm}
                className="w-full mt-4 py-2 px-4 bg-mono-50 text-mono-900 rounded hover:bg-mono-200 transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainApp;
