import { useEffect } from 'react'
import { MODO_LOCAL } from '@/config/env'

/**
 * Reescribe el titulo del dialog padre de D365 (el iframe host).
 *
 * El parent CRM monta un dialog con id `#defaultDialogChromeTitle-N` (N es un
 * indice incremental). Se itera hasta encontrar el primer match. En MODO_LOCAL
 * se hace noop porque no hay parent.
 *
 * Ver apolo-modal-documentos/src/hooks/useData.js:25-38.
 *
 * @param {string} [nuevoTitulo='Documentos']
 */
export const useD365Title = (nuevoTitulo = 'Documentos') => {
  useEffect(() => {
    if (MODO_LOCAL) return

    try {
      let n = 0
      let found = false
      const maxIntentos = 20
      while (!found && n < maxIntentos) {
        const el = window.parent.document.querySelector(
          `#defaultDialogChromeTitle-${n}`
        )
        if (el) {
          el.innerHTML = nuevoTitulo
          found = true
        }
        n++
      }
    } catch {
      // Cross-origin o no hay parent — no pasa nada.
    }
  }, [nuevoTitulo])
}
