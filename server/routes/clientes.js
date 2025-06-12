import express from 'express';
import { getPool, sql } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Obtener todos los clientes
router.get('/', authenticateToken, async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT id, nombre, email, telefono, direccion, fecha_creacion
      FROM Clientes 
      WHERE activo = 1
      ORDER BY nombre
    `);

    res.json(result.recordset);
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
    const result = await pool.request()
      .input('nombre', sql.VarChar, nombre)
      .input('email', sql.VarChar, email)
      .input('telefono', sql.VarChar, telefono)
      .input('direccion', sql.VarChar, direccion)
      .query(`
        INSERT INTO Clientes (nombre, email, telefono, direccion)
        OUTPUT INSERTED.id
        VALUES (@nombre, @email, @telefono, @direccion)
      `);

    res.status(201).json({
      message: 'Cliente creado exitosamente',
      clienteId: result.recordset[0].id
    });

  } catch (error) {
    console.error('Error creando cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;