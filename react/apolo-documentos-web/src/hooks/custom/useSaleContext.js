import { useEffect } from 'react'
import { useDocumentStore } from '@/store/useDocumentStore'
import { MODO_LOCAL, MOCK_SALE_ID } from '@/config/env'

/**
 * Lee el saleId desde sessionStorage y lo publica en el store.
 *
 * En MODO_LOCAL, si no hay valor previo, autocompleta con MOCK_SALE_ID para
 * que el flujo entero pueda ejecutarse en dev sin CRM.
 */
export const useSaleContext = () => {
  const setSaleId = useDocumentStore((s) => s.setSaleId)

  useEffect(() => {
    let saleId = sessionStorage.getItem('IdVenta')

    if (MODO_LOCAL && !saleId) {
      saleId = MOCK_SALE_ID
      sessionStorage.setItem('IdVenta', saleId)
    }

    if (saleId) {
      setSaleId(saleId)
    }
  }, [setSaleId])
}
