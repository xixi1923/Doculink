import { useState, useEffect, useCallback } from 'react'
import { getRelationshipStatus, followUser, unfollowUser } from '@/api/socialApi'

export type FollowState = 'none' | 'follower' | 'following' | 'friend' | 'self'

export interface RelationshipData {
  state: FollowState
  is_following: boolean
  is_follower: boolean
  is_self: boolean
  followers_count: number
  following_count: number
}

export const useFollow = (userId: string | number | undefined) => {
  const [relationship, setRelationship] = useState<RelationshipData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch initial relationship status
  useEffect(() => {
    if (!userId) return

    const fetchRelationship = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getRelationshipStatus(userId)
        setRelationship(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch relationship status')
        console.error('Failed to fetch relationship status:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchRelationship()
  }, [userId])

  // Handle follow/unfollow with optimistic updates
  const toggleFollow = useCallback(async () => {
    if (!relationship || !userId || relationship.is_self) {
      return
    }

    const previousState = relationship

    // Optimistic update
    const newIsFollowing = !relationship.is_following
    const followersDelta = newIsFollowing ? 1 : -1

    setRelationship((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        is_following: newIsFollowing,
        followers_count: prev.followers_count + followersDelta,
        state: newIsFollowing && prev.is_follower ? 'friend' : newIsFollowing ? 'following' : prev.is_follower ? 'follower' : 'none',
      }
    })

    try {
      if (newIsFollowing) {
        await followUser(userId)
      } else {
        await unfollowUser(userId)
      }
    } catch (err) {
      // Revert on error
      setRelationship(previousState)
      setError(err instanceof Error ? err.message : 'Failed to update follow status')
      console.error('Failed to update follow status:', err)
    }
  }, [relationship, userId])

  return {
    relationship,
    loading,
    error,
    toggleFollow,
  }
}
