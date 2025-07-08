export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'jefe_produccion' | 'operario_extrusion' | 'operario_corte' | 'operario_laminado' | 'operario_sellado' | 'operario_impresion' | 'control_calidad';
  area?: string;
}

export interface Cliente {
  id: number;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
}

export interface Pedido {
  id: number;
  clienteId: number;
  cliente: Cliente;
  descripcion: string;
  cantidad: number;
  fechaPedido: string;
  fechaEntrega: string;
  estado: 'pendiente' | 'en_proceso' | 'completado';
  especificaciones: string;
}

export interface FichaTecnica {
  id: number;
  pedidoId: number;
  pedido: Pedido;
  numeroFicha: string;
  fechaCreacion: string;
  jefeProduccionId: number;
  estado: 'creada' | 'en_extrusion' | 'en_corte' | 'en_laminado' | 'en_sellado' | 'en_impresion' | 'control_calidad' | 'completada';
  especificaciones: EspecificacionesProducto;
  avances: AvanceArea[];
  inspeccionCalidad?: ControlCalidad;
}

export interface EspecificacionesProducto {
  tipoEnvoltura: string;
  dimensiones: {
    largo: number;
    ancho: number;
    grosor: number;
  };
  material: string;
  color: string;
  acabado: string;
  cantidadTotal: number;
  observaciones: string;
}

export interface AvanceArea {
  id: number;
  fichaTecnicaId: number;
  area: 'extrusion' | 'corte' | 'laminado' | 'sellado' | 'impresion';
  operarioId: number;
  operario: Usuario;
  fechaInicio: string;
  fechaFin?: string;
  parametrosProduccion: ParametrosProduccion;
  cantidadProcesada: number;
  tiempoOperacion: number; // en minutos
  observaciones: string;
  estado: 'pendiente' | 'en_proceso' | 'completado';
}

export interface ParametrosProduccion {
  temperatura?: number;
  presion?: number;
  velocidad?: number;
  configuracionMaquina?: string;
  parametrosEspecificos?: Record<string, any>;
}

export interface InformeProduccion {
  id: number;
  fichaTecnicaId: number;
  fechaGeneracion: string;
  resumenProceso: string;
  tiempoTotalProduccion: number;
  cantidadTotal: number;
  observacionesFinales: string;
  controlCalidad?: ControlCalidad;
}

export interface ControlCalidad {
  id: number;
  fechaInspeccion: string;
  inspectorId: number;
  inspectorNombre: string;
  resultado: 'aprobado' | 'rechazado' | 'revision';
  observaciones: string;
  defectosEncontrados?: string[];
  areaObservada?: string;
}

export interface ReporteObservacion {
  id: number;
  fichaId: number;
  numeroFicha: string;
  tipo: 'observacion_calidad';
  area: string;
  resultado: 'aprobado' | 'rechazado' | 'revision';
  observaciones: string;
  defectos: string[];
  inspector: string;
  fechaCreacion: string;
  estado: 'pendiente' | 'atendido';
  accionCorrectiva?: string;
  fechaCorreccion?: string;
  responsableCorreccion?: string;
}