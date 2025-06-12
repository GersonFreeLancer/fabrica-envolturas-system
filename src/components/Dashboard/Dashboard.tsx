import React from 'react';
import {
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Users,
  Package,
  AlertTriangle,
  Factory,
  Play,
  Pause
} from 'lucide-react';
import StatsCard from './StatsCard';
import RecentActivity from './RecentActivity';
import ProductionChart from './ProductionChart';
import { FichaTecnica } from '../../types';

interface DashboardProps {
  fichas: FichaTecnica[];
  pedidos: any[];
}

const Dashboard: React.FC<DashboardProps> = ({ fichas, pedidos }) => {
  const fichasActivas = fichas.filter(f => !['completada', 'control_calidad'].includes(f.estado));
  const fichasEnProduccion = fichas.filter(f => f.estado.startsWith('en_'));
  const fichasCompletadasHoy = fichas.filter(f => {
    const today = new Date().toDateString();
    return f.estado === 'completada' && new Date(f.fechaCreacion).toDateString() === today;
  });
  const pedidosPendientes = pedidos.filter(p => p.estado === 'pendiente');

  const stats = [
    {
      title: 'Fichas Activas',
      value: fichasActivas.length.toString(),
      change: `+${fichasActivas.length}`,
      changeType: 'increase' as const,
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'En Producción',
      value: fichasEnProduccion.length.toString(),
      change: `+${fichasEnProduccion.length}`,
      changeType: 'increase' as const,
      icon: Factory,
      color: 'purple'
    },
    {
      title: 'Completadas Hoy',
      value: fichasCompletadasHoy.length.toString(),
      change: `+${fichasCompletadasHoy.length}`,
      changeType: 'increase' as const,
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Pedidos Pendientes',
      value: pedidosPendientes.length.toString(),
      change: `${pedidosPendientes.length} esperando`,
      changeType: 'increase' as const,
      icon: Package,
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
          <ProductionChart fichas={fichas} />
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-1">
          <RecentActivity fichas={fichas} />
        </div>
      </div>

      {/* Estado de Producción por Área */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Producción por Área</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { area: 'Extrusión', estado: 'en_extrusion', color: 'purple', icon: Factory },
            { area: 'Corte', estado: 'en_corte', color: 'orange', icon: AlertTriangle },
            { area: 'Laminado', estado: 'en_laminado', color: 'pink', icon: Play },
            { area: 'Sellado', estado: 'en_sellado', color: 'indigo', icon: Pause },
            { area: 'Impresión', estado: 'en_impresion', color: 'teal', icon: TrendingUp }
          ].map((area) => {
            const fichasArea = fichas.filter(f => f.estado === area.estado);
            const Icon = area.icon;

            return (
              <div key={area.area} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`p-2 rounded-lg bg-${area.color}-100 text-${area.color}-600`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">{area.area}</h4>
                    <p className="text-xs text-gray-500">{fichasArea.length} fichas</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {fichasArea.slice(0, 2).map(ficha => (
                    <div key={ficha.id} className="text-xs text-gray-600 bg-white rounded px-2 py-1">
                      {ficha.numeroFicha}
                    </div>
                  ))}
                  {fichasArea.length > 2 && (
                    <div className="text-xs text-gray-500">
                      +{fichasArea.length - 2} más
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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
            {fichas.filter(f => f.estado === 'control_calidad').slice(0, 3).map(ficha => (
              <div key={ficha.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    Ficha {ficha.numeroFicha} en control de calidad
                  </span>
                </div>
                <span className="text-xs text-gray-500">Pendiente</span>
              </div>
            ))}
            {pedidosPendientes.slice(0, 2).map(pedido => (
              <div key={pedido.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-700">
                    Pedido de {pedido.cliente.nombre} esperando ficha técnica
                  </span>
                </div>
                <span className="text-xs text-gray-500">Nuevo</span>
              </div>
            ))}
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