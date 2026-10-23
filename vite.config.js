import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { scanTranscript, PROMPT_GUARD_MODEL } from './src/services/promptGuardCore.js';

function promptGuardServerPlugin() {
  let env = {};
  return {
    name: 'prompt-guard-server-plugin',
    configResolved(config) {
      env = loadEnv(config.mode, process.cwd(), '');
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Health check endpoint
        if (req.url === '/api/security/health' && req.method === 'GET') {
          const apiKey = process.env.GROQ_API_KEY || env.GROQ_API_KEY;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            status: 'online',
            model: PROMPT_GUARD_MODEL,
            isKeyConfigured: Boolean(apiKey && apiKey.trim().length > 0),
          }));
          return;
        }

        // Server-side Prompt Guard scan endpoint (Requirement 10: keeps secrets on server)
        if (req.url === '/api/security/scan' && req.method === 'POST') {
          let body = '';
          req.on('data', chunk => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(body || '{}');
              const apiKey = process.env.GROQ_API_KEY || env.GROQ_API_KEY;

              if (!apiKey) {
                res.statusCode = 503;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  status: 'Scan unavailable',
                  error: 'GROQ_API_KEY is not configured in server environment variables.',
                }));
                return;
              }

              const result = await scanTranscript({
                text: parsed.text,
                apiKey,
                model: PROMPT_GUARD_MODEL,
              });

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                status: 'Scan unavailable',
                error: err.message,
              }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), promptGuardServerPlugin()],
  test: {
    globals: true,
    environment: 'node',
  },
});
