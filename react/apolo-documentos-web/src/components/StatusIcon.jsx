import { Spinner } from '@fluentui/react-components'
import {
  CheckmarkCircleFilled,
  DismissCircleFilled,
  DocumentRegular,
} from '@fluentui/react-icons'
import { colors } from '@/config/colors'

export const StatusIcon = ({ status, size = 24 }) => {
  if (status === 'loading' || status === 'idle') {
    return (
      <Spinner
        size="small"
        style={{ '--colorBrandForeground1': colors.accent }}
      />
    )
  }
  if (status === 'ready') {
    return <CheckmarkCircleFilled style={{ fontSize: size, color: colors.success }} />
  }
  if (status === 'error') {
    return <DismissCircleFilled style={{ fontSize: size, color: colors.error }} />
  }
  return <DocumentRegular style={{ fontSize: size, color: colors.textMuted }} />
}
