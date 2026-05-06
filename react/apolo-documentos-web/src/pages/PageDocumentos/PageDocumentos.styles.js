import { makeStyles } from '@fluentui/react-components'
import { colors } from '@/config/colors'

export const usePageStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    minHeight: 0,
    backgroundColor: colors.background,
  },
  list: {
    flex: '1',
    overflowY: 'auto',
    paddingTop: '8px',
    paddingBottom: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
})
