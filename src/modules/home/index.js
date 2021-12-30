import { Router } from 'express';
import Home from './home.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

const homeRouter = Router();

homeRouter.get('/', Home.home);
homeRouter.get(
  '/dashboard',
  isAuthenticated,
  Home.getDashboardCounts,
);
homeRouter.get(
  '/notifications',
  isAuthenticated,
  Home.getNotifications,
);

export default homeRouter;
