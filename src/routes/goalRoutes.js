import { Router } from 'express';
import {
  getGoals,
  getGoal,
  createGoal,
  updateGoal,
  deleteGoal,
} from '../controllers/goalController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import {
  createGoalSchema,
  updateGoalSchema,
  deleteGoalSchema,
} from '../schemas/goalSchemas.js';

const router = Router();

router.use(protect);

router.get('/',     getGoals);
router.get('/:id',  getGoal);
router.post('/',    validate(createGoalSchema),  createGoal);
router.put('/:id',  validate(updateGoalSchema),  updateGoal);
router.delete('/:id', validate(deleteGoalSchema), deleteGoal);

export default router;
