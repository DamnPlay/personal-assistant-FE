import styles from './Sidebar.module.css'
import { PlusIcon, TrashIcon, ChatBubbleIcon } from '../icons'

export default function Sidebar({ conversations, activeId, onNew, onSelect, onDelete }) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.logo}>
          <span className={styles.logoMark}>✦</span> Assistant
        </span>
        <button className={styles.newBtn} onClick={onNew} title="New conversation">
          <PlusIcon />
        </button>
      </div>

      <nav className={styles.nav}>
        {conversations.length === 0 && (
          <p className={styles.empty}>No conversations yet</p>
        )}
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`${styles.item} ${conv.id === activeId ? styles.active : ''}`}
            onClick={() => onSelect(conv.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(conv.id)}
          >
            <ChatBubbleIcon className={styles.itemIcon} />
            <span className={styles.itemTitle}>{conv.title || 'Untitled'}</span>
            <button
              className={styles.deleteBtn}
              onClick={(e) => {
                e.stopPropagation()
                onDelete(conv.id)
              }}
              title="Delete"
            >
              <TrashIcon />
            </button>
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <span className={styles.footerText}>Personal Assistant v0.1</span>
      </div>
    </aside>
  )
}
