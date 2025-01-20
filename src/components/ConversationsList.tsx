import React, { useState } from 'react';
import { MoreHorizontal, Pencil, Trash2, X, Search } from 'lucide-react';

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
}

export const ConversationsList: React.FC<ConversationsListProps> = ({ onConversationSelect, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [showOptionsId, setShowOptionsId] = useState<string | null>(null);

  // Exemple de conversations (à remplacer par les vraies données)
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: '1',
      title: 'Identification des destinataires en',
      date: new Date(),
      messages: []
    },
    {
      id: '2',
      title: 'Mise à jour jQuery',
      date: new Date(),
      messages: []
    },
    {
      id: '3',
      title: 'Réécriture de Pull Request',
      date: new Date(),
      messages: []
    },
    {
      id: '4',
      title: 'Résumé des tâches Dev',
      date: new Date(),
      messages: []
    },
    {
      id: '5',
      title: 'Résumé Daily 20/01/2025',
      date: new Date(),
      messages: []
    },
    {
      id: '6',
      title: 'Envoi de message',
      date: new Date(),
      messages: []
    },
    {
      id: '7',
      title: 'Résumé de la conversation',
      date: new Date(-1),
      messages: []
    }
  ]);

  const handleEdit = (id: string, title: string) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  const handleSaveEdit = (id: string) => {
    setConversations(conversations.map(conv => 
      conv.id === id ? { ...conv, title: editingTitle } : conv
    ));
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    setConversations(conversations.filter(conv => conv.id !== id));
  };

  const groupedConversations = conversations.reduce((groups, conv) => {
    const date = new Date(conv.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let dateStr = 'Plus ancien';
    if (date.toDateString() === today.toDateString()) {
      dateStr = "Aujourd'hui";
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateStr = 'Hier';
    }

    if (!groups[dateStr]) {
      groups[dateStr] = [];
    }
    groups[dateStr].push(conv);
    return groups;
  }, {} as Record<string, Conversation[]>);

  return (
    <div className="flex flex-col h-full bg-mono-900">
      {/* Barre de recherche */}
      <div className="px-4 py-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 bg-mono-800 text-mono-50 placeholder-mono-400 rounded border-none focus:outline-none focus:ring-0"
          />
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-mono-400">
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Liste des conversations */}
      <div className="flex-1 overflow-y-auto min-h-0">
        {Object.entries(groupedConversations).map(([date, convs]) => (
          <div key={date} className="mb-2">
            <div className="px-4 py-1 sticky top-0 bg-mono-900 z-10">
              <h3 className="text-sm text-mono-400 font-normal">{date}</h3>
            </div>
            <div>
              {convs.map((conv) => (
                <div
                  key={conv.id}
                  className="relative group"
                >
                  {editingId === conv.id ? (
                    <div className="flex items-center gap-2 px-4 py-1">
                      <input
                        type="text"
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        className="flex-1 px-2 py-1 bg-mono-800 text-mono-50 rounded focus:outline-none"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveEdit(conv.id);
                          }
                        }}
                      />
                      <button
                        onClick={() => handleSaveEdit(conv.id)}
                        className="text-mono-400 hover:text-mono-50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between px-4 py-1.5 hover:bg-mono-800/50 group">
                      <span 
                        className="text-mono-50 hover:text-mono-200 flex-1 truncate pr-2 text-[13px] cursor-pointer"
                        onClick={() => onConversationSelect?.(conv)}
                      >
                        {conv.title}
                      </span>
                      <div className="flex items-center gap-2 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(conv.id, conv.title);
                          }}
                          className="text-mono-50 hover:text-mono-200 transition-colors p-1"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(conv.id);
                          }}
                          className="text-mono-50 hover:text-mono-200 transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {Object.keys(groupedConversations).length === 0 && (
          <div className="flex-1 flex items-center justify-center text-mono-400 text-sm">
            Aucune conversation
          </div>
        )}
      </div>

      {/* Bouton nouvelle conversation */}
      <div className="p-4">
        <button
          onClick={() => {
            const newConv = {
              id: Date.now().toString(),
              title: 'Nouvelle conversation',
              date: new Date(),
              messages: []
            };
            setConversations([newConv, ...conversations]);
            handleEdit(newConv.id, newConv.title);
          }}
          className="w-full py-2.5 bg-mono-50 hover:bg-mono-200 text-mono-900 rounded-md transition-colors text-sm font-medium"
        >
          Nouvelle conversation
        </button>
      </div>
    </div>
  );
};
