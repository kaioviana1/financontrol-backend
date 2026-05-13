import { Router } from 'express';
import {
  getInstallments,
  getInstallment,
  createInstallment,
  updateInstallment,
  deleteInstallment,
  payInstallment,
  unpayInstallment,
} from '../controllers/installmentController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import {
  listInstallmentsSchema,
  createInstallmentSchema,
  updateInstallmentSchema,
  deleteInstallmentSchema,
  payInstallmentSchema,
} from '../schemas/installmentSchemas.js';

const router = Router();

router.use(protect);

router.get('/',            validate(listInstallmentsSchema),    getInstallments);
router.get('/:id',         getInstallment);
router.post('/',           validate(createInstallmentSchema),   createInstallment);
router.put('/:id',         validate(updateInstallmentSchema),   updateInstallment);
router.delete('/:id',      validate(deleteInstallmentSchema),   deleteInstallment);
router.put('/:id/pay',     validate(payInstallmentSchema),      payInstallment);
router.put('/:id/unpay',   validate(payInstallmentSchema),      unpayInstallment);

export default router;
