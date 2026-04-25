import { useRef, useEffect } from 'react'
import Message from './Message'
import TypingIndicator from './TypingIndicator'
import styles from './ChatArea.module.css'

const SUGGESTIONS = [
  'What can you help me with?',
  'Summarize the latest news for me',
  'Help me plan my week',
  'Write a quick email for me',
]

export default function ChatArea({ messages, loading, error, onSend, onDismissError }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const isEmpty = messages.length === 0

  return (
    <div className={styles.area}>
      {isEmpty ? (
        <div className={styles.welcome}>
          <div className={styles.welcomeIcon}>✦</div>
          <h1 className={styles.welcomeTitle}>How can I help you today?</h1>
          <p className={styles.welcomeSub}>Ask me anything — I'm here to assist you.</p>
          <div className={styles.suggestions}>
            {SUGGESTIONS.map((s) => (
              <button key={s} className={styles.suggestion} onClick={() => onSend(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.messages}>
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
          {loading && <TypingIndicator />}
          {error && (
            <div className={styles.error}>
              <span>{error}</span>
              <button onClick={onDismissError} className={styles.errorDismiss}>✕</button>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}
    </div>
  )
}
