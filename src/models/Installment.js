import pool from '../config/db.js';

const Installment = {
  async findAllByUser(userId, { card_id, active } = {}) {
    let query = `
      SELECT
        i.*,
        c.name  AS card_name,
        c.color AS card_color,
        c.brand AS card_brand,
        (i.installment_count - i.paid_count) AS remaining_count,
        ROUND((i.installment_count - i.paid_count) * i.installment_value, 2) AS remaining_amount
      FROM installments i
      JOIN cards c ON i.card_id = c.id
      WHERE i.user_id = ?
    `;
    const params = [userId];

    if (card_id) {
      query += ' AND i.card_id = ?';
      params.push(card_id);
    }
    if (active === 'true') {
      query += ' AND i.paid_count < i.installment_count';
    }

    query += ' ORDER BY i.created_at DESC';
    const [rows] = await pool.query(query, params);
    return rows;
  },

  async findById(id, userId) {
    const [rows] = await pool.query(
      `SELECT
         i.*,
         c.name  AS card_name,
         c.color AS card_color,
         c.brand AS card_brand,
         (i.installment_count - i.paid_count) AS remaining_count,
         ROUND((i.installment_count - i.paid_count) * i.installment_value, 2) AS remaining_amount
       FROM installments i
       JOIN cards c ON i.card_id = c.id
       WHERE i.id = ? AND i.user_id = ?`,
      [id, userId]
    );
    return rows[0] || null;
  },

  async create({ user_id, card_id, description, total_amount, installment_count, start_date }) {
    // Armazena o valor exato de cada parcela evitando desvio por arredondamento
    const installment_value = Number((total_amount / installment_count).toFixed(2));

    const [result] = await pool.query(
      `INSERT INTO installments
         (user_id, card_id, description, total_amount, installment_count, installment_value, start_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, card_id, description, total_amount, installment_count, installment_value, start_date]
    );
    return {
      id: result.insertId,
      user_id, card_id, description,
      total_amount, installment_count, installment_value,
      start_date, paid_count: 0,
      remaining_count: installment_count,
      remaining_amount: total_amount,
    };
  },

  async update(id, userId, { description, total_amount, installment_count, start_date }) {
    const installment_value = Number((total_amount / installment_count).toFixed(2));
    const [result] = await pool.query(
      `UPDATE installments
       SET description=?, total_amount=?, installment_count=?, installment_value=?, start_date=?
       WHERE id=? AND user_id=?`,
      [description, total_amount, installment_count, installment_value, start_date, id, userId]
    );
    return result.affectedRows > 0;
  },

  async delete(id, userId) {
    const [result] = await pool.query(
      'DELETE FROM installments WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  // Marca próxima parcela como paga (incrementa paid_count)
  async pay(id, userId) {
    const [result] = await pool.query(
      `UPDATE installments
       SET paid_count = paid_count + 1
       WHERE id = ? AND user_id = ? AND paid_count < installment_count`,
      [id, userId]
    );
    return result.affectedRows > 0;
  },

  // Desfaz o último pagamento (decrementa paid_count)
  async unpay(id, userId) {
    const [result] = await pool.query(
      `UPDATE installments
       SET paid_count = paid_count - 1
       WHERE id = ? AND user_id = ? AND paid_count > 0`,
      [id, userId]
    );
    return result.affectedRows > 0;
  },
};

export default Installment;
