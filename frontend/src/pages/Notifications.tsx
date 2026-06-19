import React, { useState } from 'react'
import {
  Bell,
  Heart,
  MessageSquare,
  UserPlus,
  FileText,
  Check,
  Trash2
} from 'lucide-react'

// ================= TYPES & INTERFACES =================
interface NotificationItem {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'system';
  user: string;
  avatar: string | null;
  content: string;
  time: string;
  isRead: boolean;
}

type FilterType = 'all' | 'unread';

// ================= MOCK DATABASE =================
const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: 'like',
    user: 'Sokea M.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    content: 'liked your document "Grade 12 Physics Summary"',
    time: '2 mins ago',
    isRead: false
  },
  {
    id: 2,
    type: 'comment',
    user: 'Leakena T.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    content: 'commented: "This is exactly what I needed, thank you!"',
    time: '1 hour ago',
    isRead: false
  },
  {
    id: 3,
    type: 'follow',
    user: 'Vibol R.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    content: 'started following you',
    time: '3 hours ago',
    isRead: true
  },
  {
    id: 4,
    type: 'system',
    user: 'DocuLink',
    avatar: null,
    content: 'Your document "National Exam Prep" has been approved!',
    time: 'Yesterday',
    isRead: true
  }
]

export default function Notifications(): React.JSX.Element {
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState<FilterType>('all')

  const markAsRead = (id: number): void => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
  }

  const deleteNotification = (id: number): void => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const markAllAsRead = (): void => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
  }

  const filteredNotifications = notifications.filter(n =>
    filter === 'all' ? true : !n.isRead
  )

  const getIcon = (type: NotificationItem['type']): React.JSX.Element => {
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

        {notifications.some(n => !n.isRead) && (
          <button
            onClick={markAllAsRead}
            className="text-teal-550 hover:text-teal-600 text-xs font-bold uppercase tracking-wider transition-colors duration-200"
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
          {notifications.some(n => !n.isRead) && (
            <span className="px-2 py-0.5 bg-teal-500/10 text-teal-600 text-[10px] font-bold rounded-md">
              {notifications.filter(n => !n.isRead).length}
            </span>
          )}
          {filter === 'unread' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-teal-500 rounded-full" />
          )}
        </button>
      </div>

      {/* ================= NOTIFICATIONS CONTAINER ================= */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        {filteredNotifications.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {filteredNotifications.map((n) => (
              <div
                key={n.id}
                className={`p-5 flex items-start gap-4 transition-all duration-200 hover:bg-slate-50/50 group relative ${
                  !n.isRead ? 'bg-teal-500/[0.01]' : ''
                }`}
              >
                {/* Active Indicator Accent Pin */}
                {!n.isRead && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500" />
                )}

                {/* Avatar / System Icon Block */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-50 border border-slate-200/60 flex items-center justify-center">
                    {n.avatar ? (
                      <img src={n.avatar} alt={n.user} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold bg-[#0b1329] text-teal-400 text-xs">
                        DL
                      </div>
                    )}
                  </div>

                  {/* Miniature Contextual Bubble Badge */}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100">
                    {getIcon(n.type)}
                  </div>
                </div>

                {/* Main Dynamic Message Wording */}
                <div className="flex-grow min-w-0 pt-1">
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <span className="font-bold text-slate-900 mr-1">{n.user}</span> {n.content}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{n.time}</p>
                </div>

                {/* Floating Interactive Inline Controls */}
                <div className="flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                  {!n.isRead && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-teal-500 rounded-lg transition-colors border border-transparent hover:border-slate-200/40"
                      title="Mark as read"
                    >
                      <Check size={14} className="stroke-[3]" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-rose-500 rounded-lg transition-colors border border-transparent hover:border-slate-200/40"
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
            <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-slate-300">
              <Bell size={24} />
            </div>
            <p className="text-base text-slate-900 font-bold">
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