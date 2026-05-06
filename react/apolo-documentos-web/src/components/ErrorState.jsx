import { makeStyles, Button, Text } from '@fluentui/react-components'
import { ErrorCircleRegular } from '@fluentui/react-icons'
import { colors } from '@/config/colors'

const useStyles = makeStyles({
  container: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: '32px',
  },
  iconCircle: {
    width: '80px',
    height: '80px',
    borderRadius: '40px',
    backgroundColor: colors.errorLight,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: colors.textPrimary,
    fontWeight: '700',
    fontSize: '18px',
    marginTop: '16px',
  },
  message: {
    color: colors.textSecondary,
    fontSize: '15px',
    lineHeight: '22px',
    marginTop: '8px',
    textAlign: 'center',
    maxWidth: '420px',
  },
  retryButton: {
    marginTop: '24px',
    backgroundColor: colors.accent,
    color: colors.textOnAccent,
    fontWeight: '600',
    paddingLeft: '24px',
    paddingRight: '24px',
    ':hover': {
      backgroundColor: colors.accentDark,
      color: colors.textOnAccent,
    },
  },
})

export const ErrorState = ({ message = 'Ocurrio un error inesperado', onRetry }) => {
  const styles = useStyles()
  return (
    <div className={styles.container}>
      <div className={styles.iconCircle}>
        <ErrorCircleRegular style={{ fontSize: 48, color: colors.error }} />
      </div>
      <Text as="p" className={styles.title}>
        Error
      </Text>
      <Text as="p" className={styles.message}>
        {message}
      </Text>
      {onRetry ? (
        <Button appearance="primary" onClick={onRetry} className={styles.retryButton}>
          Reintentar
        </Button>
      ) : null}
    </div>
  )
}
