import { Router } from 'express';
import Home from './home.controller';
import authorization from '../middleware/auth.middleware';

const homeRouter = Router();

homeRouter.get('/', Home.home);
homeRouter.get('/dashboard', authorization, Home.getDashboardCounts);
homeRouter.get(
  '/notifications',
  authorization,
  Home.getDashboardCounts,
);
homeRouter.get(
  '/notifications/count',
  authorization,
  Home.getDashboardCounts,
);

export default homeRouter;
