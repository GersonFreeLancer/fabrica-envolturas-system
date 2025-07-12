/*
  # Agregar columna para inspección de calidad

  1. Modificaciones a la tabla
    - Agregar columna `inspeccion_calidad` a la tabla `FichasTecnicas`
    - La columna almacenará datos JSON con la información de la inspección

  2. Funcionalidad
    - Permite almacenar una única inspección de calidad por ficha
    - Datos incluyen inspector, fecha, resultado, observaciones y defectos
    - Una vez registrada, la inspección no se puede modificar
*/

-- Agregar columna para almacenar datos de inspección de calidad
ALTER TABLE FichasTecnicas 
ADD inspeccion_calidad NTEXT NULL;

-- Crear tabla para reportes de observaciones (opcional, para futuras mejoras)
CREATE TABLE ReportesObservaciones (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ficha_id INT NOT NULL,
    numero_ficha NVARCHAR(50) NOT NULL,
    tipo NVARCHAR(50) DEFAULT 'observacion_calidad',
    area NVARCHAR(50) NOT NULL,
    resultado NVARCHAR(20) NOT NULL,
    observaciones NTEXT NOT NULL,
    defectos NTEXT NULL, -- JSON array de defectos
    inspector NVARCHAR(100) NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    estado NVARCHAR(20) DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'atendido')),
    accion_correctiva NTEXT NULL,
    fecha_correccion DATETIME NULL,
    responsable_correccion NVARCHAR(100) NULL,
    FOREIGN KEY (ficha_id) REFERENCES FichasTecnicas(id)
);