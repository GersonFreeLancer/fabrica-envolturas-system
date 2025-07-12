import express from 'express';
import { getPool } from '../config/database.js';
import { authenticateToken, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los pedidos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.query(`
      SELECT 
        p.id,
        p.descripcion,
        p.cantidad,
        p.fecha_pedido,
        p.fecha_entrega,
        p.estado,
        p.especificaciones,
        c.id as cliente_id,
        c.nombre as cliente_nombre,
        c.email as cliente_email,
        c.telefono as cliente_telefono,
        c.direccion as cliente_direccion
      FROM pedidos p
      INNER JOIN clientes c ON p.cliente_id = c.id
      ORDER BY p.fecha_pedido DESC
    `);

    const pedidos = result.rows.map(row => ({
      id: row.id,
      descripcion: row.descripcion,
      cantidad: row.cantidad,
      fechaPedido: row.fecha_pedido,
      fechaEntrega: row.fecha_entrega,
      estado: row.estado,
      especificaciones: row.especificaciones,
      cliente: {
        id: row.cliente_id,
        nombre: row.cliente_nombre,
        email: row.cliente_email,
        telefono: row.cliente_telefono,
        direccion: row.cliente_direccion
      }
    }));

    res.json(pedidos);
  } catch (error) {
    console.error('Error obteniendo pedidos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo pedido
router.post('/', authenticateToken, authorizeRoles('jefe_produccion'), async (req, res) => {
  try {
    const { clienteId, descripcion, cantidad, fechaEntrega, especificaciones } = req.body;

    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO pedidos (cliente_id, descripcion, cantidad, fecha_entrega, especificaciones, estado)
       VALUES ($1, $2, $3, $4, $5, 'pendiente')
       RETURNING id`,
      [clienteId, descripcion, cantidad, new Date(fechaEntrega), especificaciones]
    );

    const pedidoId = result.rows[0].id;

    res.status(201).json({
      message: 'Pedido creado exitosamente',
      pedidoId
    });

  } catch (error) {
    console.error('Error creando pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Actualizar estado del pedido
router.put('/:id/estado', authenticateToken, authorizeRoles('jefe_produccion'), async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const pool = getPool();
    await pool.query(
      'UPDATE pedidos SET estado = $1 WHERE id = $2',
      [estado, id]
    );

    res.json({ message: 'Estado del pedido actualizado' });

  } catch (error) {
    console.error('Error actualizando pedido:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;