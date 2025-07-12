import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const config = {
  host: process.env.DB_HOST || process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

let pool;

export const connectDB = async () => {
  try {
    if (!pool) {
      pool = new Pool(config);
      
      // Probar la conexión
      const client = await pool.connect();
      console.log('✅ Conectado a PostgreSQL');
      client.release();
    }
    return pool;
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    throw error;
  }
};

export const getPool = () => {
  if (!pool) {
    throw new Error('Base de datos no inicializada');
  }
  return pool;
};

export { Pool };