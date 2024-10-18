// src/constants/index.js

import path from 'node:path';

export const ONE_DAY = 24 * 60 * 60 * 1000; // Кількість мілісекунд в одному дні

export const ENV_VARS = {
    PORT: 'PORT',
};

export const MONGO_DB_VARS = {
    MONGODB_USER: 'MONGODB_USER',
    MONGODB_PASSWORD: 'MONGODB_PASSWORD',
    MONGODB_URL: 'MONGODB_URL',
    MONGODB_DB: 'MONGODB_DB',
};

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
