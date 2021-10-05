import { Router } from 'express';
import AuthController from './auth.controller';
import {
  validateUserBody,
  validateSecurePassword,
  validateLoginBody,
  validateUdateProfile,
  validateNewPassword,
} from './auth.validation';
import {
  checkEmailExists,
  checkPasswordCredentials,
  checkUserCredential,
  doesUserExist,
} from './auth.middleware';
import authorization, {
  isAdmin,
  isAdminOrManager,
} from '../middleware/auth.middleware';

const userRouter = Router();

userRouter.post(
  '/register',
  authorization,
  isAdminOrManager,
  validateUserBody,
  checkEmailExists,
  AuthController.createAccount,
);
userRouter.patch(
  '/users/:userId',
  authorization,
  isAdminOrManager,
  doesUserExist,
  validateUserBody,
  checkEmailExists,
  AuthController.updateUserInfo,
);
userRouter.delete(
  '/users/:userId',
  authorization,
  isAdmin,
  doesUserExist,
  AuthController.deleteUser,
);
userRouter.post(
  '/login',
  validateLoginBody,
  checkUserCredential,
  AuthController.login,
);
userRouter.patch(
  '/secure-password',
  validateSecurePassword,
  checkPasswordCredentials,
  AuthController.updatingPassword,
);
userRouter.patch(
  '/set-password',
  validateNewPassword,
  AuthController.setNewPassword,
);
userRouter.post('/send-reset-link', AuthController.sendResetPassword);
userRouter.post(
  '/reset-password',
  validateNewPassword,
  AuthController.resetPassword,
);
userRouter.patch(
  '/edit-profile',
  authorization,
  validateUserBody,
  AuthController.editAccount,
);
userRouter.get('/users', authorization, AuthController.getUsers);
userRouter.post(
  '/seed',
  authorization,
  isAdminOrManager,
  AuthController.seed,
);

export default userRouter;
