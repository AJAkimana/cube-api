import { Router } from 'express';
import quote from './quote.controller';
import authorization from '../middleware/auth.middleware';
import { validateQuoteBody } from './quote.validation';
import { checkUserRole } from './quote.middleware';

const quoteRouter = Router();
const { createQuote } = quote;

quoteRouter.post(
  '/',
  authorization,
  validateQuoteBody,
  checkUserRole,
  createQuote,
);

export default quoteRouter;
