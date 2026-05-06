import { useQueries } from '@tanstack/react-query'
import { fetchDocumentFile } from '@/services/document-service'
import { useDocumentStore } from '@/store/useDocumentStore'
import { useApiClient } from '@/context/useApiClient'

/**
 * Fan-out de queries — una por documento. Actualiza el store por IdChecklist
 * con los transitions idle → loading → ready | error.
 *
 * @param {Array} documents
 * @param {string|null} saleId
 * @param {boolean} enabled
 */
export const useDocumentFiles = (documents, saleId, enabled) => {
  const apiClient = useApiClient()
  const updateDocument = useDocumentStore((s) => s.updateDocument)

  const queries = useQueries({
    queries: documents.map((doc) => ({
      queryKey: ['document-file', doc.IdChecklist],
      queryFn: async () => {
        updateDocument(doc.IdChecklist, { fileStatus: 'loading' })

        const result = await fetchDocumentFile(apiClient, doc)

        if (result.error) {
          updateDocument(doc.IdChecklist, {
            fileStatus: 'error',
            fileError: result.error,
          })
          throw new Error(result.error)
        }

        updateDocument(doc.IdChecklist, {
          fileStatus: 'ready',
          pdfBase64: result.pdfBase64,
          fileName: result.fileName,
          rutaSharepoint: result.rutaSharepoint,
        })

        return result
      },
      enabled: enabled && !!apiClient && !!saleId,
      staleTime: 0,
      gcTime: 0,
      retry: 1,
    })),
  })

  return queries
}
