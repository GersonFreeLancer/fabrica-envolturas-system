import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPool } from '../config/database.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    const pool = getPool();
    const result = await pool.query(
      'SELECT id, nombre, email, password_hash, rol, area, activo FROM usuarios WHERE email = $1 AND activo = true',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    // No enviar el hash de la contraseña
    const { password_hash, ...userWithoutPassword } = user;

    res.json({
      message: 'Login exitoso',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Verificar token
router.get('/verify', async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const pool = getPool();
    const result = await pool.query(
      'SELECT id, nombre, email, rol, area, activo FROM usuarios WHERE id = $1 AND activo = true',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no válido' });
    }

    res.json({ user: result.rows[0] });

  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(401).json({ error: 'Token inválido' });
  }
});

export default router;