import { Router } from 'express';
import { validateSubscriptionBody } from './subscription.validation';
import { checkSubscription } from './subscription.middleware';
import SubscriptionController from './subscription.controller';

const router = Router();

router.patch(
  '/subscription/:id',
  validateSubscriptionBody,
  checkSubscription,
  SubscriptionController.UserSubscription,
);

export default router;
