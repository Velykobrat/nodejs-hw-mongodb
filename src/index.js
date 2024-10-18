// src/index.js

// Імпортуємо функцію initMongoConnection з модуля, що відповідає за ініціалізацію підключення до MongoDB.
import { initMongoConnection } from './db/initMongoConnection.js';
// Імпортуємо функцію startServer, яка відповідає за запуск веб-сервера.
import { startServer } from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_UPLOAD_DIR, UPLOAD_DIR } from './constants/index.js';

// Оголошуємо асинхронну функцію bootstrap, яка об'єднує ініціалізацію бази даних та запуск сервера.
const bootstrap = async () => {
  // Викликаємо функцію initMongoConnection для підключення до бази даних MongoDB.
  await initMongoConnection();
  await createDirIfNotExists(TEMP_UPLOAD_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  // Запускаємо веб-сервер.
  startServer();
};

// Викликаємо функцію bootstrap для старту програми.
bootstrap();

