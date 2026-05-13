import Goal from '../models/Goal.js';
import { AppError } from '../utils/AppError.js';
import { ok, created, msgOk } from '../utils/response.js';

export const getGoals = async (req, res, next) => {
  try {
    const goals = await Goal.findAllByUser(req.user.id);
    return ok(res, goals);
  } catch (error) {
    next(error);
  }
};

export const getGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id, req.user.id);
    if (!goal) return next(new AppError('Meta não encontrada.', 404));
    return ok(res, goal);
  } catch (error) {
    next(error);
  }
};

export const createGoal = async (req, res, next) => {
  try {
    const { title, target_amount, current_amount, deadline } = req.body;
    const goal = await Goal.create({
      user_id: req.user.id,
      title,
      target_amount,
      current_amount: current_amount ?? 0,
      deadline: deadline ?? null,
    });
    return created(res, goal);
  } catch (error) {
    next(error);
  }
};

export const updateGoal = async (req, res, next) => {
  try {
    const wasUpdated = await Goal.update(req.params.id, req.user.id, req.body);
    if (!wasUpdated) return next(new AppError('Meta não encontrada.', 404));
    return msgOk(res, 'Meta atualizada com sucesso.');
  } catch (error) {
    next(error);
  }
};

export const deleteGoal = async (req, res, next) => {
  try {
    const wasDeleted = await Goal.delete(req.params.id, req.user.id);
    if (!wasDeleted) return next(new AppError('Meta não encontrada.', 404));
    return msgOk(res, 'Meta removida com sucesso.');
  } catch (error) {
    next(error);
  }
};
