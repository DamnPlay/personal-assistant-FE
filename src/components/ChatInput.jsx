import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './ChatInput.module.css'
import { SendIcon } from '../icons'

export default function ChatInput({ onSend, loading }) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (!loading) textareaRef.current?.focus()
  }, [loading])

  const autoResize = useCallback(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
  }, [])

  const handleChange = (e) => {
    setText(e.target.value)
    autoResize()
  }

  const handleSubmit = () => {
    const trimmed = text.trim()
    if (!trimmed || loading) return
    onSend(trimmed)
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything… (Shift+Enter for new line)"
          rows={1}
          disabled={loading}
          autoFocus
        />
        <button
          className={`${styles.sendBtn} ${text.trim() && !loading ? styles.active : ''}`}
          onClick={handleSubmit}
          disabled={!text.trim() || loading}
          title="Send (Enter)"
        >
          <SendIcon />
        </button>
      </div>
      <p className={styles.hint}>Press Enter to send · Shift+Enter for new line</p>
    </div>
  )
}
