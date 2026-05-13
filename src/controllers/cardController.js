import Card from '../models/Card.js';
import { AppError } from '../utils/AppError.js';
import { ok, created, msgOk } from '../utils/response.js';

export const getCards = async (req, res, next) => {
  try {
    const cards = await Card.findAllByUser(req.user.id);
    return ok(res, cards);
  } catch (error) {
    next(error);
  }
};

export const createCard = async (req, res, next) => {
  try {
    const card = await Card.create({ user_id: req.user.id, ...req.body });
    return created(res, card);
  } catch (error) {
    next(error);
  }
};

export const updateCard = async (req, res, next) => {
  try {
    const wasUpdated = await Card.update(req.params.id, req.user.id, req.body);
    if (!wasUpdated) return next(new AppError('Cartão não encontrado.', 404));
    return msgOk(res, 'Cartão atualizado com sucesso.');
  } catch (error) {
    next(error);
  }
};

export const deleteCard = async (req, res, next) => {
  try {
    const wasDeleted = await Card.delete(req.params.id, req.user.id);
    if (!wasDeleted) return next(new AppError('Cartão não encontrado.', 404));
    return msgOk(res, 'Cartão removido com sucesso.');
  } catch (error) {
    next(error);
  }
};

// GET /api/cards/:id/invoice?year=&month=
export const getCardInvoice = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id, req.user.id);
    if (!card) return next(new AppError('Cartão não encontrado.', 404));

    const now   = new Date();
    const year  = Number(req.query.year)  || now.getFullYear();
    const month = Number(req.query.month) || now.getMonth() + 1;

    const invoice = await Card.getInvoice(req.params.id, req.user.id, year, month);

    // Data de vencimento da fatura:
    // se due_day < closing_day, o vencimento cai no mês seguinte ao fechamento
    let dueYear = year, dueMonth = month;
    if (card.due_day <= card.closing_day) {
      dueMonth += 1;
      if (dueMonth > 12) { dueMonth = 1; dueYear += 1; }
    }
    const due_date = `${dueYear}-${String(dueMonth).padStart(2, '0')}-${String(card.due_day).padStart(2, '0')}`;
    const close_date = `${year}-${String(month).padStart(2, '0')}-${String(card.closing_day).padStart(2, '0')}`;

    return ok(res, {
      card: {
        id:              card.id,
        name:            card.name,
        brand:           card.brand,
        last_digits:     card.last_digits,
        limit_amount:    Number(card.limit_amount),
        available_limit: Number(card.available_limit),
        closing_day:     card.closing_day,
        due_day:         card.due_day,
      },
      invoice: {
        ...invoice,
        close_date,
        due_date,
      },
    });
  } catch (error) {
    next(error);
  }
};
