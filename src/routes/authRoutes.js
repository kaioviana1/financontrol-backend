import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validate.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  updatePasswordSchema,
} from '../schemas/authSchemas.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login',    validate(loginSchema),    login);

router.get('/me',              protect,                                     getMe);
router.put('/profile',         protect, validate(updateProfileSchema),      updateProfile);
router.put('/password',        protect, validate(updatePasswordSchema),     updatePassword);

export default router;
