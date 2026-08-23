require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { connectRedis } = require('./config/redis');
const errorHandler = require('./middleware/errorHandler');

const propertyRoutes = require('./routes/propertyRoutes');
const cacheRoutes = require('./routes/cacheRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/properties', propertyRoutes);
app.use('/api/cache', cacheRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function start() {
    await connectRedis();
    app.listen(PORT, () => {
        console.log(`[server] running on port ${PORT}`);
    });
}

start();
