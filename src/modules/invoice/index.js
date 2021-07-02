import { Router } from 'express';
import authorization, {
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
  authorization,
  validateInvoiceUpdate,
  isAdminOrManager,
  paymentOfInvoice,
);
invoiceRouter.get('/', authorization, getAllInvoices);
invoiceRouter.get('/:downloadId', downloadInvoice);

export default invoiceRouter;
