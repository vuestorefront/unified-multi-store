import { createServer }  from '@vue-storefront/middleware';
import { middlewareConfig } from './middleware.config';
const cors = require('cors');

const CORS_MIDDLEWARE_NAME = 'corsMiddleware';

export const buildApp = async (config) => {
  const app = await createServer(config);

  const corsMiddleware = app._router.stack.find(
    (middleware) => middleware.name === CORS_MIDDLEWARE_NAME
  );

  corsMiddleware.handle = cors({
    origin: 'http://localhost:3000',
    credentials: true
  });

  return app;
};

(async () => {
  const app = await createServer({ integrations: middlewareConfig.integrations });

  const corsMiddleware = app._router.stack.find(
    (middleware) => middleware.name === CORS_MIDDLEWARE_NAME
  );

  corsMiddleware.handle = cors({
    origin: process.env.MIDDLEWARE_ALLOWED_ORIGINS.split(','),
    credentials: true
  });

  app.listen(8181, () => {
    console.log('Middleware started');
  });
})();