const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./db/database');
const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const { metricsMiddleware, metricsHandler } = require('./metrics');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());
app.use(metricsMiddleware);

// Initialize DB (creates tables & seeds data if empty)
initializeDatabase();

app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Prometheus metrics — scraped by the ServiceMonitor every 15 s
app.get('/api/metrics', metricsHandler);

app.listen(PORT, () => {
  console.log(`ShopEase backend running at http://localhost:${PORT}`);
});
