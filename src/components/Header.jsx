import styles from './Header.module.css'
import { SunIcon, MoonIcon, SidebarIcon } from '../icons'

export default function Header({ theme, onToggleTheme, onToggleSidebar, title }) {
  return (
    <header className={styles.header}>
      <button className={styles.iconBtn} onClick={onToggleSidebar} title="Toggle sidebar">
        <SidebarIcon />
      </button>
      <span className={styles.title}>{title || 'Personal Assistant'}</span>
      <button className={styles.iconBtn} onClick={onToggleTheme} title="Toggle theme">
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  )
}
