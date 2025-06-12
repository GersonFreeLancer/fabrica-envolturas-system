import React from 'react';
import { BarChart3 } from 'lucide-react';

const ProductionChart: React.FC = () => {
  const data = [
    { area: 'Extrusión', completed: 15, pending: 3 },
    { area: 'Corte', completed: 12, pending: 5 },
    { area: 'Laminado', completed: 18, pending: 2 },
    { area: 'Sellado', completed: 10, pending: 7 },
    { area: 'Impresión', completed: 14, pending: 4 }
  ];

  const maxValue = Math.max(...data.map(d => d.completed + d.pending));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Producción por Área</h3>
        </div>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Completadas</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Pendientes</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{item.area}</span>
              <span className="text-sm text-gray-500">
                {item.completed + item.pending} total
              </span>
            </div>
            <div className="flex h-6 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="bg-green-500 transition-all duration-300"
                style={{ width: `${(item.completed / maxValue) * 100}%` }}
              ></div>
              <div 
                className="bg-blue-500 transition-all duration-300"
                style={{ width: `${(item.pending / maxValue) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{item.completed} completadas</span>
              <span>{item.pending} pendientes</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductionChart;