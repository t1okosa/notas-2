import { customApis } from '@/config/endpoints'
import { buildMockListResponse } from './mock-lista'
import { buildMockFileResponse, buildMockFileError } from './mock-file'

/**
 * Cliente mock que imita la firma de createApoloClient(xrm) de @apolo/shared-api.
 * Solo implementa customApi — las otras operaciones (odata, decrypt, retrieve*)
 * tiran error explicito porque este visor no las usa.
 *
 * Inspecciona el endpointName (mas robusto que los payloads, cuyas keys son largas
 * y propensas a typos) y devuelve el envelope {Error, Response} con el mismo JSON
 * stringificado anidado que genera D365 en produccion.
 */

const LIST_DELAY_MS = 1200
const FILE_DELAY_BASE_MS = 800
const FILE_DELAY_RANDOM_MS = 2000
const FILE_ERROR_RATE = 0.15

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const extractFileName = (params) =>
  params?.fileName ?? params?.FileName ?? 'Documento Mock'

const extractRutaSharepoint = (params) => {
  const cliente = params?.nombreCliente ?? 'Cliente'
  const venta = params?.ventaNameId ?? 'venta'
  const producto = params?.nombreProducto ?? 'producto'
  return `account/mock/${cliente}/Venta/${venta}/${producto}`
}

/**
 * @returns {{
 *   customApi: (method: string, params: object, endpointName: string) => Promise<{Error: any, Response: any}>,
 *   odata: Function,
 *   decrypt: Function,
 *   retrieveById: Function,
 *   retrieveByIdExpand: Function,
 * }}
 */
export const createMockApiClient = () => {
  const customApi = async (_method, params, endpointName) => {
    if (endpointName === customApis.ListaDocumentos) {
      await delay(LIST_DELAY_MS)
      return buildMockListResponse()
    }

    if (endpointName === customApis.ObtenerDocumento) {
      const jitter = Math.random() * FILE_DELAY_RANDOM_MS
      await delay(FILE_DELAY_BASE_MS + jitter)

      if (Math.random() < FILE_ERROR_RATE) {
        return buildMockFileError('Mock: timeout simulando red lenta')
      }

      return buildMockFileResponse({
        fileName: extractFileName(params),
        rutaSharepoint: extractRutaSharepoint(params),
      })
    }

    return {
      Error: `Mock: endpoint no soportado (${endpointName})`,
      Response: null,
    }
  }

  const notImplemented = (name) => () => {
    throw new Error(`mockApiClient.${name} no esta implementado en este visor`)
  }

  return {
    customApi,
    odata: notImplemented('odata'),
    decrypt: notImplemented('decrypt'),
    retrieveById: notImplemented('retrieveById'),
    retrieveByIdExpand: notImplemented('retrieveByIdExpand'),
  }
}
