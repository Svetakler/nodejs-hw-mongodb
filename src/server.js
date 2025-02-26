
import express from 'express';
import cors from 'cors';
import pino from 'pino';
import pinoHttp from 'pino-http';
import dotenv from 'dotenv';
import contactsRouter from './routes/contacts.routes.js';

dotenv.config();

const logger = pino();

export const setupServer = () => {
  const app = express();


  app.use(express.json());


  app.use(cors());


  app.use(pinoHttp({ logger }));


  app.use('/contacts', contactsRouter);

  
  app.use((req, res) => {
    res.status(404).json({ message: 'Not found' });
  });

  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
};
