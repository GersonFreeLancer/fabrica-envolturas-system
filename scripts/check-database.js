import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la base de datos
const config = {
  host: process.env.DB_HOST || process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT) || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
};

async function checkDatabase() {
  const pool = new Pool(config);
  
  try {
    console.log('🔍 Verificando estado de la base de datos...');
    
    // Conectar a la base de datos
    const client = await pool.connect();
    console.log('✅ Conectado a PostgreSQL');
    
    // Verificar tablas
    const tables = [
      'usuarios', 'clientes', 'pedidos', 'fichas_tecnicas', 
      'avances_por_area', 'informes_produccion', 'control_calidad'
    ];
    
    console.log('\n📊 Estado de las tablas:');
    for (const table of tables) {
      try {
        const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
        console.log(`✅ ${table}: ${result.rows[0].count} registros`);
      } catch (error) {
        console.log(`❌ ${table}: NO existe`);
      }
    }
    
    // Verificar conexión
    const version = await client.query('SELECT version()');
    console.log('\n🐘 Versión de PostgreSQL:', version.rows[0].version.split(' ')[0]);
    
    // Verificar variables de entorno
    console.log('\n🔧 Variables de entorno:');
    console.log(`Host: ${process.env.DB_HOST || 'No configurado'}`);
    console.log(`Database: ${process.env.DB_DATABASE || 'No configurado'}`);
    console.log(`User: ${process.env.DB_USER || 'No configurado'}`);
    console.log(`Port: ${process.env.DB_PORT || '5432'}`);
    console.log(`SSL: ${process.env.NODE_ENV === 'production' ? 'Habilitado' : 'Deshabilitado'}`);
    
    client.release();
    console.log('\n🎉 Verificación completada');
    
  } catch (error) {
    console.error('❌ Error verificando base de datos:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  checkDatabase()
    .then(() => {
      console.log('✅ Verificación completada exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en verificación:', error);
      process.exit(1);
    });
}

export { checkDatabase }; 