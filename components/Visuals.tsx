import Image from "next/image";
import { BrandLogo } from "@/components/BrandLogo";

type VisualTone = "brand" | "accent" | "ink";

type IllustrationAsset = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blend?: boolean;
};

const toneClasses: Record<VisualTone, string> = {
  brand: "from-brand/20 to-blue-50",
  accent: "from-accent/20 to-emerald-50",
  ink: "from-ink/10 to-slate-50"
};

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 88 24" fill="none" aria-hidden="true">
      <path d="M2 12H78" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M68 3L78 12L68 21"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const illustrations = {
  stockMarket: {
    src: "/illustrations/stock-market-monetization.jpg",
    alt: "Ilustração sobre monetização online e investimento",
    width: 5157,
    height: 3438
  },
  coworking: {
    src: "/illustrations/coworking-cloud-team.jpg",
    alt: "Ilustração de equipe conectada por colaboração online",
    width: 5158,
    height: 3438
  },
  testing: {
    src: "/illustrations/testing-team.jpg",
    alt: "Ilustração de equipe testando uma plataforma digital",
    width: 5157,
    height: 3438
  },
  agile: {
    src: "/illustrations/agile-team.jpg",
    alt: "Ilustração de equipe trabalhando em projeto ágil",
    width: 5157,
    height: 3438
  },
  analytics: {
    src: "/illustrations/eye-tracking-analytics.jpg",
    alt: "Ilustração de análise de atenção e métricas digitais",
    width: 5157,
    height: 3438
  },
  platform: {
    src: "/illustrations/platform-development.jpg",
    alt: "Ilustração de desenvolvimento de plataforma digital",
    width: 5157,
    height: 3438
  },
  idea: {
    src: "/illustrations/innovative-idea.jpg",
    alt: "Ilustração de ideia inovadora",
    width: 2000,
    height: 2000
  },
  dollar: {
    src: "/illustrations/dollar-bill.jpg",
    alt: "Ilustração de nota de cem dólares",
    width: 3000,
    height: 2000
  },
  crowdfunding: {
    src: "/illustrations/crowdfunding.jpg",
    alt: "Ilustração de financiamento coletivo e crescimento",
    width: 7730,
    height: 7730
  },
  stockExchangeData2: {
    src: "/illustrations/stock-exchange-data-2-transparent.png",
    alt: "Ilustração de dados de bolsa e análise de mercado",
    width: 3000,
    height: 2000,
    blend: false
  },
  resellerAffiliate: {
    src: "/illustrations/reseller-affiliate-transparent.png",
    alt: "Ilustração de revenda e parceria de afiliados",
    width: 2000,
    height: 2000,
    blend: false
  },
  cryptoTradingBot: {
    src: "/illustrations/crypto-trading-bot-transparent.png",
    alt: "Ilustração de bot de trading cripto e automação",
    width: 2400,
    height: 2400,
    blend: false
  },
  businessIdeaGeneration: {
    src: "/illustrations/business-idea-generation-transparent.png",
    alt: "Ilustração de geração de ideia de negócio digital",
    width: 2400,
    height: 2400,
    blend: false
  },
  creativeCollaboration: {
    src: "/illustrations/creative-collaboration-transparent.png",
    alt: "Ilustração de colaboração criativa e programa de parceria",
    width: 2400,
    height: 2400,
    blend: false
  },
  traderWorking: {
    src: "/illustrations/trader-working-transparent.png",
    alt: "Ilustração de trader trabalhando com dados de mercado",
    width: 2000,
    height: 2000,
    blend: false
  },
  stockMarketScreen: {
    src: "/illustrations/stock-market-screen-transparent.png",
    alt: "Ilustração de tela com gráfico de mercado financeiro",
    width: 3000,
    height: 2000,
    blend: false
  },
  cryptoTradingDesk: {
    src: "/illustrations/crypto-trading-desk-transparent.png",
    alt: "Ilustração de mesa de trading de criptomoedas",
    width: 2400,
    height: 2400,
    blend: false
  },
  financeLeaders: {
    src: "/illustrations/finance-leaders-transparent.png",
    alt: "Ilustração de líderes financeiros analisando crescimento",
    width: 3000,
    height: 2000,
    blend: false
  },
  stockExchangeData: {
    src: "/illustrations/stock-exchange-data-transparent.png",
    alt: "Ilustração de dados de bolsa de valores",
    width: 3000,
    height: 2000,
    blend: false
  }
} satisfies Record<string, IllustrationAsset>;

