import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, FileText, User, Calendar, Send, Eye, Factory, Thermometer, Gauge, Zap, Scissors, Layers } from 'lucide-react';
import { FichaTecnica } from '../../types';
import { formatDate, formatDateTime } from '../../utils/formatters';

interface CalidadViewProps {
    fichas: FichaTecnica[];
    currentUser: any;
    onUpdateFicha: () => void;
    onCreateReport?: (fichaId: number, reportData: any) => void;
}

const CalidadView: React.FC<CalidadViewProps> = ({ fichas, currentUser, onUpdateFicha, onCreateReport }) => {
    const [selectedFicha, setSelectedFicha] = useState<FichaTecnica | null>(null);
    const [showInspectionForm, setShowInspectionForm] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);

    const canInspect = currentUser?.rol === 'control_calidad' || currentUser?.rol === 'jefe_produccion';

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Control de Calidad</h1>
                    <p className="text-gray-600 mt-1">Inspección y aprobación de fichas técnicas completadas</p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <CheckCircle className="w-4 h-4" />
                    <span>Inspector: {currentUser?.nombre || 'Usuario'}</span>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                            <AlertTriangle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Pendientes de Inspección</p>
                            <p className="text-xl font-bold text-gray-900">{fichas.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Aprobadas Hoy</p>
                            <p className="text-xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                            <XCircle className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Con Observaciones</p>
                            <p className="text-xl font-bold text-gray-900">0</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de Fichas para Inspección */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Fichas Pendientes de Inspección</h3>
                </div>

                {fichas.length === 0 ? (
                    <div className="text-center py-12">
                        <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No hay fichas pendientes de inspección</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {fichas.map((ficha) => (
                            <div key={ficha.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <span className="font-mono text-sm font-medium text-blue-600">
                                                {ficha.numeroFicha}
                                            </span>
                                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                                Control de Calidad
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="font-medium text-gray-900">{ficha.pedido.cliente.nombre}</p>
                                                <p className="text-gray-600">{ficha.especificaciones.tipoEnvoltura}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Cantidad: {ficha.especificaciones.cantidadTotal.toLocaleString()}</p>
                                                <p className="text-gray-600">Material: {ficha.especificaciones.material}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600">Creada: {formatDate(ficha.fechaCreacion)}</p>
                                                <p className="text-gray-600">Entrega: {formatDate(ficha.pedido.fechaEntrega)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 ml-4">
                                        <button
                                            onClick={() => {
                                                setSelectedFicha(ficha);
                                                setShowDetailModal(true);
                                            }}
                                            className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span>Ver Detalles</span>
                                        </button>
                                        {canInspect && (
                                            <button
                                                onClick={() => {
                                                    setSelectedFicha(ficha);
                                                    setShowInspectionForm(true);
                                                }}
                                                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Inspeccionar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal de Detalles de Operarios */}
            {showDetailModal && selectedFicha && (
                <OperarioDetailsModal
                    ficha={selectedFicha}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedFicha(null);
                    }}
                />
            )}

            {/* Modal de Inspección */}
            {showInspectionForm && selectedFicha && (
                <InspectionModal
                    ficha={selectedFicha}
                    inspector={currentUser}
                    onSave={(result) => {
                        console.log('Resultado de inspección:', result);

                        // Si hay observaciones, crear informe
                        if (result.resultado === 'rechazado' || result.resultado === 'revision') {
                            if (onCreateReport) {
                                onCreateReport(selectedFicha.id, {
                                    tipo: 'observacion_calidad',
                                    resultado: result.resultado,
                                    observaciones: result.observaciones,
                                    defectos: result.defectosEncontrados,
                                    inspector: currentUser.nombre,
                                    fechaInspeccion: new Date().toISOString()
                                });
                            }
                        }

                        setShowInspectionForm(false);
                        setSelectedFicha(null);
                        onUpdateFicha();
                    }}
                    onCancel={() => {
                        setShowInspectionForm(false);
                        setSelectedFicha(null);
                    }}
                />
            )}
        </div>
    );
};

// Modal para ver detalles del trabajo de operarios
const OperarioDetailsModal: React.FC<{
    ficha: FichaTecnica;
    onClose: () => void;
}> = ({ ficha, onClose }) => {
    // Simular datos de avances por área (en una implementación real vendrían de la API)
    const avancesMock = [
        {
            area: 'extrusion',
            operario: 'Ana García',
            fechaInicio: '2024-01-20T08:00:00Z',
            fechaFin: '2024-01-20T10:30:00Z',
            parametros: {
                temperaturaZona: 'Z1:180, Z2:185, Z3:190',
                velocidadLinea: '15.5',
                presionMasa: '2.5',
                espesor: '0.05',
                configuracionExtrusora: 'Configuración estándar PLA'
            },
            cantidadProcesada: 5000,
            tiempoOperacion: 150,
            observaciones: 'Proceso normal, temperatura estable'
        },
        {
            area: 'corte',
            operario: 'Luis Rodríguez',
            fechaInicio: '2024-01-20T11:00:00Z',
            fechaFin: '2024-01-20T13:00:00Z',
            parametros: {
                dimensionesCorte: '30x20',
                cantidadUnidades: '5000',
                calidadCorte: 'excelente',
                velocidadCorte: '50',
                configuracionCuchillas: 'Cuchillas nuevas, afilado perfecto'
            },
            cantidadProcesada: 5000,
            tiempoOperacion: 120,
            observaciones: 'Corte preciso, sin desperdicios'
        },
        {
            area: 'laminado',
            operario: 'María Torres',
            fechaInicio: '2024-01-20T14:00:00Z',
            fechaFin: '2024-01-20T16:30:00Z',
            parametros: {
                tipoAdhesivo: 'poliuretano',
                velocidadLaminacion: '12.5',
                fuerzaLaminacion: '150',
                temperaturaTrabajo: '60',
                gramajeAdhesivo: '3.5'
            },
            cantidadProcesada: 5000,
            tiempoOperacion: 150,
            observaciones: 'Adhesión perfecta, sin burbujas'
        },
        {
            area: 'sellado',
            operario: 'Jorge Sánchez',
            fechaInicio: '2024-01-21T08:00:00Z',
            fechaFin: '2024-01-21T10:00:00Z',
            parametros: {
                temperaturaSellado: '140',
                presionSellado: '4.5',
                velocidadMaquina: '8.0',
                tipoSellado: 'termico',
                tiempoSellado: '1.5',
                anchoSellado: '10'
            },
            cantidadProcesada: 5000,
            tiempoOperacion: 120,
            observaciones: 'Sellado uniforme y resistente'
        },
        {
            area: 'impresion',
            operario: 'Carmen López',
            fechaInicio: '2024-01-21T11:00:00Z',
            fechaFin: '2024-01-21T14:00:00Z',
            parametros: {
                tipoTinta: 'base_agua',
                temperaturaSecado: '80',
                velocidadImpresion: '25.0',
                densidadColor: '85',
                resolucion: '600',
                numeroColores: '4'
            },
            cantidadProcesada: 5000,
            tiempoOperacion: 180,
            observaciones: 'Impresión nítida, colores vibrantes'
        }
    ];

    const getAreaIcon = (area: string) => {
        const icons = {
            extrusion: Factory,
            corte: Scissors,
            laminado: Layers,
            sellado: Gauge,
            impresion: FileText
        };
        return icons[area as keyof typeof icons] || Factory;
    };

    const getAreaName = (area: string) => {
        const names = {
            extrusion: 'Extrusión',
            corte: 'Corte',
            laminado: 'Laminado',
            sellado: 'Sellado',
            impresion: 'Impresión'
        };
        return names[area as keyof typeof names] || area;
    };

    const renderParametros = (area: string, parametros: any) => {
        switch (area) {
            case 'extrusion':
                return (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="font-medium">Temperatura por zona:</span> {parametros.temperaturaZona}</div>
                        <div><span className="font-medium">Velocidad línea:</span> {parametros.velocidadLinea} m/min</div>
                        <div><span className="font-medium">Presión masa:</span> {parametros.presionMasa} bar</div>
                        <div><span className="font-medium">Espesor:</span> {parametros.espesor} mm</div>
                        <div className="col-span-2"><span className="font-medium">Configuración:</span> {parametros.configuracionExtrusora}</div>
                    </div>
                );
            case 'corte':
                return (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="font-medium">Dimensiones:</span> {parametros.dimensionesCorte} cm</div>
                        <div><span className="font-medium">Unidades:</span> {parametros.cantidadUnidades}</div>
                        <div><span className="font-medium">Calidad:</span> {parametros.calidadCorte}</div>
                        <div><span className="font-medium">Velocidad:</span> {parametros.velocidadCorte} cortes/min</div>
                        <div className="col-span-2"><span className="font-medium">Cuchillas:</span> {parametros.configuracionCuchillas}</div>
                    </div>
                );
            case 'laminado':
                return (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="font-medium">Adhesivo:</span> {parametros.tipoAdhesivo}</div>
                        <div><span className="font-medium">Velocidad:</span> {parametros.velocidadLaminacion} m/min</div>
                        <div><span className="font-medium">Fuerza:</span> {parametros.fuerzaLaminacion} N/cm</div>
                        <div><span className="font-medium">Temperatura:</span> {parametros.temperaturaTrabajo}°C</div>
                        <div className="col-span-2"><span className="font-medium">Gramaje adhesivo:</span> {parametros.gramajeAdhesivo} g/m²</div>
                    </div>
                );
            case 'sellado':
                return (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="font-medium">Temperatura:</span> {parametros.temperaturaSellado}°C</div>
                        <div><span className="font-medium">Presión:</span> {parametros.presionSellado} bar</div>
                        <div><span className="font-medium">Velocidad:</span> {parametros.velocidadMaquina} m/min</div>
                        <div><span className="font-medium">Tipo:</span> {parametros.tipoSellado}</div>
                        <div><span className="font-medium">Tiempo:</span> {parametros.tiempoSellado} seg</div>
                        <div><span className="font-medium">Ancho:</span> {parametros.anchoSellado} mm</div>
                    </div>
                );
            case 'impresion':
                return (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div><span className="font-medium">Tinta:</span> {parametros.tipoTinta}</div>
                        <div><span className="font-medium">Temp. secado:</span> {parametros.temperaturaSecado}°C</div>
                        <div><span className="font-medium">Velocidad:</span> {parametros.velocidadImpresion} m/min</div>
                        <div><span className="font-medium">Densidad color:</span> {parametros.densidadColor}%</div>
                        <div><span className="font-medium">Resolución:</span> {parametros.resolucion} DPI</div>
                        <div><span className="font-medium">Colores:</span> {parametros.numeroColores}</div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                                Resumen de Trabajo - {ficha.numeroFicha}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                                {ficha.pedido.cliente.nombre} - {ficha.especificaciones.tipoEnvoltura}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            ×
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {avancesMock.map((avance, index) => {
                        const Icon = getAreaIcon(avance.area);
                        return (
                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{getAreaName(avance.area)}</h4>
                                        <p className="text-sm text-gray-600">Operario: {avance.operario}</p>
                                    </div>
                                    <div className="text-right text-sm text-gray-500">
                                        <p>Inicio: {formatDateTime(avance.fechaInicio)}</p>
                                        <p>Fin: {formatDateTime(avance.fechaFin)}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h5 className="font-medium text-gray-900 mb-2">Parámetros de Producción</h5>
                                        {renderParametros(avance.area, avance.parametros)}
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium text-gray-700">Cantidad procesada:</span>
                                            <p className="text-gray-900">{avance.cantidadProcesada.toLocaleString()} unidades</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Tiempo operación:</span>
                                            <p className="text-gray-900">{avance.tiempoOperacion} minutos</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-700">Eficiencia:</span>
                                            <p className="text-gray-900">{Math.round((avance.cantidadProcesada / avance.tiempoOperacion) * 60)} und/hora</p>
                                        </div>
                                    </div>

                                    {avance.observaciones && (
                                        <div>
                                            <span className="font-medium text-gray-700">Observaciones:</span>
                                            <p className="text-gray-900 bg-white p-2 rounded border mt-1">{avance.observaciones}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-6 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            <p><span className="font-medium">Tiempo total de producción:</span> {avancesMock.reduce((sum, a) => sum + a.tiempoOperacion, 0)} minutos</p>
                            <p><span className="font-medium">Cantidad total procesada:</span> {ficha.especificaciones.cantidadTotal.toLocaleString()} unidades</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Modal de Inspección (mantener el código existente)
const InspectionModal: React.FC<{
    ficha: FichaTecnica;
    inspector: any;
    onSave: (result: any) => void;
    onCancel: () => void;
}> = ({ ficha, inspector, onSave, onCancel }) => {
    const [resultado, setResultado] = useState<'aprobado' | 'rechazado' | 'revision'>('aprobado');
    const [observaciones, setObservaciones] = useState('');
    const [defectos, setDefectos] = useState<string[]>([]);
    const [nuevoDefecto, setNuevoDefecto] = useState('');
    const [areaObservada, setAreaObservada] = useState('');

    const defectosComunes = [
        'Dimensiones incorrectas',
        'Color no uniforme',
        'Acabado deficiente',
        'Grosor irregular',
        'Defectos de sellado',
        'Impresión borrosa',
        'Material contaminado',
        'Temperatura inadecuada',
        'Presión insuficiente',
        'Velocidad incorrecta'
    ];

    const areas = [
        'Extrusión',
        'Corte',
        'Laminado',
        'Sellado',
        'Impresión'
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            resultado,
            observaciones,
            defectosEncontrados: defectos,
            areaObservada: (resultado === 'rechazado' || resultado === 'revision') ? areaObservada : null,
            fechaInspeccion: new Date().toISOString(),
            inspectorId: inspector.id
        });
    };

    const agregarDefecto = (defecto: string) => {
        if (defecto && !defectos.includes(defecto)) {
            setDefectos([...defectos, defecto]);
        }
    };

    const eliminarDefecto = (defecto: string) => {
        setDefectos(defectos.filter(d => d !== defecto));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Inspección de Calidad - {ficha.numeroFicha}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        {ficha.pedido.cliente.nombre} - {ficha.especificaciones.tipoEnvoltura}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Información de la Ficha */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">Especificaciones del Producto</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Material:</span>
                                <span className="ml-2 font-medium">{ficha.especificaciones.material}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Color:</span>
                                <span className="ml-2 font-medium">{ficha.especificaciones.color}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Dimensiones:</span>
                                <span className="ml-2 font-medium">
                                    {ficha.especificaciones.dimensiones.largo} × {ficha.especificaciones.dimensiones.ancho} × {ficha.especificaciones.dimensiones.grosor} cm
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">Cantidad:</span>
                                <span className="ml-2 font-medium">{ficha.especificaciones.cantidadTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Resultado de Inspección */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Resultado de la Inspección
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setResultado('aprobado')}
                                className={`p-3 rounded-lg border-2 transition-colors ${resultado === 'aprobado'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 hover:border-green-300'
                                    }`}
                            >
                                <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                                <span className="text-sm font-medium">Aprobado</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setResultado('revision')}
                                className={`p-3 rounded-lg border-2 transition-colors ${resultado === 'revision'
                                        ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                                        : 'border-gray-200 hover:border-yellow-300'
                                    }`}
                            >
                                <AlertTriangle className="w-5 h-5 mx-auto mb-1" />
                                <span className="text-sm font-medium">Revisión</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setResultado('rechazado')}
                                className={`p-3 rounded-lg border-2 transition-colors ${resultado === 'rechazado'
                                        ? 'border-red-500 bg-red-50 text-red-700'
                                        : 'border-gray-200 hover:border-red-300'
                                    }`}
                            >
                                <XCircle className="w-5 h-5 mx-auto mb-1" />
                                <span className="text-sm font-medium">Rechazado</span>
                            </button>
                        </div>
                    </div>

                    {/* Área Observada */}
                    {(resultado === 'rechazado' || resultado === 'revision') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Área con Observaciones
                            </label>
                            <select
                                value={areaObservada}
                                onChange={(e) => setAreaObservada(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                <option value="">Seleccionar área...</option>
                                {areas.map(area => (
                                    <option key={area} value={area}>{area}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Defectos Encontrados */}
                    {(resultado === 'rechazado' || resultado === 'revision') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Defectos Encontrados
                            </label>

                            <div className="space-y-3">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={nuevoDefecto}
                                        onChange={(e) => setNuevoDefecto(e.target.value)}
                                        placeholder="Describir defecto..."
                                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            agregarDefecto(nuevoDefecto);
                                            setNuevoDefecto('');
                                        }}
                                        className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                    >
                                        Agregar
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {defectosComunes.map(defecto => (
                                        <button
                                            key={defecto}
                                            type="button"
                                            onClick={() => agregarDefecto(defecto)}
                                            className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                                        >
                                            + {defecto}
                                        </button>
                                    ))}
                                </div>

                                {defectos.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700">Defectos seleccionados:</p>
                                        {defectos.map(defecto => (
                                            <div key={defecto} className="flex items-center justify-between bg-red-50 px-3 py-2 rounded-lg">
                                                <span className="text-sm text-red-700">{defecto}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => eliminarDefecto(defecto)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Observaciones */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Observaciones de la Inspección
                        </label>
                        <textarea
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Detalles adicionales sobre la inspección..."
                            required
                        />
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <Send className="w-4 h-4" />
                            <span>Guardar Inspección</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CalidadView;