import { Router } from 'express';
import {
  getCards,
  createCard,
  updateCard,
  deleteCard,
  getCardInvoice,
} from '../controllers/cardController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import {
  createCardSchema,
  updateCardSchema,
  deleteCardSchema,
  cardInvoiceSchema,
} from '../schemas/cardSchemas.js';

const router = Router();

router.use(protect);

router.get('/',                getCards);
router.post('/',               validate(createCardSchema),   createCard);
router.put('/:id',             validate(updateCardSchema),   updateCard);
router.delete('/:id',          validate(deleteCardSchema),   deleteCard);
router.get('/:id/invoice',     validate(cardInvoiceSchema),  getCardInvoice);

export default router;
