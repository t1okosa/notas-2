import { useCallback, useMemo, useState } from 'react'
import {
  Toaster,
  Toast,
  ToastTitle,
  useToastController,
  useId,
} from '@fluentui/react-components'
import { useDocumentStore } from '@/store/useDocumentStore'
import { useDocumentList } from '@/hooks/api/useDocumentList'
import { useDocumentFiles } from '@/hooks/api/useDocumentFiles'
import { useDocumentActions } from '@/hooks/custom/useDocumentActions'
import { AppHeader } from '@/components/AppHeader'
import { CustomerBar } from '@/components/CustomerBar'
import { SelectBar } from '@/components/SelectBar'
import { DocumentListItem } from '@/components/DocumentListItem'
import { DocumentViewer } from '@/components/DocumentViewer'
import { PrintActionBar } from '@/components/PrintActionBar'
import { LoadingState } from '@/components/LoadingState'
import { ErrorState } from '@/components/ErrorState'
import { usePageStyles } from './PageDocumentos.styles'

export const PageDocumentos = () => {
  const styles = usePageStyles()
  const toasterId = useId('toaster')
  const { dispatchToast } = useToastController(toasterId)

  const saleId = useDocumentStore((s) => s.saleId)
  const documents = useDocumentStore((s) => s.documents)
  const listStatus = useDocumentStore((s) => s.listStatus)
  const listError = useDocumentStore((s) => s.listError)
  const selectedIds = useDocumentStore((s) => s.selectedIds)
  const toggleSelect = useDocumentStore((s) => s.toggleSelect)
  const selectAllReady = useDocumentStore((s) => s.selectAllReady)
  const clearSelection = useDocumentStore((s) => s.clearSelection)

  const listQuery = useDocumentList(saleId)
  const fileQueries = useDocumentFiles(documents, saleId, listStatus === 'ready')

  const { printDocument, printMergedDocuments } = useDocumentActions()

  const [activeId, setActiveId] = useState(null)
  const [selectable, setSelectable] = useState(false)

  const showError = useCallback(
    (message) =>
      dispatchToast(
        <Toast>
          <ToastTitle>{message}</ToastTitle>
        </Toast>,
        { intent: 'error', timeout: 3000 }
      ),
    [dispatchToast]
  )

  const readyCount = useMemo(
    () => documents.filter((d) => d.fileStatus === 'ready').length,
    [documents]
  )
  const allSelected = readyCount > 0 && selectedIds.length === readyCount
  const customerName = documents[0]?.NombreCliente ?? null

  const handleView = useCallback((id) => setActiveId(id), [])
  const handleBack = useCallback(() => setActiveId(null), [])

  const handlePrintOne = useCallback(
    async (doc) => {
      try {
        await printDocument(doc)
      } catch {
        showError('Error al imprimir el documento')
      }
    },
    [printDocument, showError]
  )

  const handleRetry = useCallback(
    (doc) => {
      const idx = documents.findIndex((d) => d.IdChecklist === doc.IdChecklist)
      if (idx >= 0 && fileQueries[idx]) fileQueries[idx].refetch()
    },
    [documents, fileQueries]
  )

  const handleToggleSelectable = useCallback(() => {
    setSelectable((prev) => {
      if (prev) clearSelection()
      return !prev
    })
  }, [clearSelection])

  const handleToggleAll = useCallback(() => {
    if (allSelected) clearSelection()
    else selectAllReady()
  }, [allSelected, clearSelection, selectAllReady])

  const handlePrintSelected = useCallback(async () => {
    const selected = documents.filter((d) => selectedIds.includes(d.IdChecklist))
    if (selected.length === 0) return
    try {
      await printMergedDocuments(selected)
    } catch {
      showError('Error al combinar los documentos')
    }
  }, [documents, selectedIds, printMergedDocuments, showError])

  const activeDoc = useMemo(
    () => documents.find((d) => d.IdChecklist === activeId) ?? null,
    [documents, activeId]
  )

  if (activeDoc) {
    return (
      <div className={styles.container}>
        <DocumentViewer document={activeDoc} onBack={handleBack} onPrint={handlePrintOne} />
        <Toaster toasterId={toasterId} position="bottom" />
      </div>
    )
  }

  if (!saleId) {
    return (
      <div className={styles.container}>
        <AppHeader title="Documentos" />
        <ErrorState message="No se recibio identificador de venta. Abra esta pantalla desde una venta en Dynamics." />
        <Toaster toasterId={toasterId} position="bottom" />
      </div>
    )
  }

  if (listStatus === 'loading' || listStatus === 'idle') {
    return (
      <div className={styles.container}>
        <AppHeader title="Documentos" />
        <LoadingState message="Obteniendo documentos de la venta…" />
        <Toaster toasterId={toasterId} position="bottom" />
      </div>
    )
  }

  if (listStatus === 'error') {
    return (
      <div className={styles.container}>
        <AppHeader title="Documentos" />
        <ErrorState
          message={listError ?? 'Error al obtener los documentos'}
          onRetry={() => listQuery.refetch()}
        />
        <Toaster toasterId={toasterId} position="bottom" />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <AppHeader title="Documentos" />
      <CustomerBar
        customerName={customerName}
        docCount={documents.length}
        canSelect={readyCount > 1}
        selectable={selectable}
        onToggleSelectable={handleToggleSelectable}
      />
      {selectable ? (
        <SelectBar
          allSelected={allSelected}
          selectedCount={selectedIds.length}
          onToggleAll={handleToggleAll}
        />
      ) : null}

      <div className={styles.list}>
        {documents.map((doc) => (
          <DocumentListItem
            key={doc.IdChecklist}
            document={doc}
            onView={() => handleView(doc.IdChecklist)}
            onPrint={() => handlePrintOne(doc)}
            onRetry={() => handleRetry(doc)}
            selectable={selectable}
            selected={selectedIds.includes(doc.IdChecklist)}
            onToggleSelect={() => toggleSelect(doc.IdChecklist)}
          />
        ))}
      </div>

      {selectable && selectedIds.length > 0 ? (
        <PrintActionBar count={selectedIds.length} onPrintSelected={handlePrintSelected} />
      ) : null}

      <Toaster toasterId={toasterId} position="bottom" />
    </div>
  )
}
