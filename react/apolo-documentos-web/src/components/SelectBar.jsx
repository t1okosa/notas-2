import { makeStyles, Button, Text } from '@fluentui/react-components'
import { colors } from '@/config/colors'

const useStyles = makeStyles({
  bar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderBottom: `1px solid ${colors.border}`,
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  toggleButton: {
    color: colors.primary,
    fontWeight: '600',
  },
  count: {
    color: colors.textSecondary,
    fontSize: '13px',
    marginRight: '12px',
  },
})

export const SelectBar = ({ allSelected, selectedCount, onToggleAll }) => {
  const styles = useStyles()
  return (
    <div className={styles.bar}>
      <Button
        appearance="subtle"
        onClick={onToggleAll}
        className={styles.toggleButton}
      >
        {allSelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
      </Button>
      <Text className={styles.count}>
        {selectedCount} seleccionado{selectedCount === 1 ? '' : 's'}
      </Text>
    </div>
  )
}
