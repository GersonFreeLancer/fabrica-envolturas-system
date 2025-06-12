import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '../Dashboard/Dashboard';
import FichasList from '../FichasTecnicas/FichasList';
import FichaForm from '../FichasTecnicas/FichaForm';
import ProduccionView from '../Produccion/ProduccionView';
import PedidosList from '../Pedidos/PedidosList';
import { useAuth } from '../../contexts/AuthContext';
import { fichasService, pedidosService, clientesService } from '../../services/api';
import { FichaTecnica } from '../../types';

const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [fichas, setFichas] = useState<FichaTecnica[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [fichasData, pedidosData, clientesData] = await Promise.all([
        fichasService.getAll(),
        pedidosService.getAll(),
        clientesService.getAll()
      ]);
      
      setFichas(fichasData);
      setPedidos(pedidosData);
      setClientes(clientesData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFicha = async (data: any) => {
    try {
      await fichasService.create(data);
      loadData(); // Recargar datos
    } catch (error) {
      console.error('Error creando ficha:', error);
    }
  };

  const handleUpdateAvance = async (fichaId: number, area: string, data: any) => {
    try {
      await fichasService.updateAvance(fichaId, area, data);
      loadData(); // Recargar datos
    } catch (error) {
      console.error('Error actualizando avance:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        isCollapsed={sidebarCollapsed}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentUser={user}
        />
        
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route 
              path="/fichas" 
              element={
                <FichasList
                  fichas={fichas}
                  onCreateNew={() => {}}
                  onViewFicha={(ficha) => console.log('Ver ficha:', ficha)}
                  onEditFicha={(ficha) => console.log('Editar ficha:', ficha)}
                />
              } 
            />
            <Route 
              path="/fichas/nueva" 
              element={
                <FichaForm
                  clientes={clientes}
                  pedidos={pedidos.filter(p => p.estado === 'pendiente')}
                  onSave={handleCreateFicha}
                  onCancel={() => window.history.back()}
                />
              } 
            />
            <Route 
              path="/produccion" 
              element={
                <ProduccionView
                  fichas={fichas}
                  currentUser={user}
                  onUpdateAvance={handleUpdateAvance}
                />
              } 
            />
            <Route path="/pedidos" element={<PedidosList />} />
            <Route path="/calidad" element={<div className="p-6"><h1 className="text-2xl font-bold">Control de Calidad</h1></div>} />
            <Route path="/informes" element={<div className="p-6"><h1 className="text-2xl font-bold">Informes y Reportes</h1></div>} />
            <Route path="/usuarios" element={<div className="p-6"><h1 className="text-2xl font-bold">Gestión de Usuarios</h1></div>} />
            <Route path="/configuracion" element={<div className="p-6"><h1 className="text-2xl font-bold">Configuración del Sistema</h1></div>} />
            <Route path="*" element={<Navigate to="/\" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;