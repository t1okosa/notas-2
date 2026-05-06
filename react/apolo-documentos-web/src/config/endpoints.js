/**
 * Nombres exactos de las Custom APIs de Dynamics 365 usadas por este visor.
 * Se pasan como tercer argumento a `apiClient.customApi(method, params, endpointName)`
 * de @apolo/shared-api.
 *
 * Extraidos de apolo-modal-documentos/src/backend/config.js
 */
export const customApis = {
  /** Devuelve la lista de informes (documentos) asociados a una venta. */
  ListaDocumentos: 'Axx_Api_ApiIntegracion_DocumentosVenta_ListaInformes',

  /** Devuelve el base64 de un documento individual desde SharePoint. */
  ObtenerDocumento: 'axx_Plugin_ApiIntegration_DocumentosVenta_ObtenerDocumentoSharepoint',
}
