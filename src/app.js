import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
// import uploader from 'express-fileupload';
import router from './modules';

const app = express();

app.use(cors({ origin: true }));
app.use(helmet());
app.use(morgan('dev'));

app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: '50mb',
    parameterLimit: 500,
  }),
);
// app.use(uploader({ useTempFiles: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use('/assets', express.static('assets'));
app.use('/api/v1', router);

export default app;
