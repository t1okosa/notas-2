/**
 * Genera el envelope Dynamics 365 para la Custom API ListaDocumentos.
 *
 * Shape (ver apolo-modal-documentos/src/store/files/thunks.js:37):
 *   {
 *     Error: null,
 *     Response: {
 *       Api_ApiIntegracion_DocumentosVenta_ListaInformes_Output: "<JSON stringified>"
 *     }
 *   }
 *
 * El Output parseado es { Lista: DocumentItem[] }.
 */

const MOCK_DOCUMENTS = [
  {
    Copias: 0,
    IdChecklist: 'a410eb78-5b07-f111-8407-7ced8dd5f287',
    IdCliente: '2d5cb354-4707-f111-8407-7ced8dd5f287',
    IdVenta: '7b53fa6c-5b07-f111-8407-7ced8dd5f287',
    Impreso: false,
    NombreCliente: 'JHON PLATINUM',
    NombreInforme: 'Solicitud de Incorporación - Cesantia Tarjeta',
    Orden: 0,
    Producto: 'SEGUROCESA',
    VentaNameId: 'MOCK-VENTA-001',
  },
  {
    Copias: 0,
    IdChecklist: 'b510ec78-5b07-f111-8407-7ced8dd5f288',
    IdCliente: '2d5cb354-4707-f111-8407-7ced8dd5f287',
    IdVenta: '7b53fa6c-5b07-f111-8407-7ced8dd5f287',
    Impreso: false,
    NombreCliente: 'JHON PLATINUM',
    NombreInforme: 'Contrato RDR Repactación - EEFF',
    Orden: 1,
    Producto: 'RDR',
    VentaNameId: 'MOCK-VENTA-001',
  },
  {
    Copias: 0,
    IdChecklist: 'c610ed78-5b07-f111-8407-7ced8dd5f289',
    IdCliente: '2d5cb354-4707-f111-8407-7ced8dd5f287',
    IdVenta: '7b53fa6c-5b07-f111-8407-7ced8dd5f287',
    Impreso: false,
    NombreCliente: 'JHON PLATINUM',
    NombreInforme: 'Anexo Tarjeta Adicional',
    Orden: 2,
    Producto: 'TARJETA',
    VentaNameId: 'MOCK-VENTA-001',
  },
  {
    Copias: 0,
    IdChecklist: 'd710ee78-5b07-f111-8407-7ced8dd5f28a',
    IdCliente: '2d5cb354-4707-f111-8407-7ced8dd5f287',
    IdVenta: '7b53fa6c-5b07-f111-8407-7ced8dd5f287',
    Impreso: false,
    NombreCliente: 'JHON PLATINUM',
    NombreInforme: 'Mandato Cargo Automático',
    Orden: 3,
    Producto: 'MANDATO',
    VentaNameId: 'MOCK-VENTA-001',
  },
  {
    Copias: 0,
    IdChecklist: 'e810ef78-5b07-f111-8407-7ced8dd5f28b',
    IdCliente: '2d5cb354-4707-f111-8407-7ced8dd5f287',
    IdVenta: '7b53fa6c-5b07-f111-8407-7ced8dd5f287',
    Impreso: false,
    NombreCliente: 'JHON PLATINUM',
    NombreInforme: 'Certificado de Vigencia',
    Orden: 4,
    Producto: 'CERTIFICADO',
    VentaNameId: 'MOCK-VENTA-001',
  },
  {
    Copias: 0,
    IdChecklist: 'f910f078-5b07-f111-8407-7ced8dd5f28c',
    IdCliente: '2d5cb354-4707-f111-8407-7ced8dd5f287',
    IdVenta: '7b53fa6c-5b07-f111-8407-7ced8dd5f287',
    Impreso: false,
    NombreCliente: 'JHON PLATINUM',
    NombreInforme: 'Poliza Seguro Desgravamen',
    Orden: 5,
    Producto: 'SEGURO',
    VentaNameId: 'MOCK-VENTA-001',
  },
]

/**
 * Produce el envelope listo para devolver desde mockApiClient.customApi.
 *
 * @returns {{ Error: null, Response: { Api_ApiIntegracion_DocumentosVenta_ListaInformes_Output: string } }}
 */
export const buildMockListResponse = () => ({
  Error: null,
  //Response: {
    Api_ApiIntegracion_DocumentosVenta_ListaInformes_Output: JSON.stringify({
      Lista: MOCK_DOCUMENTS,
    }),
  //},
})
