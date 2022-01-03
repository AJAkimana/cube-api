import { Router } from 'express';
import { checkUserRoleAndServiceExists } from './service.middleware';
import { validateServiceBody } from './service.validation';
import { isAuthenticated } from '../middleware/auth.middleware';
import ServiceController from './service.controller';

const router = Router();

router.post(
  '/',
  isAuthenticated,
  validateServiceBody,
  checkUserRoleAndServiceExists,
  ServiceController.createService,
);

export default router;
