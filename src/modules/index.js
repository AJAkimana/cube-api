import { Router } from 'express';
import homeRouter from './home';
import mailRouter from './mail';
import userRouter from './auth/user.route';
import invoiceRouter from './invoice';
import serviceRouter from './services/service.route';
import authVerification from './middleware/auth.middleware';
import orderRouter from './order';
import subscriptionRouter from './subscription';
import projectRouter from './project';
import quoteRouter from './quote';
import ResponseUtil from '../utils/response.util';
import { NOT_FOUND } from 'http-status';

const indexRouter = Router();

indexRouter.use('/home', homeRouter);
indexRouter.use('/auth', userRouter);
indexRouter.use('/mail', mailRouter);
indexRouter.use('/user', userRouter);
indexRouter.use('/invoice', invoiceRouter);
indexRouter.use('/services', serviceRouter);
indexRouter.use('/edit-profile', userRouter);
indexRouter.use('/order', authVerification, orderRouter);
indexRouter.use('/user', subscriptionRouter);
indexRouter.use('/project', projectRouter);
indexRouter.use('/quote', quoteRouter);
indexRouter.all('/*', (req, res) => {
  ResponseUtil.setError(NOT_FOUND, 'Oops, you have lost');
  return ResponseUtil.send(res);
});

export default indexRouter;
