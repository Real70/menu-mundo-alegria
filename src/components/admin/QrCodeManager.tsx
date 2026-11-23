import { useEffect, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  QrCode,
  Sparkles,
  Smartphone,
} from 'lucide-react';
import QRCode from 'qrcode';
import { LOGO_URL } from '../../data/menuData';

export function QrCodeManager() {
  const [menuUrl, setMenuUrl] = useState<string>(() => {
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    ) {
      return 'https://menu-mundo-alegria.pages.dev';
    }
    return window.location.origin;
  });
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGeneratingPoster, setIsGeneratingPoster] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    const targetUrl = menuUrl.trim() || window.location.origin;
    QRCode.toDataURL(targetUrl, {
      width: 1024,
      margin: 2,
      color: {
        dark: '#073d77',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => {
        if (active) setQrDataUrl(url);
      })
      .catch(() => {
        // ignore
      });
    return () => {
      active = false;
    };
  }, [menuUrl]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(menuUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleDownloadQrOnly = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = 'qr-menu-mundo-alegria.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadTableTentPoster = async () => {
    if (!qrDataUrl) return;
    setIsGeneratingPoster(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 1650;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Fondo degradado Azul Mundo Alegría
      const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      bgGrad.addColorStop(0, '#073d77');
      bgGrad.addColorStop(0.5, '#0a529e');
      bgGrad.addColorStop(1, '#063262');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Marco interior dorado
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 14;
      ctx.strokeRect(42, 42, canvas.width - 84, canvas.height - 84);

      // Cargar logo y QR
      const loadImage = (src: string) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });

      const [logoImg, qrImg] = await Promise.all([
        loadImage(LOGO_URL),
        loadImage(qrDataUrl),
      ]);

      // Círculo blanco para el logo superior
      ctx.save();
      ctx.beginPath();
      ctx.arc(600, 210, 115, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#fbbf24';
      ctx.stroke();
      ctx.clip();
      ctx.drawImage(logoImg, 490, 100, 220, 220);
      ctx.restore();

      // Título del restaurante
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = '900 56px Poppins, sans-serif';
      ctx.fillText('Restaurante Mundo Alegría', 600, 400);

      // Subtítulo especialidades
      ctx.fillStyle = '#fde68a';
      ctx.font = '700 28px Nunito, sans-serif';
      ctx.fillText('Heladería • Comidas Rápidas • Asados • Diversión', 600, 450);

      // Tarjeta blanca central para el QR
      const cardX = 210;
      const cardY = 510;
      const cardW = 780;
      const cardH = 860;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 42);
      ctx.fill();

      // Encabezado dentro de la tarjeta blanca
      ctx.fillStyle = '#0a529e';
      ctx.font = '900 42px Poppins, sans-serif';
      ctx.fillText('¡ESCANEA NUESTRO MENÚ!', 600, 590);

      ctx.fillStyle = '#475569';
      ctx.font = '700 25px Nunito, sans-serif';
      ctx.fillText('Apunta la cámara de tu celular al código QR', 600, 635);

      // Dibujar el código QR grande
      ctx.drawImage(qrImg, 290, 665, 620, 620);

      // Insignia central con el logo dentro del QR
      ctx.save();
      ctx.beginPath();
      ctx.arc(600, 975, 62, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#fbbf24';
      ctx.stroke();
      ctx.clip();
      ctx.drawImage(logoImg, 542, 917, 116, 116);
      ctx.restore();

      // Pie de la tarjeta blanca
      ctx.fillStyle = '#0f172a';
      ctx.font = '800 26px Poppins, sans-serif';
      ctx.fillText('Pedidos y Domicilios por WhatsApp: 310 221 0949', 600, 1330);

      // Pie inferior sobre el fondo azul
      ctx.fillStyle = '#fbbf24';
      ctx.font = '800 32px Poppins, sans-serif';
      ctx.fillText('¡Gracias por visitarnos! Dios bendiga tu mesa', 600, 1465);

      ctx.fillStyle = '#bfdbfe';
      ctx.font = '600 22px Nunito, sans-serif';
      ctx.fillText(menuUrl, 600, 1520);

      const posterUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = posterUrl;
      a.download = 'hablador-qr-mesa-mundo-alegria.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setIsGeneratingPoster(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-[#0a529e]" />
              <span>Generador Oficial de Código QR para Mesas y WhatsApp</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Este código QR es <strong>100% gratuito y permanente (nunca caduca)</strong>. Lleva a
              tus clientes directamente al menú digital interactivo.
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
            Sin fecha de vencimiento
          </span>
        </div>

        <div className="pt-2">
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
            Enlace Web del Menú Digital (URL que abre el QR)
          </label>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="url"
              value={menuUrl}
              onChange={(e) => setMenuUrl(e.target.value)}
              placeholder="https://menu-mundo-alegria.pages.dev"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-[#0a529e]"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyUrl}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Link</span>
                  </>
                )}
              </button>
              <a
                href={menuUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-[#0a529e] text-xs font-extrabold cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Abrir</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Vista Previa del Hablador de Mesa */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#073d77] via-[#0a529e] to-[#063262] p-4 shadow-2xl border-4 border-amber-400 text-center text-white">
            <div className="border-2 border-amber-400/70 rounded-2xl p-5 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-white p-1 border-2 border-amber-300 shadow-lg flex items-center justify-center">
                <img
                  src={LOGO_URL}
                  alt="Mundo Alegría"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>

              <h3 className="mt-2.5 text-xl font-black font-brand tracking-tight">
                Restaurante Mundo Alegría
              </h3>
              <p className="text-[11px] font-bold text-amber-300">
                Heladería • Comidas Rápidas • Asados • Diversión
              </p>

              <div className="mt-4 w-full bg-white text-slate-900 rounded-2xl p-4 shadow-lg flex flex-col items-center">
                <span className="text-sm font-black text-[#0a529e] tracking-tight font-heading">
                  ¡ESCANEA NUESTRO MENÚ!
                </span>
                <span className="text-[11px] text-slate-500 font-semibold mt-0.5">
                  Apunta la cámara de tu celular al código QR
                </span>

                <div className="relative my-3 w-52 h-52 flex items-center justify-center">
                  {qrDataUrl && (
                    <img
                      src={qrDataUrl}
                      alt="Código QR del Menú Mundo Alegría"
                      className="w-full h-full object-contain"
                    />
                  )}
                  <div className="absolute w-12 h-12 rounded-full bg-white p-0.5 border-2 border-amber-400 shadow-md flex items-center justify-center">
                    <img
                      src={LOGO_URL}
                      alt="Logo central"
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                </div>

                <span className="text-[11px] font-extrabold text-slate-800 bg-amber-100 border border-amber-300 px-3 py-1 rounded-full">
                  WhatsApp Pedidos: 310 221 0949
                </span>
              </div>

              <p className="mt-3 text-xs font-extrabold text-amber-300">
                ¡Gracias por visitarnos! Dios bendiga tu mesa
              </p>
            </div>
          </div>
        </div>

        {/* Botones de Descarga e Instrucciones */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
            <h3 className="text-base font-black text-slate-900">
              Descargar para Imprimir o Enviar por WhatsApp
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Puedes descargar el <strong>Hablador de Mesa completo</strong> (con el diseño azul y
              dorado de Mundo Alegría listo para poner en porta-menús acrílicos en cada mesa, en la
              caja o enviarlo como imagen por WhatsApp) o descargar <strong>solo el cuadro QR</strong>.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                disabled={isGeneratingPoster}
                onClick={handleDownloadTableTentPoster}
                className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#0a529e] hover:bg-[#073d77] active:scale-95 text-white text-xs sm:text-sm font-extrabold shadow-md transition-all cursor-pointer disabled:opacity-60"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>
                  {isGeneratingPoster
                    ? 'Generando Hablador...'
                    : 'Descargar Hablador de Mesa (PNG)'}
                </span>
              </button>

              <button
                type="button"
                onClick={handleDownloadQrOnly}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-extrabold transition-colors cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-[#0a529e]" />
                <span>Solo el QR (1024px)</span>
              </button>
            </div>
          </div>

          <div className="bg-blue-50/80 p-5 rounded-2xl border border-blue-200/80 space-y-2.5">
            <h4 className="text-xs sm:text-sm font-black text-[#0a529e] flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              <span>¿Por qué este QR lleva a la Página Web y cómo usar el PDF?</span>
            </h4>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-4">
              <li>
                <strong>En las mesas del restaurante (Código QR):</strong> Abre la página web al
                instante sin obligar al cliente a descargar archivos en su celular y muestra siempre
                los precios y platos actualizados en tiempo real.
              </li>
              <li>
                <strong>Por chat de WhatsApp (Menú PDF con botón &ldquo;Pedir&rdquo;):</strong> Si un
                cliente te pide la carta por WhatsApp, puedes enviarle tanto el link web como el PDF
                que descargas desde el botón flotante <strong>&ldquo;Imprimir&rdquo;</strong> del
                menú.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
