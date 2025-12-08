const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration for your microservices
const services = {
    auth: {
        url: process.env.AUTH_SERVICE_URL || 'http://localhost:3030',
        routes: ['/users'] // Paths to route to the auth service
    },
    // Future services placeholders
    // sensor: {
    //     url: process.env.SENSOR_SERVICE_URL || 'http://localhost:3031',
    //     routes: ['/sensors', '/data']
    // },
    // chatbot: {
    //     url: process.env.CHATBOT_SERVICE_URL || 'http://localhost:3032',
    //     routes: ['/chat', '/bot']
    // }
};

// Apply CORS globally - adjust origin as needed for your client
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173', // Vite default
    credentials: true
}));

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'API Gateway is running' });
});

// Set up proxies
// Loop through services and setup proxy middleware
Object.entries(services).forEach(([name, service]) => {
    service.routes.forEach(route => {
        app.use(route, createProxyMiddleware({
            target: service.url,
            changeOrigin: true,
            pathRewrite: {
                // You can rewrite paths here if needed. 
                // For example if the service expects /api/v1/users but you expose /users
                // [`^${route}`]: '' 
            },
            onProxyReq: (proxyReq, req, res) => {
                // You can add custom headers here, e.g. for internal auth
                // proxyReq.setHeader('X-Gateway-Secret', process.env.GATEWAY_SECRET);
                console.log(`[Gateway] Proxying ${req.method} ${req.originalUrl} -> ${service.url}`);
            },
            onError: (err, req, res) => {
                console.error(`[Gateway] Error proxying to ${name} service:`, err.message);
                res.status(502).json({ error: `Service ${name} unavailable` });
            }
        }));
    });
});

app.listen(PORT, () => {
    console.log(`API Gateway running on http://localhost:${PORT}`);
    console.log('Configured services:', Object.keys(services).join(', '));
});






