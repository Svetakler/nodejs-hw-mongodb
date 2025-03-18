import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const getEnvVar = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

const MONGODB_USER = getEnvVar('MONGODB_USER');
const MONGODB_PASSWORD = getEnvVar('MONGODB_PASSWORD');
const MONGODB_URL = getEnvVar('MONGODB_URL');
const MONGODB_DB = getEnvVar('MONGODB_DB');

const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;

export const initMongoConnection = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection error:', error);
    process.exit(1);
  }
};
