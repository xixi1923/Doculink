import React, { useState } from 'react'
import {
  Search,
  MoreVertical,
  Send,
  Info,
  CheckCheck,
  Image as ImageIcon,
  Paperclip,
  Smile
} from 'lucide-react'

interface Message {
  id: number;
  text: string;
  time: string;
  isMe: boolean;
  status: 'sent' | 'delivered' | 'read';
}

interface Chat {
  id: number;
  user: {
    name: string;
    avatar: string;
    status: 'online' | 'offline';
    lastSeen?: string;
  };
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: Message[];
}

const MOCK_CHATS: Chat[] = [
  {
    id: 1,
    user: {
      name: 'Sopheak K.',
      avatar: 'https://i.pravatar.cc/150?u=sopheak',
      status: 'online',
    },
    lastMessage: 'Thanks for the physics notes! They helped a lot.',
    time: '2:45 PM',
    unreadCount: 2,
    messages: [
      { id: 1, text: 'Hi! I saw your upload on Grade 12 Physics.', time: '2:30 PM', isMe: false, status: 'read' },
      { id: 2, text: 'Can you share the formula sheet too?', time: '2:31 PM', isMe: false, status: 'read' },
      { id: 3, text: 'Sure! I will upload it tonight.', time: '2:40 PM', isMe: true, status: 'read' },
      { id: 4, text: 'Thanks for the physics notes! They helped a lot.', time: '2:45 PM', isMe: false, status: 'delivered' },
    ]
  },
  {
    id: 2,
    user: {
      name: 'Vibol R.',
      avatar: 'https://i.pravatar.cc/150?u=vibol',
      status: 'offline',
      lastSeen: '2 hours ago'
    },
    lastMessage: 'Do you have the solution for the 2023 math exam?',
    time: '11:20 AM',
    unreadCount: 0,
    messages: []
  },
  {
    id: 3,
    user: {
      name: 'Leakena T.',
      avatar: 'https://i.pravatar.cc/150?u=leakena',
      status: 'online',
    },
    lastMessage: 'I just uploaded the chemistry lab reports.',
    time: 'Yesterday',
    unreadCount: 0,
    messages: []
  }
]

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState<Chat>(MOCK_CHATS[0])
  const [newMessage, setNewMessage] = useState('')

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-120px)] my-6 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700 h-full overflow-hidden flex">

        {/* Sidebar - Chat List */}
        <aside className="w-full md:w-80 lg:w-96 border-r border-gray-100 dark:border-gray-700 flex flex-col">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Messages</h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search messages..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-transparent rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto px-3 space-y-1">
            {MOCK_CHATS.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full flex items-center gap-4 p-4 rounded-[24px] transition-all ${
                  selectedChat.id === chat.id
                    ? 'bg-primary/5 text-primary'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                }`}
              >
                <div className="relative shrink-0">
                  <img src={chat.user.avatar} alt={chat.user.name} className="w-12 h-12 rounded-full object-cover" />
                  {chat.user.status === 'online' && (
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                  )}
                </div>
                <div className="flex-grow min-w-0 text-left">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className={`font-bold text-sm truncate ${selectedChat.id === chat.id ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                      {chat.user.name}
                    </h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{chat.time}</span>
                  </div>
                  <p className="text-xs truncate font-medium opacity-70">{chat.lastMessage}</p>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {chat.unreadCount}
                  </div>
                )}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-grow flex flex-col bg-gray-50/30 dark:bg-gray-900/10">
          {/* Chat Header */}
          <header className="p-4 md:p-6 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={selectedChat.user.avatar} alt={selectedChat.user.name} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white leading-none mb-1">{selectedChat.user.name}</h2>
                <p className="text-[10px] font-bold text-green-500 uppercase tracking-widest">
                  {selectedChat.user.status === 'online' ? 'Online' : `Last seen ${selectedChat.user.lastSeen}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl transition-all">
                <Info size={20} />
              </button>
            </div>
          </header>

          {/* Messages Feed */}
          <div className="flex-grow overflow-y-auto p-6 space-y-6">
            <div className="flex justify-center">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">Today</span>
            </div>

            {selectedChat.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] group ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <div className={`px-5 py-3 rounded-[24px] text-sm font-medium shadow-sm leading-relaxed ${
                    msg.isMe
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-50 dark:border-gray-700'
                  }`}>
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5 px-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">{msg.time}</span>
                    {msg.isMe && (
                      <CheckCheck size={12} className={msg.status === 'read' ? 'text-primary' : 'text-gray-300'} />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <footer className="p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-2 rounded-2xl border border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-1">
                <button className="p-2 text-gray-400 hover:text-primary transition-all">
                  <Smile size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-primary transition-all">
                  <Paperclip size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-primary transition-all">
                  <ImageIcon size={20} />
                </button>
              </div>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-grow bg-transparent border-none outline-none text-sm py-2 px-2 text-gray-900 dark:text-white"
              />
              <button
                disabled={!newMessage.trim()}
                className={`p-2.5 rounded-xl transition-all ${
                  newMessage.trim() ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-200 text-white cursor-not-allowed'
                }`}
              >
                <Send size={20} />
              </button>
            </div>
          </footer>
        </main>

      </div>
    </div>
  )
}
