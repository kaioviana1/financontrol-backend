import Transaction from '../models/Transaction.js';
import { AppError } from '../utils/AppError.js';
import { ok, created, msgOk } from '../utils/response.js';

export const getTransactions = async (req, res, next) => {
  try {
    const transactions = await Transaction.findAllByUser(req.user.id, req.query);
    return ok(res, transactions);
  } catch (error) {
    next(error);
  }
};

export const getTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findById(req.params.id, req.user.id);
    if (!transaction) return next(new AppError('Transação não encontrada.', 404));
    return ok(res, transaction);
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const { category_id, description, amount, type, date } = req.body;
    const transaction = await Transaction.create({
      user_id: req.user.id,
      category_id: category_id ?? null,
      description,
      amount,
      type,
      date,
    });
    return created(res, transaction);
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const wasUpdated = await Transaction.update(req.params.id, req.user.id, req.body);
    if (!wasUpdated) return next(new AppError('Transação não encontrada.', 404));
    return msgOk(res, 'Transação atualizada com sucesso.');
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    const wasDeleted = await Transaction.delete(req.params.id, req.user.id);
    if (!wasDeleted) return next(new AppError('Transação não encontrada.', 404));
    return msgOk(res, 'Transação removida com sucesso.');
  } catch (error) {
    next(error);
  }
};

export const getSummary = async (req, res, next) => {
  try {
    const now = new Date();
    const summary = await Transaction.getSummaryByMonth(
      req.user.id,
      req.query.year || now.getFullYear(),
      req.query.month || now.getMonth() + 1
    );
    return ok(res, {
      total_income:  Number(summary.total_income)  || 0,
      total_expense: Number(summary.total_expense) || 0,
      balance: (Number(summary.total_income) || 0) - (Number(summary.total_expense) || 0),
    });
  } catch (error) {
    next(error);
  }
};
