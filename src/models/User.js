import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

const User = {
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create({ name, email, password }) {
    const hashed = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), hashed]
    );
    return { id: result.insertId, name: name.trim(), email: email.toLowerCase().trim() };
  },

  async updateProfile(id, { name, email }) {
    const [result] = await pool.query(
      'UPDATE users SET name = ?, email = ? WHERE id = ?',
      [name.trim(), email.toLowerCase().trim(), id]
    );
    return result.affectedRows > 0;
  },

  async updatePassword(id, newPassword) {
    const hashed = await bcrypt.hash(newPassword, 12);
    const [result] = await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashed, id]
    );
    return result.affectedRows > 0;
  },

  async emailExists(email, excludeId = null) {
    let query = 'SELECT id FROM users WHERE email = ?';
    const params = [email.toLowerCase().trim()];

    if (excludeId) {
      query += ' AND id != ?';
      params.push(excludeId);
    }

    const [rows] = await pool.query(query, params);
    return rows.length > 0;
  },

  async comparePassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  },
};

export default User;
