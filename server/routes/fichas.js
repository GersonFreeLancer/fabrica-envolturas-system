import express from 'express';
import { getPool, sql } from '../config/database.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Obtener todas las fichas técnicas
router.get('/', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT 
        ft.id,
        ft.numero_ficha,
        ft.fecha_creacion,
        ft.estado,
        ft.tipo_envoltura,
        ft.material,
        ft.color,
        ft.acabado,
        ft.largo,
        ft.ancho,
        ft.grosor,
        ft.cantidad_total,
        ft.observaciones,
        p.id as pedido_id,
        p.descripcion as pedido_descripcion,
        p.cantidad as pedido_cantidad,
        p.fecha_entrega as pedido_fecha_entrega,
        p.especificaciones as pedido_especificaciones,
        c.id as cliente_id,
        c.nombre as cliente_nombre,
        c.email as cliente_email,
        u.nombre as jefe_nombre
      FROM FichasTecnicas ft
      INNER JOIN Pedidos p ON ft.pedido_id = p.id
      INNER JOIN Clientes c ON p.cliente_id = c.id
      INNER JOIN Usuarios u ON ft.jefe_produccion_id = u.id
      ORDER BY ft.fecha_creacion DESC
    `);

    const fichas = result.recordset.map(row => ({
      id: row.id,
      numeroFicha: row.numero_ficha,
      fechaCreacion: row.fecha_creacion,
      estado: row.estado,
      jefeProduccionId: row.jefe_produccion_id,
      especificaciones: {
        tipoEnvoltura: row.tipo_envoltura,
        material: row.material,
        color: row.color,
        acabado: row.acabado,
        dimensiones: {
          largo: row.largo,
          ancho: row.ancho,
          grosor: row.grosor
        },
        cantidadTotal: row.cantidad_total,
        observaciones: row.observaciones
      },
      pedido: {
        id: row.pedido_id,
        descripcion: row.pedido_descripcion,
        cantidad: row.pedido_cantidad,
        fechaEntrega: row.pedido_fecha_entrega,
        especificaciones: row.pedido_especificaciones,
        cliente: {
          id: row.cliente_id,
          nombre: row.cliente_nombre,
          email: row.cliente_email
        }
      },
      avances: []
    }));

    res.json(fichas);
  } catch (error) {
    console.error('Error obteniendo fichas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nueva ficha técnica
router.post('/', authenticateToken, authorizeRoles('jefe_produccion'), async (req, res) => {
  try {
    const { pedidoId, especificaciones } = req.body;
    const jefeId = req.user.id;

    // Generar número de ficha
    const year = new Date().getFullYear();
    const timestamp = Date.now().toString().slice(-3);
    const numeroFicha = `FT-${year}-${timestamp}`;

    const pool = getPool();
    const result = await pool.request()
      .input('pedido_id', sql.Int, pedidoId)
      .input('numero_ficha', sql.VarChar, numeroFicha)
      .input('jefe_produccion_id', sql.Int, jefeId)
      .input('tipo_envoltura', sql.VarChar, especificaciones.tipoEnvoltura)
      .input('material', sql.VarChar, especificaciones.material)
      .input('color', sql.VarChar, especificaciones.color)
      .input('acabado', sql.VarChar, especificaciones.acabado)
      .input('largo', sql.Decimal(10,2), especificaciones.dimensiones.largo)
      .input('ancho', sql.Decimal(10,2), especificaciones.dimensiones.ancho)
      .input('grosor', sql.Decimal(10,3), especificaciones.dimensiones.grosor)
      .input('cantidad_total', sql.Int, especificaciones.cantidadTotal)
      .input('observaciones', sql.Text, especificaciones.observaciones || '')
      .query(`
        INSERT INTO FichasTecnicas (
          pedido_id, numero_ficha, jefe_produccion_id, tipo_envoltura,
          material, color, acabado, largo, ancho, grosor, cantidad_total, observaciones, estado
        )
        OUTPUT INSERTED.id
        VALUES (
          @pedido_id, @numero_ficha, @jefe_produccion_id, @tipo_envoltura,
          @material, @color, @acabado, @largo, @ancho, @grosor, @cantidad_total, @observaciones, 'creada'
        )
      `);

    // Actualizar estado del pedido
    await pool.request()
      .input('pedido_id', sql.Int, pedidoId)
      .query('UPDATE Pedidos SET estado = \'en_proceso\' WHERE id = @pedido_id');

    res.status(201).json({
      message: 'Ficha técnica creada exitosamente',
      fichaId: result.recordset[0].id,
      numeroFicha
    });

  } catch (error) {
    console.error('Error creando ficha técnica:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar avance por área
router.put('/:id/avance/:area', authenticateToken, async (req, res) => {
  try {
    const { id, area } = req.params;
    const { parametrosProduccion, cantidadProcesada, tiempoOperacion, observaciones } = req.body;
    const operarioId = req.user.id;

    const pool = getPool();
    
    // Insertar avance
    await pool.request()
      .input('ficha_tecnica_id', sql.Int, id)
      .input('area', sql.VarChar, area)
      .input('operario_id', sql.Int, operarioId)
      .input('temperatura', sql.Decimal(8,2), parametrosProduccion.temperatura || null)
      .input('presion', sql.Decimal(8,2), parametrosProduccion.presion || null)
      .input('velocidad', sql.Decimal(8,2), parametrosProduccion.velocidad || null)
      .input('configuracion_maquina', sql.VarChar, parametrosProduccion.configuracionMaquina || null)
      .input('cantidad_procesada', sql.Int, cantidadProcesada)
      .input('tiempo_operacion', sql.Int, tiempoOperacion)
      .input('observaciones', sql.Text, observaciones || '')
      .query(`
        INSERT INTO AvancesPorArea (
          ficha_tecnica_id, area, operario_id, fecha_inicio, fecha_fin,
          temperatura, presion, velocidad, configuracion_maquina,
          cantidad_procesada, tiempo_operacion, observaciones, estado
        )
        VALUES (
          @ficha_tecnica_id, @area, @operario_id, GETDATE(), GETDATE(),
          @temperatura, @presion, @velocidad, @configuracion_maquina,
          @cantidad_procesada, @tiempo_operacion, @observaciones, 'completado'
        )
      `);

    // Actualizar estado de la ficha
    const nextStates = {
      'extrusion': 'en_corte',
      'corte': 'en_laminado',
      'laminado': 'en_sellado',
      'sellado': 'en_impresion',
      'impresion': 'control_calidad'
    };

    const nextState = nextStates[area];
    if (nextState) {
      await pool.request()
        .input('id', sql.Int, id)
        .input('estado', sql.VarChar, nextState)
        .query('UPDATE FichasTecnicas SET estado = @estado WHERE id = @id');
    }

    res.json({ message: 'Avance registrado exitosamente' });

  } catch (error) {
    console.error('Error registrando avance:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;