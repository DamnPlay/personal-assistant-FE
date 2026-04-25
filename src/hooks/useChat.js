import { useState, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { sendMessage as apiSendMessage } from '../api/assistant'

const STORAGE_KEY = 'pa_conversations'

function loadConversations() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function saveConversations(conversations) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
  } catch {
    // storage full or unavailable
  }
}

export function useChat() {
  const [conversations, setConversations] = useState(() => loadConversations())
  const [activeId, setActiveId] = useState(() => {
    const saved = loadConversations()
    return saved.length > 0 ? saved[0].id : null
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const activeConversation = conversations.find((c) => c.id === activeId) ?? null
  const messages = activeConversation?.messages ?? []

  const updateConversations = useCallback((updated) => {
    setConversations(updated)
    saveConversations(updated)
  }, [])

  const newConversation = useCallback(() => {
    const id = uuidv4()
    const conv = { id, title: 'New conversation', messages: [], createdAt: Date.now() }
    const updated = [conv, ...conversations]
    updateConversations(updated)
    setActiveId(id)
    return id
  }, [conversations, updateConversations])

  const selectConversation = useCallback((id) => {
    setActiveId(id)
    setError(null)
  }, [])

  const deleteConversation = useCallback(
    (id) => {
      const updated = conversations.filter((c) => c.id !== id)
      updateConversations(updated)
      if (activeId === id) {
        setActiveId(updated.length > 0 ? updated[0].id : null)
      }
    },
    [conversations, activeId, updateConversations],
  )

  const sendMessage = useCallback(
    async (text) => {
      if (!text.trim()) return

      let convId = activeId
      if (!convId) {
        convId = uuidv4()
        const newConv = {
          id: convId,
          title: text.slice(0, 40),
          messages: [],
          createdAt: Date.now(),
        }
        const updated = [newConv, ...conversations]
        updateConversations(updated)
        setActiveId(convId)
      }

      const userMsg = { id: uuidv4(), role: 'user', content: text, ts: Date.now() }

      setConversations((prev) => {
        const updated = prev.map((c) => {
          if (c.id !== convId) return c
          const msgs = [...c.messages, userMsg]
          return {
            ...c,
            messages: msgs,
            title: c.messages.length === 0 ? text.slice(0, 40) : c.title,
          }
        })
        saveConversations(updated)
        return updated
      })

      setLoading(true)
      setError(null)

      try {
        const history = [
          ...(conversations.find((c) => c.id === convId)?.messages ?? []),
          userMsg,
        ]
        const reply = await apiSendMessage(text, history)
        const assistantMsg = { id: uuidv4(), role: 'assistant', content: reply, ts: Date.now() }

        setConversations((prev) => {
          const updated = prev.map((c) => {
            if (c.id !== convId) return c
            return { ...c, messages: [...c.messages, assistantMsg] }
          })
          saveConversations(updated)
          return updated
        })
      } catch (err) {
        setError(err.message ?? 'Something went wrong. Please try again.')
      } finally {
        setLoading(false)
      }
    },
    [activeId, conversations, updateConversations],
  )

  return {
    conversations,
    activeId,
    messages,
    loading,
    error,
    newConversation,
    selectConversation,
    deleteConversation,
    sendMessage,
    setError,
  }
}
