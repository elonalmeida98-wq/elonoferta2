import { useState, useEffect, useRef } from 'react';

const CHECKOUT_URL = 'https://payblack.co.mz/checkout/b2fa73e0-c6af-4f6d-8b80-a5df1cb8d3ec';
const PLAYER_ACCOUNT = '1c049ea8-b7d4-4846-a066-e842abb5715b';
const PLAYER_ID = '6a1b3b33e6e441f74424f3aa';
const CTA_DELAY = 540;

const MOCAMBICAN_CITIES = [
  'Maputo', 'Matola', 'Nampula', 'Beira', 'Quelimane',
  'Tete', 'Lichinga', 'Pemba', 'Xai-Xai', 'Inhambane',
  'Chimoio', 'Maxixe', 'Angoche', 'Dondo', 'Cuamba',
  'Ilha de Moçambique', 'Mocuba', 'Moatize', 'Nacala', 'Gurué'
];

function getRandomCity() {
  return MOCAMBICAN_CITIES[Math.floor(Math.random() * MOCAMBICAN_CITIES.length)];
}

function getViewerCount() {
  const base = 120;
  return Math.floor(base + Math.random() * 300);
}

function useGeolocation() {
  const [city, setCity] = useState(null);

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => setCity(d.city || getRandomCity()))
      .catch(() => setCity(getRandomCity()));
  }, []);

  return city;
}

function useViewerCount() {
  const [count, setCount] = useState(getViewerCount());

  useEffect(() => {
    const interval = setInterval(() => {
      const variation = Math.floor(Math.random() * 11) - 5;
      setCount(prev => Math.max(85, prev + variation));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return count;
}

function MpesaIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#4CAF50" />
      <path d="M7 17V7h2.5l2.5 6.5L14.5 7H17v10h-2v-6.5L12.5 17h-1L9 10.5V17H7z" fill="white" />
    </svg>
  );
}

function EmolaIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="6" fill="#FF9800" />
      <path d="M7 7h2.5c2.5 0 4 1.5 4 3.5S12 14 9.5 14H9v3H7V7zm2 4.5h.5c1 0 1.5-.7 1.5-1.5S10.5 8.5 9.5 8.5H9v3z" fill="white" />
      <path d="M15 7h2v10h-2V7z" fill="white" opacity="0.7" />
    </svg>
  );
}

function ShieldIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function LightningIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function CheckIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function ArrowIcon({ className = 'w-4 h-4' }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}

