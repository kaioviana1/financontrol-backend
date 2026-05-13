import { Router } from 'express';
import { getDashboard } from '../controllers/dashboardController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { getDashboardSchema } from '../schemas/dashboardSchemas.js';

const router = Router();

router.use(protect);

router.get('/', validate(getDashboardSchema), getDashboard);

export default router;
