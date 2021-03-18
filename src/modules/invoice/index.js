import { Router } from 'express';
import authorization from '../middleware/auth.middleware';
import invoice from './invoice.controller';
import {
  validateInvoiceUpdate,
  validateInvoiceBody,
} from './invoice.validation';
import { checkInvoiceExists } from './invoice.middleware';

const { getAllInvoices, paymentOfInvoice } = invoice;
const invoiceRouter = Router();

invoiceRouter.post('/', validateInvoiceBody, invoice.generateInvoice);
invoiceRouter.patch(
  '/:id',
  authorization,
  validateInvoiceUpdate,
  checkInvoiceExists,
  paymentOfInvoice,
);
invoiceRouter.get('/', authorization, getAllInvoices);

export default invoiceRouter;
