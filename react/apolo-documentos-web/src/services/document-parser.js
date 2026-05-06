import { isNullOrUndefinedOrEmpty } from '@apolo/shared-utils'

/**
 * Parsea la respuesta de la Custom API ListaDocumentos.
 *
 * Envelope externo (D365):
 *   { Error, Response: { Api_ApiIntegracion_DocumentosVenta_ListaInformes_Output: "<JSON string>" } }
 *
 * El Output parseado es { Lista: DocumentItem[] }.
 *
 * @param {{ Error: any, Response: any }} envelope
 * @returns {{ documents: Array, error: string|null }}
 */
export const parseListResponse = (envelope) => {
  if (!envelope) {
    return { documents: [], error: 'Respuesta vacia del servicio' }
  }

  if (!isNullOrUndefinedOrEmpty(envelope.Error)) {
    return { documents: [], error: String(envelope.Error) }
  }

  if (isNullOrUndefinedOrEmpty(envelope.Api_ApiIntegracion_DocumentosVenta_ListaInformes_Output)) {
    return { documents: [], error: 'No se recibio la lista de documentos' }
  }

  try {
    const output = JSON.parse(
      envelope.Api_ApiIntegracion_DocumentosVenta_ListaInformes_Output
    )
    const lista = Array.isArray(output?.Lista) ? output.Lista : []
    return { documents: lista, error: null }
  } catch (err) {
    return { documents: [], error: `Error parseando lista: ${err.message}` }
  }
}

/**
 * Parsea la respuesta de la Custom API ObtenerDocumento.
 *
 * Envelope externo:
 *   { Error, Response: { pdfBase64: "<JSON string>" } }
 *
 * El string parseado es { fileName, rutaSharepoint, pdfBase64, Error }.
 * Tiene DOS niveles de error: el outer Error del envelope y un Error interno
 * dentro del JSON parseado. Ambos deben chequearse.
 *
 * @param {{ Error: any, Response: any }} envelope
 * @returns {{ pdfBase64: string|null, fileName: string|null, rutaSharepoint: string|null, error: string|null }}
 */
export const parseFileResponse = (envelope) => {
  if (!envelope) {
    return { pdfBase64: null, fileName: null, rutaSharepoint: null, error: 'Respuesta vacia' }
  }

  if (!isNullOrUndefinedOrEmpty(envelope.Error)) {
    return {
      pdfBase64: null,
      fileName: null,
      rutaSharepoint: null,
      error: String(envelope.Error),
    }
  }

  if (isNullOrUndefinedOrEmpty(envelope.pdfBase64)) {
    return {
      pdfBase64: null,
      fileName: null,
      rutaSharepoint: null,
      error: 'No se recibio el archivo',
    }
  }

  try {
    const inner = JSON.parse(envelope.pdfBase64)

    if (!isNullOrUndefinedOrEmpty(inner.Error)) {
      return {
        pdfBase64: null,
        fileName: null,
        rutaSharepoint: null,
        error: String(inner.Error),
      }
    }

    if (isNullOrUndefinedOrEmpty(inner.pdfBase64)) {
      return {
        pdfBase64: null,
        fileName: null,
        rutaSharepoint: null,
        error: 'El documento llego sin contenido',
      }
    }

    return {
      pdfBase64: inner.pdfBase64,
      fileName: inner.fileName ?? null,
      rutaSharepoint: inner.rutaSharepoint ?? null,
      error: null,
    }
  } catch (err) {
    return {
      pdfBase64: null,
      fileName: null,
      rutaSharepoint: null,
      error: `Error parseando archivo: ${err.message}`,
    }
  }
}