export default function App() {
  const [ctaVisible, setCtaVisible] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const city = useGeolocation();
  const viewers = useViewerCount();
  const playerRef = useRef(null);

  useEffect(() => {
    const existing = document.querySelector(`script[src*="converteai.net/${PLAYER_ACCOUNT}"]`);
    if (existing) {
      setVideoLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://scripts.converteai.net/${PLAYER_ACCOUNT}/players/${PLAYER_ID}/v4/player.js`;
    script.async = true;
    script.onload = () => setVideoLoaded(true);
    document.head.appendChild(script);

    return () => {
      const s = document.querySelector(`script[src*="converteai.net/${PLAYER_ACCOUNT}"]`);
      if (s) s.remove();
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setCtaVisible(true), CTA_DELAY * 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCtaClick = () => {
    fbq('track', 'Purchase', { value: 1, currency: 'MZN' });
    window.open(CHECKOUT_URL, '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground">

      <nav className="flex items-center justify-between px-6 h-16 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">Dra. Carla</span>
          <span className="text-sm text-white/40">|</span>
          <span className="text-sm text-white/40">Potência Na Hora H</span>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8">

        <section className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-white/50">
              {viewers} pessoas em {city || 'Moçambique'} estão assistindo agora
            </span>
          </div>

          <h1 className="text-4xl font-bold leading-tight mb-4">
            Potência Na <span className="text-primary">Hora H</span>
          </h1>
          <p className="text-sm text-white/45 max-w-lg mx-auto leading-relaxed">
            Descubra o método científico que está a transformar a vida de milhares de homens em Moçambique.
          </p>
        </section>

        <section className="relative aspect-video rounded-xl overflow-hidden bg-black mb-6">
          <div
            ref={playerRef}
            id={`player_${PLAYER_ID}`}
            className="w-full h-full"
          />
          {!videoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-primary animate-spin" />
            </div>
          )}
        </section>

        <section className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 text-xs text-white/30 mb-6">
            <span className="flex items-center gap-1">
              <ShieldIcon /> Compra segura
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1">
              <LightningIcon /> Entrega imediata
            </span>
            <span className="w-px h-3 bg-white/10" />
            <span className="flex items-center gap-1">
              <CheckIcon /> Acesso vitalício
            </span>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-secondary/50 border border-white/[0.06]">
            <h3 className="text-sm font-medium mb-2 text-primary">Resultados Reais</h3>
            <p className="text-xs text-white/45 leading-relaxed">
              Baseado em estudos clínicos e testado por centenas de homens em todo o país.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50 border border-white/[0.06]">
            <h3 className="text-sm font-medium mb-2 text-primary">100% Natural</h3>
            <p className="text-xs text-white/45 leading-relaxed">
              Fórmula completamente natural, sem efeitos colaterais e com resultados duradouros.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50 border border-white/[0.06]">
            <h3 className="text-sm font-medium mb-2 text-primary">Suporte 24/7</h3>
            <p className="text-xs text-white/45 leading-relaxed">
              Equipa de suporte disponível todos os dias para tirar as suas dúvidas.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-secondary/50 border border-white/[0.06]">
            <h3 className="text-sm font-medium mb-2 text-primary">Garantia 30 Dias</h3>
            <p className="text-xs text-white/45 leading-relaxed">
              Satisfação garantida ou o seu dinheiro de volta nos primeiros 30 dias.
            </p>
          </div>
        </section>

        <section className="flex items-center justify-center gap-6 mb-8">
          <div className="flex items-center gap-2">
            <MpesaIcon className="w-8 h-8" />
            <div className="text-left">
              <p className="text-sm font-medium text-white">M-Pesa</p>
              <p className="text-[10px] text-white/35">Vodacom</p>
            </div>
          </div>
          <div className="w-px h-8 bg-white/[0.06]" />
          <div className="flex items-center gap-2">
            <EmolaIcon className="w-8 h-8" />
            <div className="text-left">
              <p className="text-sm font-medium text-white">e-Mola</p>
              <p className="text-[10px] text-white/35">Movitel</p>
            </div>
          </div>
        </section>

        {ctaVisible && (
          <section className="text-center mb-12 animate-fade-in">
            <div className="p-6 rounded-2xl bg-secondary/50 border border-white/[0.06]">
              <p className="text-sm text-white/35 mb-2">Oferta por tempo limitado</p>
              <h2 className="text-2xl font-bold mb-4">
                Não perca esta <span className="text-primary">oportunidade</span>
              </h2>
              <p className="text-sm text-white/45 mb-6 max-w-md mx-auto">
                De <span className="line-through text-white/30">3.500 MT</span>{' '}
                <span className="text-primary font-bold text-lg">1.500 MT</span>
              </p>
              <button
                onClick={handleCtaClick}
                className="w-full max-w-md mx-auto block cursor-pointer px-8 py-4 rounded-xl text-base font-bold transition-all duration-300 bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-[0_8px_32px_rgba(249,116,21,0.25)]"
              >
                Quero o meu energizante
                <ArrowIcon className="inline-block ml-2" />
              </button>
              <div className="flex items-center justify-center gap-2 mt-3">
                <ShieldIcon className="w-3 h-3 text-green-500" />
                <span className="text-xs text-white/30">Pagamento 100% seguro via PAYBLACK</span>
              </div>
            </div>
          </section>
        )}

        {!ctaVisible && (
          <section className="text-center mb-12">
            <div className="p-6 rounded-2xl bg-secondary/50 border border-white/[0.06]">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm text-white/50">A aguardar...</span>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>
              <p className="text-xs text-white/35">
                O botão de compra aparecerá automaticamente após assistir ao vídeo completo.
              </p>
            </div>
          </section>
        )}

      </main>

      <footer className="border-t border-white/[0.06] py-8 mt-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} Dra. Carla - Potência Na Hora H. Todos os direitos reservados.
          </p>
          <p className="text-[10px] text-white/10 mt-2">
            Este site não é afiliado ao Facebook. As declarações não foram avaliadas pela ANSA.
          </p>
        </div>
      </footer>

    </div>
  );
}
