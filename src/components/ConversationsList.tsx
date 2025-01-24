import React, { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, X, Search, MessageSquarePlus } from 'lucide-react';

interface Conversation {
  id: string;
  title: string;
  date: Date;
  messages: Message[];
}

interface Message {
  content: string;
  type: 'user' | 'assistant' | 'stats';
  freelancers?: any[];
}

interface ConversationsListProps {
  onConversationSelect?: (conversation: Conversation) => void;
  onClose?: () => void;
  conversations: Conversation[];
  onNewConversation?: () => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, newTitle: string) => void;
}

export const ConversationsList: React.FC<ConversationsListProps> = ({ 
  onConversationSelect, 
  onClose,
  conversations = [],
  onNewConversation,
  onDelete,
  onEdit
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null);

  const filteredConversations = conversations.filter(conv => 
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  const handleSaveEdit = (id: string) => {
    if (onEdit) {
      onEdit(id, editingTitle);
    }
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (onDelete) {
      onDelete(id);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Barre de recherche */}
      <div className="px-4 py-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-mono-800 text-mono-50 rounded-lg pl-4 pr-10 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-mono-700"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-mono-400" />
        </div>
      </div>

      {/* Liste des conversations ou message vide */}
      <div className="flex-1 overflow-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center">
            <div className="bg-mono-800 rounded-full p-4 mb-4">
              <MessageSquarePlus className="w-8 h-8 text-mono-400" />
            </div>
            <h3 className="text-mono-50 font-medium mb-2">Aucune conversation</h3>
            <p className="text-mono-400 text-sm mb-6">
              Commencez une nouvelle conversation pour interagir avec Qbet
            </p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-4 py-8 text-center">
            <p className="text-mono-400 text-sm">
              Aucune conversation ne correspond à votre recherche
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {/* Aujourd'hui */}
            <div className="px-2 py-1">
              <h3 className="text-xs font-medium text-mono-400">Aujourd'hui</h3>
            </div>
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="relative group"
              >
                <div
                  onClick={() => onConversationSelect?.(conversation)}
                  className="w-full px-2 py-2 rounded-lg text-left hover:bg-mono-800 transition-colors group flex items-center justify-between cursor-pointer"
                >
                  {editingId === conversation.id ? (
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSaveEdit(conversation.id);
                        }
                      }}
                      className="flex-1 bg-mono-700 text-mono-50 rounded px-2 py-1 text-sm focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <span className="text-mono-50 text-sm truncate">
                      {conversation.title}
                    </span>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(conversation.id, conversation.title);
                      }}
                      className="p-1.5 text-mono-50 transition-colors rounded hover:bg-mono-700"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(conversation.id);
                      }}
                      className="p-1.5 text-mono-50 transition-colors rounded hover:bg-mono-700 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bouton Nouvelle conversation en bas */}
      <div className="p-4 border-t border-mono-800">
        <button
          onClick={onNewConversation}
          className="w-full py-2 bg-mono-800 hover:bg-mono-700 text-mono-50 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>Nouvelle conversation</span>
        </button>
      </div>
    </div>
  );
};
