import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { handleContactSubmission } from './server/apiHandler.js';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    appType: 'spa',
    plugins: [
      react(),
      {
        name: 'brevo-supabase-api',
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (req.method === 'POST' && req.url === '/api/contact') {
              let bodyStr = '';
              req.on('data', chunk => {
                bodyStr += chunk;
              });

              req.on('end', async () => {
                try {
                  const body = JSON.parse(bodyStr || '{}');
                  const result = await handleContactSubmission(body, { ...process.env, ...env });
                  res.statusCode = result.status;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify(result.body));
                } catch (err) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ success: false, error: 'Invalid JSON request' }));
                }
              });
              return;
            }
            next();
          });
        }
      }
    ],
  };
});

