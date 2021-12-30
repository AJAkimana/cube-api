import { Router } from 'express';
import quote from './quote.controller';
import {
  isAuthenticated,
  isAdminOrManager,
  isNotVisitor,
} from '../middleware/auth.middleware';
import {
  validateQuoteBody,
  validateQuoteUpdate,
} from './quote.validation';
import { doesQuoteExist } from './quote.middleware';

const quoteRouter = Router();
const { createQuote, getAllQuotes, updateQuote } = quote;

quoteRouter.post(
  '/',
  isAuthenticated,
  isAdminOrManager,
  validateQuoteBody,
  createQuote,
);

quoteRouter.patch(
  '/:id',
  isAuthenticated,
  validateQuoteUpdate,
  isNotVisitor,
  doesQuoteExist,
  updateQuote,
);
quoteRouter.get('/', isAuthenticated, getAllQuotes);

export default quoteRouter;
