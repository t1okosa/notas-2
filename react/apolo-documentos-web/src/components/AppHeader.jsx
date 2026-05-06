import { makeStyles, Text } from '@fluentui/react-components'
import { colors } from '@/config/colors'

const useStyles = makeStyles({
  header: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingTop: '12px',
    paddingBottom: '12px',
    paddingLeft: '20px',
    paddingRight: '20px',
    gap: '8px',
  },
  title: {
    color: colors.textOnPrimary,
    fontSize: '20px',
    fontWeight: '700',
    letterSpacing: '0.3px',
    flex: '1',
    minWidth: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: '5px 0px'
  },
})

export const AppHeader = ({ title, leading, trailing }) => {
  const styles = useStyles()
  return (
    <div className={styles.header}>
      {leading}
      <Text as="h1" className={styles.title}>
        {title}
      </Text>
      {trailing}
    </div>
  )
}
