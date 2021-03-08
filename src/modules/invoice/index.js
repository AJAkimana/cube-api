import { Router } from 'express';
import invoice from './invoice.controller';
import { validateInvoiceBody } from './invoice.validation';
// import validateInvoice from './invoice.middleware';

const invoiceRouter = Router();

invoiceRouter.post('/', validateInvoiceBody, invoice.generateInvoice);

export default invoiceRouter;
