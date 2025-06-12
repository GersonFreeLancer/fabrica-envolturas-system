import React from 'react';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Users,
  Package,
  AlertTriangle,
  Factory
} from 'lucide-react';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import ProductionChart from './ProductionChart';

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: 'Fichas Activas',
      value: '12',
      change: '+3',
      changeType: 'increase' as const,
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'En Producción',
      value: '8',
      change: '+2',
      changeType: 'increase' as const,
      icon: Factory,
      color: 'purple'
    },
    {
      title: 'Completadas Hoy',
      value: '5',
      change: '+1',
      changeType: 'increase' as const,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Tiempo Promedio',
      value: '4.2h',
      change: '-0.3h',
      changeType: 'decrease' as const,
      icon: Clock,
      color: 'orange'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Resumen general del sistema de producción</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Última actualización: hace 2 minutos</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Production Chart */}
        <div className="lg:col-span-2">
          <ProductionChart />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>

      {/* Alerts and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-900">Alertas del Sistema</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Ficha FT-2024-001 requiere atención</span>
              </div>
              <span className="text-xs text-gray-500">hace 15 min</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Retraso en área de sellado</span>
              </div>
              <span className="text-xs text-gray-500">hace 32 min</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="w-6 h-6 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Nueva Ficha</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Package className="w-6 h-6 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Ver Pedidos</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <TrendingUp className="w-6 h-6 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Informes</span>
            </button>
            <button className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="w-6 h-6 text-orange-600 mb-2" />
              <span className="text-sm font-medium text-gray-700">Usuarios</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;