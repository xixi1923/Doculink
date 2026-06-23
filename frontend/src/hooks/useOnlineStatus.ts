import { useState, useEffect } from 'react'

interface OnlineStatusInfo {
  isOnline: boolean
  lastSeen?: Date
  timeAgoText: string
}

const OFFLINE_TIMEOUT_MS = 3 * 60 * 1000 // 3 minutes

/**
 * Hook to manage online/offline status with timeout
 * After 3 minutes of inactivity, user is marked as offline
 * @param initialStatus - Initial online status ('online' | 'offline')
 * @param lastActivityTime - Last activity timestamp in milliseconds
 * @returns Object with isOnline status and time ago text
 */
export const useOnlineStatus = (
  initialStatus: 'online' | 'offline',
  lastActivityTime?: number
): OnlineStatusInfo => {
  const [statusInfo, setStatusInfo] = useState<OnlineStatusInfo>(() => {
    const isOnline = initialStatus === 'online'
    const lastSeen = lastActivityTime ? new Date(lastActivityTime) : undefined
    
    return {
      isOnline,
      lastSeen,
      timeAgoText: isOnline ? 'Online' : 'Offline'
    }
  })

  useEffect(() => {
    // If initially offline, just show offline
    if (initialStatus === 'offline') {
      setStatusInfo({
        isOnline: false,
        lastSeen: lastActivityTime ? new Date(lastActivityTime) : undefined,
        timeAgoText: 'Offline'
      })
      return
    }

    // If initially online, set up timeout to mark as offline after 3 minutes
    const timeoutId = setTimeout(() => {
      setStatusInfo(prev => ({
        ...prev,
        isOnline: false,
        timeAgoText: 'Offline'
      }))
    }, OFFLINE_TIMEOUT_MS)

    // Also set up interval to update "time ago" text if offline
    const intervalId = setInterval(() => {
      setStatusInfo(prev => {
        if (!prev.isOnline && prev.lastSeen) {
          const now = new Date()
          const diffMinutes = Math.floor((now.getTime() - prev.lastSeen.getTime()) / 60000)
          
          if (diffMinutes === 0) {
            return { ...prev, timeAgoText: 'Offline just now' }
          } else if (diffMinutes === 1) {
            return { ...prev, timeAgoText: 'Offline 1 minute ago' }
          } else if (diffMinutes < 60) {
            return { ...prev, timeAgoText: `Offline ${diffMinutes} minutes ago` }
          } else {
            const diffHours = Math.floor(diffMinutes / 60)
            if (diffHours === 1) {
              return { ...prev, timeAgoText: 'Offline 1 hour ago' }
            } else {
              return { ...prev, timeAgoText: `Offline ${diffHours} hours ago` }
            }
          }
        }
        return prev
      })
    }, 30000) // Update every 30 seconds

    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [initialStatus, lastActivityTime])

  return statusInfo
}

/**
 * Utility function to get time ago text
 * @param date - Date to calculate time from
 * @returns Human readable time ago text
 */
export const getTimeAgoText = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes === 0) {
    return 'just now'
  } else if (diffMinutes === 1) {
    return '1 minute ago'
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minutes ago`
  } else if (diffHours === 1) {
    return '1 hour ago'
  } else if (diffHours < 24) {
    return `${diffHours} hours ago`
  } else if (diffDays === 1) {
    return 'yesterday'
  } else {
    return `${diffDays} days ago`
  }
}
