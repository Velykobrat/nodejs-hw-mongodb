// src/middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    const status = err.status || 500; // Отримання статусу помилки
    res.status(status).json({
        status,
        message: "Something went wrong",
        data: err.message, // Конкретне повідомлення про помилку
    });
};

export default errorHandler;

