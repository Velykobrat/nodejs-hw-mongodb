// src/server.js

import express from 'express'; // Express — це фреймворк для створення веб-серверів.
import cors from 'cors'; // CORS — модуль для налаштування політики доступу між джерелами.
import pino from 'pino-http'; // Pino — це швидкий логер для Node.js.
import { env } from './utils/env.js'; // Імпортуємо утиліту для доступу до змінних середовища.
import contactsRouter from './routers/contacts.js'; // Імпортуємо роутер для контактів.
import authRouter from './routers/auth.js'; // Імпортуємо роутер для автентифікації.
import errorHandler from './middlewares/errorHandler.js'; // Імпортуємо обробник помилок.
import notFoundHandler from './middlewares/notFoundHandler.js'; // Імпортуємо обробник неіснуючих маршрутів.
import cookieParser from 'cookie-parser'; // Імпортуємо cookie-parser

// Оголошуємо функцію для запуску сервера.
export const startServer = () => {
    // Створюємо новий екземпляр Express.
    const app = express();
    // Задаємо порт для сервера, беручи його зі змінних середовища або за замовчуванням 3000.
    const PORT = Number(env('PORT', '3000'));

    // Налаштовуємо логер Pino для ведення логів HTTP-запитів.
    app.use(
        pino({
            transport: {
                target: 'pino-pretty', // Формат виводу логів.
            },
        })
    );

    // Додаємо middleware для обробки CORS (доступу між джерелами).
    app.use(cors());
    // Додаємо middleware для парсингу JSON в запитах.
    app.use(express.json());
        // Додаємо middleware для обробки кукі
    app.use(cookieParser());

    // Налаштовуємо маршрути:
    app.use('/contacts', contactsRouter); // Всі запити на '/contacts' обробляються contactsRouter.
    app.use('/auth', authRouter); // Всі запити на '/auth' обробляються authRouter.

    // Головний маршрут для кореневої сторінки.
    app.get('/', (req, res) => {
        res.json({
            message: 'Hello world!', // Відповідь на запит до кореневого маршруту.
        });
    });

    // Обробка неіснуючих маршрутів (404).
    app.use(notFoundHandler);

    // Обробка помилок.
    app.use(errorHandler);

    // Запускаємо сервер на заданому порті.
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`); // Лог повідомлення про запуск сервера.
    });
};
