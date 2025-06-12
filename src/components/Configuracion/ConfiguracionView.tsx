import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Database, Palette } from 'lucide-react';

interface ConfiguracionViewProps {
    currentUser: any;
}

const ConfiguracionView: React.FC<ConfiguracionViewProps> = ({ currentUser }) => {
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: false,
            fichaCompleted: true,
            qualityAlert: true
        },
        system: {
            autoBackup: true,
            maintenanceMode: false,
            debugMode: false
        },
        appearance: {
            theme: 'light',
            language: 'es',
            dateFormat: 'dd/mm/yyyy'
        }
    });

    const canManageSystem = currentUser?.rol === 'jefe_produccion';

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'notifications', label: 'Notificaciones', icon: Bell },
        { id: 'security', label: 'Seguridad', icon: Shield },
        { id: 'system', label: 'Sistema', icon: Database, adminOnly: true },
        { id: 'appearance', label: 'Apariencia', icon: Palette }
    ];

    const handleSave = () => {
        console.log('Guardando configuración:', settings);
        // Aquí implementarías la lógica para guardar la configuración
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Configuración del Sistema</h1>
                    <p className="text-gray-600 mt-1">Personaliza las preferencias del sistema</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Save className="w-4 h-4" />
                    <span>Guardar Cambios</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar de Tabs */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        <nav className="space-y-2">
                            {tabs.map((tab) => {
                                if (tab.adminOnly && !canManageSystem) return null;

                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${activeTab === tab.id
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                            : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span className="text-sm font-medium">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Contenido de Configuración */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        {activeTab === 'general' && (
                            <GeneralSettings currentUser={currentUser} />
                        )}

                        {activeTab === 'notifications' && (
                            <NotificationSettings
                                settings={settings.notifications}
                                onChange={(notifications) => setSettings(prev => ({ ...prev, notifications }))}
                            />
                        )}

                        {activeTab === 'security' && (
                            <SecuritySettings currentUser={currentUser} />
                        )}

                        {activeTab === 'system' && canManageSystem && (
                            <SystemSettings
                                settings={settings.system}
                                onChange={(system) => setSettings(prev => ({ ...prev, system }))}
                            />
                        )}

                        {activeTab === 'appearance' && (
                            <AppearanceSettings
                                settings={settings.appearance}
                                onChange={(appearance) => setSettings(prev => ({ ...prev, appearance }))}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente de Configuración General
const GeneralSettings: React.FC<{ currentUser: any }> = ({ currentUser }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información del Usuario</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                        <input
                            type="text"
                            value={currentUser?.nombre || ''}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={currentUser?.email || ''}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                        <input
                            type="text"
                            value={currentUser?.rol?.replace('_', ' ') || ''}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                            readOnly
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Área</label>
                        <input
                            type="text"
                            value={currentUser?.area || 'No asignada'}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
                            readOnly
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente de Configuración de Notificaciones
const NotificationSettings: React.FC<{
    settings: any;
    onChange: (settings: any) => void;
}> = ({ settings, onChange }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencias de Notificaciones</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Notificaciones por Email</p>
                            <p className="text-sm text-gray-600">Recibir notificaciones importantes por correo</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.email}
                            onChange={(e) => onChange({ ...settings, email: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Ficha Completada</p>
                            <p className="text-sm text-gray-600">Notificar cuando se complete una ficha técnica</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.fichaCompleted}
                            onChange={(e) => onChange({ ...settings, fichaCompleted: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Alertas de Calidad</p>
                            <p className="text-sm text-gray-600">Notificar sobre problemas de control de calidad</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.qualityAlert}
                            onChange={(e) => onChange({ ...settings, qualityAlert: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente de Configuración de Seguridad
const SecuritySettings: React.FC<{ currentUser: any }> = ({ currentUser }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Seguridad</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cambiar Contraseña</label>
                        <div className="space-y-3">
                            <input
                                type="password"
                                placeholder="Contraseña actual"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="password"
                                placeholder="Nueva contraseña"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <input
                                type="password"
                                placeholder="Confirmar nueva contraseña"
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <button className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Actualizar Contraseña
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente de Configuración del Sistema
const SystemSettings: React.FC<{
    settings: any;
    onChange: (settings: any) => void;
}> = ({ settings, onChange }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración del Sistema</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Respaldo Automático</p>
                            <p className="text-sm text-gray-600">Realizar respaldos automáticos de la base de datos</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.autoBackup}
                            onChange={(e) => onChange({ ...settings, autoBackup: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-900">Modo de Mantenimiento</p>
                            <p className="text-sm text-gray-600">Activar modo de mantenimiento del sistema</p>
                        </div>
                        <input
                            type="checkbox"
                            checked={settings.maintenanceMode}
                            onChange={(e) => onChange({ ...settings, maintenanceMode: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

// Componente de Configuración de Apariencia
const AppearanceSettings: React.FC<{
    settings: any;
    onChange: (settings: any) => void;
}> = ({ settings, onChange }) => {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuración de Apariencia</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tema</label>
                        <select
                            value={settings.theme}
                            onChange={(e) => onChange({ ...settings, theme: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="light">Claro</option>
                            <option value="dark">Oscuro</option>
                            <option value="auto">Automático</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Idioma</label>
                        <select
                            value={settings.language}
                            onChange={(e) => onChange({ ...settings, language: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="es">Español</option>
                            <option value="en">English</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Formato de Fecha</label>
                        <select
                            value={settings.dateFormat}
                            onChange={(e) => onChange({ ...settings, dateFormat: e.target.value })}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                            <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                            <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfiguracionView;