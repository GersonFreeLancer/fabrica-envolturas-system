-- Crear base de datos
CREATE DATABASE FabricaEnvolturas;
USE FabricaEnvolturas;

-- Tabla de Usuarios
CREATE TABLE Usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) UNIQUE NOT NULL,
    password_hash NVARCHAR(255) NOT NULL,
    rol NVARCHAR(50) NOT NULL CHECK (rol IN ('jefe_produccion', 'operario_extrusion', 'operario_corte', 'operario_laminado', 'operario_sellado', 'operario_impresion', 'control_calidad')),
    area NVARCHAR(50) NULL,
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE()
);

-- Tabla de Clientes
CREATE TABLE Clientes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL,
    telefono NVARCHAR(20) NULL,
    direccion NVARCHAR(255) NULL,
    activo BIT DEFAULT 1,
    fecha_creacion DATETIME DEFAULT GETDATE()
);

-- Tabla de Pedidos
CREATE TABLE Pedidos (
    id INT IDENTITY(1,1) PRIMARY KEY,
    cliente_id INT NOT NULL,
    descripcion NVARCHAR(255) NOT NULL,
    cantidad INT NOT NULL,
    fecha_pedido DATETIME DEFAULT GETDATE(),
    fecha_entrega DATETIME NOT NULL,
    estado NVARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'completado')),
    especificaciones NTEXT NULL,
    FOREIGN KEY (cliente_id) REFERENCES Clientes(id)
);

-- Tabla de Fichas Técnicas
CREATE TABLE FichasTecnicas (
    id INT IDENTITY(1,1) PRIMARY KEY,
    pedido_id INT NOT NULL,
    numero_ficha NVARCHAR(50) UNIQUE NOT NULL,
    jefe_produccion_id INT NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    estado NVARCHAR(20) DEFAULT 'creada' CHECK (estado IN ('creada', 'en_extrusion', 'en_corte', 'en_laminado', 'en_sellado', 'en_impresion', 'control_calidad', 'completada')),
    tipo_envoltura NVARCHAR(100) NOT NULL,
    material NVARCHAR(100) NOT NULL,
    color NVARCHAR(50) NOT NULL,
    acabado NVARCHAR(50) NOT NULL,
    largo DECIMAL(10,2) NOT NULL,
    ancho DECIMAL(10,2) NOT NULL,
    grosor DECIMAL(10,3) NOT NULL,
    cantidad_total INT NOT NULL,
    observaciones NTEXT NULL,
    FOREIGN KEY (pedido_id) REFERENCES Pedidos(id),
    FOREIGN KEY (jefe_produccion_id) REFERENCES Usuarios(id)
);

-- Tabla de Avances por Área
CREATE TABLE AvancesPorArea (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ficha_tecnica_id INT NOT NULL,
    area NVARCHAR(20) NOT NULL CHECK (area IN ('extrusion', 'corte', 'laminado', 'sellado', 'impresion')),
    operario_id INT NOT NULL,
    fecha_inicio DATETIME NOT NULL,
    fecha_fin DATETIME NULL,
    temperatura DECIMAL(8,2) NULL,
    presion DECIMAL(8,2) NULL,
    velocidad DECIMAL(8,2) NULL,
    configuracion_maquina NVARCHAR(255) NULL,
    cantidad_procesada INT NOT NULL,
    tiempo_operacion INT NOT NULL, -- en minutos
    observaciones NTEXT NULL,
    estado NVARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'completado')),
    FOREIGN KEY (ficha_tecnica_id) REFERENCES FichasTecnicas(id),
    FOREIGN KEY (operario_id) REFERENCES Usuarios(id)
);

-- Tabla de Informes de Producción
CREATE TABLE InformesProduccion (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ficha_tecnica_id INT NOT NULL,
    fecha_generacion DATETIME DEFAULT GETDATE(),
    resumen_proceso NTEXT NOT NULL,
    tiempo_total_produccion INT NOT NULL, -- en minutos
    cantidad_total INT NOT NULL,
    observaciones_finales NTEXT NULL,
    FOREIGN KEY (ficha_tecnica_id) REFERENCES FichasTecnicas(id)
);

-- Tabla de Control de Calidad
CREATE TABLE ControlCalidad (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ficha_tecnica_id INT NOT NULL,
    inspector_id INT NOT NULL,
    fecha_inspeccion DATETIME DEFAULT GETDATE(),
    resultado NVARCHAR(20) NOT NULL CHECK (resultado IN ('aprobado', 'rechazado', 'revision')),
    observaciones NTEXT NOT NULL,
    defectos_encontrados NTEXT NULL,
    FOREIGN KEY (ficha_tecnica_id) REFERENCES FichasTecnicas(id),
    FOREIGN KEY (inspector_id) REFERENCES Usuarios(id)
);

-- Insertar datos de prueba
-- Usuarios (contraseña: 123456 - hash bcrypt)
INSERT INTO Usuarios (nombre, email, password_hash, rol, area) VALUES
('Carlos Mendoza', 'jefe@fabrica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'jefe_produccion', NULL),
('Ana García', 'extrusion@fabrica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'operario_extrusion', 'Extrusión'),
('Luis Rodríguez', 'corte@fabrica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'operario_corte', 'Corte'),
('María Torres', 'laminado@fabrica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'operario_laminado', 'Laminado'),
('Jorge Sánchez', 'sellado@fabrica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'operario_sellado', 'Sellado'),
('Carmen López', 'impresion@fabrica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'operario_impresion', 'Impresión'),
('Roberto Vega', 'calidad@fabrica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'control_calidad', NULL);

-- Clientes
INSERT INTO Clientes (nombre, email, telefono, direccion) VALUES
('Empresa ABC', 'contacto@abc.com', '555-0001', 'Av. Principal 123'),
('Corporación XYZ', 'ventas@xyz.com', '555-0002', 'Calle Comercial 456'),
('Industrias DEF', 'compras@def.com', '555-0003', 'Zona Industrial 789');

-- Pedidos
INSERT INTO Pedidos (cliente_id, descripcion, cantidad, fecha_entrega, especificaciones) VALUES
(1, 'Envolturas biodegradables para alimentos', 5000, '2024-02-15', 'Material PLA, alta resistencia, transparente'),
(2, 'Envolturas industriales resistentes', 3000, '2024-02-20', 'Polietileno reforzado, color azul'),
(3, 'Envolturas premium para cosméticos', 2000, '2024-02-25', 'Acabado brillante, impresión personalizada');

USE FabricaEnvolturas;
GO


select * from clientes
select * from usuarios
select * from ControlCalidad
select * from FichasTecnicas
select * from pedidos
select * from InformesProduccion
