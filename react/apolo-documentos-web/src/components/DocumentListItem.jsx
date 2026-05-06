import { memo } from 'react'
import { makeStyles, mergeClasses, Button, Checkbox, Spinner, Text } from '@fluentui/react-components'
import { EyeRegular, PrintRegular, ArrowClockwiseRegular } from '@fluentui/react-icons'
import { colors } from '@/config/colors'

const useStyles = makeStyles({
  card: {
    backgroundColor: colors.surface,
    borderRadius: '12px',
    marginLeft: '16px',
    marginRight: '16px',
    boxShadow: '0px 2px 6px rgba(27, 42, 74, 0.1)',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'background-color 0.15s ease',
    ':hover': {
      backgroundColor: 'rgba(27, 42, 74, 0.04)',
    },
  },
  cardReady: {
    borderLeft: '4px solid ' + colors.accent,
  },
  cardSelected: {
    borderLeft: '4px solid ' + colors.primary,
    backgroundColor: '#EFF3FA',
    ':hover': {
      backgroundColor: '#E4EBF7',
    },
  },
  cardError: {
    borderLeft: '4px solid ' + colors.error,
    opacity: '0.7',
    cursor: 'default',
    ':hover': {
      backgroundColor: colors.surface,
    },
  },
  cardLoading: {
    borderLeft: '4px solid ' + colors.accent,
    cursor: 'default',
    opacity: '0.7',
    ':hover': {
      backgroundColor: colors.surface,
    },
  },
  inner: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
  },
  checkbox: {
    '--colorBrandBackground': colors.accent,
    '--colorBrandBackgroundHover': colors.accentLight,
    '--colorBrandBackgroundPressed': colors.accentDark,
    marginRight: '8px',
    padding: '4px',
  },
  textBlock: {
    flex: '1',
    minWidth: 0,
    marginRight: '8px',
  },
  docTitle: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: '15px',
    lineHeight: '1.3',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    margin: '0',
  },
  docTitleError: {
    color: colors.textDisabled,
  },
  docSubtitle: {
    color: colors.textMuted,
    fontSize: '13px',
    margin: '2px 0 0 0',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  docSubtitleError: {
    color: colors.textDisabled,
  },
  loadingLabel: {
    color: colors.accent,
    fontSize: '12px',
    fontWeight: '500',
    marginTop: '4px',
  },
  errorLabel: {
    color: colors.error,
    fontSize: '12px',
    marginTop: '4px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    flexShrink: '0',
  },
  actionButton: {
    minWidth: 0,
    padding: '4px',
    borderRadius: '50%',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.08)',
    },
  },
  spinner: {
    '--colorBrandForeground1': colors.accent,
  },
})

const DocumentListItemComponent = ({
  document,
  onView,
  onPrint,
  onRetry,
  selectable = false,
  selected = false,
  onToggleSelect,
}) => {
  const styles = useStyles()
  const { NombreInforme, Producto, fileStatus, fileError } = document
  const isReady = fileStatus === 'ready'
  const isLoading = fileStatus === 'loading' || fileStatus === 'idle'
  const isError = fileStatus === 'error'

  const handlePress = () => {
    if (!isReady) return
    if (selectable) onToggleSelect?.()
    else onView()
  }

  const cardClass = mergeClasses(
    styles.card,
    isError && styles.cardError,
    isLoading && styles.cardLoading,
    selected && styles.cardSelected,
    isReady && !selected && styles.cardReady,
  )

  return (
    <div className={cardClass} onClick={handlePress} role={isReady ? 'button' : undefined} tabIndex={isReady ? 0 : -1}>
      <div className={styles.inner}>
        {selectable && isReady ? (
          <Checkbox
            checked={selected}
            onClick={(ev) => {
              ev.stopPropagation()
              onToggleSelect?.()
            }}
            className={styles.checkbox}
          />
        ) : null}

        <div className={styles.textBlock}>
          <Text as="p" className={mergeClasses(styles.docTitle, isError && styles.docTitleError)}>
            {NombreInforme}
          </Text>
          <Text as="p" className={mergeClasses(styles.docSubtitle, isError && styles.docSubtitleError)}>
            {Producto}
          </Text>
          {isLoading ? (
            <Text as="p" className={styles.loadingLabel}>Generando documento...</Text>
          ) : null}
          {isError ? (
            <Text as="p" className={styles.errorLabel}>{fileError ?? 'Error al obtener documento'}</Text>
          ) : null}
        </div>

        <div className={styles.actions}>
          {isLoading ? <Spinner size="small" className={styles.spinner} /> : null}
          {isReady && !selectable ? (
            <>
              <Button
                appearance="transparent"
                size="medium"
                icon={<EyeRegular style={{ fontSize: 24, color: colors.accent }} />}
                onClick={(ev) => { ev.stopPropagation(); onView() }}
                aria-label="Ver documento"
                className={styles.actionButton}
              />
              <Button
                appearance="transparent"
                size="medium"
                icon={<PrintRegular style={{ fontSize: 24, color: colors.primaryLight }} />}
                onClick={(ev) => { ev.stopPropagation(); onPrint() }}
                aria-label="Imprimir documento"
                className={styles.actionButton}
              />
            </>
          ) : null}
          {isError ? (
            <Button
              appearance="transparent"
              size="medium"
              icon={<ArrowClockwiseRegular style={{ fontSize: 24, color: colors.error }} />}
              onClick={(ev) => { ev.stopPropagation(); onRetry() }}
              aria-label="Reintentar"
              className={styles.actionButton}
            />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export const DocumentListItem = memo(DocumentListItemComponent)
