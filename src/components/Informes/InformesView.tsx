import React, { useState } from 'react';
import { BarChart3, FileText, Download, Calendar, TrendingUp, Package, AlertTriangle, CheckCircle, XCircle, Edit, Save, X } from 'lucide-react';
import { FichaTecnica } from '../../types';
import { formatDate, formatDateTime } from '../../utils/formatters';

interface InformesViewProps {
    fichas: FichaTecnica[];
    reportes?: any[];
}

const InformesView: React.FC<InformesViewProps> = ({ fichas, reportes = [] }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('mes');
    const [selectedReport, setSelectedReport] = useState('produccion');
    const [activeTab, setActiveTab] = useState('reportes');
    const [editingReport, setEditingReport] = useState<number | null>(null);
    const [reportesObservaciones, setReportesObservaciones] = useState([
        {
            id: 1,
            fichaId: 1,
            numeroFicha: 'FT-2024-001',
            tipo: 'observacion_calidad',
            area: 'Extrusión',
            resultado: 'revision',
            observaciones: 'Temperatura ligeramente elevada durante el proceso. Se recomienda ajustar a 175°C para próximas producciones.',
            defectos: ['Temperatura inadecuada'],
            inspector: 'Roberto Vega',
            fechaCreacion: '2024-01-20T14:30:00Z',
            estado: 'pendiente',
            accionCorrectiva: '',
            fechaCorreccion: null,
            responsableCorreccion: ''
        },
        {
            id: 2,
            fichaId: 2,
            numeroFicha: 'FT-2024-002',
            tipo: 'observacion_calidad',
            area: 'Sellado',
            resultado: 'rechazado',
            observaciones: 'Defectos en el sellado que comprometen la integridad del producto. Revisar configuración de máquina y presión aplicada.',
            defectos: ['Defectos de sellado', 'Presión insuficiente'],
            inspector: 'Roberto Vega',
            fechaCreacion: '2024-01-21T09:15:00Z',
            estado: 'atendido',
            accionCorrectiva: 'Se ajustó la presión de sellado a 5.2 bar y se recalibró la máquina. Se realizaron pruebas de sellado con resultados satisfactorios.',
            fechaCorreccion: '2024-01-22T10:30:00Z',
            responsableCorreccion: 'Jorge Sánchez'
        }
    ]);

    // Calcular estadísticas
    const fichasCompletadas = fichas.filter(f => f.estado === 'completada');
    const fichasEnProceso = fichas.filter(f => f.estado.startsWith('en_'));
    const totalProduccion = fichasCompletadas.reduce((sum, f) => sum + f.especificaciones.cantidadTotal, 0);

    const reportesTypes = [
        {
            id: 'produccion',
            titulo: 'Reporte de Producción',
            descripcion: 'Análisis detallado de la producción por período',
            icon: BarChart3,
            color: 'blue'
        },
        {
            id: 'calidad',
            titulo: 'Reporte de Calidad',
            descripcion: 'Estadísticas de control de calidad y defectos',
            icon: FileText,
            color: 'green'
        },
        {
            id: 'eficiencia',
            titulo: 'Reporte de Eficiencia',
            descripcion: 'Análisis de tiempos y eficiencia por área',
            icon: TrendingUp,
            color: 'purple'
        },
        {
            id: 'inventario',
            titulo: 'Reporte de Inventario',
            descripción: 'Estado de materiales y productos terminados',
            icon: Package,
            color: 'orange'
        }
    ];

    const handleMarcarAtendido = (reporteId: number, accionCorrectiva: string) => {
        setReportesObservaciones(prev =>
            prev.map(reporte =>
                reporte.id === reporteId
                    ? {
                        ...reporte,
                        estado: 'atendido',
                        accionCorrectiva,
                        fechaCorreccion: new Date().toISOString(),
                        responsableCorreccion: 'Usuario Actual' // En una implementación real sería el usuario logueado
                    }
                    : reporte
            )
        );
        setEditingReport(null);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Informes y Reportes</h1>
                    <p className="text-gray-600 mt-1">Análisis, estadísticas y observaciones de producción</p>
                </div>
                <div className="flex items-center space-x-3">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="semana">Esta semana</option>
                        <option value="mes">Este mes</option>
                        <option value="trimestre">Este trimestre</option>
                        <option value="año">Este año</option>
                    </select>
                    <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <Download className="w-4 h-4" />
                        <span>Exportar</span>
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-8 px-6">
                        <button
                            onClick={() => setActiveTab('reportes')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'reportes'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <BarChart3 className="w-4 h-4 inline mr-2" />
                            Reportes de Producción
                        </button>
                        <button
                            onClick={() => setActiveTab('observaciones')}
                            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'observaciones'
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <AlertTriangle className="w-4 h-4 inline mr-2" />
                            Informes de Observaciones
                            {reportesObservaciones.filter(r => r.estado === 'pendiente').length > 0 && (
                                <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                                    {reportesObservaciones.filter(r => r.estado === 'pendiente').length}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === 'reportes' && (
                        <div className="space-y-6">
                            {/* Estadísticas Generales */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-blue-50 rounded-xl p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                            <FileText className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Fichas Completadas</p>
                                            <p className="text-2xl font-bold text-gray-900">{fichasCompletadas.length}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-50 rounded-xl p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                                            <Package className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Producido</p>
                                            <p className="text-2xl font-bold text-gray-900">{totalProduccion.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-purple-50 rounded-xl p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">En Proceso</p>
                                            <p className="text-2xl font-bold text-gray-900">{fichasEnProceso.length}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-orange-50 rounded-xl p-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                                            <BarChart3 className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Eficiencia</p>
                                            <p className="text-2xl font-bold text-gray-900">87%</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tipos de Reportes */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Reportes</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {reportesTypes.map((reporte) => {
                                        const Icon = reporte.icon;
                                        return (
                                            <div
                                                key={reporte.id}
                                                className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${selectedReport === reporte.id
                                                    ? `border-${reporte.color}-500 bg-${reporte.color}-50`
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                onClick={() => setSelectedReport(reporte.id)}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className={`p-2 bg-${reporte.color}-100 text-${reporte.color}-600 rounded-lg`}>
                                                        <Icon className="w-5 h-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{reporte.titulo}</h4>
                                                        <p className="text-sm text-gray-600">{reporte.descripcion}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Reporte Seleccionado */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {reportesTypes.find(r => r.id === selectedReport)?.titulo}
                                    </h3>
                                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4" />
                                        <span>Período: {selectedPeriod}</span>
                                    </div>
                                </div>

                                {selectedReport === 'produccion' && <ProductionReport fichas={fichas} />}
                                {selectedReport === 'calidad' && <QualityReport fichas={fichas} />}
                                {selectedReport === 'eficiencia' && <EfficiencyReport fichas={fichas} />}
                                {selectedReport === 'inventario' && <InventoryReport fichas={fichas} />}
                            </div>
                        </div>
                    )}

                    {activeTab === 'observaciones' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Informes de Observaciones de Calidad</h3>
                                <div className="flex items-center space-x-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                        <span>Pendiente</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span>Atendido</span>
                                    </div>
                                </div>
                            </div>

                            {reportesObservaciones.length === 0 ? (
                                <div className="text-center py-12">
                                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No hay informes de observaciones</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {reportesObservaciones.map((reporte) => (
                                        <div key={reporte.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <span className="font-mono text-sm font-medium text-blue-600">
                                                            {reporte.numeroFicha}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${reporte.resultado === 'rechazado' ? 'bg-red-100 text-red-800' :
                                                            reporte.resultado === 'revision' ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-green-100 text-green-800'
                                                            }`}>
                                                            {reporte.resultado === 'rechazado' ? 'Rechazado' :
                                                                reporte.resultado === 'revision' ? 'Requiere Revisión' : 'Aprobado'}
                                                        </span>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${reporte.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                                                            }`}>
                                                            {reporte.estado === 'pendiente' ? 'Pendiente' : 'Atendido'}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                        <div>
                                                            <p className="text-sm text-gray-600">Área observada:</p>
                                                            <p className="font-medium text-gray-900">{reporte.area}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">Inspector:</p>
                                                            <p className="font-medium text-gray-900">{reporte.inspector}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-600">Fecha de inspección:</p>
                                                            <p className="font-medium text-gray-900">{formatDateTime(reporte.fechaCreacion)}</p>
                                                        </div>
                                                        {reporte.fechaCorreccion && (
                                                            <div>
                                                                <p className="text-sm text-gray-600">Fecha de corrección:</p>
                                                                <p className="font-medium text-gray-900">{formatDateTime(reporte.fechaCorreccion)}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="mb-4">
                                                        <p className="text-sm text-gray-600 mb-1">Observaciones:</p>
                                                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg text-sm">{reporte.observaciones}</p>
                                                    </div>

                                                    {reporte.defectos && reporte.defectos.length > 0 && (
                                                        <div className="mb-4">
                                                            <p className="text-sm text-gray-600 mb-2">Defectos encontrados:</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {reporte.defectos.map((defecto, index) => (
                                                                    <span key={index} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                                                        {defecto}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Acción Correctiva */}
                                                    {reporte.estado === 'atendido' && reporte.accionCorrectiva && (
                                                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                            <div className="flex items-center space-x-2 mb-2">
                                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                                <p className="text-sm font-medium text-green-800">Acción Correctiva Implementada</p>
                                                            </div>
                                                            <p className="text-sm text-green-700 mb-2">{reporte.accionCorrectiva}</p>
                                                            <p className="text-xs text-green-600">
                                                                Responsable: {reporte.responsableCorreccion} | {formatDateTime(reporte.fechaCorreccion || '')}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {/* Formulario de Acción Correctiva */}
                                                    {editingReport === reporte.id && (
                                                        <CorrectiveActionForm
                                                            onSave={(accion) => handleMarcarAtendido(reporte.id, accion)}
                                                            onCancel={() => setEditingReport(null)}
                                                        />
                                                    )}
                                                </div>

                                                <div className="flex items-center space-x-2 ml-4">
                                                    {reporte.estado === 'pendiente' && editingReport !== reporte.id && (
                                                        <button
                                                            onClick={() => setEditingReport(reporte.id)}
                                                            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                                        >
                                                            <Edit className="w-3 h-3" />
                                                            <span>Atender</span>
                                                        </button>
                                                    )}
                                                    <button className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                                                        Ver Detalles
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Componente para el formulario de acción correctiva
const CorrectiveActionForm: React.FC<{
    onSave: (accion: string) => void;
    onCancel: () => void;
}> = ({ onSave, onCancel }) => {
    const [accionCorrectiva, setAccionCorrectiva] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (accionCorrectiva.trim()) {
            onSave(accionCorrectiva);
        }
    };

    return (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-3">Registrar Acción Correctiva</h4>
            <form onSubmit={handleSubmit} className="space-y-3">
                <textarea
                    value={accionCorrectiva}
                    onChange={(e) => setAccionCorrectiva(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Describe las acciones tomadas para corregir la observación..."
                    required
                />
                <div className="flex items-center space-x-2">
                    <button
                        type="submit"
                        className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Save className="w-3 h-3" />
                        <span>Guardar y Marcar como Atendido</span>
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex items-center space-x-1 px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <X className="w-3 h-3" />
                        <span>Cancelar</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

// Componente de Reporte de Producción
const ProductionReport: React.FC<{ fichas: FichaTecnica[] }> = ({ fichas }) => {
    const areas = ['extrusion', 'corte', 'laminado', 'sellado', 'impresion'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Producción por Estado</h4>
                    <div className="space-y-2">
                        {areas.map(area => {
                            const fichasArea = fichas.filter(f => f.estado === `en_${area}`);
                            return (
                                <div key={area} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span className="text-sm text-gray-700 capitalize">{area}</span>
                                    <span className="font-medium">{fichasArea.length} fichas</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Últimas Fichas Completadas</h4>
                    <div className="space-y-2">
                        {fichas.filter(f => f.estado === 'completada').slice(0, 5).map(ficha => (
                            <div key={ficha.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                <span className="text-sm text-gray-700">{ficha.numeroFicha}</span>
                                <span className="text-xs text-gray-500">{formatDate(ficha.fechaCreacion)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente de Reporte de Calidad
const QualityReport: React.FC<{ fichas: FichaTecnica[] }> = ({ fichas }) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">95%</p>
                    <p className="text-sm text-gray-600">Tasa de Aprobación</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">3%</p>
                    <p className="text-sm text-gray-600">Requieren Revisión</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                    <p className="text-2xl font-bold text-red-600">2%</p>
                    <p className="text-sm text-gray-600">Rechazadas</p>
                </div>
            </div>
            <p className="text-sm text-gray-600">
                Los datos de calidad se actualizarán cuando se completen más inspecciones.
            </p>
        </div>
    );
};

// Componente de Reporte de Eficiencia
const EfficiencyReport: React.FC<{ fichas: FichaTecnica[] }> = ({ fichas }) => {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-lg font-bold text-blue-600">4.2 horas</p>
                    <p className="text-sm text-gray-600">Tiempo promedio por ficha</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                    <p className="text-lg font-bold text-purple-600">87%</p>
                    <p className="text-sm text-gray-600">Eficiencia general</p>
                </div>
            </div>
            <p className="text-sm text-gray-600">
                Los datos de eficiencia se calcularán basándose en los tiempos de operación registrados.
            </p>
        </div>
    );
};

// Componente de Reporte de Inventario
const InventoryReport: React.FC<{ fichas: FichaTecnica[] }> = ({ fichas }) => {
    const materiales = fichas.reduce((acc, ficha) => {
        const material = ficha.especificaciones.material;
        acc[material] = (acc[material] || 0) + ficha.especificaciones.cantidadTotal;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Uso de Materiales</h4>
            <div className="space-y-2">
                {Object.entries(materiales).map(([material, cantidad]) => (
                    <div key={material} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700">{material}</span>
                        <span className="font-medium">{cantidad.toLocaleString()} unidades</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InformesView;