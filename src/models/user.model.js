import pool from '../config/database.js';

class UserModel {
  async createUser(userData) {
    const { email, name, type, password } = userData;
    const query = `
      INSERT INTO users (email, name, type, password)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, name, type;
    `;
    const values = [email, name, type, password]; // Do not need to hash password
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async getUserByEmail(email) {
    const query = `
      SELECT * FROM users WHERE email = $1;
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  async getUserById(id) {
    const query = `
      SELECT id, email, name, type FROM users WHERE id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  async getAllUsers() {
    const query = `
      SELECT id, email, name, type FROM users;
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  async updateUser(id, userData) {
    const { email, name, type, password } = userData;
    let query = `
      UPDATE users SET email = $1, name = $2, type = $3
    `;
    const values = [email, name, type];
    if (password) {
      query += `, password = $${values.length + 1}`; // En producción, la contraseña debería ser hasheada
      values.push(password);
    }
    query += ` WHERE id = $${values.length + 1} RETURNING id, email, name, type;`;
    values.push(id);
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async deleteUser(id) {
    const query = `
      DELETE FROM users WHERE id = $1 RETURNING id;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

export default new UserModel();