import defaultCatalog from '../../src/data/catalog.json';

interface KVNamespaceLike {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

interface Env {
  MUNDO_ALEGRIA_KV?: KVNamespaceLike;
}

const CATALOG_KEY = 'catalog_v1';

export const onRequestGet = async (context: { env: Env }) => {
  try {
    if (context.env.MUNDO_ALEGRIA_KV) {
      const stored = await context.env.MUNDO_ALEGRIA_KV.get(CATALOG_KEY);
      if (stored) {
        return new Response(stored, {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
          },
        });
      }
    }

    return new Response(JSON.stringify(defaultCatalog), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const body = (await context.request.json()) as {
      categories?: unknown[];
      items?: unknown[];
    };

    if (!Array.isArray(body.categories) || !Array.isArray(body.items)) {
      return new Response(JSON.stringify({ error: 'Formato de catálogo inválido' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload = {
      categories: body.categories,
      items: body.items,
      updatedAt: new Date().toISOString(),
    };

    if (context.env.MUNDO_ALEGRIA_KV) {
      await context.env.MUNDO_ALEGRIA_KV.put(CATALOG_KEY, JSON.stringify(payload));
    }

    return new Response(JSON.stringify({ ok: true, updatedAt: payload.updatedAt }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
