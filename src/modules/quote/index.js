import { Router } from 'express';
import quote from './quote.controller';
import authorization, {
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
  authorization,
  isAdminOrManager,
  validateQuoteBody,
  createQuote,
);

quoteRouter.patch(
  '/:id',
  authorization,
  validateQuoteUpdate,
  isNotVisitor,
  doesQuoteExist,
  updateQuote,
);
quoteRouter.get('/', authorization, getAllQuotes);

export default quoteRouter;
