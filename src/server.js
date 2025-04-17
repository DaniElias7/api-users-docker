import app from './app.js';
import dotenv from 'dotenv';
import pool from './config/database.js';

dotenv.config();

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    // Check DB connection
    await pool.connect();
    console.log('Conectado a la base de datos PostgreSQL');

    // Create users table if it doesn't exist and add the admin user
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(100) UNIQUE NOT NULL,
          name VARCHAR(100) NOT NULL,
          type VARCHAR(50) NOT NULL,
          password VARCHAR(100) NOT NULL
        );
      `);

      const adminCheck = await client.query('SELECT * FROM users WHERE email = $1', [adminUser.email]);
      if (adminCheck.rows.length === 0) {
        await client.query(
          'INSERT INTO users (name, email, type, password) VALUES ($1, $2, $3, $4)',
          [adminUser.name, adminUser.email, adminUser.type, adminUser.password]
        );
        console.log('Usuario administrador inicial creado.');
      }
    } finally {
      client.release();
    }

    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

startServer();

const adminUser = {
  name: "admin",
  email: "admin@spsgroup.com.br",
  type: "admin",
  password: "1234"
};