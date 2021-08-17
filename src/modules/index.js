import express, { Router } from 'express';
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
import productRouter from './product';
import { serverResponse } from '../utils/response';

const indexRouter = Router();

indexRouter.use('/home', homeRouter);
indexRouter.use('/auth', userRouter);
indexRouter.use('/mail', mailRouter);
indexRouter.use('/user', userRouter);
indexRouter.use('/invoice', invoiceRouter);
indexRouter.use('/services', serviceRouter);
indexRouter.use('/edit-profile', userRouter);
indexRouter.use('/order', authVerification, orderRouter);
indexRouter.use('/subscription', subscriptionRouter);
indexRouter.use('/project', projectRouter);
indexRouter.use('/quote', quoteRouter);
indexRouter.use('/products', productRouter);

indexRouter.use('/images', express.static(process.env.IMAGES_ZONE));
indexRouter.all('/*', (_req, res) => {
  return serverResponse(res, 404, 'Oops, you have lost');
});

export default indexRouter;
