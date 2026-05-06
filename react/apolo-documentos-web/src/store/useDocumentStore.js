import { create } from 'zustand'

/**
 * @typedef {'idle'|'loading'|'ready'|'error'} DocumentFileStatus
 *
 * @typedef {Object} DocumentItem
 * @property {string} IdChecklist
 * @property {string} NombreInforme
 * @property {string} IdVenta
 * @property {string} IdCliente
 * @property {string} Producto
 * @property {number} Orden
 * @property {number} Copias
 * @property {boolean} Impreso
 * @property {string} NombreCliente
 * @property {string} VentaNameId
 * @property {DocumentFileStatus} fileStatus
 * @property {string|null} pdfBase64
 * @property {string|null} fileName
 * @property {string|null} rutaSharepoint
 * @property {string|null} fileError
 */

/**
 * Store Zustand — espejo del store de app-apolo-documentos/src/store/useDocumentStore.js
 * con dos agregados: ventaNameId (para el header) y rutaSharepoint (para debug).
 */
export const useDocumentStore = create((set) => ({
  saleId: null,
  ventaNameId: null,
  documents: [],
  listStatus: 'idle',
  listError: null,
  selectedIds: [],

  setSaleId: (saleId) => set({ saleId }),

  setVentaNameId: (ventaNameId) => set({ ventaNameId }),

  setDocuments: (docs) =>
    set({
      documents: docs.map((doc) => ({
        ...doc,
        fileStatus: 'idle',
        pdfBase64: null,
        fileName: null,
        rutaSharepoint: null,
        fileError: null,
      })),
    }),

  setListStatus: (listStatus) => set({ listStatus }),

  setListError: (listError) => set({ listError }),

  updateDocument: (idChecklist, updates) =>
    set((state) => ({
      documents: state.documents.map((doc) =>
        doc.IdChecklist === idChecklist ? { ...doc, ...updates } : doc
      ),
    })),

  toggleSelect: (idChecklist) =>
    set((state) => {
      const exists = state.selectedIds.includes(idChecklist)
      return {
        selectedIds: exists
          ? state.selectedIds.filter((id) => id !== idChecklist)
          : [...state.selectedIds, idChecklist],
      }
    }),

  selectAllReady: () =>
    set((state) => ({
      selectedIds: state.documents
        .filter((d) => d.fileStatus === 'ready')
        .map((d) => d.IdChecklist),
    })),

  clearSelection: () => set({ selectedIds: [] }),

  resetDocuments: () =>
    set({
      saleId: null,
      ventaNameId: null,
      documents: [],
      listStatus: 'idle',
      listError: null,
      selectedIds: [],
    }),
}))
