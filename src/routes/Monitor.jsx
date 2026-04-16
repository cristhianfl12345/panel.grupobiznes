import Leads from '../pages/Leads'
import { useLocalTheme } from '../context/useLocalTheme'

export default function Monitor() {
  const { theme } = useLocalTheme()

  const isDark = theme === 'dark'

  return <Leads />
}