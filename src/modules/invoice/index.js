import { Router } from 'express';
import {
  isAuthenticated,
  isAdminOrManager,
} from '../middleware/auth.middleware';
import invoice from './invoice.controller';
import {
  validateInvoiceUpdate,
  validateInvoiceBody,
} from './invoice.validation';

const { getAllInvoices, paymentOfInvoice, downloadInvoice } = invoice;
const invoiceRouter = Router();

invoiceRouter.post('/', validateInvoiceBody, invoice.generateInvoice);
invoiceRouter.patch(
  '/:id',
  isAuthenticated,
  validateInvoiceUpdate,
  isAdminOrManager,
  paymentOfInvoice,
);
invoiceRouter.get('/', isAuthenticated, getAllInvoices);
invoiceRouter.get('/:downloadId', downloadInvoice);

export default invoiceRouter;
