import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import contactsRouter from './routes/contacts.js';

export const startServer = () => {
    const app = express();

    // Використовуємо змінну оточення або 3000 за замовчуванням
    const PORT = Number(env('PORT', '3000'));

    // Логер pino
    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            },
        })
    );

    // Використовуємо cors
    app.use(cors());

    app.use(express.json());  // Додаємо middleware для роботи з JSON

    // Реєструємо маршрут для контактів
    app.use('/contacts', contactsRouter);

    // Основний роут
    app.get('/', (req, res) => {
        res.json({
            message: 'Hello world!',
        });
    });

    // Обробка неіснуючих маршрутів
    app.use('*', (req, res) => {
        res.status(404).json({
            message: 'Not found',
        });
    });

      app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

    // Запуск серверу
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
