import express from 'express';
import { getPool } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los clientes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.query(`
      SELECT id, nombre, email, telefono, direccion, fecha_creacion
      FROM clientes 
      WHERE activo = true
      ORDER BY nombre
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo clientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear nuevo cliente
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { nombre, email, telefono, direccion } = req.body;

    const pool = getPool();
    const result = await pool.query(
      `INSERT INTO clientes (nombre, email, telefono, direccion)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [nombre, email, telefono, direccion]
    );

    res.status(201).json({
      message: 'Cliente creado exitosamente',
      clienteId: result.rows[0].id
    });

  } catch (error) {
    console.error('Error creando cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;