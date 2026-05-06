import { useContext } from 'react'
import { ApiClientContext } from './ApiClientContext'

/**
 * Hook de consumo del apiClient. Devuelve null mientras el xrm real no
 * este disponible (en MODO_LOCAL siempre devuelve el mock).
 *
 * @returns {{ customApi: Function } | null}
 */
export const useApiClient = () => useContext(ApiClientContext)
