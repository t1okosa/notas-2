import { FluentProvider } from '@fluentui/react-components'
import { fluentTheme } from '@/theme/fluentTheme'
import { useSaleContext } from '@/hooks/custom/useSaleContext'
import { useD365Title } from '@/hooks/custom/useD365Title'
import { PageDocumentos } from '@/pages/PageDocumentos/PageDocumentos'

const App = () => {
  useSaleContext()
  useD365Title('Documentos')

  return (
    <FluentProvider theme={fluentTheme}>
      <PageDocumentos />
    </FluentProvider>
  )
}

export default App
