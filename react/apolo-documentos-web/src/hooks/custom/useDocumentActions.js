import { useCallback } from 'react'
import { base64ToBlob, descargarArchivo } from '@apolo/shared-utils'
import PDFMerger from 'pdf-merger-js'

/**
 * Imprime un Blob PDF via iframe oculto.
 * Patron tomado de apolo-modal-documentos/src/functions/base.js:52-67 — funciona
 * dentro del iframe del CRM donde popups estan bloqueados.
 *
 * @param {Blob} blob
 */
const printBlob = (blob) => {
  const blobUrl = window.URL.createObjectURL(blob)
  const frame = document.createElement('iframe')
  frame.style.position = 'fixed'
  frame.style.top = '-10000px'
  frame.style.left = '-10000px'
  frame.style.width = '0'
  frame.style.height = '0'
  frame.src = blobUrl
  document.body.appendChild(frame)

  frame.onload = () => {
    frame.contentWindow.focus()
    frame.contentWindow.print()
    // Release tras 60s — dar tiempo al dialog nativo de impresion.
    setTimeout(() => {
      try {
        document.body.removeChild(frame)
      } catch {
        // ya fue removido
      }
      window.URL.revokeObjectURL(blobUrl)
    }, 60_000)
  }
}

/**
 * Hook que expone las acciones sobre un documento: imprimir individual,
 * imprimir seleccion combinada, descargar.
 */
export const useDocumentActions = () => {
  const printDocument = useCallback(async (document) => {
    if (!document?.pdfBase64) return
    const blob = base64ToBlob(document.pdfBase64, 'application/pdf')
    printBlob(blob)
  }, [])

  const printMergedDocuments = useCallback(async (documents) => {
    const ready = documents.filter((d) => d.pdfBase64)
    if (ready.length === 0) return

    const merger = new PDFMerger()
    for (const doc of ready) {
      const blob = base64ToBlob(doc.pdfBase64, 'application/pdf')
      await merger.add(blob)
    }
    const merged = await merger.saveAsBlob()
    printBlob(merged)
  }, [])

  const downloadDocument = useCallback(async (document) => {
    if (!document?.pdfBase64) return
    const safeName = (document.fileName ?? document.NombreInforme ?? 'Documento').replace(
      /[^a-zA-Z0-9_\s-]/g,
      '_'
    )
    descargarArchivo(document.pdfBase64, `${safeName}.pdf`, 'application/pdf')
  }, [])

  return { printDocument, printMergedDocuments, downloadDocument }
}
