// src/index.js

// Імпортуємо функцію initMongoConnection з модуля, що відповідає за ініціалізацію підключення до MongoDB.
import { initMongoConnection } from './db/initMongoConnection.js';
// Імпортуємо функцію startServer, яка відповідає за запуск веб-сервера.
import { startServer } from './server.js';

// Оголошуємо асинхронну функцію bootstrap, яка об'єднує ініціалізацію бази даних та запуск сервера.
const bootstrap = async () => {
  // Викликаємо функцію initMongoConnection для підключення до бази даних MongoDB.
  await initMongoConnection();
  // Запускаємо веб-сервер.
  startServer();
};

// Викликаємо функцію bootstrap для старту програми.
bootstrap();