export const visualIllustrations = illustrations;

function IllustrationImage({
  asset,
  className = "",
  imageClassName = "object-contain",
  priority = false,
  blend = true
}: {
  asset: IllustrationAsset;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  blend?: boolean;
}) {
  const useBlend = blend && asset.blend !== false;

  return (
    <div className={`media-frame relative w-full overflow-hidden rounded-[1.75rem] ${className}`}>
      <Image
        src={asset.src}
        alt={asset.alt}
        fill
        sizes="(min-width: 1280px) 560px, (min-width: 1024px) 42vw, 100vw"
        priority={priority}
        className={`object-contain p-4 ${useBlend ? "mix-blend-multiply" : ""} ${imageClassName}`}
      />
    </div>
  );
}

export function HeroVisual() {
  const checks = ["CPA que paga", "RevShare que escala", "FTD aprovado", "Sem conta bloqueada"];

  return (
    <div className="relative self-center overflow-hidden rounded-[2rem] bg-white/85 p-5 shadow-soft md:p-6">
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand/10 blur-sm" />
      <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-accent/10 blur-sm" />
      <div className="relative grid gap-4">
        <IllustrationImage
          asset={illustrations.stockMarket}
          className="aspect-[1.35]"
          imageClassName="object-contain object-center"
          priority
        />
        <div className="rounded-3xl bg-ink p-4 text-white sm:p-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/60 sm:text-sm">
              Escolha com ROI
            </p>
            <p className="text-sm font-black text-accent">Brasil/LATAM</p>
          </div>
          <div className="mt-4 grid gap-2 min-[420px]:grid-cols-2 sm:gap-3">
            {checks.map((label) => (
              <div key={label} className="flex min-w-0 items-center gap-2 rounded-2xl bg-white/10 p-2.5 sm:gap-3 sm:p-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-black text-ink sm:h-7 sm:w-7 sm:text-sm">
                  ✓
                </span>
                <p className="min-w-0 text-sm font-bold leading-5 text-white/85">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-3 min-[420px]:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">Para comparar</p>
            <p className="mt-2 text-lg font-black text-ink">Programas de afiliados</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">Para crescer</p>
            <p className="mt-2 text-lg font-black text-ink">Marca própria</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function categoryIllustration(label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("forex")) {
    return illustrations.stockExchangeData;
  }

  if (normalized.includes("trading")) {
    return illustrations.stockMarketScreen;
  }

  if (normalized.includes("cripto") || normalized.includes("fintech")) {
    return illustrations.cryptoTradingDesk;
  }

  return illustrations.analytics;
}

export function CategoryVisual({ label, tone = "brand" }: { label: string; tone?: VisualTone }) {
  return (
    <div className={`overflow-hidden rounded-3xl bg-gradient-to-br ${toneClasses[tone]} p-4`}>
      <div className="grid gap-4">
        <IllustrationImage
          asset={categoryIllustration(label)}
          className="aspect-[1.8]"
          imageClassName="object-contain object-center"
        />
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">Categoria</p>
          <p className="mt-2 text-lg font-black text-ink">{label}</p>
        </div>
      </div>
    </div>
  );
}

export function FunnelVisual() {
  const steps = ["Tráfego", "Página", "FTD", "Pagamento"];

  return (
    <div className="surface-card rounded-[2rem] p-6">
      <IllustrationImage
        asset={illustrations.creativeCollaboration}
        className="mb-6 aspect-[2.4]"
        imageClassName="object-contain object-center"
      />
      <p className="inline-flex rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand">Funil de afiliados</p>
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        {steps.map((step, index) => (
          <div key={step} className="relative rounded-2xl bg-cream/80 p-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-muted">
              Etapa {index + 1}
            </p>
            <p className="mt-2 text-lg font-black text-ink">{step}</p>
            {index < steps.length - 1 ? (
              <Arrow className="absolute -right-8 top-1/2 hidden h-6 w-12 -translate-y-1/2 text-brand md:block" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CommissionVisual() {
  return (
    <div className="surface-card rounded-[2rem] p-6">
      <IllustrationImage
        asset={illustrations.financeLeaders}
        className="mb-6 aspect-[2.4]"
        imageClassName="object-contain object-center"
      />
      <p className="inline-flex rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand">
        Lógica de comissão
      </p>
      <div className="mt-6 grid grid-cols-[repeat(auto-fit,minmax(12rem,1fr))] gap-4">
        {[
          ["CPA", "Recebimento mais rápido", "Pagamento fixo após qualificação"],
          ["RevShare", "Potencial futuro", "Valor recorrente pela atividade"],
          ["Híbrido", "Equilíbrio", "Menos risco com potencial futuro"]
        ].map(([title, badge, copy]) => (
          <div key={title} className="rounded-2xl bg-cream/80 p-5">
            <span className="inline-flex w-fit whitespace-nowrap rounded-full bg-white px-3 py-1 text-xs font-black leading-5 text-brand">
              {badge}
            </span>
            <p className="mt-4 text-2xl font-black text-ink">{title}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TrafficSourcesVisual({ sources }: { sources: string[] }) {
  return (
    <div className="surface-card rounded-[2rem] p-6">
      <IllustrationImage
        asset={illustrations.stockExchangeData2}
        className="mb-6 aspect-[2.4]"
        imageClassName="object-contain object-center"
      />
      <p className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-accent">Fontes de tráfego</p>
      <div className="mt-6 grid gap-3">
        {sources.slice(0, 5).map((source) => (
          <div key={source} className="rounded-2xl bg-cream/80 p-4">
            <p className="text-sm font-bold leading-6 text-ink">{source}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WhiteLabelFlowVisual() {
  const steps = [
    {
      title: "Aquisição de tráfego",
      copy: "Você já entende canais, criativos, CAC e qualidade dos leads."
    },
    {
      title: "Corretora white label",
      copy: "A tecnologia, pagamentos e painel operacional entram como infraestrutura pronta."
    },
    {
      title: "Marca própria",
      copy: "O afiliado deixa de capturar só comissão e passa a construir um ativo."
    }
  ];

  return (
    <div className="surface-card rounded-[2rem] p-6">
      <p className="inline-flex rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand">
        De afiliado a dono da marca
      </p>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="relative rounded-2xl bg-cream/80 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-sm font-black text-brand shadow-sm">
                {index + 1}
              </span>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-muted">
                Fase {index + 1}
              </p>
            </div>
            <p className="mt-4 text-lg font-black text-ink">{step.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted">{step.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function brandReviewIllustration(slug: string) {
  const assets: Record<string, IllustrationAsset> = {
    "pocket-option-affiliate-program": illustrations.traderWorking,
    "quotex-affiliate-program": illustrations.stockExchangeData2,
    "iq-option-affiliate-program": illustrations.businessIdeaGeneration,
    "olymp-trade-affiliate-program": illustrations.creativeCollaboration,
    "deriv-affiliate-program": illustrations.cryptoTradingBot
  };

  return assets[slug] ?? illustrations.financeLeaders;
}

export function BrandReviewVisual({
  slug,
  name,
  keyword
}: {
  slug: string;
  name: string;
  keyword: string;
}) {
  const asset = brandReviewIllustration(slug);

  return (
    <div className="surface-card-strong min-w-0 overflow-hidden rounded-[2rem] p-5 md:p-6">
      <IllustrationImage
        asset={asset}
        className="aspect-[1.65]"
        imageClassName="object-contain object-center"
      />
      <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 2xl:grid-cols-2">
        <div className="flex min-w-0 items-center gap-3 rounded-2xl bg-white p-4">
          <BrandLogo slug={slug} name={name} size="md" />
          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">Análise de marca</p>
            <p className="mt-1 text-balance text-lg font-black leading-snug tracking-tight text-ink">{name}</p>
          </div>
        </div>
        <div className="min-w-0 rounded-2xl bg-ink p-4 text-white">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/60">Busca alvo</p>
          <p className="mt-2 text-balance text-sm font-black leading-6 text-white/90">{keyword}</p>
        </div>
      </div>
    </div>
  );
}

export function MetricsVisual({ metrics }: { metrics: string[] }) {
  return (
    <div className="surface-card rounded-[2rem] p-6">
      <IllustrationImage
        asset={illustrations.testing}
        className="mb-6 aspect-[2.4]"
        imageClassName="object-contain object-center"
      />
      <p className="inline-flex rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand">
        Resumo de métricas
      </p>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        {metrics.slice(0, 6).map((metric) => (
          <div key={metric} className="rounded-2xl bg-cream/80 p-4">
            <p className="text-sm font-black leading-6 text-ink">{metric}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
