import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import { env } from './utils/env.js';
import contactsRouter from './routers/contacts.js';

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

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
