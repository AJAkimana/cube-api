import { Router } from 'express';
import { validateSubscriptionBody } from './subscription.validation';
import { checkSubscription } from './subscription.middleware';
import authorization from '../middleware/auth.middleware';
import SubscriptionController from './subscription.controller';

const router = Router();

router.get(
  '/',
  authorization,
  SubscriptionController.getAllSubscription,
);
router.patch(
  '/:id',
  authorization,
  validateSubscriptionBody,
  checkSubscription,
  SubscriptionController.UserSubscription,
);

export default router;
