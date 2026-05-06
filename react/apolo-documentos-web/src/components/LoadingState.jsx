import { makeStyles, Spinner, Text } from '@fluentui/react-components'
import { colors } from '@/config/colors'

const useStyles = makeStyles({
  container: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: '24px',
  },
  spinner: {
    '--colorBrandForeground1': colors.accent,
  },
  message: {
    color: colors.textSecondary,
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '16px',
  },
})

export const LoadingState = ({ message = 'Cargando…' }) => {
  const styles = useStyles()
  return (
    <div className={styles.container}>
      <Spinner size="large" className={styles.spinner} />
      <Text className={styles.message}>{message}</Text>
    </div>
  )
}
