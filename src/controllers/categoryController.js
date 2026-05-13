import Category from '../models/Category.js';
import { AppError } from '../utils/AppError.js';
import { ok, created, msgOk } from '../utils/response.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAllByUser(req.user.id);
    return ok(res, categories);
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, type, color, icon } = req.body;
    const category = await Category.create({ user_id: req.user.id, name, type, color, icon });
    return created(res, category);
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const wasUpdated = await Category.update(req.params.id, req.user.id, req.body);
    if (!wasUpdated) return next(new AppError('Categoria não encontrada.', 404));
    return msgOk(res, 'Categoria atualizada com sucesso.');
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const wasDeleted = await Category.delete(req.params.id, req.user.id);
    if (!wasDeleted) return next(new AppError('Categoria não encontrada.', 404));
    return msgOk(res, 'Categoria removida com sucesso.');
  } catch (error) {
    next(error);
  }
};
