import { useEffect, useState, useCallback } from 'react'
import { Worker, Viewer } from '@react-pdf-viewer/core'
import { zoomPlugin } from '@react-pdf-viewer/zoom'
import { Document, Page, pdfjs } from 'react-pdf'
import '@react-pdf-viewer/core/lib/styles/index.css'
import '@react-pdf-viewer/zoom/lib/styles/index.css'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import '@/styles/pdf-overrides.css'
import { base64ToBlob } from '@apolo/shared-utils'
import { makeStyles, Button, Text, Tooltip } from '@fluentui/react-components'
import {
  ArrowLeftRegular,
  PrintRegular,
  GlobeRegular,
  AppGenericRegular,
  DocumentPdfRegular,
  ChevronLeftRegular,
  ChevronRightRegular,
  ZoomInRegular,
  ZoomOutRegular,
} from '@fluentui/react-icons'
import { PDF_WORKER_URL, PDF_CMAP_URL, PDF_FONTS_URL } from '@/config/env'
import { colors } from '@/config/colors'
import { LoadingState } from './LoadingState'

// react-pdf@10 usa pdfjs-dist@5 (anidado en su node_modules), no compatible con el v3 del proyecto.
// El script sync-pdfjs-assets.mjs copia ese worker a public/ en predev/prebuild.
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.react-pdf.min.mjs'

const VIEWER_MODES = {
  PDFJS: 'pdfjs',
  NATIVE: 'native',
  REACT_PDF: 'react-pdf',
}

const NATIVE_ZOOM_LEVELS = [
  { value: '50', label: '50%' },
  { value: '75', label: '75%' },
  { value: 'page-fit', label: 'Ajustar página' },
  { value: 'page-width', label: 'Ajustar ancho' },
  { value: '100', label: '100%' },
  { value: '125', label: '125%' },
  { value: '150', label: '150%' },
  { value: '200', label: '200%' },
]
const NATIVE_ZOOM_DEFAULT = 'page-width'

const useStyles = makeStyles({
  container: {
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.background,
    minHeight: 0,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingLeft: '4px',
    paddingRight: '4px',
  },
  navButton: {
    color: colors.textOnPrimary,
    minWidth: 0,
  },
  title: {
    color: colors.textOnPrimary,
    fontWeight: '600',
    fontSize: '16px',
    flex: '1',
    minWidth: 0,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  zoomBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    paddingTop: '4px',
    paddingBottom: '4px',
    paddingLeft: '8px',
    paddingRight: '8px',
    backgroundColor: colors.surfaceElevated,
    borderBottom: `1px solid ${colors.border}`,
  },
  pdfArea: {
    flex: '1',
    minHeight: 0,
    backgroundColor: '#525659',
  },
  iframeArea: {
    flex: '1',
    minHeight: 0,
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'column',
  },
  iframeViewer: {
    flex: '1',
    width: '100%',
    height: '100%',
    border: 'none',
    display: 'block',
    backgroundColor: colors.white,
  },
  zoomSeparator: {
    width: '1px',
    height: '20px',
    backgroundColor: colors.border,
    marginLeft: '2px',
    marginRight: '2px',
    flexShrink: 0,
  },
  reactPdfArea: {
    flex: '1',
    minHeight: 0,
    overflowY: 'auto',
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '12px',
    paddingBottom: '12px',
    gap: '8px',
  },
  reactPdfPageLabel: {
    fontSize: '13px',
    color: colors.textMuted,
    minWidth: '80px',
    textAlign: 'center',
  },
})

