import React, { useState, useEffect } from 'react'
import {
  Bell,
  Heart,
  MessageSquare,
  UserPlus,
  FileText,
  Check,
  Trash2,
  Loader2
} from 'lucide-react'
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotificationApi
} from '@/api/authApi'

// ================= TYPES & INTERFACES =================
interface NotificationItem {
  id: string;
  type: string;
  data: {
    message?: string;
    user_name?: string;
    user_avatar?: string;
    action_text?: string;
    item_title?: string;
    type?: 'like' | 'comment' | 'follow' | 'system';
  };
  read_at: string | null;
  created_at: string;
}

// Fallback mock data if server is empty
const MOCK_FALLBACK: any[] = [
  {
    id: '1',
    type: 'like',
    data: {
      user_name: 'Sokea M.',
      user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      action_text: 'liked your document',
      item_title: 'Grade 12 Physics Summary',
      type: 'like'
    },
    created_at: '2 mins ago',
    read_at: null
  },
  {
    id: '2',
    type: 'comment',
    data: {
      user_name: 'Leakena T.',
      user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
      action_text: 'commented:',
      item_title: 'This is exactly what I needed, thank you!',
      type: 'comment'
    },
    created_at: '1 hour ago',
    read_at: null
  },
  {
    id: '3',
    type: 'follow',
    data: {
      user_name: 'Vibol R.',
      user_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      action_text: 'started following you',
      type: 'follow'
    },
    created_at: '3 hours ago',
    read_at: '2023-10-10'
  },
  {
    id: '4',
    type: 'system',
    data: {
      user_name: 'DocuLink',
      action_text: 'Your document',
      item_title: 'National Exam Prep',
      message: 'has been approved!',
      type: 'system'
    },
    created_at: 'Yesterday',
    read_at: '2023-10-10'
  }
]

type FilterType = 'all' | 'unread';

export default function Notifications(): React.JSX.Element {
  const [notifications, setNotifications] = useState<any[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const data = await getNotifications()
      // Laravel returns pagination object, so we get data.data
      const fetched = data.data || []
      if (fetched.length === 0) {
        setNotifications(MOCK_FALLBACK)
      } else {
        setNotifications(fetched)
      }
    } catch (error) {
      console.error('Failed to fetch notifications', error)
      setNotifications(MOCK_FALLBACK)
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n))
    } catch (error) {
      console.error('Failed to mark as read', error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteNotificationApi(id)
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (error) {
      console.error('Failed to delete', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })))
    } catch (error) {
      console.error('Failed to mark all as read', error)
    }
  }

  const filteredNotifications = notifications.filter(n =>
    filter === 'all' ? true : !n.read_at
  )

  const unreadCount = notifications.filter(n => !n.read_at).length

  const getIcon = (type: string): React.JSX.Element => {
    switch (type) {
      case 'like':
        return <Heart className="text-rose-500 fill-rose-500" size={12} />
      case 'comment':
        return <MessageSquare className="text-sky-500 fill-sky-500" size={12} />
      case 'follow':
        return <UserPlus className="text-emerald-500" size={12} />
      case 'system':
        return <FileText className="text-teal-500" size={12} />
      default:
        return <Bell size={12} />
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 font-sans motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom duration-500">

      {/* ================= HEADER SECTION ================= */}
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Notifications</h1>
        <p className="text-base text-slate-400 dark:text-slate-500 mt-2 font-medium">Stay updated with your active community footprint.</p>
      </div>

      {/* ================= TABS & ACTIONS ================= */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-slate-800">
        <div className="flex gap-8">
          <button
            onClick={() => setFilter('all')}
            className={`pb-4 text-[13px] font-black uppercase tracking-widest transition-all relative ${
              filter === 'all' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            All
            {filter === 'all' && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-teal-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setFilter('unread')}
            className={`pb-4 text-[13px] font-black uppercase tracking-widest transition-all relative flex items-center gap-2 ${
              filter === 'unread' ? 'text-slate-900 dark:text-white' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-teal-500/10 text-teal-600 text-[10px] font-black rounded-md">
                {unreadCount}
              </span>
            )}
            {filter === 'unread' && (
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-teal-500 rounded-full" />
            )}
          </button>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="pb-4 text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest hover:text-teal-500 transition-colors"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* ================= NOTIFICATIONS LIST ================= */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800/60 shadow-sm overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-slate-50 dark:divide-slate-800/40">
            {filteredNotifications.map((n) => {
              const data = typeof n.data === 'string' ? JSON.parse(n.data) : n.data;
              const isUnread = !n.read_at;
              const type = data.type || 'system';

              return (
                <div
                  key={n.id}
                  className={`p-6 flex items-start gap-5 transition-all duration-200 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 group relative ${
                    isUnread ? 'bg-teal-500/[0.02] dark:bg-teal-500/[0.05]' : ''
                  }`}
                >
                  {/* Unread Indicator Bar */}
                  {isUnread && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500" />
                  )}

                  {/* Avatar / Brand Block */}
                  <div className="relative shrink-0">
                    <div className={`w-14 h-14 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700/50 flex items-center justify-center shadow-xs ${
                      !data.user_avatar ? 'bg-[#0b1329]' : 'bg-slate-50 dark:bg-slate-800'
                    }`}>
                      {data.user_avatar ? (
                        <img src={data.user_avatar} alt={data.user_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-teal-400 font-black text-xs">DL</div>
                      )}
                    </div>

                    {/* Miniature Type Badge */}
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800">
                      {getIcon(type)}
                    </div>
                  </div>

                  {/* Content Block */}
                  <div className="flex-grow min-w-0 pt-1">
                    <p className="text-[15px] text-slate-700 dark:text-slate-300 leading-snug">
                      <span className="font-black text-slate-900 dark:text-white mr-1.5">{data.user_name}</span>
                      {data.action_text}
                      {data.item_title && (
                        <span className="font-bold text-slate-900 dark:text-white mx-1.5">"{data.item_title}"</span>
                      )}
                      {data.message && <span>{data.message}</span>}
                    </p>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] mt-2.5">
                      {n.created_at}
                    </p>
                  </div>

                  {/* Actions Overlay */}
                  <div className="flex items-center gap-1.5 md:opacity-0 group-hover:opacity-100 transition-all duration-200">
                    {isUnread && (
                      <button
                        onClick={() => handleMarkAsRead(n.id)}
                        className="p-2 hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-teal-500 rounded-xl transition-all border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700 shadow-sm"
                        title="Mark as read"
                      >
                        <Check size={16} className="stroke-[3]" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(n.id)}
                      className="p-2 hover:bg-white dark:hover:bg-slate-800 text-slate-400 hover:text-rose-500 rounded-xl transition-all border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700 shadow-sm"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* ================= EMPTY STATE ================= */
          <div className="py-24 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-600">
              <Bell size={32} />
            </div>
            <h3 className="text-lg text-slate-900 dark:text-white font-black">All Caught Up!</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 max-w-[240px] mx-auto font-medium">
              {filter === 'all'
                ? "Your notification center is currently empty. Check back later for updates."
                : "You've read all your notifications. Great job keeping up!"}
            </p>
          </div>
        )}
      </div>

      {/* ================= FOOTER LINKS ================= */}
      <div className="mt-12 text-center">
        <button className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-teal-500 transition-all duration-300">
          View Preferences Settings
        </button>
      </div>

    </div>
  )
}
