import React, { useState } from 'react';
import { Factory, Clock, User, CheckCircle, AlertCircle } from 'lucide-react';
import { FichaTecnica, AvanceArea } from '../../types';
import { getEstadoColor, getEstadoLabel, formatDateTime } from '../../utils/formatters';

interface ProduccionViewProps {
  fichas: FichaTecnica[];
  currentUser: any;
  onUpdateAvance: (fichaId: number, area: string, data: any) => void;
}

const ProduccionView: React.FC<ProduccionViewProps> = ({
  fichas,
  currentUser,
  onUpdateAvance
}) => {
  const [selectedFicha, setSelectedFicha] = useState<FichaTecnica | null>(null);
  const [showAreaForm, setShowAreaForm] = useState(false);

  // Obtener fichas asignadas al área del usuario actual
  const getMyFichas = () => {
    const areaMap = {
      'operario_extrusion': 'en_extrusion',
      'operario_corte': 'en_corte',
      'operario_laminado': 'en_laminado',
      'operario_sellado': 'en_sellado',
      'operario_impresion': 'en_impresion'
    };
    
    const myArea = areaMap[currentUser?.rol as keyof typeof areaMap];
    return fichas.filter(f => f.estado === myArea);
  };

  const areas = [
    { id: 'extrusion', nombre: 'Extrusión', icon: Factory, color: 'purple' },
    { id: 'corte', nombre: 'Corte', icon: AlertCircle, color: 'orange' },
    { id: 'laminado', nombre: 'Laminado', icon: CheckCircle, color: 'pink' },
    { id: 'sellado', nombre: 'Sellado', icon: Clock, color: 'indigo' },
    { id: 'impresion', nombre: 'Impresión', icon: User, color: 'teal' }
  ];

  const myFichas = getMyFichas();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Área de Producción</h1>
          <p className="text-gray-600 mt-1">
            Gestión de procesos por área - {currentUser?.area || 'Usuario'}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Factory className="w-4 h-4" />
          <span>Área: {currentUser?.area || 'Sin asignar'}</span>
        </div>
      </div>

      {/* Resumen de Áreas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {areas.map((area) => {
          const fichasArea = fichas.filter(f => f.estado === `en_${area.id}`);
          const Icon = area.icon;
          
          return (
            <div key={area.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg bg-${area.color}-100 text-${area.color}-600`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{area.nombre}</h3>
                  <p className="text-sm text-gray-500">{fichasArea.length} fichas</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mis Fichas Asignadas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Mis Fichas Asignadas ({myFichas.length})
        </h3>
        
        {myFichas.length === 0 ? (
          <div className="text-center py-8">
            <Factory className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No tienes fichas asignadas en este momento</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myFichas.map((ficha) => (
              <div key={ficha.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-sm font-medium text-blue-600">
                    {ficha.numeroFicha}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEstadoColor(ficha.estado)}`}>
                    {getEstadoLabel(ficha.estado)}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <p className="font-medium text-gray-900">{ficha.pedido.cliente.nombre}</p>
                  <p className="text-gray-600">{ficha.especificaciones.tipoEnvoltura}</p>
                  <p className="text-gray-500">
                    Cantidad: {ficha.especificaciones.cantidadTotal.toLocaleString()}
                  </p>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setSelectedFicha(ficha)}
                    className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Procesar
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Procesamiento */}
      {selectedFicha && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Procesar Ficha {selectedFicha.numeroFicha}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {selectedFicha.pedido.cliente.nombre} - {selectedFicha.especificaciones.tipoEnvoltura}
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <AreaProcessForm
                ficha={selectedFicha}
                currentUser={currentUser}
                onSave={(data) => {
                  onUpdateAvance(selectedFicha.id, currentUser?.rol.replace('operario_', ''), data);
                  setSelectedFicha(null);
                }}
                onCancel={() => setSelectedFicha(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Formulario para procesar por área
const AreaProcessForm: React.FC<{
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
    onSave({
      ...formData,
      fechaInicio: new Date().toISOString(),
      fechaFin: new Date().toISOString(),
      estado: 'completado'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Temperatura (°C)
          </label>
          <input
            type="number"
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
            onChange={(e) => setFormData(prev => ({...prev, tiempoOperacion: Number(e.target.value)}))}
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
          onChange={(e) => setFormData(prev => ({...prev, cantidadProcesada: Number(e.target.value)}))}
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
          onChange={(e) => setFormData(prev => ({...prev, observaciones: e.target.value}))}
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
  );
};

export default ProduccionView;