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
import {
  isAuthenticated,
  isClient,
  isNotVisitor,
} from '../middleware/auth.middleware';

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
  isAuthenticated,
  isClient,
  validateProjectBody,
  createProject,
);

projectRouter.get('/', isAuthenticated, getProjects);
projectRouter.get(
  '/:id',
  isAuthenticated,
  doesProjectExist,
  getProjectDetail,
);
projectRouter.get(
  '/:id/histories',
  isAuthenticated,
  doesProjectExist,
  getProjectHistories,
);
projectRouter.patch(
  '/:id',
  isAuthenticated,
  isNotVisitor,
  validateProjectBody,
  doesProjectExist,
  updateProject,
);

projectRouter.patch(
  '/approve-project/:id',
  isAuthenticated,
  updateProjectStatus,
  checkManagerRoleAndProjectExists,
  updateProject,
);
projectRouter.post(
  '/:id/histories',
  isAuthenticated,
  doesProjectExist,
  createNewLog,
);
projectRouter.post(
  '/:id/products',
  isAuthenticated,
  doesProjectExist,
  isAddProductValid,
  addProductToProject,
);
projectRouter.get(
  '/:id/products',
  isAuthenticated,
  getProductProjects,
);

export default projectRouter;
