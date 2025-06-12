import React from 'react';
import { Clock, User, FileText, CheckCircle } from 'lucide-react';

const RecentActivity: React.FC = () => {
  const activities = [
    {
      id: 1,
      type: 'ficha_creada',
      description: 'Nueva ficha técnica FT-2024-003 creada',
      user: 'Carlos Mendoza',
      time: 'hace 5 min',
      icon: FileText,
      color: 'blue'
    },
    {
      id: 2,
      type: 'proceso_completado',
      description: 'Proceso de extrusión completado para FT-2024-001',
      user: 'Ana García',
      time: 'hace 15 min',
      icon: CheckCircle,
      color: 'green'
    },
    {
      id: 3,
      type: 'usuario_asignado',
      description: 'Luis Rodríguez asignado a área de corte',
      user: 'Sistema',
      time: 'hace 32 min',
      icon: User,
      color: 'purple'
    },
    {
      id: 4,
      type: 'ficha_actualizada',
      description: 'Parámetros actualizados en FT-2024-002',
      user: 'María Torres',
      time: 'hace 1h',
      icon: FileText,
      color: 'orange'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Clock className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className={`p-2 rounded-lg ${colorClasses[activity.color as keyof typeof colorClasses]}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 font-medium mb-1">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">{activity.user}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
        Ver toda la actividad
      </button>
    </div>
  );
};

export default RecentActivity;