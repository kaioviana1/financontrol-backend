import pool from '../config/db.js';

export const getDashboardData = async (userId, year, month) => {
  const [
    [[monthlySummary]],
    [[allTimeSummary]],
    [byCategory],
    [recentTransactions],
    [monthlyHistory],
  ] = await Promise.all([
    // Totais do mês filtrado
    pool.query(
      `SELECT
        SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
       FROM transactions
       WHERE user_id = ? AND YEAR(date) = ? AND MONTH(date) = ?`,
      [userId, year, month]
    ),

    // Saldo acumulado de todos os tempos
    pool.query(
      `SELECT
        SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
       FROM transactions
       WHERE user_id = ?`,
      [userId]
    ),

    // Gastos por categoria no mês filtrado
    pool.query(
      `SELECT
        c.id,
        c.name,
        c.color,
        c.icon,
        SUM(t.amount) AS total
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = ? AND t.type = 'expense'
         AND YEAR(t.date) = ? AND MONTH(t.date) = ?
       GROUP BY c.id, c.name, c.color, c.icon
       ORDER BY total DESC`,
      [userId, year, month]
    ),

    // Últimas 5 transações (independente do período)
    pool.query(
      `SELECT
        t.id,
        t.description,
        t.amount,
        t.type,
        t.date,
        c.name  AS category_name,
        c.color AS category_color,
        c.icon  AS category_icon
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = ?
       ORDER BY t.date DESC, t.id DESC
       LIMIT 5`,
      [userId]
    ),

    // Histórico dos últimos 6 meses (receitas e despesas)
    pool.query(
      `SELECT
        YEAR(date)  AS year,
        MONTH(date) AS month,
        SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END) AS total_income,
        SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense
       FROM transactions
       WHERE user_id = ?
         AND date >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 5 MONTH), '%Y-%m-01')
       GROUP BY YEAR(date), MONTH(date)
       ORDER BY year ASC, month ASC`,
      [userId]
    ),
  ]);

  const monthIncome  = Number(monthlySummary?.total_income)  || 0;
  const monthExpense = Number(monthlySummary?.total_expense) || 0;
  const allIncome    = Number(allTimeSummary?.total_income)  || 0;
  const allExpense   = Number(allTimeSummary?.total_expense) || 0;

  return {
    period: { year, month },

    summary: {
      total_income:  monthIncome,
      total_expense: monthExpense,
      balance:       monthIncome - monthExpense,
    },

    overall_balance: allIncome - allExpense,

    expenses_by_category: byCategory,

    recent_transactions: recentTransactions,

    monthly_history: monthlyHistory.map((r) => ({
      year:          Number(r.year),
      month:         Number(r.month),
      total_income:  Number(r.total_income)  || 0,
      total_expense: Number(r.total_expense) || 0,
    })),
  };
};
