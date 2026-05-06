import { useState } from 'react'
import { makeStyles, Button, Spinner, Text } from '@fluentui/react-components'
import { PrintRegular } from '@fluentui/react-icons'
import { colors } from '@/config/colors'

const useStyles = makeStyles({
  container: {
    backgroundColor: colors.primary,
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '16px',
    paddingRight: '16px',
    boxShadow: `0px -2px 4px rgba(27, 42, 74, 0.15)`,
  },
  busyRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
  },
  busySpinner: {
    '--colorBrandForeground1': colors.textOnPrimary,
  },
  busyText: {
    color: colors.textOnPrimary,
    fontWeight: '600',
  },
  printButton: {
    width: '100%',
    backgroundColor: colors.accent,
    color: colors.textOnAccent,
    borderRadius: '8px',
    fontWeight: '700',
    paddingTop: '8px',
    paddingBottom: '8px',
    ':hover': {
      backgroundColor: colors.accentDark,
      color: colors.textOnAccent,
    },
  },
})

export const PrintActionBar = ({ count, onPrintSelected }) => {
  const styles = useStyles()
  const [busy, setBusy] = useState(false)

  const handlePrint = async () => {
    setBusy(true)
    try {
      await onPrintSelected()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={styles.container}>
      {busy ? (
        <div className={styles.busyRow}>
          <Spinner size="small" className={styles.busySpinner} />
          <Text className={styles.busyText}>Combinando documentos…</Text>
        </div>
      ) : (
        <Button
          appearance="primary"
          icon={<PrintRegular />}
          onClick={handlePrint}
          className={styles.printButton}
        >
          Imprimir {count} documento{count === 1 ? '' : 's'}
        </Button>
      )}
    </div>
  )
}
