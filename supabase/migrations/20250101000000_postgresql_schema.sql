-- Crear base de datos (esto se hace automáticamente en Railway)
-- CREATE DATABASE fabrica_envolturas;

-- Tabla de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL CHECK (rol IN ('jefe_produccion', 'operario_extrusion', 'operario_corte', 'operario_laminado', 'operario_sellado', 'operario_impresion', 'control_calidad')),
    area VARCHAR(50) NULL,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    telefono VARCHAR(20) NULL,
    direccion VARCHAR(255) NULL,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id SERIAL PRIMARY KEY,
    cliente_id INTEGER NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    cantidad INTEGER NOT NULL,
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega TIMESTAMP NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'completado')),
    especificaciones TEXT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Tabla de Fichas Técnicas
CREATE TABLE IF NOT EXISTS fichas_tecnicas (
    id SERIAL PRIMARY KEY,
    pedido_id INTEGER NOT NULL,
    numero_ficha VARCHAR(50) UNIQUE NOT NULL,
    jefe_produccion_id INTEGER NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'creada' CHECK (estado IN ('creada', 'en_extrusion', 'en_corte', 'en_laminado', 'en_sellado', 'en_impresion', 'control_calidad', 'completada')),
    tipo_envoltura VARCHAR(100) NOT NULL,
    material VARCHAR(100) NOT NULL,
    color VARCHAR(50) NOT NULL,
    acabado VARCHAR(50) NOT NULL,
    largo DECIMAL(10,2) NOT NULL,
    ancho DECIMAL(10,2) NOT NULL,
    grosor DECIMAL(10,3) NOT NULL,
    cantidad_total INTEGER NOT NULL,
    observaciones TEXT NULL,
    inspeccion_calidad JSONB NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (jefe_produccion_id) REFERENCES usuarios(id)
);

-- Tabla de Avances por Área
CREATE TABLE IF NOT EXISTS avances_por_area (
    id SERIAL PRIMARY KEY,
    ficha_tecnica_id INTEGER NOT NULL,
    area VARCHAR(20) NOT NULL CHECK (area IN ('extrusion', 'corte', 'laminado', 'sellado', 'impresion')),
    operario_id INTEGER NOT NULL,
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NULL,
    temperatura DECIMAL(8,2) NULL,
    presion DECIMAL(8,2) NULL,
    velocidad DECIMAL(8,2) NULL,
    configuracion_maquina TEXT NULL,
    cantidad_procesada INTEGER NOT NULL,
    tiempo_operacion INTEGER NOT NULL, -- en minutos
    observaciones TEXT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'en_proceso', 'completado')),
    FOREIGN KEY (ficha_tecnica_id) REFERENCES fichas_tecnicas(id),
    FOREIGN KEY (operario_id) REFERENCES usuarios(id)
);

-- Tabla de Informes de Producción
CREATE TABLE IF NOT EXISTS informes_produccion (
    id SERIAL PRIMARY KEY,
    ficha_tecnica_id INTEGER NOT NULL,
    fecha_generacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resumen_proceso TEXT NOT NULL,
    tiempo_total_produccion INTEGER NOT NULL, -- en minutos
    cantidad_total INTEGER NOT NULL,
    observaciones_finales TEXT NULL,
    FOREIGN KEY (ficha_tecnica_id) REFERENCES fichas_tecnicas(id)
);

-- Tabla de Control de Calidad
CREATE TABLE IF NOT EXISTS control_calidad (
    id SERIAL PRIMARY KEY,
    ficha_tecnica_id INTEGER NOT NULL,
    inspector_id INTEGER NOT NULL,
    fecha_inspeccion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resultado VARCHAR(20) NOT NULL CHECK (resultado IN ('aprobado', 'rechazado', 'revision')),
    observaciones TEXT NOT NULL,
    defectos_encontrados JSONB NULL,
    FOREIGN KEY (ficha_tecnica_id) REFERENCES fichas_tecnicas(id),
    FOREIGN KEY (inspector_id) REFERENCES usuarios(id)
);

-- Insertar datos de prueba
-- Usuarios (contraseña: 123456 - hash bcrypt)
INSERT INTO usuarios (nombre, email, password_hash, rol, area) VALUES
('Carlos Mendoza', 'jefe@fabrica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'jefe_produccion', NULL),
('Ana García', 'extrusion@fabrica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'operario_extrusion', 'Extrusión'),
('Luis Rodríguez', 'corte@fabrica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'operario_corte', 'Corte'),
('María Torres', 'laminado@fabrica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'operario_laminado', 'Laminado'),
('Jorge Sánchez', 'sellado@fabrica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'operario_sellado', 'Sellado'),
('Carmen López', 'impresion@fabrica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'operario_impresion', 'Impresión'),
('Roberto Vega', 'calidad@fabrica.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'control_calidad', NULL)
ON CONFLICT (email) DO NOTHING;

-- Clientes
INSERT INTO clientes (nombre, email, telefono, direccion) VALUES
('Empresa ABC', 'contacto@abc.com', '555-0001', 'Av. Principal 123'),
('Corporación XYZ', 'ventas@xyz.com', '555-0002', 'Calle Comercial 456'),
('Industrias DEF', 'compras@def.com', '555-0003', 'Zona Industrial 789'),
('Empresa Peru2', 'contacto@peru.com', '555-0001', 'Av. Lima')
ON CONFLICT (email) DO NOTHING;

-- Pedidos
INSERT INTO pedidos (cliente_id, descripcion, cantidad, fecha_entrega, especificaciones) VALUES
(1, 'Envolturas biodegradables para alimentos', 5000, '2024-02-15', 'Material PLA, alta resistencia, transparente'),
(2, 'Envolturas industriales resistentes', 3000, '2024-02-20', 'Polietileno reforzado, color azul'),
(3, 'Envolturas premium para cosméticos', 2000, '2024-02-25', 'Acabado brillante, impresión personalizada')
ON CONFLICT DO NOTHING;

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_id ON pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_fichas_tecnicas_pedido_id ON fichas_tecnicas(pedido_id);
CREATE INDEX IF NOT EXISTS idx_fichas_tecnicas_estado ON fichas_tecnicas(estado);
CREATE INDEX IF NOT EXISTS idx_avances_ficha_tecnica_id ON avances_por_area(ficha_tecnica_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol); 