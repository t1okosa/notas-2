import { makeStyles, Button, Text } from '@fluentui/react-components'
import { CheckboxCheckedRegular, DismissRegular } from '@fluentui/react-icons'
import { colors } from '@/config/colors'

const useStyles = makeStyles({
  bar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    paddingTop: '6px',
    paddingBottom: '6px',
    paddingLeft: '20px',
    paddingRight: '20px',
    gap: '16px',
  },
  customerName: {
    color: colors.textOnPrimary,
    fontWeight: '600',
    flex: '1',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  badge: {
    backgroundColor: colors.accent,
    color: colors.textOnAccent,
    fontWeight: '700',
    fontSize: '12px',
    borderRadius: '12px',
    paddingTop: '3px',
    paddingBottom: '3px',
    paddingLeft: '10px',
    paddingRight: '10px',
    overflow: 'hidden',
  },
  toggleButton: {
    color: colors.textOnPrimary,
    padding: '4px',
    marginLeft: '4px',
    minWidth: 0,
  },
})

export const CustomerBar = ({
  customerName,
  docCount,
  canSelect,
  selectable,
  onToggleSelectable,
}) => {
  const styles = useStyles()
  if (!customerName) return null
  return (
    <div className={styles.bar}>
      <Text className={styles.customerName}>{customerName.trim()}</Text>
      <div className={styles.right}>
        <span className={styles.badge}>
          {docCount} documento{docCount === 1 ? '' : 's'}
        </span>
        {canSelect ? (
          <Button
            appearance="transparent"
            size="small"
            icon={selectable ? <DismissRegular /> : <CheckboxCheckedRegular />}
            onClick={onToggleSelectable}
            aria-label={selectable ? 'Cancelar seleccion' : 'Seleccionar varios'}
            className={styles.toggleButton}
          />
        ) : null}
      </div>
    </div>
  )
}
