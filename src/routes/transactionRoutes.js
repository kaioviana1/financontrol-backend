import { Router } from 'express';
import {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getSummary,
} from '../controllers/transactionController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import {
  listTransactionsSchema,
  createTransactionSchema,
  updateTransactionSchema,
  deleteTransactionSchema,
} from '../schemas/transactionSchemas.js';

const router = Router();

router.use(protect);

router.get('/',         validate(listTransactionsSchema), getTransactions);
router.get('/summary',  getSummary);
router.get('/:id',      getTransaction);
router.post('/',        validate(createTransactionSchema), createTransaction);
router.put('/:id',      validate(updateTransactionSchema), updateTransaction);
router.delete('/:id',   validate(deleteTransactionSchema), deleteTransaction);

export default router;
