import express from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
// import uploader from 'express-fileupload';
import indexRouter from './modules';

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use(
  bodyParser.urlencoded({
    extended: false,
    limit: '1mb',
    parameterLimit: 500,
  }),
);
// app.use(uploader({ useTempFiles: true }));
app.use(bodyParser.json({ limit: '1mb' }));

app.use('/api/v1', indexRouter);

export default app;
