import React, { useState } from 'react';
import { BarChart3, FileText, Download, Calendar, TrendingUp, Package } from 'lucide-react';
import { FichaTecnica } from '../../types';
import { formatDate } from '../../utils/formatters';

interface InformesViewProps {
    fichas: FichaTecnica[];
}

const InformesView: React.FC<InformesViewProps> = ({ fichas }) => {
    const [selectedPeriod, setSelectedPeriod] = useState('mes');
    const [selectedReport, setSelectedReport] = useState('produccion');

    // Calcular estadísticas
    const fichasCompletadas = fichas.filter(f => f.estado === 'completada');
    const fichasEnProceso = fichas.filter(f => f.estado.startsWith('en_'));
    const totalProduccion = fichasCompletadas.reduce((sum, f) => sum + f.especificaciones.cantidadTotal, 0);

    const reportes = [
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

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Informes y Reportes</h1>
                    <p className="text-gray-600 mt-1">Análisis y estadísticas de producción</p>
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

            {/* Estadísticas Generales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Reportes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportes.map((reporte) => {
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {reportes.find(r => r.id === selectedReport)?.titulo}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        <span>Período: {selectedPeriod}</span>
                    </div>
                </div>

                {selectedReport === 'produccion' && (
                    <ProductionReport fichas={fichas} />
                )}

                {selectedReport === 'calidad' && (
                    <QualityReport fichas={fichas} />
                )}

                {selectedReport === 'eficiencia' && (
                    <EfficiencyReport fichas={fichas} />
                )}

                {selectedReport === 'inventario' && (
                    <InventoryReport fichas={fichas} />
                )}
            </div>
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