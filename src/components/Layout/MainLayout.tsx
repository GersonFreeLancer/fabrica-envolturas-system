import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from '../Dashboard/Dashboard';
import FichasList from '../FichasTecnicas/FichasList';
import FichaForm from '../FichasTecnicas/FichaForm';
import FichaDetail from '../FichasTecnicas/FichaDetail';
import ProcessForm from '../FichasTecnicas/ProcessForm';
import ProduccionView from '../Produccion/ProduccionView';
import PedidosList from '../Pedidos/PedidosList';
import CalidadView from '../Calidad/CalidadView';
import InformesView from '../Informes/InformesView';
import UsuariosView from '../Usuarios/UsuariosView';
import ConfiguracionView from '../Configuracion/ConfiguracionView';
import { useAuth } from '../../contexts/AuthContext';
import { fichasService, pedidosService, clientesService } from '../../services/api';
import { FichaTecnica } from '../../types';

const MainLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [fichas, setFichas] = useState<FichaTecnica[]>([]);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'list' | 'form' | 'detail' | 'process'>('list');
  const [selectedFicha, setSelectedFicha] = useState<FichaTecnica | null>(null);
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
      await loadData();
      setCurrentView('list');
    } catch (error) {
      console.error('Error creando ficha:', error);
    }
  };

  const handleProcessFicha = async (data: any) => {
    try {
      if (!selectedFicha) return;

      await fichasService.updateAvance(selectedFicha.id, data.area, data);
      await loadData();
      setCurrentView('list');
      setSelectedFicha(null);
    } catch (error) {
      console.error('Error procesando ficha:', error);
    }
  };

  const handleUpdateAvance = async (fichaId: number, area: string, data: any) => {
    try {
      await fichasService.updateAvance(fichaId, area, data);
      await loadData();
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
      <Sidebar isCollapsed={sidebarCollapsed} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentUser={user}
        />

        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard fichas={fichas} pedidos={pedidos} />} />

            <Route
              path="/fichas"
              element={
                currentView === 'form' ? (
                  <FichaForm
                    clientes={clientes}
                    pedidos={pedidos.filter(p => p.estado === 'pendiente')}
                    onSave={handleCreateFicha}
                    onCancel={() => setCurrentView('list')}
                  />
                ) : currentView === 'detail' && selectedFicha ? (
                  <FichaDetail
                    ficha={selectedFicha}
                    onBack={() => setCurrentView('list')}
                    onUpdateAvance={handleUpdateAvance}
                    currentUser={user}
                  />
                ) : currentView === 'process' && selectedFicha ? (
                  <ProcessForm
                    ficha={selectedFicha}
                    currentUser={user}
                    onSave={handleProcessFicha}
                    onCancel={() => {
                      setCurrentView('list');
                      setSelectedFicha(null);
                    }}
                  />
                ) : (
                  <FichasList
                    fichas={fichas}
                    currentUser={user}
                    onCreateNew={() => setCurrentView('form')}
                    onViewFicha={(ficha) => {
                      setSelectedFicha(ficha);
                      setCurrentView('detail');
                    }}
                    onEditFicha={(ficha) => {
                      setSelectedFicha(ficha);
                      setCurrentView('detail');
                    }}
                    onProcessFicha={(ficha) => {
                      setSelectedFicha(ficha);
                      setCurrentView('process');
                    }}
                  />
                )
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

            <Route
              path="/pedidos"
              element={
                <PedidosList
                  pedidos={pedidos}
                  onCreateFicha={(pedidoId) => {
                    // Navegar a crear ficha con pedido preseleccionado
                    setCurrentView('form');
                  }}
                  onRefresh={loadData}
                />
              }
            />

            <Route
              path="/calidad"
              element={
                <CalidadView
                  fichas={fichas.filter(f => f.estado === 'control_calidad')}
                  currentUser={user}
                  onUpdateFicha={loadData}
                />
              }
            />

            <Route
              path="/informes"
              element={<InformesView fichas={fichas} />}
            />

            <Route
              path="/usuarios"
              element={<UsuariosView currentUser={user} />}
            />

            <Route
              path="/configuracion"
              element={<ConfiguracionView currentUser={user} />}
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;