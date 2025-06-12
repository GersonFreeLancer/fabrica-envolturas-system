import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Package, 
  Users, 
  BarChart3, 
  Settings,
  Factory,
  ClipboardCheck
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: '/', label: 'Dashboard', icon: Home },
    { id: '/fichas', label: 'Fichas Técnicas', icon: FileText },
    { id: '/pedidos', label: 'Pedidos', icon: Package },
    { id: '/produccion', label: 'Producción', icon: Factory },
    { id: '/calidad', label: 'Control Calidad', icon: ClipboardCheck },
    { id: '/informes', label: 'Informes', icon: BarChart3 },
    { id: '/usuarios', label: 'Usuarios', icon: Users },
    { id: '/configuracion', label: 'Configuración', icon: Settings }
  ];

  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen`}>
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-8">
          <Factory className="w-8 h-8 text-blue-400" />
          {!isCollapsed && (
            <div>
              <h1 className="text-xl font-bold">FabriFlow</h1>
              <p className="text-sm text-slate-400">Sistema de Gestión</p>
            </div>
          )}
        </div>
        
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;