import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import contactsRouter from './routers/contacts.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

export const startServer = () => {
    const app = express();
    const PORT = Number(env('PORT', '3000'));

    app.use(
        pino({
            transport: {
                target: 'pino-pretty',
            },
        })
    );

    app.use(cors());
    app.use(express.json());

    app.use('/contacts', contactsRouter);

    app.get('/', (req, res) => {
        res.json({
            message: 'Hello world!',
        });
    });

    // Обробка неіснуючих маршрутів
    app.use(notFoundHandler);

    // Обробка помилок
    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
