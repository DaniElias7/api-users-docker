import pool from './database.js'; 

const adminUser = {
  name: "admin",
  email: "admin@spsgroup.com.br",
  type: "admin",
  password: "1234"
};

/**
 * Initializes the database by creating the 'users' table if it doesn't exist
 * and inserting a default admin user if one is not found.
 */
async function initializeDatabaseSchemaAndUser() {
    let client;
    try {
        client = await pool.connect();
        console.log('Checking DB schema and admin user...');

        // Create users table if it doesn't exist
        await client.query(`
          CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            email VARCHAR(100) UNIQUE NOT NULL,
            name VARCHAR(100) NOT NULL,
            type VARCHAR(50) NOT NULL,
            password VARCHAR(100) NOT NULL
          );
        `);
        console.log('Users table checked/created.');

        // Check if admin user already exists
        const adminCheck = await client.query('SELECT * FROM users WHERE email = $1', [adminUser.email]);

        // If admin user does not exist, create it
        if (adminCheck.rows.length === 0) {
            await client.query(
              'INSERT INTO users (name, email, type, password) VALUES ($1, $2, $3, $4)',
              [adminUser.name, adminUser.email, adminUser.type, adminUser.password]
            );
            console.log('Admin User created.');
        } else {
             console.log('Admin user already exists.');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error; // Re-throw the error to calling code
    } finally {
        if (client) {
            client.release();
        }
    }
}

export default initializeDatabaseSchemaAndUser;