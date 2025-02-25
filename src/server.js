import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import dotenv from 'dotenv';

dotenv.config();

const logger = pino();

export const setupServer = () => {
  const app = express();

  app.use(cors());

  app.use(pinoHttp({ logger }));

  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
  });
};
