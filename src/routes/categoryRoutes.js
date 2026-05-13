import { Router } from 'express';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from '../schemas/categorySchemas.js';

const router = Router();

router.use(protect);

router.get('/',     getCategories);
router.post('/',    validate(createCategorySchema), createCategory);
router.put('/:id',  validate(updateCategorySchema), updateCategory);
router.delete('/:id', validate(deleteCategorySchema), deleteCategory);

export default router;
