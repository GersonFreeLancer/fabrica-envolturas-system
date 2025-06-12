import { Usuario, Cliente, Pedido, FichaTecnica } from '../types';

export const mockUsuarios: Usuario[] = [
  { id: 1, nombre: 'Carlos Mendoza', email: 'carlos@fabrica.com', rol: 'jefe_produccion' },
  { id: 2, nombre: 'Ana García', email: 'ana@fabrica.com', rol: 'operario_extrusion', area: 'Extrusión' },
  { id: 3, nombre: 'Luis Rodríguez', email: 'luis@fabrica.com', rol: 'operario_corte', area: 'Corte' },
  { id: 4, nombre: 'María Torres', email: 'maria@fabrica.com', rol: 'operario_laminado', area: 'Laminado' },
  { id: 5, nombre: 'Jorge Sánchez', email: 'jorge@fabrica.com', rol: 'operario_sellado', area: 'Sellado' },
  { id: 6, nombre: 'Carmen López', email: 'carmen@fabrica.com', rol: 'operario_impresion', area: 'Impresión' },
  { id: 7, nombre: 'Roberto Vega', email: 'roberto@fabrica.com', rol: 'control_calidad' }
];

export const mockClientes: Cliente[] = [
  { id: 1, nombre: 'Empresa ABC', email: 'contacto@abc.com', telefono: '555-0001', direccion: 'Av. Principal 123' },
  { id: 2, nombre: 'Corporación XYZ', email: 'ventas@xyz.com', telefono: '555-0002', direccion: 'Calle Comercial 456' },
  { id: 3, nombre: 'Industrias DEF', email: 'compras@def.com', telefono: '555-0003', direccion: 'Zona Industrial 789' }
];

export const mockPedidos: Pedido[] = [
  {
    id: 1,
    clienteId: 1,
    cliente: mockClientes[0],
    descripcion: 'Envolturas para alimentos - Lote A',
    cantidad: 5000,
    fechaPedido: '2024-01-15',
    fechaEntrega: '2024-01-25',
    estado: 'pendiente',
    especificaciones: 'Material biodegradable, alta resistencia'
  },
  {
    id: 2,
    clienteId: 2,
    cliente: mockClientes[1],
    descripcion: 'Envolturas industriales - Serie B',
    cantidad: 3000,
    fechaPedido: '2024-01-16',
    fechaEntrega: '2024-01-28',
    estado: 'pendiente',
    especificaciones: 'Resistencia química, grosor especial'
  }
];

export const mockFichasTecnicas: FichaTecnica[] = [
  {
    id: 1,
    pedidoId: 1,
    pedido: mockPedidos[0],
    numeroFicha: 'FT-2024-001',
    fechaCreacion: '2024-01-15T10:00:00Z',
    jefeProduccionId: 1,
    estado: 'en_extrusion',
    especificaciones: {
      tipoEnvoltura: 'Biodegradable Premium',
      dimensiones: { largo: 30, ancho: 20, grosor: 0.05 },
      material: 'PLA Biodegradable',
      color: 'Transparente',
      acabado: 'Mate',
      cantidadTotal: 5000,
      observaciones: 'Especial cuidado en temperatura'
    },
    avances: []
  }
];