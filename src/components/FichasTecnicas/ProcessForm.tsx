import React, { useState } from 'react';
import { Save, X, Factory, AlertTriangle, CheckCircle, Thermometer, Gauge, Zap, Scissors, Layers } from 'lucide-react';
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
        parametrosProduccion: {},
        cantidadProcesada: ficha.especificaciones.cantidadTotal,
        tiempoOperacion: 0,
        observaciones: '',
        derivarCalidad: false
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

    const updateParametro = (key: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            parametrosProduccion: {
                ...prev.parametrosProduccion,
                [key]: value
            }
        }));
    };

    const renderAreaSpecificFields = () => {
        switch (currentUser?.rol) {
            case 'operario_extrusion':
                return <ExtrusionFields parametros={formData.parametrosProduccion} onChange={updateParametro} />;
            case 'operario_corte':
                return <CorteFields parametros={formData.parametrosProduccion} onChange={updateParametro} />;
            case 'operario_laminado':
                return <LaminadoFields parametros={formData.parametrosProduccion} onChange={updateParametro} />;
            case 'operario_sellado':
                return <SelladoFields parametros={formData.parametrosProduccion} onChange={updateParametro} />;
            case 'operario_impresion':
                return <ImpresionFields parametros={formData.parametrosProduccion} onChange={updateParametro} />;
            default:
                return null;
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
                        Parámetros de {areaNames[currentUser?.rol as keyof typeof areaNames]}
                    </h3>

                    {renderAreaSpecificFields()}

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

// Componente para Extrusión
const ExtrusionFields: React.FC<{
    parametros: any;
    onChange: (key: string, value: any) => void;
}> = ({ parametros, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Thermometer className="w-4 h-4 inline mr-2" />
                Temperatura por Zona (°C)
            </label>
            <input
                type="text"
                value={parametros.temperaturaZona || ''}
                onChange={(e) => onChange('temperaturaZona', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Z1:180, Z2:185, Z3:190"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Zap className="w-4 h-4 inline mr-2" />
                Velocidad de Línea (m/min)
            </label>
            <input
                type="number"
                step="0.1"
                value={parametros.velocidadLinea || ''}
                onChange={(e) => onChange('velocidadLinea', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 15.5"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Gauge className="w-4 h-4 inline mr-2" />
                Presión de Masa (bar)
            </label>
            <input
                type="number"
                step="0.1"
                value={parametros.presionMasa || ''}
                onChange={(e) => onChange('presionMasa', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 2.5"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Layers className="w-4 h-4 inline mr-2" />
                Espesor (mm)
            </label>
            <input
                type="number"
                step="0.01"
                value={parametros.espesor || ''}
                onChange={(e) => onChange('espesor', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 0.05"
            />
        </div>

        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Configuración de Extrusora
            </label>
            <input
                type="text"
                value={parametros.configuracionExtrusora || ''}
                onChange={(e) => onChange('configuracionExtrusora', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Configuración específica de la extrusora..."
            />
        </div>
    </div>
);

// Componente para Corte
const CorteFields: React.FC<{
    parametros: any;
    onChange: (key: string, value: any) => void;
}> = ({ parametros, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Scissors className="w-4 h-4 inline mr-2" />
                Dimensiones del Corte (cm)
            </label>
            <input
                type="text"
                value={parametros.dimensionesCorte || ''}
                onChange={(e) => onChange('dimensionesCorte', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 30x20"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad Total de Unidades
            </label>
            <input
                type="number"
                value={parametros.cantidadUnidades || ''}
                onChange={(e) => onChange('cantidadUnidades', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Número de unidades cortadas"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Calidad de Corte
            </label>
            <select
                value={parametros.calidadCorte || ''}
                onChange={(e) => onChange('calidadCorte', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="">Seleccionar...</option>
                <option value="excelente">Excelente</option>
                <option value="buena">Buena</option>
                <option value="regular">Regular</option>
                <option value="deficiente">Deficiente</option>
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Zap className="w-4 h-4 inline mr-2" />
                Velocidad de Corte (cortes/min)
            </label>
            <input
                type="number"
                value={parametros.velocidadCorte || ''}
                onChange={(e) => onChange('velocidadCorte', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 50"
            />
        </div>

        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Configuración de Cuchillas
            </label>
            <input
                type="text"
                value={parametros.configuracionCuchillas || ''}
                onChange={(e) => onChange('configuracionCuchillas', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tipo de cuchillas, afilado, configuración..."
            />
        </div>
    </div>
);

// Componente para Laminado
const LaminadoFields: React.FC<{
    parametros: any;
    onChange: (key: string, value: any) => void;
}> = ({ parametros, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Layers className="w-4 h-4 inline mr-2" />
                Tipo de Adhesivo
            </label>
            <select
                value={parametros.tipoAdhesivo || ''}
                onChange={(e) => onChange('tipoAdhesivo', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="">Seleccionar...</option>
                <option value="poliuretano">Poliuretano</option>
                <option value="acrilico">Acrílico</option>
                <option value="base_agua">Base Agua</option>
                <option value="base_solvente">Base Solvente</option>
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Zap className="w-4 h-4 inline mr-2" />
                Velocidad de Laminación (m/min)
            </label>
            <input
                type="number"
                step="0.1"
                value={parametros.velocidadLaminacion || ''}
                onChange={(e) => onChange('velocidadLaminacion', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 12.5"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Gauge className="w-4 h-4 inline mr-2" />
                Fuerza de Laminación (N/cm)
            </label>
            <input
                type="number"
                step="0.1"
                value={parametros.fuerzaLaminacion || ''}
                onChange={(e) => onChange('fuerzaLaminacion', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 150"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Thermometer className="w-4 h-4 inline mr-2" />
                Temperatura de Trabajo (°C)
            </label>
            <input
                type="number"
                value={parametros.temperaturaTrabajo || ''}
                onChange={(e) => onChange('temperaturaTrabajo', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 60"
            />
        </div>

        <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Gramaje de Adhesivo (g/m²)
            </label>
            <input
                type="number"
                step="0.1"
                value={parametros.gramajeAdhesivo || ''}
                onChange={(e) => onChange('gramajeAdhesivo', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 3.5"
            />
        </div>
    </div>
);

// Componente para Sellado
const SelladoFields: React.FC<{
    parametros: any;
    onChange: (key: string, value: any) => void;
}> = ({ parametros, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Thermometer className="w-4 h-4 inline mr-2" />
                Temperatura de Sellado (°C)
            </label>
            <input
                type="number"
                value={parametros.temperaturaSellado || ''}
                onChange={(e) => onChange('temperaturaSellado', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 140"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Gauge className="w-4 h-4 inline mr-2" />
                Presión de Sellado (bar)
            </label>
            <input
                type="number"
                step="0.1"
                value={parametros.presionSellado || ''}
                onChange={(e) => onChange('presionSellado', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 4.5"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Zap className="w-4 h-4 inline mr-2" />
                Velocidad de Máquina (m/min)
            </label>
            <input
                type="number"
                step="0.1"
                value={parametros.velocidadMaquina || ''}
                onChange={(e) => onChange('velocidadMaquina', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 8.0"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Sellado
            </label>
            <select
                value={parametros.tipoSellado || ''}
                onChange={(e) => onChange('tipoSellado', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="">Seleccionar...</option>
                <option value="termico">Térmico</option>
                <option value="ultrasonico">Ultrasónico</option>
                <option value="impulso">Impulso</option>
                <option value="continuo">Continuo</option>
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiempo de Sellado (seg)
            </label>
            <input
                type="number"
                step="0.1"
                value={parametros.tiempoSellado || ''}
                onChange={(e) => onChange('tiempoSellado', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 1.5"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Ancho de Sellado (mm)
            </label>
            <input
                type="number"
                value={parametros.anchoSellado || ''}
                onChange={(e) => onChange('anchoSellado', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 10"
            />
        </div>
    </div>
);

// Componente para Impresión
const ImpresionFields: React.FC<{
    parametros: any;
    onChange: (key: string, value: any) => void;
}> = ({ parametros, onChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Tinta
            </label>
            <select
                value={parametros.tipoTinta || ''}
                onChange={(e) => onChange('tipoTinta', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="">Seleccionar...</option>
                <option value="base_agua">Base Agua</option>
                <option value="base_solvente">Base Solvente</option>
                <option value="uv">UV</option>
                <option value="latex">Látex</option>
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Thermometer className="w-4 h-4 inline mr-2" />
                Temperatura de Secado (°C)
            </label>
            <input
                type="number"
                value={parametros.temperaturaSecado || ''}
                onChange={(e) => onChange('temperaturaSecado', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 80"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                <Zap className="w-4 h-4 inline mr-2" />
                Velocidad de Impresión (m/min)
            </label>
            <input
                type="number"
                step="0.1"
                value={parametros.velocidadImpresion || ''}
                onChange={(e) => onChange('velocidadImpresion', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 25.0"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Densidad de Color (%)
            </label>
            <input
                type="number"
                min="0"
                max="100"
                value={parametros.densidadColor || ''}
                onChange={(e) => onChange('densidadColor', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 85"
            />
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Resolución (DPI)
            </label>
            <select
                value={parametros.resolucion || ''}
                onChange={(e) => onChange('resolucion', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
                <option value="">Seleccionar...</option>
                <option value="300">300 DPI</option>
                <option value="600">600 DPI</option>
                <option value="1200">1200 DPI</option>
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Colores
            </label>
            <input
                type="number"
                min="1"
                max="8"
                value={parametros.numeroColores || ''}
                onChange={(e) => onChange('numeroColores', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 4"
            />
        </div>
    </div>
);

export default ProcessForm;