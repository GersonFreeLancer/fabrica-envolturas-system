import React, { useState } from 'react';
import {
    ArrowLeft,
    FileText,
    User,
    Calendar,
    Package,
    Settings,
    CheckCircle,
    Clock,
    AlertCircle,
    Factory
} from 'lucide-react';
import { FichaTecnica } from '../../types';
import { formatDate, getEstadoColor, getEstadoLabel } from '../../utils/formatters';

interface FichaDetailProps {
    ficha: FichaTecnica;
    onBack: () => void;
    onUpdateAvance: (fichaId: number, area: string, data: any) => void;
    currentUser: any;
}

const FichaDetail: React.FC<FichaDetailProps> = ({
    ficha,
    onBack,
    onUpdateAvance,
    currentUser
}) => {
    const [showProcessForm, setShowProcessForm] = useState(false);

    const areas = [
        { id: 'extrusion', nombre: 'Extrusión', estado: 'en_extrusion', icon: Factory, color: 'purple' },
        { id: 'corte', nombre: 'Corte', estado: 'en_corte', icon: AlertCircle, color: 'orange' },
        { id: 'laminado', nombre: 'Laminado', estado: 'en_laminado', icon: Settings, color: 'pink' },
        { id: 'sellado', nombre: 'Sellado', estado: 'en_sellado', icon: Package, color: 'indigo' },
        { id: 'impresion', nombre: 'Impresión', estado: 'en_impresion', icon: FileText, color: 'teal' }
    ];

    const getCurrentAreaIndex = () => {
        return areas.findIndex(area => area.estado === ficha.estado);
    };

    const canUserProcess = () => {
        const userAreaMap = {
            'operario_extrusion': 'extrusion',
            'operario_corte': 'corte',
            'operario_laminado': 'laminado',
            'operario_sellado': 'sellado',
            'operario_impresion': 'impresion'
        };

        const userArea = userAreaMap[currentUser?.rol as keyof typeof userAreaMap];
        const currentArea = areas.find(area => area.estado === ficha.estado);

        return userArea === currentArea?.id;
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onBack}
                        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Ficha Técnica {ficha.numeroFicha}</h1>
                        <p className="text-gray-600 mt-1">Detalles y seguimiento de producción</p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(ficha.estado)}`}>
                        {getEstadoLabel(ficha.estado)}
                    </span>
                    {canUserProcess() && (
                        <button
                            onClick={() => setShowProcessForm(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Procesar
                        </button>
                    )}
                </div>
            </div>

            {/* Información General */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <FileText className="w-5 h-5" />
                        <span>Información General</span>
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Número de Ficha:</span>
                            <span className="font-medium text-gray-900">{ficha.numeroFicha}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Fecha de Creación:</span>
                            <span className="font-medium text-gray-900">{formatDate(ficha.fechaCreacion)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Estado Actual:</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(ficha.estado)}`}>
                                {getEstadoLabel(ficha.estado)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>Cliente y Pedido</span>
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Cliente:</span>
                            <span className="font-medium text-gray-900">{ficha.pedido.cliente.nombre}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Descripción:</span>
                            <span className="font-medium text-gray-900">{ficha.pedido.descripcion}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Cantidad Pedido:</span>
                            <span className="font-medium text-gray-900">{ficha.pedido.cantidad.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Fecha Entrega:</span>
                            <span className="font-medium text-gray-900">{formatDate(ficha.pedido.fechaEntrega)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Especificaciones del Producto */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Especificaciones del Producto</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Envoltura</label>
                        <p className="text-gray-900">{ficha.especificaciones.tipoEnvoltura}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
                        <p className="text-gray-900">{ficha.especificaciones.material}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <p className="text-gray-900">{ficha.especificaciones.color}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Acabado</label>
                        <p className="text-gray-900">{ficha.especificaciones.acabado}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dimensiones</label>
                        <p className="text-gray-900">
                            {ficha.especificaciones.dimensiones.largo} × {ficha.especificaciones.dimensiones.ancho} × {ficha.especificaciones.dimensiones.grosor} cm
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad Total</label>
                        <p className="text-gray-900">{ficha.especificaciones.cantidadTotal.toLocaleString()} unidades</p>
                    </div>
                </div>
                {ficha.especificaciones.observaciones && (
                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                        <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{ficha.especificaciones.observaciones}</p>
                    </div>
                )}
            </div>

            {/* Progreso de Producción */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Factory className="w-5 h-5" />
                    <span>Progreso de Producción</span>
                </h3>
                <div className="space-y-4">
                    {areas.map((area, index) => {
                        const currentIndex = getCurrentAreaIndex();
                        const isCompleted = index < currentIndex;
                        const isCurrent = index === currentIndex;
                        const isPending = index > currentIndex;

                        const Icon = area.icon;

                        return (
                            <div key={area.id} className="flex items-center space-x-4">
                                <div className={`p-3 rounded-full ${isCompleted ? 'bg-green-100 text-green-600' :
                                    isCurrent ? `bg-${area.color}-100 text-${area.color}-600` :
                                        'bg-gray-100 text-gray-400'
                                    }`}>
                                    {isCompleted ? <CheckCircle className="w-5 h-5" /> :
                                        isCurrent ? <Clock className="w-5 h-5" /> :
                                            <Icon className="w-5 h-5" />}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-medium ${isCompleted ? 'text-green-900' :
                                        isCurrent ? 'text-gray-900' :
                                            'text-gray-500'
                                        }`}>
                                        {area.nombre}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {isCompleted ? 'Completado' :
                                            isCurrent ? 'En proceso' :
                                                'Pendiente'}
                                    </p>
                                </div>
                                {isCurrent && canUserProcess() && (
                                    <button
                                        onClick={() => setShowProcessForm(true)}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        Procesar →
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal de Procesamiento */}
            {showProcessForm && (
                <ProcessModal
                    ficha={ficha}
                    currentUser={currentUser}
                    onSave={(data) => {
                        const userAreaMap = {
                            'operario_extrusion': 'extrusion',
                            'operario_corte': 'corte',
                            'operario_laminado': 'laminado',
                            'operario_sellado': 'sellado',
                            'operario_impresion': 'impresion'
                        };
                        const area = userAreaMap[currentUser?.rol as keyof typeof userAreaMap];
                        onUpdateAvance(ficha.id, area, data);
                        setShowProcessForm(false);
                    }}
                    onCancel={() => setShowProcessForm(false)}
                />
            )}
        </div>
    );
};

// Modal para procesar área
const ProcessModal: React.FC<{
    ficha: FichaTecnica;
    currentUser: any;
    onSave: (data: any) => void;
    onCancel: () => void;
}> = ({ ficha, currentUser, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        parametrosProduccion: {
            temperatura: '',
            presion: '',
            velocidad: '',
            configuracionMaquina: ''
        },
        cantidadProcesada: ficha.especificaciones.cantidadTotal,
        tiempoOperacion: 0,
        observaciones: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const areaNames = {
        'operario_extrusion': 'Extrusión',
        'operario_corte': 'Corte',
        'operario_laminado': 'Laminado',
        'operario_sellado': 'Sellado',
        'operario_impresion': 'Impresión'
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Procesar en {areaNames[currentUser?.rol as keyof typeof areaNames]}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Ficha {ficha.numeroFicha} - {ficha.especificaciones.tipoEnvoltura}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Temperatura (°C)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.parametrosProduccion.temperatura}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    parametrosProduccion: {
                                        ...prev.parametrosProduccion,
                                        temperatura: e.target.value
                                    }
                                }))}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Presión (bar)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.parametrosProduccion.presion}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    parametrosProduccion: {
                                        ...prev.parametrosProduccion,
                                        presion: e.target.value
                                    }
                                }))}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Velocidad (m/min)
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.parametrosProduccion.velocidad}
                                onChange={(e) => setFormData(prev => ({
                                    ...prev,
                                    parametrosProduccion: {
                                        ...prev.parametrosProduccion,
                                        velocidad: e.target.value
                                    }
                                }))}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tiempo Operación (min)
                            </label>
                            <input
                                type="number"
                                value={formData.tiempoOperacion}
                                onChange={(e) => setFormData(prev => ({ ...prev, tiempoOperacion: Number(e.target.value) }))}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cantidad Procesada
                        </label>
                        <input
                            type="number"
                            value={formData.cantidadProcesada}
                            onChange={(e) => setFormData(prev => ({ ...prev, cantidadProcesada: Number(e.target.value) }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Configuración de Máquina
                        </label>
                        <input
                            type="text"
                            value={formData.parametrosProduccion.configuracionMaquina}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                parametrosProduccion: {
                                    ...prev.parametrosProduccion,
                                    configuracionMaquina: e.target.value
                                }
                            }))}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Configuración específica..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Observaciones
                        </label>
                        <textarea
                            value={formData.observaciones}
                            onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                            rows={3}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Observaciones del proceso..."
                        />
                    </div>

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
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Completar Proceso
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FichaDetail;