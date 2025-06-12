import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, FileText, User, Calendar } from 'lucide-react';
import { FichaTecnica } from '../../types';
import { formatDate, formatDateTime } from '../../utils/formatters';

interface CalidadViewProps {
    fichas: FichaTecnica[];
    currentUser: any;
    onUpdateFicha: () => void;
}

const CalidadView: React.FC<CalidadViewProps> = ({ fichas, currentUser, onUpdateFicha }) => {
    const [selectedFicha, setSelectedFicha] = useState<FichaTecnica | null>(null);
    const [showInspectionForm, setShowInspectionForm] = useState(false);

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
                            <p className="text-sm text-gray-600">Rechazadas</p>
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
                                            onClick={() => setSelectedFicha(ficha)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                        >
                                            Ver Detalles
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

            {/* Modal de Inspección */}
            {showInspectionForm && selectedFicha && (
                <InspectionModal
                    ficha={selectedFicha}
                    inspector={currentUser}
                    onSave={(result) => {
                        console.log('Resultado de inspección:', result);
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

// Modal de Inspección
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

    const defectosComunes = [
        'Dimensiones incorrectas',
        'Color no uniforme',
        'Acabado deficiente',
        'Grosor irregular',
        'Defectos de sellado',
        'Impresión borrosa',
        'Material contaminado'
    ];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            resultado,
            observaciones,
            defectosEncontrados: defectos,
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
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Guardar Inspección
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CalidadView;