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
  Loader2,
  User as UserIcon,
  ChevronLeft,
  RotateCw,
  X,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight,
  Download,
  File,
  FileText,
  FileVideo,
  Eye,
  Trash2,
  Ban,
  Lock,
} from 'lucide-react'
import {
  getConversations,
  getConversationMessages,
  sendChatMessageApi,
  searchUsersApi,
  startConversationApi,
  markConversationAsRead,
  deleteConversationApi,
  endConversationApi,
  reopenConversationApi,
  blockUserApi,
  unblockUserApi,
  setTypingIndicatorApi,
  getTypingIndicatorsApi,
  downloadAttachmentApi,
} from '@/api/authApi'
import { useAuthStore } from '@/store/authStore'
import { useOnlineStatus } from '@/hooks/useOnlineStatus'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'

interface Attachment {
  id: number;
  message_id: number;
  file_path: string;
  file_name: string;
  file_type?: string;
  file_size?: number;
  file_url: string;
  thumbnail_url: string;
  display_type: 'image' | 'video' | 'pdf' | 'document' | 'presentation' | 'spreadsheet' | 'archive' | 'file';
  created_at: string;
}

interface Message {
  id: number;
  message: string;
  type: 'text' | 'image' | 'video' | 'file' | 'emoji';
  sender_id: number;
  created_at: string;
  attachments?: Attachment[];
  sender: {
    id: number;
    name: string;
    avatar: string;
  };
}

interface Conversation {
  id: number;
  status?: 'active' | 'ended' | 'archived';
  other_user: {
    id: number;
    name: string;
    avatar: string;
    status: 'online' | 'offline';
    last_activity?: number | string;
  };
  last_message: {
    text: string;
    time: string;
  } | null;
  unread_count: number;
}

