import React, { useState, useEffect } from 'react'
import {
  Bell,
  Heart,
  MessageSquare,
  UserPlus,
  FileText,
  Check,
  Trash2,
  Loader2,
  Reply,
  ArrowRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification as deleteNotificationApi
} from '@/api/notificationsApi'

interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  related_id: number;
  related_type: string;
  read_at: string | null;
  created_at: string;
}

export default function Notifications(): React.JSX.Element {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const data = await getNotifications()
      // Filter based on user request: comment, reply, follow (and likes as they are social)
      const allowedTypes = ['document_comment', 'comment_reply', 'follow', 'document_like', 'comment_like']
      setNotifications(data.filter((n: NotificationItem) => allowedTypes.includes(n.type)))
    } catch (error) {
      console.error('Failed to fetch notifications', error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n))

      // Dispatch custom event to trigger navbar update immediately
      window.dispatchEvent(new CustomEvent('notification-marked-read'))
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteNotificationApi(id)
      setNotifications(prev => prev.filter(n => n.id !== id))

      // Dispatch custom event to trigger navbar update immediately
      window.dispatchEvent(new CustomEvent('notification-marked-read'))
    } catch (error) {
      console.error(error)
    }
  }

  const handleNotificationClick = async (n: NotificationItem) => {
    if (!n.read_at) {
      await markAsRead(n.id)
    }

    // Redirection logic
    if (n.type === 'document_like' || n.type === 'document_comment' || n.type === 'comment_reply' || n.type === 'comment_like') {
        navigate(`/documents/${n.related_id}`)
    } else if (n.type === 'follow') {
        navigate(`/user/${n.related_id}`)
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'document_like':
      case 'comment_like':
        return <Heart className="text-rose-500 fill-rose-500" size={12} />
      case 'document_comment':
        return <MessageSquare className="text-sky-500 fill-sky-500" size={12} />
      case 'comment_reply':
        return <Reply className="text-violet-500" size={12} />
      case 'follow':
        return <UserPlus className="text-emerald-500" size={12} />
      default:
        return <Bell size={12} />
    }
  }

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'Just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

    return date.toLocaleDateString()
  }

  const filteredNotifications = notifications.filter(n => filter === 'all' ? true : !n.read_at)
  const unreadCount = notifications.filter(n => !n.read_at).length

  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })))
      window.dispatchEvent(new CustomEvent('notification-marked-read'))
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom duration-500">

      {/* ================= HEADER SECTION ================= */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-500/10 px-3.5 py-1 rounded-full">
            User Workspace
          </span>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mt-3">Notifications</h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">Stay updated with your active community footprint.</p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-teal-600 hover:text-teal-700 text-xs font-bold uppercase tracking-wider transition-colors duration-200"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* ================= FILTER TABS ================= */}
      <div className="flex gap-6 mb-6 border-b border-slate-100">
        <button
          onClick={() => setFilter('all')}
          className={`pb-3 text-sm font-bold transition-all duration-200 relative ${
            filter === 'all' ? 'text-slate-950' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          All
          {filter === 'all' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setFilter('unread')}
          className={`pb-3 text-sm font-bold transition-all duration-200 relative flex items-center gap-2 ${
            filter === 'unread' ? 'text-slate-950' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 bg-teal-500/10 text-teal-600 text-[10px] font-bold rounded-md">
              {unreadCount}
            </span>
          )}
          {filter === 'unread' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full" />
          )}
        </button>
      </div>

      {/* ================= NOTIFICATIONS CONTAINER ================= */}
      <div className="bg-white dark:bg-gray-900 rounded-[24px] border border-slate-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-teal-500 animate-spin mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Accessing feed...</p>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-gray-800">
            {filteredNotifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n)}
                className={`p-5 flex items-start gap-4 transition-all duration-200 hover:bg-slate-50/50 dark:hover:bg-gray-800/30 group relative cursor-pointer ${
                  !n.read_at ? 'bg-teal-500/[0.01]' : ''
                }`}
              >
                {/* Active Indicator Accent Pin */}
                {!n.read_at && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500" />
                )}

                {/* Avatar / System Icon Block */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 dark:bg-gray-800 border border-slate-200/60 dark:border-gray-700 flex items-center justify-center">
                      <div className="w-full h-full flex items-center justify-center font-bold bg-[#0b1329] text-teal-400 text-xs uppercase">
                        {n.title.substring(0, 2)}
                      </div>
                  </div>

                  {/* Miniature Contextual Bubble Badge */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white dark:bg-gray-900 rounded-lg flex items-center justify-center shadow-sm border border-slate-100 dark:border-gray-800">
                    {getIcon(n.type)}
                  </div>
                </div>

                {/* Main Dynamic Message Wording */}
                <div className="flex-grow min-w-0 pt-1">
                  <p className="text-sm text-slate-700 dark:text-gray-300 leading-relaxed">
                    <span className="font-bold text-slate-900 dark:text-white mr-1">{n.title}</span>
                    {n.message.includes(n.title) ? n.message.replace(n.title, '').trim() : n.message}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{getTimeAgo(n.created_at)}</p>
                </div>

                {/* Floating Interactive Inline Controls */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  {!n.read_at && (
                    <button
                      onClick={(e) => { e.stopPropagation(); markAsRead(n.id); }}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 hover:text-teal-500 rounded-lg transition-colors border border-transparent hover:border-slate-200/40"
                      title="Mark as read"
                    >
                      <Check size={14} className="stroke-[3]" />
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(n.id); }}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-gray-800 text-slate-400 hover:text-rose-500 rounded-lg transition-colors border border-transparent hover:border-slate-200/40"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* ================= EMPTY STATE CONTAINER ================= */
          <div className="py-20 text-center">
            <div className="w-14 h-14 bg-slate-50 dark:bg-gray-800 border border-slate-100 dark:border-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Bell size={24} />
            </div>
            <p className="text-base text-slate-900 dark:text-white font-bold">
              {filter === 'all' ? 'No notifications yet' : 'No unread alerts remaining'}
            </p>
            <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto font-medium">
              {filter === 'all'
                ? "We'll ping you here as soon as collaborative interactions occur on your logs."
                : "Excellent work! You've completely structured and cleared your current queue."}
            </p>
          </div>
        )}
      </div>

      {/* ================= FOLLOWER WORKSPACE BAR ================= */}
      <div className="mt-8 text-center">
        <button className="text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-teal-500 transition-colors duration-200">
          View Preferences Settings
        </button>
      </div>

    </div>
  )
}
