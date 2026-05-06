import { PDF_BASE64 } from './mock-pdf-data.js'

/**
 * Construye el envelope Dynamics 365 para la Custom API ObtenerDocumento.
 *
 * Shape (ver apolo-modal-documentos/src/store/files/thunks.js:78):
 *   {
 *     Error: null,
 *     Response: {
 *       pdfBase64: "<JSON stringified>"
 *     }
 *   }
 *
 * Donde el string parseado es { fileName, rutaSharepoint, pdfBase64, Error }.
 */

/**
 * Envelope exitoso — inner JSON con Error: null y pdfBase64 valido.
 *
 * @param {{ fileName?: string, rutaSharepoint?: string }} opts
 */
export const buildMockFileResponse = ({ fileName, rutaSharepoint } = {}) => ({
  Error: null,
  //Response: {
    pdfBase64: JSON.stringify({
      fileName: fileName ?? 'Documento Mock',
      rutaSharepoint: rutaSharepoint ?? 'account/mock/Cliente/Venta/Producto',
      pdfBase64: PDF_BASE64,
      Error: null,
    }),
  //},
})

/**
 * Envelope con error interno — inner JSON trae Error poblado y pdfBase64 null.
 *
 * @param {string} mensaje
 */
export const buildMockFileError = (mensaje = 'Simulated mock error') => ({
  Error: null,
  //Response: {
    pdfBase64: JSON.stringify({
      fileName: null,
      rutaSharepoint: null,
      pdfBase64: null,
      Error: mensaje,
    }),
  //},
})
