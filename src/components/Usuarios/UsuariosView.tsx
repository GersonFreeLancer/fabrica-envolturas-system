import React from 'react';
import { Users, UserPlus, Shield, Settings } from 'lucide-react';

interface UsuariosViewProps {
    currentUser: any;
}

const UsuariosView: React.FC<UsuariosViewProps> = ({ currentUser }) => {
    const usuarios = [
        { id: 1, nombre: 'Carlos Mendoza', email: 'jefe@fabrica.com', rol: 'jefe_produccion', area: 'Administración', activo: true },
        { id: 2, nombre: 'Ana García', email: 'extrusion@fabrica.com', rol: 'operario_extrusion', area: 'Extrusión', activo: true },
        { id: 3, nombre: 'Luis Rodríguez', email: 'corte@fabrica.com', rol: 'operario_corte', area: 'Corte', activo: true },
        { id: 4, nombre: 'María Torres', email: 'laminado@fabrica.com', rol: 'operario_laminado', area: 'Laminado', activo: true },
        { id: 5, nombre: 'Jorge Sánchez', email: 'sellado@fabrica.com', rol: 'operario_sellado', area: 'Sellado', activo: true },
        { id: 6, nombre: 'Carmen López', email: 'impresion@fabrica.com', rol: 'operario_impresion', area: 'Impresión', activo: true },
        { id: 7, nombre: 'Roberto Vega', email: 'calidad@fabrica.com', rol: 'control_calidad', area: 'Calidad', activo: true }
    ];

    const getRolLabel = (rol: string) => {
        const labels = {
            'jefe_produccion': 'Jefe de Producción',
            'operario_extrusion': 'Operario Extrusión',
            'operario_corte': 'Operario Corte',
            'operario_laminado': 'Operario Laminado',
            'operario_sellado': 'Operario Sellado',
            'operario_impresion': 'Operario Impresión',
            'control_calidad': 'Control de Calidad'
        };
        return labels[rol as keyof typeof labels] || rol;
    };

    const getRolColor = (rol: string) => {
        const colors = {
            'jefe_produccion': 'bg-purple-100 text-purple-800',
            'operario_extrusion': 'bg-blue-100 text-blue-800',
            'operario_corte': 'bg-orange-100 text-orange-800',
            'operario_laminado': 'bg-pink-100 text-pink-800',
            'operario_sellado': 'bg-indigo-100 text-indigo-800',
            'operario_impresion': 'bg-teal-100 text-teal-800',
            'control_calidad': 'bg-green-100 text-green-800'
        };
        return colors[rol as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const canManageUsers = currentUser?.rol === 'jefe_produccion';

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                    <p className="text-gray-600 mt-1">Administra los usuarios del sistema</p>
                </div>
                {canManageUsers && (
                    <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <UserPlus className="w-4 h-4" />
                        <span>Nuevo Usuario</span>
                    </button>
                )}
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Total Usuarios</p>
                            <p className="text-xl font-bold text-gray-900">{usuarios.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Usuarios Activos</p>
                            <p className="text-xl font-bold text-gray-900">{usuarios.filter(u => u.activo).length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Settings className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Operarios</p>
                            <p className="text-xl font-bold text-gray-900">
                                {usuarios.filter(u => u.rol.startsWith('operario_')).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Supervisores</p>
                            <p className="text-xl font-bold text-gray-900">
                                {usuarios.filter(u => ['jefe_produccion', 'control_calidad'].includes(u.rol)).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de Usuarios */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Lista de Usuarios</h3>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Usuario</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Rol</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Área</th>
                                <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                                {canManageUsers && (
                                    <th className="text-right py-3 px-4 font-medium text-gray-900">Acciones</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">
                                                    {usuario.nombre.split(' ').map(n => n[0]).join('')}
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-900">{usuario.nombre}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {usuario.email}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRolColor(usuario.rol)}`}>
                                            {getRolLabel(usuario.rol)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600">
                                        {usuario.area}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${usuario.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {usuario.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </td>
                                    {canManageUsers && (
                                        <td className="py-4 px-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Editar">
                                                    <Settings className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {!canManageUsers && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                        <Shield className="w-4 h-4 inline mr-2" />
                        Solo los jefes de producción pueden gestionar usuarios.
                    </p>
                </div>
            )}
        </div>
    );
};

export default UsuariosView;