import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import authRoute from '@/app/routes/auth.route';
import errorMiddleware from './middlewares/error.middleware';
import { testingEmail, verifyMailConnection } from '@/configs/mailer';

verifyMailConnection();
testingEmail();

const app = express();

app.use(compression());
app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/auth', authRoute);
app.use(errorMiddleware);

export default app;
