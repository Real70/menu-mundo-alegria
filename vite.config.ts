import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

function mundoAlegriaLocalApi(): Plugin {
  const catalogPath = path.resolve(process.cwd(), 'src/data/catalog.json');
  const imagesDir = path.resolve(process.cwd(), 'public/images/products');

  const setupMiddleware = (middlewares: any) => {
    middlewares.use(async (req: any, res: any, next: any) => {
      if (!req.url) return next();
      const urlPath = req.url.split('?')[0];

      if (urlPath === '/api/catalog' && req.method === 'GET') {
        try {
          if (fs.existsSync(catalogPath)) {
            const raw = fs.readFileSync(catalogPath, 'utf-8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(raw);
            return;
          }
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'catalog.json no encontrado' }));
          return;
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: String(err) }));
          return;
        }
      }

      if (urlPath === '/api/catalog' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const parsed = JSON.parse(body);
            if (!Array.isArray(parsed.categories) || !Array.isArray(parsed.items)) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Formato de catálogo inválido' }));
              return;
            }
            const payload = {
              categories: parsed.categories,
              items: parsed.items,
              updatedAt: new Date().toISOString(),
            };
            fs.mkdirSync(path.dirname(catalogPath), { recursive: true });
            fs.writeFileSync(catalogPath, JSON.stringify(payload, null, 2), 'utf-8');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ ok: true, updatedAt: payload.updatedAt }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
        return;
      }

      if (urlPath === '/api/upload-image' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => {
          body += chunk.toString();
        });
        req.on('end', () => {
          try {
            const { fileName, dataUrl } = JSON.parse(body);
            if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Imagen inválida' }));
              return;
            }

            const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
            if (!matches) {
              res.statusCode = 400;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Formato Base64 inválido' }));
              return;
            }

            const mimeSub = matches[1].toLowerCase();
            const base64Data = matches[2];
            const ext =
              mimeSub === 'jpeg'
                ? 'jpg'
                : mimeSub === 'svg+xml'
                  ? 'svg'
                  : mimeSub.replace(/[^a-z0-9]/g, '');

            const baseName = (fileName || 'producto')
              .replace(/\.[^/.]+$/, '')
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '') || 'producto';

            const finalFileName = `${baseName}-${Date.now()}.${ext}`;
            fs.mkdirSync(imagesDir, { recursive: true });
            const filePath = path.join(imagesDir, finalFileName);
            fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(
              JSON.stringify({
                ok: true,
                imageUrl: `/images/products/${finalFileName}`,
              })
            );
          } catch (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
        return;
      }

      next();
    });
  };

  return {
    name: 'mundo-alegria-local-api',
    configureServer(server) {
      setupMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      setupMiddleware(server.middlewares);
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), mundoAlegriaLocalApi()],
  server: {
    watch: {
      ignored: ['**/src/data/catalog.json'],
    },
  },
});
