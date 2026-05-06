import { useQuery } from '@tanstack/react-query'
import { fetchDocumentList } from '@/services/document-service'
import { useDocumentStore } from '@/store/useDocumentStore'
import { useApiClient } from '@/context/useApiClient'

/**
 * Dispara la consulta de la lista de documentos y sincroniza el store.
 * No se ejecuta hasta que haya apiClient y saleId.
 *
 * @param {string|null} saleId
 */
export const useDocumentList = (saleId) => {
  const apiClient = useApiClient()
  const setDocuments = useDocumentStore((s) => s.setDocuments)
  const setListStatus = useDocumentStore((s) => s.setListStatus)
  const setListError = useDocumentStore((s) => s.setListError)
  const setVentaNameId = useDocumentStore((s) => s.setVentaNameId)

  return useQuery({
    queryKey: ['document-list', saleId],
    queryFn: async () => {
      setListStatus('loading')
      setListError(null)

      const result = await fetchDocumentList(apiClient, saleId)

      if (result.error) {
        setListStatus('error')
        setListError(result.error)
        throw new Error(result.error)
      }

      setDocuments(result.documents)
      setVentaNameId(result.documents[0]?.VentaNameId ?? null)
      setListStatus('ready')
      return result.documents
    },
    enabled: !!apiClient && !!saleId,
    staleTime: 0,
    gcTime: 0,
    retry: 1,
  })
}
