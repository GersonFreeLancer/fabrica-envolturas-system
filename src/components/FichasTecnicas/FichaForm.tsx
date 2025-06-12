import React, { useState } from 'react';
import { Save, X, Package } from 'lucide-react';
import { Cliente, Pedido, EspecificacionesProducto } from '../../types';

interface FichaFormProps {
  clientes: Cliente[];
  pedidos: Pedido[];
  onSave: (data: any) => void;
  onCancel: () => void;
}

const FichaForm: React.FC<FichaFormProps> = ({
  clientes,
  pedidos,
  onSave,
  onCancel
}) => {
  const [selectedPedido, setSelectedPedido] = useState<number | null>(null);
  const [especificaciones, setEspecificaciones] = useState<EspecificacionesProducto>({
    tipoEnvoltura: '',
    dimensiones: { largo: 0, ancho: 0, grosor: 0 },
    material: '',
    color: '',
    acabado: '',
    cantidadTotal: 0,
    observaciones: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPedido) return;

    const numeroFicha = `FT-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
    
    onSave({
      pedidoId: selectedPedido,
      numeroFicha,
      especificaciones,
      fechaCreacion: new Date().toISOString(),
      estado: 'creada'
    });
  };

  const pedido = pedidos.find(p => p.id === selectedPedido);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nueva Ficha Técnica</h1>
          <p className="text-gray-600 mt-1">Crear una nueva ficha técnica de producción</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de Pedido */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Información del Pedido</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Pedido
              </label>
              <select
                value={selectedPedido || ''}
                onChange={(e) => setSelectedPedido(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar pedido...</option>
                {pedidos.filter(p => p.estado === 'pendiente').map(pedido => (
                  <option key={pedido.id} value={pedido.id}>
                    {pedido.cliente.nombre} - {pedido.descripcion}
                  </option>
                ))}
              </select>
            </div>
            
            {pedido && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Detalles del Pedido</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><span className="font-medium">Cliente:</span> {pedido.cliente.nombre}</p>
                  <p><span className="font-medium">Cantidad:</span> {pedido.cantidad.toLocaleString()}</p>
                  <p><span className="font-medium">Entrega:</span> {new Date(pedido.fechaEntrega).toLocaleDateString()}</p>
                  <p><span className="font-medium">Especificaciones:</span> {pedido.especificaciones}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Especificaciones del Producto */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Especificaciones del Producto</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Envoltura
              </label>
              <input
                type="text"
                value={especificaciones.tipoEnvoltura}
                onChange={(e) => setEspecificaciones(prev => ({...prev, tipoEnvoltura: e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Biodegradable Premium"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Material
              </label>
              <select
                value={especificaciones.material}
                onChange={(e) => setEspecificaciones(prev => ({...prev, material: e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar material...</option>
                <option value="PLA Biodegradable">PLA Biodegradable</option>
                <option value="Polietileno">Polietileno</option>
                <option value="Polipropileno">Polipropileno</option>
                <option value="PET">PET</option>
                <option value="Papel Laminado">Papel Laminado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color
              </label>
              <input
                type="text"
                value={especificaciones.color}
                onChange={(e) => setEspecificaciones(prev => ({...prev, color: e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: Transparente, Azul, etc."
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Largo (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={especificaciones.dimensiones.largo}
                onChange={(e) => setEspecificaciones(prev => ({
                  ...prev, 
                  dimensiones: {...prev.dimensiones, largo: Number(e.target.value)}
                }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ancho (cm)
              </label>
              <input
                type="number"
                step="0.1"
                value={especificaciones.dimensiones.ancho}
                onChange={(e) => setEspecificaciones(prev => ({
                  ...prev, 
                  dimensiones: {...prev.dimensiones, ancho: Number(e.target.value)}
                }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grosor (mm)
              </label>
              <input
                type="number"
                step="0.01"
                value={especificaciones.dimensiones.grosor}
                onChange={(e) => setEspecificaciones(prev => ({
                  ...prev, 
                  dimensiones: {...prev.dimensiones, grosor: Number(e.target.value)}
                }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad Total
              </label>
              <input
                type="number"
                value={especificaciones.cantidadTotal}
                onChange={(e) => setEspecificaciones(prev => ({...prev, cantidadTotal: Number(e.target.value)}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Acabado
              </label>
              <select
                value={especificaciones.acabado}
                onChange={(e) => setEspecificaciones(prev => ({...prev, acabado: e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar acabado...</option>
                <option value="Mate">Mate</option>
                <option value="Brillante">Brillante</option>
                <option value="Satinado">Satinado</option>
                <option value="Texturizado">Texturizado</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Observaciones
            </label>
            <textarea
              value={especificaciones.observaciones}
              onChange={(e) => setEspecificaciones(prev => ({...prev, observaciones: e.target.value}))}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Observaciones especiales o requisitos adicionales..."
            />
          </div>
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
            className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>Crear Ficha Técnica</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default FichaForm;