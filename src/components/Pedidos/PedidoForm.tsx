import React, { useState, useEffect } from 'react';
import { Save, X, Package } from 'lucide-react';
import { clientesService, pedidosService } from '../../services/api';

interface PedidoFormProps {
  onSave: () => void;
  onCancel: () => void;
}

const PedidoForm: React.FC<PedidoFormProps> = ({ onSave, onCancel }) => {
  const [clientes, setClientes] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    clienteId: '',
    descripcion: '',
    cantidad: 0,
    fechaEntrega: '',
    especificaciones: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const data = await clientesService.getAll();
      setClientes(data);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await pedidosService.create({
        ...formData,
        clienteId: parseInt(formData.clienteId)
      });
      onSave();
    } catch (error) {
      console.error('Error creando pedido:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo Pedido</h1>
          <p className="text-gray-600 mt-1">Crear un nuevo pedido de cliente</p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Información del Pedido</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente
              </label>
              <select
                value={formData.clienteId}
                onChange={(e) => setFormData(prev => ({...prev, clienteId: e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Seleccionar cliente...</option>
                {clientes.map(cliente => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <input
                type="number"
                value={formData.cantidad}
                onChange={(e) => setFormData(prev => ({...prev, cantidad: parseInt(e.target.value)}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min="1"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fecha de Entrega
              </label>
              <input
                type="date"
                value={formData.fechaEntrega}
                onChange={(e) => setFormData(prev => ({...prev, fechaEntrega: e.target.value}))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción del Pedido
            </label>
            <input
              type="text"
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({...prev, descripcion: e.target.value}))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Envolturas biodegradables para alimentos"
              required
            />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especificaciones
            </label>
            <textarea
              value={formData.especificaciones}
              onChange={(e) => setFormData(prev => ({...prev, especificaciones: e.target.value}))}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Especificaciones técnicas del producto..."
              required
            />
          </div>
        </div>

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
            <span>{loading ? 'Guardando...' : 'Crear Pedido'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default PedidoForm;