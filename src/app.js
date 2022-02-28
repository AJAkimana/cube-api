import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import userAgent from 'express-useragent';
import router from './modules';

const app = express();

app.use(cors({ origin: true }));
app.set('trust proxy', true);
app.use(helmet());
app.use(morgan('dev'));
app.use(userAgent.express());

app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: '50mb',
    parameterLimit: 500,
  }),
);
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/assets', express.static('assets'));
app.use('/api/v1', router);

export default app;
