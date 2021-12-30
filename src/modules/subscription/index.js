import { Router } from 'express';
import { validateSubscriptionBody } from './subscription.validation';
import { checkSubscription } from './subscription.middleware';
import { isAuthenticated } from '../middleware/auth.middleware';
import SubscriptionController from './subscription.controller';

const router = Router();

router.get(
  '/',
  isAuthenticated,
  SubscriptionController.getAllSubscription,
);
router.patch(
  '/:id',
  isAuthenticated,
  validateSubscriptionBody,
  checkSubscription,
  SubscriptionController.UserSubscription,
);

export default router;
