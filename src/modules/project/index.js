import { Router } from 'express';
import ProjectCtrl from './project.controller';
import {
  validateProjectBody,
  updateProjectStatus,
} from './project.validation';
import {
  checkManagerRoleAndProjectExists,
  doesProjectExist,
  isAddProductValid,
} from './project.middleware';
import authorization, {
  isClient,
  isNotVisitor,
} from '../middleware/auth.middleware';
import { uploadImage } from '../../utils/image.util';

const {
  createProject,
  updateProject,
  getProjects,
  getProjectHistories,
  getProjectDetail,
  createNewLog,
  addProductToProject,
  getProductProjects,
} = ProjectCtrl;
const projectRouter = Router();

projectRouter.post(
  '/',
  authorization,
  isClient,
  validateProjectBody,
  uploadImage,
  createProject,
);

projectRouter.get('/', authorization, getProjects);
projectRouter.get(
  '/:id',
  authorization,
  doesProjectExist,
  getProjectDetail,
);
projectRouter.get(
  '/:id/histories',
  authorization,
  doesProjectExist,
  getProjectHistories,
);
projectRouter.patch(
  '/:id',
  authorization,
  isNotVisitor,
  validateProjectBody,
  doesProjectExist,
  updateProject,
);

projectRouter.patch(
  '/approve-project/:id',
  authorization,
  updateProjectStatus,
  checkManagerRoleAndProjectExists,
  updateProject,
);
projectRouter.post(
  '/:id/histories',
  authorization,
  doesProjectExist,
  createNewLog,
);
projectRouter.post(
  '/:id/products',
  authorization,
  doesProjectExist,
  isAddProductValid,
  addProductToProject,
);
projectRouter.get('/:id/products', authorization, getProductProjects);

export default projectRouter;
