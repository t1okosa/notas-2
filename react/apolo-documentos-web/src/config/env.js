/**
 * Flag unico que gobierna el modo desarrollo local.
 *
 * Cuando es true:
 *  - ApiClientProvider monta el mockApiClient en vez de createApoloClient(xrm)
 *  - useD365Title se convierte en noop (no hay dialog padre en dev)
 *  - useSaleContext autocompleta sessionStorage.IdVenta si esta vacio
 *
 * Se configura con VITE_APP_MODO_LOCAL=true al levantar Vite (ver script dev:local).
 *
 * @type {boolean}
 */
export const MODO_LOCAL = import.meta.env.VITE_APP_MODO_LOCAL === 'true'

/**
 * URL del worker de pdfjs. En dev Vite sirve /pdf.work.min.js desde public/.
 * En CRM override via VITE_PDF_WORKER_URL al build.
 *
 * @type {string}
 */
export const PDF_WORKER_URL = import.meta.env.VITE_PDF_WORKER_URL ?? '/pdf.work.min.js'

/**
 * URL base de los cMaps de pdfjs. Se pasa al <Viewer characterMap={...}> y
 * habilita PDFs con fuentes CID (asiaticas, algunos encodings legacy).
 * scripts/sync-pdfjs-assets.mjs copia los archivos a public/pdf-cmaps/.
 *
 * @type {string}
 */
export const PDF_CMAP_URL = import.meta.env.VITE_PDF_CMAP_URL ?? '/pdf-cmaps/'

/**
 * URL base de las 14 fuentes estandar de pdfjs (Helvetica, Times, Courier,
 * Symbol, ZapfDingbats). pdfjs 3.x no las embebe — sin esto los glifos
 * salen vacios en PDFs que referencian esas fuentes sin embeberlas.
 * scripts/sync-pdfjs-assets.mjs copia los archivos a public/pdf-fonts/.
 *
 * @type {string}
 */
export const PDF_FONTS_URL = import.meta.env.VITE_PDF_FONTS_URL ?? '/pdf-fonts/'

/**
 * GUID de venta dummy usado cuando MODO_LOCAL y sessionStorage esta vacio.
 * Mismo valor que usa el legacy (apolo-modal-documentos/src/hooks/useData.js:20).
 *
 * @type {string}
 */
export const MOCK_SALE_ID = '4BE46695-8085-EF11-AC20-7C1E5249C49D'
