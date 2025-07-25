import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Eye, Edit, Package, FileText, ArrowRight } from 'lucide-react';
import { pedidosService } from '../../services/api';
import { formatDate, getEstadoColor, getEstadoLabel } from '../../utils/formatters';
import PedidoForm from './PedidoForm';

interface PedidosListProps {
  pedidos: any[];
  onCreateFicha: (pedidoId: number) => void;
  onRefresh: () => void;
}

const PedidosList: React.FC<PedidosListProps> = ({ pedidos, onCreateFicha, onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [showForm, setShowForm] = useState(false);

  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = pedido.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEstado === 'todos' || pedido.estado === filterEstado;
    return matchesSearch && matchesFilter;
  });

  const handleCreateFicha = async (pedidoId: number) => {
    try {
      setLoading(true);
      // Aquí podrías navegar directamente al formulario de ficha con el pedido preseleccionado
      onCreateFicha(pedidoId);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showForm) {
    return (
      <PedidoForm
        onSave={() => {
          setShowForm(false);
          onRefresh();
        }}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
          <p className="text-gray-600 mt-1">Administra los pedidos de clientes y crea fichas técnicas</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Pedido</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por descripción o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="todos">Todos los estados</option>
              <option value="pendiente">Pendiente</option>
              <option value="en_proceso">En Proceso</option>
              <option value="completado">Completado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Pedidos Pendientes</p>
              <p className="text-xl font-bold text-gray-900">
                {pedidos.filter(p => p.estado === 'pendiente').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">En Proceso</p>
              <p className="text-xl font-bold text-gray-900">
                {pedidos.filter(p => p.estado === 'en_proceso').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Completados</p>
              <p className="text-xl font-bold text-gray-900">
                {pedidos.filter(p => p.estado === 'completado').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pedidos Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Descripción</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Cantidad</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha Pedido</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha Entrega</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPedidos.map((pedido) => (
                <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{pedido.cliente.nombre}</p>
                      <p className="text-sm text-gray-500">{pedido.cliente.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="font-medium text-gray-900">{pedido.descripcion}</p>
                    <p className="text-sm text-gray-500 line-clamp-2">{pedido.especificaciones}</p>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {pedido.cantidad.toLocaleString()} und
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(pedido.estado)}`}>
                      {getEstadoLabel(pedido.estado)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {formatDate(pedido.fechaPedido)}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {formatDate(pedido.fechaEntrega)}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end space-x-2">
                      {pedido.estado === 'pendiente' && (
                        <button
                          onClick={() => handleCreateFicha(pedido.id)}
                          disabled={loading}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                          title="Crear ficha técnica"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Crear Ficha</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPedidos.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No se encontraron pedidos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PedidosList;