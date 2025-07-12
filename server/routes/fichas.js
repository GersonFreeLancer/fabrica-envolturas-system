import express from 'express';
import { getPool } from '../config/database.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Obtener todas las fichas técnicas
router.get('/', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.query(`
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
        ft.inspeccion_calidad,
        p.id as pedido_id,
        p.descripcion as pedido_descripcion,
        p.cantidad as pedido_cantidad,
        p.fecha_entrega as pedido_fecha_entrega,
        p.especificaciones as pedido_especificaciones,
        c.id as cliente_id,
        c.nombre as cliente_nombre,
        c.email as cliente_email,
        u.nombre as jefe_nombre
      FROM fichas_tecnicas ft
      INNER JOIN pedidos p ON ft.pedido_id = p.id
      INNER JOIN clientes c ON p.cliente_id = c.id
      INNER JOIN usuarios u ON ft.jefe_produccion_id = u.id
      ORDER BY ft.fecha_creacion DESC
    `);

    const fichas = result.rows.map(row => ({
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
      inspeccionCalidad: row.inspeccion_calidad,
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
    const result = await pool.query(
      `INSERT INTO fichas_tecnicas (
        pedido_id, numero_ficha, jefe_produccion_id, tipo_envoltura,
        material, color, acabado, largo, ancho, grosor, cantidad_total, observaciones, estado
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'en_extrusion')
      RETURNING id`,
      [
        pedidoId, numeroFicha, jefeId, especificaciones.tipoEnvoltura,
        especificaciones.material, especificaciones.color, especificaciones.acabado,
        especificaciones.dimensiones.largo, especificaciones.dimensiones.ancho,
        especificaciones.dimensiones.grosor, especificaciones.cantidadTotal,
        especificaciones.observaciones || ''
      ]
    );

    // Actualizar estado del pedido
    await pool.query(
      'UPDATE pedidos SET estado = $1 WHERE id = $2',
      ['en_proceso', pedidoId]
    );

    res.status(201).json({
      message: 'Ficha técnica creada exitosamente',
      fichaId: result.rows[0].id,
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
    const { parametrosProduccion, cantidadProcesada, tiempoOperacion, observaciones, derivarCalidad } = req.body;
    const operarioId = req.user.id;

    const pool = getPool();

    // Insertar avance con parámetros específicos por área
    const parametrosJson = JSON.stringify(parametrosProduccion);

    await pool.query(
      `INSERT INTO avances_por_area (
        ficha_tecnica_id, area, operario_id, fecha_inicio, fecha_fin,
        temperatura, presion, velocidad, configuracion_maquina,
        cantidad_procesada, tiempo_operacion, observaciones, estado
      )
      VALUES ($1, $2, $3, NOW(), NOW(), NULL, NULL, NULL, $4, $5, $6, $7, 'completado')`,
      [id, area, operarioId, parametrosJson, cantidadProcesada, tiempoOperacion, observaciones || '']
    );

    // Determinar siguiente estado
    let nextState;
    if (derivarCalidad && area === 'impresion') {
      nextState = 'control_calidad';
    } else {
      const nextStates = {
        'extrusion': 'en_corte',
        'corte': 'en_laminado',
        'laminado': 'en_sellado',
        'sellado': 'en_impresion',
        'impresion': 'completada'
      };
      nextState = nextStates[area];
    }

    // Actualizar estado de la ficha
    if (nextState) {
      await pool.query(
        'UPDATE fichas_tecnicas SET estado = $1 WHERE id = $2',
        [nextState, id]
      );
    }

    res.json({ message: 'Avance registrado exitosamente', nextState });

  } catch (error) {
    console.error('Error registrando avance:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Registrar inspección de calidad (solo una vez)
router.post('/:id/inspeccion-calidad', authenticateToken, authorizeRoles('control_calidad', 'jefe_produccion'), async (req, res) => {
  try {
    const { id } = req.params;
    const { resultado, observaciones, defectosEncontrados, areaObservada } = req.body;
    const inspectorId = req.user.id;
    const inspectorNombre = req.user.nombre;

    const pool = getPool();

    // Verificar que la ficha no haya sido inspeccionada ya
    const fichaResult = await pool.query(
      'SELECT inspeccion_calidad FROM fichas_tecnicas WHERE id = $1',
      [id]
    );

    if (fichaResult.rows[0].inspeccion_calidad) {
      return res.status(400).json({ error: 'Esta ficha ya ha sido inspeccionada y no se puede modificar' });
    }

    // Crear objeto de inspección
    const inspeccionData = {
      inspectorId,
      inspectorNombre,
      fechaInspeccion: new Date().toISOString(),
      resultado,
      observaciones,
      defectosEncontrados: defectosEncontrados || [],
      areaObservada: areaObservada || null
    };

    // Actualizar la ficha con la inspección
    await pool.query(
      `UPDATE fichas_tecnicas 
       SET inspeccion_calidad = $1, estado = $2 
       WHERE id = $3`,
      [inspeccionData, resultado === 'aprobado' ? 'completada' : 'control_calidad', id]
    );

    // Si es rechazado o requiere revisión, actualizar estado del pedido
    if (resultado !== 'aprobado') {
      const pedidoResult = await pool.query(
        'SELECT pedido_id FROM fichas_tecnicas WHERE id = $1',
        [id]
      );

      if (pedidoResult.rows.length > 0) {
        await pool.query(
          'UPDATE pedidos SET estado = $1 WHERE id = $2',
          ['en_proceso', pedidoResult.rows[0].pedido_id]
        );
      }
    }

    res.json({
      message: 'Inspección de calidad registrada exitosamente',
      resultado,
      estado: resultado === 'aprobado' ? 'completada' : 'control_calidad'
    });

  } catch (error) {
    console.error('Error registrando inspección de calidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener avances de una ficha específica
router.get('/:id/avances', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();

    const result = await pool.query(
      `SELECT 
        apa.id,
        apa.area,
        apa.fecha_inicio,
        apa.fecha_fin,
        apa.configuracion_maquina as parametros_json,
        apa.cantidad_procesada,
        apa.tiempo_operacion,
        apa.observaciones,
        apa.estado,
        u.nombre as operario_nombre
      FROM avances_por_area apa
      INNER JOIN usuarios u ON apa.operario_id = u.id
      WHERE apa.ficha_tecnica_id = $1
      ORDER BY apa.fecha_inicio`,
      [id]
    );

    const avances = result.rows.map(row => ({
      id: row.id,
      area: row.area,
      operario: row.operario_nombre,
      fechaInicio: row.fecha_inicio,
      fechaFin: row.fecha_fin,
      parametros: row.parametros_json ? JSON.parse(row.parametros_json) : {},
      cantidadProcesada: row.cantidad_procesada,
      tiempoOperacion: row.tiempo_operacion,
      observaciones: row.observaciones,
      estado: row.estado
    }));

    res.json(avances);
  } catch (error) {
    console.error('Error obteniendo avances:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;