// Status Indicator Component with timeout logic
function StatusIndicator({ status, lastActivity }: { status: 'online' | 'offline'; lastActivity?: number | string }) {
  const lastActivityMs = typeof lastActivity === 'string' ? new Date(lastActivity).getTime() : lastActivity
  const statusInfo = useOnlineStatus(status, lastActivityMs)

  return (
    <>
      <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusInfo.isOnline ? 'bg-green-500' : 'bg-slate-300'}`} />
      <span className="text-[10px] text-slate-400">{statusInfo.timeAgoText}</span>
    </>
  )
}

function StatusIndicatorSmall({ status, lastActivity }: { status: 'online' | 'offline'; lastActivity?: number | string }) {
  const lastActivityMs = typeof lastActivity === 'string' ? new Date(lastActivity).getTime() : lastActivity
  const statusInfo = useOnlineStatus(status, lastActivityMs)

  return (
    <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900"
         style={{ backgroundColor: statusInfo.isOnline ? '#22c55e' : '#cbd5e1' }} />
  )
}

function ChatAvatar({ src, name, size = 'sm' }: { src?: string; name?: string; size?: 'xs' | 'sm' | 'base' }) {
  const [hasError, setHasError] = useState(false);
  const initials = name ? name[0].toUpperCase() : 'U';

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base'
  };

  if (!src || hasError) {
    return <span className={`text-teal-600 font-medium uppercase ${sizeClasses[size]}`}>{initials}</span>;
  }

  return (
    <img
      src={src}
      alt={name}
      className="w-full h-full object-cover"
      onError={() => setHasError(true)}
    />
  );
}

export default function Messages() {
  const [searchParams, setSearchParams] = useSearchParams()
  const targetUserId = searchParams.get('user')
  const conversationIdParam = searchParams.get('conversation')
  const navigate = useNavigate()

  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [attachments, setAttachments] = useState<{ file: File; preview?: string }[]>([])
  const [previewModal, setPreviewModal] = useState<any>(null)

  const [previewIndex, setPreviewIndex] = useState(0)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showBlockConfirm, setShowBlockConfirm] = useState(false)
  const [showConversationMenu, setShowConversationMenu] = useState(false)
  const [typingUsers, setTypingUsers] = useState<any[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  const { user, token } = useAuthStore()

  // Get role-based messages
  const getRoleBasedMessages = () => {
    const role = user?.role || 'student'
    const roleMessages: { [key: string]: { empty: string; noResults: string; placeholder: string } } = {
      admin: {
        empty: 'No active discussions. Manage scholar communications here.',
        noResults: 'No scholars found. Use search to locate users to contact.',
        placeholder: 'Search scholars to manage communications...'
      },
      moderator: {
        empty: 'No open conversations. Connect with scholars to begin dialogue.',
        noResults: 'No matching scholars. Search to initiate discussions.',
        placeholder: 'Search scholars to facilitate discussions...'
      },
      student: {
        empty: 'No open threads active. Look up a peer above to start.',
        noResults: 'No scholars found matching your search.',
        placeholder: 'Search authors or scholars...'
      }
    }
    return roleMessages[role] || roleMessages.student
  }

  const roleMessages = getRoleBasedMessages()

  useEffect(() => {
    if (token) {
        fetchConversations()
    }
  }, [token])

  useEffect(() => {
    if (targetUserId) {
        handleStartNewChat(targetUserId)
    }
  }, [targetUserId])

  useEffect(() => {
    if (conversationIdParam && conversations.length > 0) {
      const found = conversations.find((c: any) => c.id.toString() === conversationIdParam)
      if (found && found.id !== selectedConversation?.id) {
        setSelectedConversation(found)
      }
    }
  }, [conversationIdParam, conversations])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
      markAsRead(selectedConversation.id)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Handle click outside emoji picker
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        // Check if click is not on the emoji button
        const target = event.target as HTMLElement
        if (!target.closest('[title="Add sticker/emoji"]')) {
          setShowEmojiPicker(false)
        }
      }
    }

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showEmojiPicker])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const fetchConversations = async () => {
    setIsLoadingConversations(true)
    try {
      const data = await getConversations()
      setConversations(data)

      if (conversationIdParam) {
        const found = data.find((c: any) => c.id.toString() === conversationIdParam)
        if (found) {
          setSelectedConversation(found)
        } else if (data.length > 0) {
           setSelectedConversation(data[0])
        }
      } else if (!targetUserId && data.length > 0 && !selectedConversation) {
        setSelectedConversation(data[0])
      }
    } catch (error: any) {
      console.error('Failed to fetch conversations', error.response?.data || error.message)
      alert('Failed to fetch conversations: ' + (error.response?.data?.message || 'Server error'))
    } finally {
      setIsLoadingConversations(false)
    }
  }

  const handleStartNewChat = async (userId: string) => {
    try {
        const res = await startConversationApi(userId)
        const data = await getConversations()
        setConversations(data)

        const conversation = data.find((c: any) => c.id === res.id)
        if (conversation) {
            setSelectedConversation(conversation)
        }
        setSearchParams({})
    } catch (error: any) {
        console.error('Failed to start conversation', error.response?.data || error.message)
        alert('Failed to start conversation: ' + (error.response?.data?.message || 'Server error'))
    }
  }

  const fetchMessages = async (conversationId: number) => {
    setIsLoadingMessages(true)
    try {
      const data = await getConversationMessages(conversationId)
      setMessages(data)
    } catch (error) {
      console.error('Failed to fetch messages', error)
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const markAsRead = async (conversationId: number) => {
    try {
      await markConversationAsRead(conversationId)
      setConversations(prev => prev.map(c =>
        c.id === conversationId ? { ...c, unread_count: 0 } : c
      ))
    } catch (err) {
      console.error(err)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!newMessage.trim() && attachments.length === 0) || !selectedConversation) return

    setIsSending(true)
    try {
      // Create FormData to handle file uploads
      const formData = new FormData()
      formData.append('message', newMessage.trim())
      
      // Add attachments
      attachments.forEach((item) => {
        formData.append('attachments[]', item.file)
      })

      // Use FormData with fetch instead of axios for file upload
      const token = localStorage.getItem('token')
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
      
      const response = await fetch(
        `${apiUrl}/messages/${selectedConversation.id}/send`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData
        }
      )
      
      const responseText = await response.text()
      
      if (!response.ok) {
        console.error('Server error:', response.status, responseText)
        try {
          const errorData = JSON.parse(responseText)
          console.error('Failed to send message:', errorData.error || errorData.message)
          alert('Failed to send message: ' + (errorData.error || errorData.message || 'Unknown error'))
        } catch {
          alert('Failed to send message: Server error (Status: ' + response.status + ')')
        }
        return
      }

      const res = JSON.parse(responseText)
      setMessages(prev => [...prev, res])
      setNewMessage('')
      setAttachments([])

      setConversations(prev => prev.map(c =>
        c.id === selectedConversation.id
          ? { ...c, last_message: { text: res.message || '[Attachment]', time: 'Just now' } }
          : c
      ).sort((a, b) => (a.id === selectedConversation.id ? -1 : 1)))
    } catch (error) {
      console.error('Failed to send message', error)
      alert('Error sending message: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsSending(false)
    }
  }

  const handleSearchUsers = async (q: string) => {
    setSearchQuery(q)
    if (q.length < 2) {
        setSearchResults([])
        setIsSearching(false)
        return
    }
    setIsSearching(true)
    try {
        const results = await searchUsersApi(q)
        setSearchResults(results)
    } catch (error) {
        console.error(error)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Limit to 5 total attachments
    const remainingSlots = 5 - attachments.length
    const filesToAdd = files.slice(0, remainingSlots)

    filesToAdd.forEach(file => {
      const isMedia = file.type.startsWith('image/') || file.type.startsWith('video/')
      if (isMedia) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const previewUrl = e.target?.result as string
          setAttachments(prev => [...prev, { file, preview: previewUrl }])
        }
        reader.readAsDataURL(file)
      } else {
        setAttachments(prev => [...prev, { file }])
      }
    })

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  const openFilePreview = (attachments: any[], index: number) => {
    const imageAttachments = attachments.filter(att => 
      att.file_type && (att.file_type.startsWith('image/') || att.file_type.startsWith('video/'))
    )
    if (imageAttachments.length > 0) {
      const previewIndex = imageAttachments.findIndex(att => att === attachments[index])
      setPreviewModal(imageAttachments)
      setPreviewIndex(previewIndex >= 0 ? previewIndex : 0)
    }
  }

  const getFileIcon = (fileType: string, fileName: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon size={16} className="text-blue-500" />
    if (fileType.startsWith('video/')) return <FileVideo size={16} className="text-purple-500" />
    if (fileType.includes('pdf')) return <FileText size={16} className="text-red-500" />
    if (fileType.includes('word') || fileType.includes('document')) return <FileText size={16} className="text-blue-400" />
    return <File size={16} className="text-slate-500" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const inputRef = useRef<HTMLInputElement>(null)

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
    // Refocus input
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  // Handle typing indicator
  useEffect(() => {
    if (!selectedConversation || !newMessage.trim()) return

    const timer = setTimeout(() => {
      setTypingIndicatorApi(selectedConversation.id, true)
    }, 500)

    return () => {
      clearTimeout(timer)
      if (selectedConversation) {
        setTypingIndicatorApi(selectedConversation.id, false)
      }
    }
  }, [newMessage, selectedConversation])

  // Fetch typing indicators periodically
  useEffect(() => {
    if (!selectedConversation) return

    const interval = setInterval(async () => {
      try {
        const users = await getTypingIndicatorsApi(selectedConversation.id)
        setTypingUsers(users)
      } catch (err) {
        console.error(err)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [selectedConversation])

  const handleDeleteConversation = async () => {
    if (!selectedConversation) return
    
    try {
      await deleteConversationApi(selectedConversation.id)
      setConversations(prev => prev.filter(c => c.id !== selectedConversation.id))
      setSelectedConversation(null)
      setShowDeleteConfirm(false)
      alert('Conversation deleted successfully')
    } catch (error) {
      console.error('Failed to delete conversation', error)
      alert('Failed to delete conversation: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleBlockUser = async () => {
    if (!selectedConversation?.other_user) return
    
    try {
      await blockUserApi(selectedConversation.other_user.id)
      setConversations(prev => prev.filter(c => c.id !== selectedConversation.id))
      setSelectedConversation(null)
      setShowBlockConfirm(false)
      alert('User blocked successfully')
    } catch (error) {
      console.error('Failed to block user', error)
      alert('Failed to block user: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }

  const handleEndConversation = async () => {
    if (!selectedConversation) return
    
    try {
      await endConversationApi(selectedConversation.id)
      setSelectedConversation(prev => 
        prev ? { ...prev, status: 'ended' } : null
      )
      setShowConversationMenu(false)
      alert('Conversation ended. It is now read-only.')
    } catch (error) {
      console.error('Failed to end conversation', error)
      alert('Failed to end conversation: ' + (error instanceof Error ? error.message : 'Unknown error'))
    }
  }


  // Common stickers/emojis
  const emojis = ['😀', '😂', '😍', '🤔', '👍', '❤️', '🎉', '🔥', '💯', '👏', '😎', '🙏', '💪', '🤝', '✨', '🚀']

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-120px)] my-4 px-4 font-sans">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-slate-200 dark:border-gray-800 h-full overflow-hidden flex">

        {/* Sidebar - Chat Thread Feed */}
        <aside className={`w-full md:w-80 lg:w-96 border-r border-slate-200 dark:border-gray-800 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-4 border-b border-slate-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-3">
                <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Messages</h1>
                <button
                    onClick={fetchConversations}
                    disabled={isLoadingConversations}
                    className="p-1.5 text-slate-400 hover:text-teal-600 rounded-md hover:bg-slate-50 transition-colors disabled:opacity-50"
                    title="Refresh chat feed"
                >
                    <RotateCw size={15} className={isLoadingConversations ? 'animate-spin' : ''} />
                </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
              <input
                type="text"
                placeholder={roleMessages.placeholder}
                value={searchQuery}
                onChange={(e) => handleSearchUsers(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded text-xs text-slate-700 dark:text-gray-200 focus:bg-white focus:border-teal-600 outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto divide-y divide-slate-100 dark:divide-gray-800">
            {isSearching ? (
                <div className="p-2 space-y-0.5">
                    <p className="px-3 text-[10px] font-medium text-slate-400 uppercase tracking-wider mb-1">Search Results</p>
                    {searchResults.length > 0 ? searchResults.map(u => (
                        <button
                            key={u.id}
                            onClick={() => {
                                handleStartNewChat(u.id)
                                setSearchQuery('')
                                setIsSearching(false)
                            }}
                            className="w-full flex items-center gap-3 p-2.5 rounded hover:bg-slate-50 dark:hover:bg-gray-800 text-left transition-colors"
                        >
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-slate-100 dark:bg-gray-800 shrink-0 flex items-center justify-center border border-slate-200 dark:border-gray-700">
                                <ChatAvatar src={u.avatar} name={u.name} size="sm" />
                            </div>
                            <div className="min-w-0 flex-grow">
                                <p className="text-xs font-medium text-slate-900 dark:text-white truncate">{u.name}</p>
                                <p className="text-[10px] text-slate-400">Click to connect</p>
                            </div>
                        </button>
                    )) : (
                        <p className="px-3 py-3 text-xs text-slate-400 italic">{roleMessages.noResults}</p>
                    )}
                </div>
            ) : isLoadingConversations ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-5 h-5 text-teal-600 animate-spin" />
              </div>
            ) : conversations.length > 0 ? (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setSelectedConversation(conv)
                    setSearchParams({ conversation: conv.id.toString() })
                  }}
                  className={`w-full flex items-center gap-3 p-4 text-left transition-colors relative ${
                    selectedConversation?.id === conv.id
                      ? 'bg-teal-50 dark:bg-gray-800 text-teal-700'
                      : 'hover:bg-slate-50/60 dark:hover:bg-gray-800/40 text-slate-600 dark:text-gray-300'
                  }`}
                >
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full overflow-hidden border border-slate-200 dark:border-gray-700 bg-slate-100 dark:bg-gray-800 flex items-center justify-center">
                      <ChatAvatar src={conv.other_user?.avatar} name={conv.other_user?.name} size="base" />
                    </div>
                    <StatusIndicatorSmall status={conv.other_user?.status} lastActivity={conv.other_user?.last_activity} />
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className={`text-xs font-medium truncate ${selectedConversation?.id === conv.id ? 'text-teal-700 dark:text-teal-400' : 'text-slate-900 dark:text-white'}`}>
                        {conv.other_user?.name}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-normal shrink-0">{conv.last_message?.time}</span>
                    </div>
                    <p className={`text-xs truncate max-w-[200px] ${conv.unread_count > 0 ? 'font-semibold text-slate-900 dark:text-white' : 'text-slate-400 font-normal'}`}>
                        {conv.last_message?.text || 'No exchange updates yet'}
                    </p>
                  </div>

                  {conv.unread_count > 0 && (
                    <div className="absolute right-4 bottom-4 w-4 h-4 bg-teal-600 text-white text-[9px] font-medium rounded-full flex items-center justify-center">
                      {conv.unread_count}
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="text-center py-12 px-4">
                <p className="text-xs text-slate-400 font-medium">{roleMessages.empty}</p>
              </div>
            )}
          </div>
        </aside>

        {/* Main Conversation Viewer Frame */}
        <main className={`flex-grow flex flex-col bg-slate-50/40 dark:bg-gray-950/20 ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          {selectedConversation ? (
            <>
              {/* Context Header */}
              <header className="p-4 bg-white dark:bg-gray-900 border-b border-slate-200 dark:border-gray-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedConversation(null)} className="md:hidden p-1 text-slate-400 hover:text-teal-600">
                    <ChevronLeft size={20} />
                  </button>
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 dark:border-gray-700 bg-slate-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    <ChatAvatar src={selectedConversation.other_user?.avatar} name={selectedConversation.other_user?.name} size="xs" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">{selectedConversation.other_user?.name}</h2>
                      {selectedConversation.status === 'ended' && (
                        <span className="px-2 py-0.5 text-[8px] font-bold uppercase bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded">Ended</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <StatusIndicator status={selectedConversation.other_user?.status} lastActivity={selectedConversation.other_user?.last_activity} />
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 relative">
                  <Link to={`/user/${selectedConversation.other_user?.id}`} className="p-2 text-slate-400 hover:text-teal-600 rounded-md hover:bg-slate-50 transition-colors" title="View Profile">
                    <UserIcon size={16} />
                  </Link>
                  <button 
                    onClick={() => setShowConversationMenu(!showConversationMenu)}
                    className="p-2 text-slate-400 hover:text-teal-600 rounded-md hover:bg-slate-50 transition-colors"
                    title="Conversation options"
                  >
                    <MoreVertical size={16} />
                  </button>

                  {/* Conversation Menu */}
                  {showConversationMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg shadow-lg z-40 min-w-[200px]">
                      {selectedConversation.status !== 'ended' ? (
                        <>
                          <button
                            onClick={handleEndConversation}
                            className="w-full text-left px-4 py-2 text-xs font-medium text-amber-600 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-2"
                          >
                            <Lock size={14} /> End Conversation
                          </button>
                          <div className="border-t border-slate-200 dark:border-gray-700" />
                        </>
                      ) : null}
                      <button
                        onClick={() => {
                          setShowBlockConfirm(true)
                          setShowConversationMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-orange-600 dark:text-orange-400 hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Ban size={14} /> Block User
                      </button>
                      <div className="border-t border-slate-200 dark:border-gray-700" />
                      <button
                        onClick={() => {
                          setShowDeleteConfirm(true)
                          setShowConversationMenu(false)
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <Trash2 size={14} /> Delete Conversation
                      </button>
                    </div>
                  )}
                </div>
              </header>

              {/* Central Post Messages Layout Feed */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4">
                {isLoadingMessages ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
                  </div>
                ) : (
                  <>
                    {messages.map((msg: any) => {
                      const isMe = msg.sender_id === user?.id
                      const hasAttachments = msg.attachments && msg.attachments.length > 0
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[75%] flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            {msg.message && (
                              <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                isMe
                                  ? 'bg-teal-600 text-white shadow-sm rounded-tr-none'
                                  : 'bg-white dark:bg-gray-800 text-slate-800 dark:text-gray-200 border border-slate-200 dark:border-gray-700 rounded-tl-none'
                              }`}>
                                {msg.message}
                              </div>
                            )}
                            
                            {/* Display attachments */}
                            {hasAttachments && (
                              <div className={`flex flex-col gap-2 mt-2 ${isMe ? 'items-end' : 'items-start'}`}>
                                {msg.attachments.map((att: Attachment, idx: number) => {
                                  const isImage = att.display_type === 'image'
                                  const isVideo = att.display_type === 'video'
                                  const isPreviewable = isImage || isVideo
                                  
                                  if (isPreviewable) {
                                    return (
                                      <div
                                        key={idx}
                                        className={`relative group rounded-xl overflow-hidden border shadow-sm ${
                                          isMe
                                            ? 'border-teal-700'
                                            : 'border-slate-200 dark:border-gray-700'
                                        }`}
                                      >
                                        <img
                                          src={att.file_url}
                                          alt={att.file_name}
                                          className="max-w-[300px] max-h-[400px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                          onClick={() => openFilePreview(msg.attachments, idx)}
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                          <button
                                            onClick={() => openFilePreview(msg.attachments, idx)}
                                            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
                                          >
                                            <Eye size={18} />
                                          </button>
                                          <button
                                            onClick={(e) => {
                                              e.preventDefault();
                                              downloadAttachmentApi(att.id, att.file_name);
                                            }}
                                            className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-colors"
                                            title="Download"
                                          >
                                            <Download size={18} />
                                          </button>
                                        </div>
                                      </div>
                                    )
                                  }

                                  return (
                                    <div
                                      key={idx}
                                      className={`flex items-center gap-3 p-3 rounded-xl border w-64 group/file cursor-pointer transition-all hover:shadow-md ${
                                        isMe
                                          ? 'bg-teal-700/10 border-teal-600/20 text-teal-900 dark:text-teal-100 hover:bg-teal-700/20'
                                          : 'bg-white dark:bg-gray-800 border-slate-200 dark:border-gray-700 text-slate-900 dark:text-gray-100 hover:border-teal-500/50'
                                      }`}
                                      onClick={() => downloadAttachmentApi(att.id, att.file_name)}
                                    >
                                      <div className={`p-2 rounded-lg transition-transform group-hover/file:scale-110 ${isMe ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-gray-700 text-slate-500 dark:text-gray-400'}`}>
                                        {getFileIcon(att.file_type || '', att.file_name)}
                                      </div>
                                      <div className="flex-grow min-w-0">
                                        <p className="text-xs font-medium truncate group-hover/file:text-teal-600 transition-colors">{att.file_name}</p>
                                        <p className="text-[10px] opacity-60 uppercase">{formatFileSize(att.file_size || 0)} • {att.display_type}</p>
                                      </div>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          downloadAttachmentApi(att.id, att.file_name);
                                        }}
                                        className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                                        title="Download"
                                      >
                                        <Download size={16} />
                                      </button>
                                    </div>
                                  )
                                })}
                              </div>
                            )}

                            <div className="flex items-center gap-1.5 mt-1.5 px-1 text-[10px] text-slate-400 font-medium">
                              <span>
                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                              {isMe && <CheckCheck size={12} className="text-teal-500" />}
                            </div>
                          </div>
                        </div>
                      )
                    })}

                    {/* Typing Indicator Display */}
                    {typingUsers.length > 0 && (
                      <div className="flex justify-start items-center gap-2">
                        <div className="flex gap-1 p-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl rounded-tl-none shadow-sm">
                          <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-1.5 h-1.5 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium italic">
                          {typingUsers[0].name} is typing...
                        </span>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>


              {/* Message Composer Footer Tray */}
              <footer className="p-4 bg-white dark:bg-gray-900 border-t border-slate-200 dark:border-gray-800 relative">
                {/* Attachment Preview */}
                {attachments.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {attachments.map((item, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg border border-slate-200 dark:border-gray-700 overflow-hidden bg-slate-100 dark:bg-gray-800 shadow-sm">
                        {item.preview ? (
                          <img src={item.preview} alt="preview" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center p-1">
                            {getFileIcon(item.file.type, item.file.name)}
                            <span className="text-[8px] truncate w-full text-center mt-0.5">{item.file.name}</span>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(idx)}
                          className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] hover:bg-red-600 transition-colors shadow-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div
                    ref={emojiPickerRef}
                    className="absolute bottom-full mb-2 left-4 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-lg p-3 grid grid-cols-8 gap-1 w-56 shadow-lg z-50"
                  >
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className="text-xl hover:bg-slate-100 dark:hover:bg-gray-700 p-1 rounded transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                )}

                <form onSubmit={handleSend} className="flex items-center gap-2 border border-slate-200 dark:border-gray-700 rounded p-1.5 focus-within:border-teal-600 transition-colors bg-slate-50 dark:bg-gray-800">
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="p-1.5 text-slate-400 hover:text-teal-600 rounded hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                      title="Add sticker/emoji"
                    >
                      <Smile size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-1.5 text-slate-400 hover:text-teal-600 rounded hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
                      title="Send file, image, video, or document"
                    >
                      <Paperclip size={16} />
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx,.txt,.xlsx,.pptx"
                    className="hidden"
                  />

                  <input
                    type="text"
                    ref={inputRef}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={selectedConversation.status === 'ended' || isSending}
                    placeholder={selectedConversation.status === 'ended' ? "This conversation has ended and is read-only." : "Write your academic exchange message..."}
                    className="flex-grow bg-transparent border-none outline-none text-xs py-1 px-2 text-slate-900 dark:text-white placeholder:text-slate-400 disabled:opacity-50"
                  />

                  <button
                    type="submit"
                    disabled={(!newMessage.trim() && attachments.length === 0) || isSending || selectedConversation.status === 'ended'}
                    className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                      (newMessage.trim() || attachments.length > 0) && !isSending && selectedConversation.status !== 'ended'
                        ? 'bg-teal-600 text-white hover:bg-teal-700'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  </button>
                </form>
              </footer>
            </>
          ) : (
            <div className="flex-grow flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/30 rounded-full flex items-center justify-center text-teal-600 mb-3">
                <MessageSquare size={22} />
              </div>
              <h2 className="text-base font-medium text-slate-800 dark:text-white mb-1">Scholarly Inbox Workspace</h2>
              <p className="text-xs text-slate-400 max-w-xs leading-normal">
                Select an open discussion thread or look up an academic author to initiate collaborative text reviews.
              </p>
            </div>
          )}
        </main>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Delete Conversation</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this conversation? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white font-medium text-sm hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConversation}
                  className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Block Confirmation Modal */}
      {showBlockConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-sm w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Block User</h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 mb-6">
                Block {selectedConversation?.other_user?.name}? They will not be able to send you messages and this conversation will be hidden.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowBlockConfirm(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-gray-700 text-slate-900 dark:text-white font-medium text-sm hover:bg-slate-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBlockUser}
                  className="flex-1 px-4 py-2 rounded-lg bg-orange-600 text-white font-medium text-sm hover:bg-orange-700 transition-colors"
                >
                  Block
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Preview Modal */}
      {previewModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-black rounded-lg overflow-hidden">
            {/* Close Button */}
            <button
              onClick={() => setPreviewModal(null)}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* File Counter */}
            <div className="absolute top-4 left-4 text-white text-sm font-medium z-10">
              {previewIndex + 1} / {previewModal.length}
            </div>

            {/* Main Viewer */}
            <div className="flex items-center justify-center h-[90vh]">
              {previewModal[previewIndex]?.display_type === 'image' && (
                <img
                  src={previewModal[previewIndex].file_url}
                  alt={previewModal[previewIndex].file_name}
                  className="max-w-full max-h-full object-contain"
                />
              )}
              {previewModal[previewIndex]?.display_type === 'video' && (
                <video
                  controls
                  className="max-w-full max-h-full"
                  src={previewModal[previewIndex].file_url}
                />
              )}
            </div>

            {/* File Info Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
              <p className="text-sm font-medium truncate">{previewModal[previewIndex].file_name}</p>
              <p className="text-xs text-gray-300 mt-1">
                {formatFileSize(previewModal[previewIndex].file_size)}
              </p>
            </div>

            {/* Navigation Buttons */}
            {previewModal.length > 1 && (
              <>
                <button
                  onClick={() => setPreviewIndex((prev) => (prev - 1 + previewModal.length) % previewModal.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
                >
                  <ChevronLeftIcon size={20} />
                </button>
                <button
                  onClick={() => setPreviewIndex((prev) => (prev + 1) % previewModal.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Download Button */}
            <button
              onClick={() => downloadAttachmentApi(previewModal[previewIndex].id, previewModal[previewIndex].file_name)}
              className="absolute bottom-4 right-4 p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full transition-colors"
              title="Download"
            >
              <Download size={20} />
            </button>

          </div>
        </div>
      )}
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
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}