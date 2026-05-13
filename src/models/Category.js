import pool from '../config/db.js';

const Category = {
  async findAllByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE user_id = ? OR user_id IS NULL ORDER BY name',
      [userId]
    );
    return rows;
  },

  async findById(id, userId) {
    const [rows] = await pool.query(
      'SELECT * FROM categories WHERE id = ? AND (user_id = ? OR user_id IS NULL)',
      [id, userId]
    );
    return rows[0];
  },

  async create({ user_id, name, type, color, icon }) {
    const [result] = await pool.query(
      'INSERT INTO categories (user_id, name, type, color, icon) VALUES (?, ?, ?, ?, ?)',
      [user_id, name, type, color, icon]
    );
    return { id: result.insertId, user_id, name, type, color, icon };
  },

  async update(id, userId, { name, type, color, icon }) {
    const [result] = await pool.query(
      'UPDATE categories SET name = ?, type = ?, color = ?, icon = ? WHERE id = ? AND user_id = ?',
      [name, type, color, icon, id, userId]
    );
    return result.affectedRows > 0;
  },

  async delete(id, userId) {
    const [result] = await pool.query(
      'DELETE FROM categories WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  },
};

export default Category;
