import pool from '../config/db.js';

// Fragment reutilizado em findAllByUser e findById
const SELECT_WITH_LIMIT = `
  SELECT c.*,
    COALESCE(SUM(
      (i.installment_count - i.paid_count) * i.installment_value
    ), 0) AS total_remaining,
    GREATEST(
      c.limit_amount - COALESCE(SUM(
        (i.installment_count - i.paid_count) * i.installment_value
      ), 0),
      0
    ) AS available_limit
  FROM cards c
  LEFT JOIN installments i
    ON i.card_id = c.id AND i.paid_count < i.installment_count
`;

const Card = {
  async findAllByUser(userId) {
    const [rows] = await pool.query(
      `${SELECT_WITH_LIMIT}
       WHERE c.user_id = ?
       GROUP BY c.id
       ORDER BY c.created_at DESC`,
      [userId]
    );
    return rows;
  },

  async findById(id, userId) {
    const [rows] = await pool.query(
      `${SELECT_WITH_LIMIT}
       WHERE c.id = ? AND c.user_id = ?
       GROUP BY c.id`,
      [id, userId]
    );
    return rows[0] || null;
  },

  async create({ user_id, name, last_digits, brand, limit_amount, closing_day, due_day, color }) {
    const [result] = await pool.query(
      `INSERT INTO cards
         (user_id, name, last_digits, brand, limit_amount, closing_day, due_day, color)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, name, last_digits || null, brand, limit_amount, closing_day, due_day, color]
    );
    return {
      id: result.insertId,
      user_id, name, last_digits: last_digits || null,
      brand, limit_amount, closing_day, due_day, color,
      is_active: 1, total_remaining: 0, available_limit: limit_amount,
    };
  },

  async update(id, userId, { name, last_digits, brand, limit_amount, closing_day, due_day, color, is_active }) {
    const [result] = await pool.query(
      `UPDATE cards
       SET name=?, last_digits=?, brand=?, limit_amount=?,
           closing_day=?, due_day=?, color=?, is_active=?
       WHERE id=? AND user_id=?`,
      [name, last_digits || null, brand, limit_amount,
       closing_day, due_day, color, is_active ? 1 : 0, id, userId]
    );
    return result.affectedRows > 0;
  },

  async delete(id, userId) {
    const [result] = await pool.query(
      'DELETE FROM cards WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  // Retorna todos os parcelamentos com vencimento no mês informado
  async getInvoice(cardId, userId, year, month) {
    const period = year * 12 + month;

    const [items] = await pool.query(
      `SELECT
         i.*,
         (? - (YEAR(i.start_date) * 12 + MONTH(i.start_date)) + 1) AS installment_number,
         IF(
           (? - (YEAR(i.start_date) * 12 + MONTH(i.start_date)) + 1) <= i.paid_count,
           1, 0
         ) AS is_paid
       FROM installments i
       WHERE i.card_id = ? AND i.user_id = ?
         AND (YEAR(i.start_date) * 12 + MONTH(i.start_date)) <= ?
         AND (YEAR(i.start_date) * 12 + MONTH(i.start_date) + i.installment_count - 1) >= ?
       ORDER BY is_paid ASC, i.description ASC`,
      [period, period, cardId, userId, period, period]
    );

    const total = items.reduce(
      (sum, item) => (item.is_paid ? sum : sum + Number(item.installment_value)),
      0
    );

    return { year, month, items, total: Number(total.toFixed(2)) };
  },
};

export default Card;
