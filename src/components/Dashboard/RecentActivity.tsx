import React from 'react';
import { Clock, User, FileText, CheckCircle, Factory } from 'lucide-react';
import { FichaTecnica } from '../../types';
import { formatDateTime } from '../../utils/formatters';

interface RecentActivityProps {
  fichas: FichaTecnica[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ fichas }) => {
  // Simular actividad reciente basada en las fichas
  const activities = fichas.slice(0, 4).map((ficha, index) => {
    const activityTypes = [
      {
        type: 'ficha_creada',
        description: `Nueva ficha técnica ${ficha.numeroFicha} creada`,
        user: 'Jefe de Producción',
        icon: FileText,
        color: 'blue'
      },
      {
        type: 'proceso_completado',
        description: `Proceso completado para ${ficha.numeroFicha}`,
        user: 'Operario',
        icon: CheckCircle,
        color: 'green'
      },
      {
        type: 'area_asignada',
        description: `${ficha.numeroFicha} asignada a área`,
        user: 'Sistema',
        icon: Factory,
        color: 'purple'
      },
      {
        type: 'ficha_actualizada',
        description: `Parámetros actualizados en ${ficha.numeroFicha}`,
        user: 'Operario',
        icon: User,
        color: 'orange'
      }
    ];

    return {
      id: ficha.id,
      ...activityTypes[index % activityTypes.length],
      time: formatDateTime(ficha.fechaCreacion)
    };
  });

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