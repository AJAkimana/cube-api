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
import authorization from '../middleware/auth.middleware';

const userRouter = Router();

userRouter.post(
  '/register',
  authorization,
  validateUserBody,
  checkEmailExists,
  AuthController.createAccount,
);
userRouter.patch(
  '/users/:userId',
  authorization,
  doesUserExist,
  validateUserBody,
  checkEmailExists,
  AuthController.updateUserInfo,
);
userRouter.delete(
  '/users/:userId',
  authorization,
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
userRouter.patch(
  '/edit-profile/:id',
  validateUdateProfile,
  AuthController.editAccount,
);
userRouter.get('/users', authorization, AuthController.getUsers);
userRouter.post('/seed', AuthController.seed);

export default userRouter;
