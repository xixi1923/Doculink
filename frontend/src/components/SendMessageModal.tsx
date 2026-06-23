import React, { useState } from 'react'
import { X, Send } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { startConversationApi, sendChatMessageApi } from '@/api/authApi'

interface SendMessageModalProps {
  isOpen: boolean
  onClose: () => void
  recipientId: number | string
  recipientName: string
}

export default function SendMessageModal({ isOpen, onClose, recipientId, recipientName }: SendMessageModalProps) {
  const [messageText, setMessageText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const navigate = useNavigate()

  const handleSendMessage = async () => {
    if (!messageText.trim()) return
    setIsSending(true)
    try {
      const convRes = await startConversationApi(recipientId)
      await sendChatMessageApi(convRes.id, messageText)
      setMessageText('')
      onClose()
      navigate(`/messages?conversation=${convRes.id}`)
    } catch (error) {
      console.error('Failed to send message', error)
      alert('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-lg shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">Send a Message</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Recipient Tag */}
        <div className="px-6 py-5">
          <div className="mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
               <button className="text-gray-400 hover:text-gray-600" onClick={onClose}><X size={14} /></button>
               <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{recipientName}</span>
            </div>
          </div>

          {/* Textarea */}
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
            <textarea
              autoFocus
              rows={6}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Write a message"
              className="w-full bg-transparent p-4 text-sm text-gray-800 dark:text-white outline-none resize-none placeholder:text-gray-400"
            />
          </div>

          {/* Action Button */}
          <div className="mt-6">
            <button
              onClick={handleSendMessage}
              disabled={isSending || !messageText.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-8 py-2.5 rounded text-sm font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20"
            >
              {isSending ? 'Sending...' : 'SEND'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
