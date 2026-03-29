const client = require('prom-client');

// Collect default Node.js metrics (event loop lag, heap, GC, etc.)
client.collectDefaultMetrics({ prefix: 'shopease_' });

// ── Custom HTTP metrics ───────────────────────────────────────────────────────
const httpRequestDuration = new client.Histogram({
  name: 'shopease_http_request_duration_ms',
  help: 'HTTP request duration in milliseconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [1, 5, 10, 25, 50, 100, 250, 500, 1000, 2500],
});

const httpRequestTotal = new client.Counter({
  name: 'shopease_http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

// ── Middleware: record every request ─────────────────────────────────────────
function metricsMiddleware(req, res, next) {
  const startMs = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startMs;
    // Use the matched Express route pattern (e.g. /api/products/:id) not the raw URL
    const route = (req.route && req.route.path)
      ? `${req.baseUrl || ''}${req.route.path}`
      : req.path;

    const labels = {
      method:      req.method,
      route,
      status_code: res.statusCode,
    };

    httpRequestDuration.observe(labels, duration);
    httpRequestTotal.inc(labels);
  });

  next();
}

// ── Route handler: expose metrics to Prometheus ───────────────────────────────
async function metricsHandler(_req, res) {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
}

module.exports = { metricsMiddleware, metricsHandler };
