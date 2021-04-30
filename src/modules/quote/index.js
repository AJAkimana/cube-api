import { Router } from 'express';
import quote from './quote.controller';
import authorization from '../middleware/auth.middleware';
import {
  validateQuoteBody,
  validateQuoteUpdate,
} from './quote.validation';
import {
  checkUserRole,
  checkUserRoleAndQuoteExists,
} from './quote.middleware';

const quoteRouter = Router();
const { createQuote, getAllQuotes, updateQuote } = quote;

quoteRouter.post(
  '/',
  authorization,
  validateQuoteBody,
  checkUserRole,
  createQuote,
);

quoteRouter.patch(
  '/:id',
  authorization,
  validateQuoteUpdate,
  updateQuote,
);
quoteRouter.get('/', authorization, getAllQuotes);

export default quoteRouter;
