import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de la base de datos
const config = {
  host: process.env.DB_HOST || process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

async function runMigrations() {
  const pool = new Pool(config);
  
  try {
    console.log('🚀 Iniciando migraciones de base de datos...');
    
    // Conectar a la base de datos
    const client = await pool.connect();
    console.log('✅ Conectado a PostgreSQL');
    
    // Leer el archivo de migración
    const migrationPath = path.join(__dirname, 'init-database.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📄 Ejecutando script de migración...');
    
    // Ejecutar las migraciones
    await client.query(migrationSQL);
    
    console.log('✅ Migraciones ejecutadas correctamente');
    
    // Verificar que las tablas se crearon
    const tables = [
      'usuarios', 'clientes', 'pedidos', 'fichas_tecnicas', 
      'avances_por_area', 'informes_produccion', 'control_calidad'
    ];
    
    for (const table of tables) {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `, [table]);
      
      if (result.rows[0].exists) {
        console.log(`✅ Tabla '${table}' existe`);
      } else {
        console.log(`❌ Tabla '${table}' NO existe`);
      }
    }
    
    // Verificar datos de prueba
    const userCount = await client.query('SELECT COUNT(*) FROM usuarios');
    const clientCount = await client.query('SELECT COUNT(*) FROM clientes');
    const orderCount = await client.query('SELECT COUNT(*) FROM pedidos');
    
    console.log(`👥 Usuarios: ${userCount.rows[0].count}`);
    console.log(`🏢 Clientes: ${clientCount.rows[0].count}`);
    console.log(`📦 Pedidos: ${orderCount.rows[0].count}`);
    
    client.release();
    console.log('🎉 Migraciones completadas exitosamente');
    
  } catch (error) {
    console.error('❌ Error ejecutando migraciones:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrations()
    .then(() => {
      console.log('✅ Script de migración completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en script de migración:', error);
      process.exit(1);
    });
}

export { runMigrations }; 