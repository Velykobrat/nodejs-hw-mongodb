import express from 'express';

export const startServer = () => {
    const app = express();

    const PORT = 3000;

    app.use('*', (req, res, next) => {
        console.log(`Time: ${new Date().toLocaleString()}`);
        next();
    });

    app.get('/', (req, res) => {
        res.json({
            message: 'Hello world!',
        });
    });

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
