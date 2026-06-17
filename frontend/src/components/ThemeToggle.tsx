import { Moon, Sun } from 'lucide-react'
import { useDarkMode } from '../hooks/useDarkMode'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useDarkMode()

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-all border border-gray-100 dark:border-gray-700 shadow-sm"
      aria-label="Toggle Dark Mode"
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
