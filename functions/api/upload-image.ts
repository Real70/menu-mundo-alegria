interface KVNamespaceLike {
  put(key: string, value: string): Promise<void>;
}

interface Env {
  MUNDO_ALEGRIA_KV?: KVNamespaceLike;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const { fileName, dataUrl } = (await context.request.json()) as {
      fileName?: string;
      dataUrl?: string;
    };

    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.startsWith('data:image/')) {
      return new Response(JSON.stringify({ error: 'Imagen inválida' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!context.env.MUNDO_ALEGRIA_KV) {
      return new Response(JSON.stringify({ ok: true, imageUrl: dataUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const baseName =
      (fileName || 'producto')
        .replace(/\.[^/.]+$/, '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || 'producto';

    const imageId = `${baseName}-${Date.now()}`;
    await context.env.MUNDO_ALEGRIA_KV.put(`img:${imageId}`, dataUrl);

    return new Response(
      JSON.stringify({
        ok: true,
        imageUrl: `/api/images/${imageId}`,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
