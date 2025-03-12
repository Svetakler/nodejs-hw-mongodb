import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { initMongoConnection } from './db/initMongoConnection.js';

dotenv.config();
const logger = pino();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(pinoHttp({ logger }));

app.use(router);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const setupServer = () => {
  initMongoConnection().then(() => {
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  });
};

export { setupServer };
