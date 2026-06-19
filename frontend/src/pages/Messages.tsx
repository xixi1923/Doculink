import React, { useState, useEffect, useRef } from 'react'
import {
  Search,
  MoreVertical,
  Send,
  Info,
  CheckCheck,
  Image as ImageIcon,
  Paperclip,
  Smile,
  Loader2
} from 'lucide-react'
import { getChats, getMessages, sendMessageApi } from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'

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
  messages?: Message[];
}

export default function Messages() {
  const [chats, setChats] = useState<Chat[]>([])
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoadingChats, setIsLoadingChats] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { user } = useAuthStore()

  useEffect(() => {
    fetchChats()
  }, [])

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id)
    }
  }, [selectedChat])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchChats = async () => {
    setIsLoadingChats(true)
    try {
      const data = await getChats()
      setChats(data)
      if (data.length > 0 && !selectedChat) {
        setSelectedChat(data[0])
      }
    } catch (error) {
      console.error('Failed to fetch chats', error)
    } finally {
      setIsLoadingChats(false)
    }
  }

  const fetchMessages = async (chatId: number) => {
    setIsLoadingMessages(true)
    try {
      const data = await getMessages(chatId)
      const formattedMessages = data.map((msg: any) => ({
        id: msg.id,
        text: msg.message,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: msg.sender_id === parseInt(user?.uid || '0'),
        status: msg.read_at ? 'read' : 'delivered'
      }))
      setMessages(formattedMessages)
    } catch (error) {
      console.error('Failed to fetch messages', error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedChat) return

    setIsSending(true)
    try {
      const res = await sendMessageApi({
        receiver_id: selectedChat.id,
        message: newMessage
      })

      const sentMsg: Message = {
        id: res.id,
        text: res.message,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true,
        status: 'sent'
      }

      setMessages(prev => [...prev, sentMsg])
      setNewMessage('')

      // Update chat list last message
      setChats(prev => prev.map(c =>
        c.id === selectedChat.id
          ? { ...c, lastMessage: res.message, time: 'Just now' }
          : c
      ))
    } catch (error) {
      console.error('Failed to send message', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-120px)] my-6 px-4 font-sans">
      <div className="bg-white dark:bg-gray-800 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-700 h-full overflow-hidden flex">

        {/* Sidebar - Chat List */}
        <aside className="w-full md:w-80 lg:w-96 border-r border-gray-100 dark:border-gray-700 flex flex-col">
          <div className="p-6">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">Messages</h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-gray-900 border border-transparent rounded-[20px] text-sm font-medium focus:bg-white dark:focus:bg-gray-950 focus:ring-4 focus:ring-primary/10 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto px-3 space-y-1 pb-4">
            {isLoadingChats ? (
              <div className="flex justify-center py-10">
                <Loader2 className="w-6 h-6 text-teal-500 animate-spin" />
              </div>
            ) : chats.length > 0 ? (
              chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`w-full flex items-center gap-4 p-4 rounded-[24px] transition-all group ${
                    selectedChat?.id === chat.id
                      ? 'bg-primary/5 text-primary'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 group-hover:scale-105 transition-transform">
                      <img src={chat.user.avatar || 'https://i.pravatar.cc/150'} alt={chat.user.name} className="w-full h-full object-cover" />
                    </div>
                    {chat.user.status === 'online' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
                    )}
                  </div>
                  <div className="flex-grow min-w-0 text-left">
                    <div className="flex justify-between items-center mb-1">
                      <h3 className={`font-black text-[15px] truncate ${selectedChat?.id === chat.id ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                        {chat.user.name}
                      </h3>
                      <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{chat.time}</span>
                    </div>
                    <p className="text-xs truncate font-bold opacity-60 leading-relaxed">{chat.lastMessage}</p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="w-5 h-5 bg-primary text-white text-[10px] font-black rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                      {chat.unreadCount}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-sm text-gray-400 font-medium">No messages yet</p>
              </div>
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-grow flex flex-col bg-gray-50/20 dark:bg-gray-900/10">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <header className="p-4 md:p-6 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
                    <img src={selectedChat.user.avatar || 'https://i.pravatar.cc/150'} alt={selectedChat.user.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h2 className="font-black text-gray-900 dark:text-white leading-none mb-1.5">{selectedChat.user.name}</h2>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${selectedChat.user.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <p className={`text-[10px] font-black uppercase tracking-widest ${selectedChat.user.status === 'online' ? 'text-green-500' : 'text-gray-400'}`}>
                        {selectedChat.user.status === 'online' ? 'Active Now' : `Last seen ${selectedChat.user.lastSeen || 'recently'}`}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-3 text-gray-400 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 rounded-2xl transition-all">
                    <Info size={22} />
                  </button>
                </div>
              </header>

              {/* Messages Feed */}
              <div className="flex-grow overflow-y-auto p-6 space-y-6">
                {isLoadingMessages ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
                  </div>
                ) : (
                  <>
                    <div className="flex justify-center">
                      <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.25em] bg-white dark:bg-gray-800 px-4 py-1.5 rounded-full shadow-sm border border-gray-50 dark:border-gray-700">Today</span>
                    </div>

                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] group ${msg.isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div className={`px-5 py-3.5 rounded-[24px] text-sm font-bold shadow-sm leading-relaxed ${
                            msg.isMe
                              ? 'bg-primary text-white rounded-tr-none'
                              : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-50 dark:border-gray-700'
                          }`}>
                            {msg.text}
                          </div>
                          <div className="flex items-center gap-2 mt-2 px-1">
                            <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{msg.time}</span>
                            {msg.isMe && (
                              <CheckCheck size={14} className={msg.status === 'read' ? 'text-primary' : 'text-gray-300'} />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <footer className="p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                <form onSubmit={handleSend} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 p-2.5 rounded-[24px] border border-gray-100 dark:border-gray-700 focus-within:ring-4 focus-within:ring-primary/5 transition-all">
                  <div className="flex items-center gap-1 pl-2">
                    <button type="button" className="p-2 text-gray-400 hover:text-primary transition-all rounded-xl hover:bg-white dark:hover:bg-gray-800">
                      <Smile size={22} />
                    </button>
                    <button type="button" className="p-2 text-gray-400 hover:text-primary transition-all rounded-xl hover:bg-white dark:hover:bg-gray-800">
                      <Paperclip size={22} />
                    </button>
                    <button type="button" className="p-2 text-gray-400 hover:text-primary transition-all rounded-xl hover:bg-white dark:hover:bg-gray-800">
                      <ImageIcon size={22} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a thoughtful message..."
                    className="flex-grow bg-transparent border-none outline-none text-[14px] font-bold py-2 px-3 text-gray-900 dark:text-white placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    className={`p-3.5 rounded-[18px] transition-all ${
                      newMessage.trim() && !isSending
                        ? 'bg-primary text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {isSending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  </button>
                </form>
              </footer>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-10 text-center">
              <div className="w-20 h-20 bg-primary/5 rounded-[32px] flex items-center justify-center text-primary mb-6">
                <MessageSquare size={40} className="fill-primary/10" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Your Inbox</h2>
              <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs font-medium leading-relaxed">
                Select a conversation from the sidebar to start collaborating with your peers.
              </p>
            </div>
          )}
        </main>

      </div>
    </div>
  )
}

function MessageSquare({ size, className }: { size: number, className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
