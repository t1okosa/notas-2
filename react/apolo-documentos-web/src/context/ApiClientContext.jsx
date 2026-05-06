import { createContext, useMemo } from 'react'
import { useCrmContext } from '@apolo/shared-crm'
import { createApoloClient } from '@apolo/shared-api'
import { MODO_LOCAL } from '@/config/env'
import { createMockApiClient } from '@/mocks/mock-api-client'

/**
 * Context que expone un unico apiClient al arbol.
 *
 * - Si MODO_LOCAL es true: mockApiClient (ignora xrm).
 * - Si no: createApoloClient(xrm) apenas xrm este disponible; null entretanto.
 *
 * Los consumidores (useDocumentList, useDocumentFiles) deben tolerar null
 * via `enabled: !!apiClient && ...` en React Query.
 */
export const ApiClientContext = createContext(null)

const mockApiClient = createMockApiClient()

export const ApiClientProvider = ({ children }) => {
  const xrm = useCrmContext()

  const apiClient = useMemo(() => {
    if (MODO_LOCAL) return mockApiClient
    if (!xrm) return null
    return createApoloClient(xrm)
  }, [xrm])

  return <ApiClientContext.Provider value={apiClient}>{children}</ApiClientContext.Provider>
}
