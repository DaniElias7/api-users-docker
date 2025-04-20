import app from './app.js';
import dotenv from 'dotenv';
import pool from './config/database.js';
import initializeDatabaseSchemaAndUser from './config/db_init.js';

dotenv.config();

const port = process.env.PORT || 5000;

async function startServer() {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL DB');

    await initializeDatabaseSchemaAndUser();

    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
    process.exit(1); // exit if critical error
  }
}

startServer();