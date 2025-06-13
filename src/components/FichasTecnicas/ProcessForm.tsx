import React, { useState } from 'react';
import { Save, X, Factory, AlertTriangle, CheckCircle } from 'lucide-react';
import { FichaTecnica } from '../../types';
import { getEstadoLabel } from '../../utils/formatters';

interface ProcessFormProps {
    ficha: FichaTecnica;
    currentUser: any;
    onSave: (data: any) => void;
    onCancel: () => void;
}

const ProcessForm: React.FC<ProcessFormProps> = ({
    ficha,
    currentUser,
    onSave,
    onCancel
}) => {
    const [formData, setFormData] = useState({
        parametrosProduccion: {
            temperatura: '',
            presion: '',
            velocidad: '',
            configuracionMaquina: ''
        },
        cantidadProcesada: ficha.especificaciones.cantidadTotal,
        tiempoOperacion: 0,
        observaciones: '',
        derivarCalidad: false // Solo para el último operario (impresión)
    });

    const [loading, setLoading] = useState(false);

    const areaNames = {
        'operario_extrusion': 'Extrusión',
        'operario_corte': 'Corte',
        'operario_laminado': 'Laminado',
        'operario_sellado': 'Sellado',
        'operario_impresion': 'Impresión'
    };

    const isLastArea = currentUser?.rol === 'operario_impresion';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const area = currentUser?.rol?.replace('operario_', '');
            await onSave({
                ...formData,
                area,
                derivarCalidad: isLastArea ? formData.derivarCalidad : false
            });
        } catch (error) {
            console.error('Error procesando ficha:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Procesar en {areaNames[currentUser?.rol as keyof typeof areaNames]}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Ficha {ficha.numeroFicha} - {ficha.especificaciones.tipoEnvoltura}
                    </p>
                </div>
                <button
                    onClick={onCancel}
                    className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Información de la Ficha */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Factory className="w-5 h-5" />
                    <span>Información del Producto</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                        <p className="text-gray-900">{ficha.pedido.cliente.nombre}</p>
                    </div>
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
            </div>

            {/* Formulario de Procesamiento */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Parámetros de Producción - {areaNames[currentUser?.rol as keyof typeof areaNames]}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                placeholder="Ej: 180.5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                placeholder="Ej: 2.5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                placeholder="Ej: 15.0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tiempo de Operación (minutos) *
                            </label>
                            <input
                                type="number"
                                value={formData.tiempoOperacion}
                                onChange={(e) => setFormData(prev => ({ ...prev, tiempoOperacion: Number(e.target.value) }))}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Ej: 120"
                                required
                            />
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Cantidad Procesada *
                            </label>
                            <input
                                type="number"
                                value={formData.cantidadProcesada}
                                onChange={(e) => setFormData(prev => ({ ...prev, cantidadProcesada: Number(e.target.value) }))}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                                max={ficha.especificaciones.cantidadTotal}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                placeholder="Configuración específica de la máquina..."
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Observaciones del Proceso
                        </label>
                        <textarea
                            value={formData.observaciones}
                            onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
                            rows={4}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Observaciones, incidencias o notas importantes del proceso..."
                        />
                    </div>

                    {/* Opción para derivar a control de calidad (solo para impresión) */}
                    {isLastArea && (
                        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="derivarCalidad"
                                    checked={formData.derivarCalidad}
                                    onChange={(e) => setFormData(prev => ({ ...prev, derivarCalidad: e.target.checked }))}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="derivarCalidad" className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span>Derivar a Control de Calidad</span>
                                </label>
                            </div>
                            <p className="text-sm text-gray-600 mt-2 ml-7">
                                Al marcar esta opción, la ficha será enviada al área de control de calidad para inspección final.
                            </p>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-4 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        <span>{loading ? 'Procesando...' : 'Completar Proceso'}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProcessForm;