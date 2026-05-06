import { customApis } from '@/config/endpoints'
import { parseListResponse, parseFileResponse } from './document-parser'

/**
 * Obtiene la lista de documentos de una venta.
 *
 * @param {{ customApi: Function }} apiClient
 * @param {string} saleId
 * @returns {Promise<{ documents: Array, error: string|null }>}
 */
export const fetchDocumentList = async (apiClient, saleId) => {
  const params = {
    Api_ApiIntegracion_DocumentosVenta_ListaInformes_IdVenta: saleId,
  }

  const envelope = await apiClient.customApi('POST', params, customApis.ListaDocumentos)
  return parseListResponse(envelope)
}

/**
 * Obtiene el PDF base64 de un documento individual.
 *
 * Los nombres de los parametros con guiones son exactos — los define el contrato
 * de la custom API y no pueden abreviarse.
 *
 * @param {{ customApi: Function }} apiClient
 * @param {Object} document - item de la lista con sus campos D365
 * @returns {Promise<{ pdfBase64: string|null, fileName: string|null, rutaSharepoint: string|null, error: string|null }>}
 */
export const fetchDocumentFile = async (apiClient, document) => {
  const params = {
    IdCliente: document.IdCliente ?? '',
    nombreCliente: document.NombreCliente ?? '',
    fileName: document.NombreInforme ?? '',
    extension: 'pdf',
    contentType: 'application/pdf',
    ventaNameId: document.VentaNameId ?? '',
    nombreProducto: document.Producto ?? '',
    'Plugin_ApiIntegration_DocumentosVenta_ObtenerDocumentoSharepoint-In-idregistro':
      document.IdVenta ?? '',
    'Plugin_ApiIntegration_DocumentosVenta_ObtenerDocumentoSharepoint-In-idChecklist':
      document.IdChecklist ?? '',
    'Plugin_ApiIntegration_DocumentosVenta_ObtenerDocumentoSharepoint-In-tiporegistro':
      'venta',
  }

  const envelope = await apiClient.customApi('POST', params, customApis.ObtenerDocumento)
  return parseFileResponse(envelope)
}
