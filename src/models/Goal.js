import pool from '../config/db.js';

const Goal = {
  async findAllByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM goals WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows;
  },

  async findById(id, userId) {
    const [rows] = await pool.query(
      'SELECT * FROM goals WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0];
  },

  async create({ user_id, title, target_amount, current_amount, deadline }) {
    const [result] = await pool.query(
      'INSERT INTO goals (user_id, title, target_amount, current_amount, deadline) VALUES (?, ?, ?, ?, ?)',
      [user_id, title, target_amount, current_amount || 0, deadline]
    );
    return { id: result.insertId, user_id, title, target_amount, current_amount: current_amount || 0, deadline };
  },

  async update(id, userId, { title, target_amount, current_amount, deadline }) {
    const [result] = await pool.query(
      'UPDATE goals SET title = ?, target_amount = ?, current_amount = ?, deadline = ? WHERE id = ? AND user_id = ?',
      [title, target_amount, current_amount, deadline, id, userId]
    );
    return result.affectedRows > 0;
  },

  async delete(id, userId) {
    const [result] = await pool.query(
      'DELETE FROM goals WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  },
};

export default Goal;
