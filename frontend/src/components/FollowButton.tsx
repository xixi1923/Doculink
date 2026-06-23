import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { UserPlus, UserCheck, Users, Loader2, X, AlertTriangle } from 'lucide-react'
import { useFollow } from '@/hooks/useFollow'
import { useAuthStore } from '@/store/authStore'

interface FollowButtonProps {
  userId: string | number
  userName?: string
  onFollowChange?: (newFollowingState: boolean) => void
  variant?: 'primary' | 'secondary'
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  confirmColor = 'bg-teal-600'
}: any) => {
  if (!isOpen) return null

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />
      <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-800 p-6 transform transition-all animate-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={16} /></button>
        <div className="text-center">
          <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={22} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
          <p className="text-slate-500 dark:text-gray-400 text-xs leading-relaxed mb-6">{message}</p>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2 px-4 border border-slate-300 dark:border-gray-600 rounded-lg text-xs font-medium text-slate-700 dark:text-gray-300 hover:bg-slate-50">Cancel</button>
            <button onClick={onConfirm} className={`flex-1 py-2 px-4 ${confirmColor} text-white rounded-lg text-xs font-medium hover:opacity-90`}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

export const FollowButton: React.FC<FollowButtonProps> = ({
  userId,
  userName = 'this scholar',
  onFollowChange,
  variant = 'primary',
}) => {
  const { user: currentUser } = useAuthStore()
  const { relationship, loading, toggleFollow } = useFollow(userId)
  const [showConfirm, setShowConfirm] = useState(false)

  // ... (rest of the component)

  // Don't render if loading initially or no relationship data
  if (loading || !relationship) {
    return (
      <button
        disabled
        className="px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-slate-100 dark:bg-gray-800 text-slate-400 dark:text-gray-500"
      >
        <Loader2 size={14} className="inline mr-2 animate-spin" />
        Loading
      </button>
    )
  }

  // If it's the user's own profile, don't show the button
  if (relationship.is_self) {
    return null
  }

  // Not authenticated
  if (!currentUser) {
    return (
      <button
        disabled
        className="px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-slate-100 dark:bg-gray-800 text-slate-400 dark:text-gray-500"
      >
        <UserPlus size={14} className="inline mr-2" />
        Sign In to Follow
      </button>
    )
  }

  const handleClick = () => {
    setShowConfirm(true)
  }

  const handleConfirmAction = async () => {
    setShowConfirm(false)
    const nextState = !relationship.is_following
    await toggleFollow()
    onFollowChange?.(nextState)
  }

  // Determine button state and styling based on relationship
  const getButtonConfig = () => {
    switch (relationship.state) {
      case 'none':
        // No relationship
        return {
          label: 'FOLLOW',
          icon: UserPlus,
          primaryStyles: 'bg-teal-500 text-white hover:bg-teal-600',
          secondaryStyles: 'bg-teal-500 text-white hover:bg-teal-600',
          description: 'Follow this user',
        }

      case 'follower':
        // User B follows User A (incoming follow)
        return {
          label: 'FOLLOW BACK',
          icon: UserCheck,
          primaryStyles: 'bg-emerald-500 text-white hover:bg-emerald-600',
          secondaryStyles: 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20',
          description: `${relationship.followers_count} follower${relationship.followers_count !== 1 ? 's' : ''}`,
        }

      case 'following':
        // User A follows User B (outgoing follow)
        return {
          label: 'FOLLOWING',
          icon: UserCheck,
          primaryStyles: 'bg-slate-100 dark:bg-gray-800 text-slate-600 dark:text-gray-400 border border-slate-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-500/30',
          secondaryStyles: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-red-100 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400',
          description: 'Click to unfollow',
        }

      case 'friend':
        // Mutual follow (both follow each other)
        return {
          label: 'FRIENDS',
          icon: Users,
          primaryStyles: 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/20',
          secondaryStyles: 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg shadow-teal-600/20',
          description: 'Mutual followers',
        }

      default:
        return {
          label: 'FOLLOW',
          icon: UserPlus,
          primaryStyles: 'bg-teal-500 text-white hover:bg-teal-600',
          secondaryStyles: 'bg-teal-500 text-white hover:bg-teal-600',
          description: 'Follow this user',
        }
    }
  }

  const config = getButtonConfig()
  const Icon = config.icon
  const buttonStyles = variant === 'primary' ? config.primaryStyles : config.secondaryStyles

  const isUnfollowing = relationship.is_following

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleClick}
        title={config.description}
        className={`px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-1.5 ${buttonStyles}`}
      >
        <Icon size={14} />
        {config.label}
      </button>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmAction}
        title={isUnfollowing ? 'Unfollow Scholar' : 'Follow Scholar'}
        message={isUnfollowing
          ? `Are you sure you want to unfollow ${userName}? You will no longer receive updates from their academic feed.`
          : `Do you want to follow ${userName}? This will add their publications and updates to your network feed.`}
        confirmText={isUnfollowing ? 'Unfollow' : 'Follow'}
        confirmColor={isUnfollowing ? 'bg-rose-600' : 'bg-teal-600'}
      />
    </div>
  )
}

export default FollowButton