export const DocumentViewer = ({ document, onBack, onPrint }) => {
  const styles = useStyles()
  const [fileUrl, setFileUrl] = useState(null)
  const [viewerMode, setViewerMode] = useState(VIEWER_MODES.PDFJS)
  const [numPages, setNumPages] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [nativeZoom, setNativeZoom] = useState(NATIVE_ZOOM_DEFAULT)

  const zoomPluginInstance = zoomPlugin()
  const { ZoomInButton, ZoomOutButton, ZoomPopover } = zoomPluginInstance

  useEffect(() => {
    if (!document?.pdfBase64) {
      setFileUrl(null)
      return
    }
    const blob = base64ToBlob(document.pdfBase64, 'application/pdf')
    const url = URL.createObjectURL(blob)
    setFileUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [document?.pdfBase64])

  useEffect(() => {
    setCurrentPage(1)
    setNumPages(null)
    setNativeZoom(NATIVE_ZOOM_DEFAULT)
  }, [document?.pdfBase64, viewerMode])

  const onDocumentLoadSuccess = useCallback(({ numPages: n }) => {
    setNumPages(n)
    setCurrentPage(1)
  }, [])

  const goToPrev = useCallback(() => setCurrentPage((p) => Math.max(p - 1, 1)), [])
  const goToNext = useCallback(
    () => setCurrentPage((p) => Math.min(p + 1, numPages ?? 1)),
    [numPages]
  )

  const nativeZoomOut = useCallback(() => {
    setNativeZoom((current) => {
      const idx = NATIVE_ZOOM_LEVELS.findIndex((z) => z.value === current)
      return NATIVE_ZOOM_LEVELS[Math.max(idx - 1, 0)].value
    })
  }, [])

  const nativeZoomIn = useCallback(() => {
    setNativeZoom((current) => {
      const idx = NATIVE_ZOOM_LEVELS.findIndex((z) => z.value === current)
      return NATIVE_ZOOM_LEVELS[Math.min(idx + 1, NATIVE_ZOOM_LEVELS.length - 1)].value
    })
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button
          appearance="transparent"
          icon={<ArrowLeftRegular />}
          onClick={onBack}
          aria-label="Volver"
          className={styles.navButton}
        />
        <Text className={styles.title}>
          {document?.fileName ?? document?.NombreInforme}
        </Text>
        {onPrint ? (
          <Button
            appearance="transparent"
            icon={<PrintRegular style={{ color: colors.accentLight }} />}
            onClick={() => onPrint(document)}
            aria-label="Imprimir"
            className={styles.navButton}
          />
        ) : null}
      </div>

      {fileUrl ? (
        <>
          <div className={styles.zoomBar}>
            {/* Boton visor pdfjs */}
            <Tooltip content="Visor avanzado (pdfjs)" relationship="label">
              <Button
                appearance={viewerMode === VIEWER_MODES.PDFJS ? 'primary' : 'subtle'}
                size="small"
                icon={<AppGenericRegular />}
                onClick={() => setViewerMode(VIEWER_MODES.PDFJS)}
                aria-label="Visor pdfjs"
              />
            </Tooltip>

            {/* Boton visor nativo */}
            <Tooltip content="Visor nativo del navegador" relationship="label">
              <Button
                appearance={viewerMode === VIEWER_MODES.NATIVE ? 'primary' : 'subtle'}
                size="small"
                icon={<GlobeRegular />}
                onClick={() => setViewerMode(VIEWER_MODES.NATIVE)}
                aria-label="Visor nativo"
              />
            </Tooltip>

            {/* Boton visor react-pdf */}
            <Tooltip content="Visor react-pdf (paginado)" relationship="label">
              <Button
                appearance={viewerMode === VIEWER_MODES.REACT_PDF ? 'primary' : 'subtle'}
                size="small"
                icon={<DocumentPdfRegular />}
                onClick={() => setViewerMode(VIEWER_MODES.REACT_PDF)}
                aria-label="Visor react-pdf"
              />
            </Tooltip>

            <div className={styles.zoomSeparator} />

            {/* Controles de zoom solo en modo pdfjs */}
            {viewerMode === VIEWER_MODES.PDFJS && (
              <>
                <ZoomOutButton />
                <ZoomPopover />
                <ZoomInButton />
              </>
            )}

            {/* Controles de zoom en modo nativo */}
            {viewerMode === VIEWER_MODES.NATIVE && (
              <>
                <Button
                  appearance="subtle"
                  size="small"
                  icon={<ZoomOutRegular />}
                  onClick={nativeZoomOut}
                  disabled={nativeZoom === NATIVE_ZOOM_LEVELS[0].value}
                  aria-label="Reducir zoom"
                />
                <Text className={styles.reactPdfPageLabel}>
                  {NATIVE_ZOOM_LEVELS.find((z) => z.value === nativeZoom)?.label}
                </Text>
                <Button
                  appearance="subtle"
                  size="small"
                  icon={<ZoomInRegular />}
                  onClick={nativeZoomIn}
                  disabled={nativeZoom === NATIVE_ZOOM_LEVELS[NATIVE_ZOOM_LEVELS.length - 1].value}
                  aria-label="Aumentar zoom"
                />
              </>
            )}

            {/* Controles de paginacion solo en modo react-pdf */}
            {viewerMode === VIEWER_MODES.REACT_PDF && numPages && (
              <>
                <Button
                  appearance="subtle"
                  size="small"
                  icon={<ChevronLeftRegular />}
                  onClick={goToPrev}
                  disabled={currentPage <= 1}
                  aria-label="Pagina anterior"
                />
                <Text className={styles.reactPdfPageLabel}>
                  {currentPage} / {numPages}
                </Text>
                <Button
                  appearance="subtle"
                  size="small"
                  icon={<ChevronRightRegular />}
                  onClick={goToNext}
                  disabled={currentPage >= numPages}
                  aria-label="Pagina siguiente"
                />
              </>
            )}
          </div>

          {/* Visor pdfjs */}
          {viewerMode === VIEWER_MODES.PDFJS && (
            <div className={styles.pdfArea}>
              <Worker workerUrl={PDF_WORKER_URL}>
                <Viewer
                  fileUrl={fileUrl}
                  plugins={[zoomPluginInstance]}
                  characterMap={{ isCompressed: true, url: PDF_CMAP_URL }}
                  transformGetDocumentParams={(options) => ({
                    ...options,
                    standardFontDataUrl: PDF_FONTS_URL,
                    useSystemFonts: false,
                  })}
                />
              </Worker>
            </div>
          )}

          {/* Visor nativo iframe */}
          {viewerMode === VIEWER_MODES.NATIVE && (
            <div className={styles.iframeArea}>
              <iframe
                src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=1&zoom=${nativeZoom}`}
                className={styles.iframeViewer}
                title={document?.fileName ?? document?.NombreInforme ?? 'Documento PDF'}
              />
            </div>
          )}

          {/* Visor react-pdf */}
          {viewerMode === VIEWER_MODES.REACT_PDF && (
            <div className={styles.reactPdfArea}>
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<LoadingState message="Cargando documento..." />}
                error={<Text style={{ color: colors.error }}>Error al cargar el PDF</Text>}
              >
                <Page
                  pageNumber={currentPage}
                  renderTextLayer
                  renderAnnotationLayer
                  width={Math.min(window.innerWidth - 32, 900)}
                />
              </Document>
            </div>
          )}
        </>
      ) : (
        <LoadingState message="Preparando documento..." />
      )}
    </div>
  )
}
