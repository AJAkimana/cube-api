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

const router = Router();

router.use('/home', homeRouter);
router.use('/auth', userRouter);
router.use('/mail', mailRouter);
router.use('/user', userRouter);
router.use('/invoice', invoiceRouter);
router.use('/services', serviceRouter);
router.use('/edit-profile', userRouter);
router.use('/order', authVerification, orderRouter);
router.use('/subscription', subscriptionRouter);
router.use('/project', projectRouter);
router.use('/quote', quoteRouter);
router.use('/products', productRouter);

// router.use('/images', express.static(process.env.IMAGES_ZONE));
// router.use('/images3d', express.static(process.env.IMAGES_3D_ZONE));
router.all('/*', (_req, res) => {
  return serverResponse(res, 404, 'Oops, you have lost');
});

export default router;
