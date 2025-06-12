import React, { useState } from 'react';
import { Plus, Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { FichaTecnica } from '../../types';
import { formatDate, getEstadoColor, getEstadoLabel } from '../../utils/formatters';

interface FichasListProps {
  fichas: FichaTecnica[];
  onCreateNew: () => void;
  onViewFicha: (ficha: FichaTecnica) => void;
  onEditFicha: (ficha: FichaTecnica) => void;
}

const FichasList: React.FC<FichasListProps> = ({
  fichas,
  onCreateNew,
  onViewFicha,
  onEditFicha
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');

  const filteredFichas = fichas.filter(ficha => {
    const matchesSearch = ficha.numeroFicha.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ficha.pedido.cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterEstado === 'todos' || ficha.estado === filterEstado;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fichas Técnicas</h1>
          <p className="text-gray-600 mt-1">Gestión de fichas técnicas de producción</p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Ficha</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por número de ficha o cliente..."
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
              <option value="creada">Creada</option>
              <option value="en_extrusion">En Extrusión</option>
              <option value="en_corte">En Corte</option>
              <option value="en_laminado">En Laminado</option>
              <option value="en_sellado">En Sellado</option>
              <option value="en_impresion">En Impresión</option>
              <option value="control_calidad">Control de Calidad</option>
              <option value="completada">Completada</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fichas Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Número</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Cliente</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Producto</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha Creación</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Cantidad</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredFichas.map((ficha) => (
                <tr key={ficha.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-mono text-sm font-medium text-blue-600">
                      {ficha.numeroFicha}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{ficha.pedido.cliente.nombre}</p>
                      <p className="text-sm text-gray-500">{ficha.pedido.descripcion}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-900">{ficha.especificaciones.tipoEnvoltura}</p>
                      <p className="text-sm text-gray-500">{ficha.especificaciones.material}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(ficha.estado)}`}>
                      {getEstadoLabel(ficha.estado)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-500">
                    {formatDate(ficha.fechaCreacion)}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-900">
                    {ficha.especificaciones.cantidadTotal.toLocaleString()} und
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onViewFicha(ficha)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ver detalles"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEditFicha(ficha)}
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Eliminar">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredFichas.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron fichas técnicas</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FichasList;