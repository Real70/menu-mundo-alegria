interface KVNamespaceLike {
  get(key: string): Promise<string | null>;
}

interface Env {
  MUNDO_ALEGRIA_KV?: KVNamespaceLike;
}

export const onRequestGet = async (context: {
  params: { id?: string };
  env: Env;
}) => {
  try {
    const imageId = context.params.id;
    if (!imageId || !context.env.MUNDO_ALEGRIA_KV) {
      return new Response('Imagen no encontrada', { status: 404 });
    }

    const dataUrl = await context.env.MUNDO_ALEGRIA_KV.get(`img:${imageId}`);
    if (!dataUrl) {
      return new Response('Imagen no encontrada', { status: 404 });
    }

    const matches = dataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
    if (!matches) {
      return new Response('Formato de imagen inválido', { status: 500 });
    }

    const contentType = matches[1];
    const base64Data = matches[2];
    const binaryStr = atob(base64Data);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    return new Response(bytes.buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }
};
