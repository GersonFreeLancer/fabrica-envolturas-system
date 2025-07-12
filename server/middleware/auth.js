import jwt from 'jsonwebtoken';
import { getPool } from '../config/database.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Verificar que el usuario existe en la base de datos
    const pool = getPool();
    const result = await pool.query(
      'SELECT id, nombre, email, rol, area, activo FROM usuarios WHERE id = $1 AND activo = true',
      [decoded.id]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuario no válido' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(403).json({ error: 'Token no válido' });
  }
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }
    next();
  };
};