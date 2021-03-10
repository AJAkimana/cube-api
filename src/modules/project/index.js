import { Router } from 'express';
import project from './project.controller';
import { validateProjectBody } from './project.validation';
import { checkUserRole } from './project.middleware';
import authorization from '../middleware/auth.middleware';
import { uploadImage } from '../../utils/image.util';

const { createProject } = project;
const projectRouter = Router();

projectRouter.post(
  '/',
  authorization,
  validateProjectBody,
  checkUserRole,
  uploadImage,
  createProject,
);

export default projectRouter;
