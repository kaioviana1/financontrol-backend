import Installment from '../models/Installment.js';
import Card from '../models/Card.js';
import { AppError } from '../utils/AppError.js';
import { ok, created, msgOk } from '../utils/response.js';

export const getInstallments = async (req, res, next) => {
  try {
    const installments = await Installment.findAllByUser(req.user.id, req.query);
    return ok(res, installments);
  } catch (error) {
    next(error);
  }
};

export const getInstallment = async (req, res, next) => {
  try {
    const installment = await Installment.findById(req.params.id, req.user.id);
    if (!installment) return next(new AppError('Parcelamento não encontrado.', 404));
    return ok(res, installment);
  } catch (error) {
    next(error);
  }
};

export const createInstallment = async (req, res, next) => {
  try {
    const { card_id } = req.body;

    // Garante que o cartão pertence ao usuário
    const card = await Card.findById(card_id, req.user.id);
    if (!card) return next(new AppError('Cartão não encontrado.', 404));
    if (!card.is_active) return next(new AppError('Este cartão está desativado.', 400));

    const installment = await Installment.create({ user_id: req.user.id, ...req.body });
    return created(res, installment);
  } catch (error) {
    next(error);
  }
};

export const updateInstallment = async (req, res, next) => {
  try {
    const wasUpdated = await Installment.update(req.params.id, req.user.id, req.body);
    if (!wasUpdated) return next(new AppError('Parcelamento não encontrado.', 404));
    return msgOk(res, 'Parcelamento atualizado com sucesso.');
  } catch (error) {
    next(error);
  }
};

export const deleteInstallment = async (req, res, next) => {
  try {
    const wasDeleted = await Installment.delete(req.params.id, req.user.id);
    if (!wasDeleted) return next(new AppError('Parcelamento não encontrado.', 404));
    return msgOk(res, 'Parcelamento removido com sucesso.');
  } catch (error) {
    next(error);
  }
};

// Marca a próxima parcela como paga
export const payInstallment = async (req, res, next) => {
  try {
    const wasPaid = await Installment.pay(req.params.id, req.user.id);
    if (!wasPaid) {
      return next(new AppError('Parcelamento não encontrado ou todas as parcelas já foram pagas.', 400));
    }
    const updated = await Installment.findById(req.params.id, req.user.id);
    return ok(res, updated, 'Parcela marcada como paga.');
  } catch (error) {
    next(error);
  }
};

// Desfaz o último pagamento registrado
export const unpayInstallment = async (req, res, next) => {
  try {
    const wasUnpaid = await Installment.unpay(req.params.id, req.user.id);
    if (!wasUnpaid) {
      return next(new AppError('Parcelamento não encontrado ou nenhuma parcela paga para desfazer.', 400));
    }
    const updated = await Installment.findById(req.params.id, req.user.id);
    return ok(res, updated, 'Pagamento desfeito com sucesso.');
  } catch (error) {
    next(error);
  }
};
