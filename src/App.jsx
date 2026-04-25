import { useState, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import ChatArea from './components/ChatArea'
import ChatInput from './components/ChatInput'
import { useChat } from './hooks/useChat'
import styles from './App.module.css'

function getInitialTheme() {
  const saved = localStorage.getItem('pa_theme')
  if (saved) return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const {
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
  } = useChat()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('pa_theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  const toggleSidebar = () => setSidebarOpen((v) => !v)

  const activeTitle = conversations.find((c) => c.id === activeId)?.title ?? ''

  return (
    <div className={`${styles.app} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
      {sidebarOpen && (
        <Sidebar
          conversations={conversations}
          activeId={activeId}
          onNew={newConversation}
          onSelect={selectConversation}
          onDelete={deleteConversation}
        />
      )}
      <div className={styles.main}>
        <Header
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleSidebar={toggleSidebar}
          title={activeTitle}
        />
        <ChatArea
          messages={messages}
          loading={loading}
          error={error}
          onSend={sendMessage}
          onDismissError={() => setError(null)}
        />
        <ChatInput onSend={sendMessage} loading={loading} />
      </div>
      <Analytics />
    </div>
  )
}
