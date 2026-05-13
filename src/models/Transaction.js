import pool from '../config/db.js';

const Transaction = {
  async findAllByUser(userId, filters = {}) {
    let query = `
      SELECT t.*, c.name AS category_name
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
    `;
    const params = [userId];

    if (filters.type) {
      query += ' AND t.type = ?';
      params.push(filters.type);
    }
    if (filters.category_id) {
      query += ' AND t.category_id = ?';
      params.push(filters.category_id);
    }
    if (filters.start_date) {
      query += ' AND t.date >= ?';
      params.push(filters.start_date);
    }
    if (filters.end_date) {
      query += ' AND t.date <= ?';
      params.push(filters.end_date);
    }

    query += ' ORDER BY t.date DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  },

  async findById(id, userId) {
    const [rows] = await pool.query(
      'SELECT * FROM transactions WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return rows[0];
  },

  async create({ user_id, category_id, description, amount, type, date }) {
    const [result] = await pool.query(
      'INSERT INTO transactions (user_id, category_id, description, amount, type, date) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, category_id, description, amount, type, date]
    );
    return { id: result.insertId, user_id, category_id, description, amount, type, date };
  },

  async update(id, userId, { category_id, description, amount, type, date }) {
    const [result] = await pool.query(
      'UPDATE transactions SET category_id = ?, description = ?, amount = ?, type = ?, date = ? WHERE id = ? AND user_id = ?',
      [category_id, description, amount, type, date, id, userId]
    );
    return result.affectedRows > 0;
  },

  async delete(id, userId) {
    const [result] = await pool.query(
      'DELETE FROM transactions WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  async getSummaryByMonth(userId, year, month) {
    const [rows] = await pool.query(
      `SELECT
        SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
       FROM transactions
       WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ?`,
      [userId, year, month]
    );
    return rows[0];
  },
};

export default Transaction;
