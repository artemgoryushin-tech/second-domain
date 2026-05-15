import type { Metadata } from "next";
import { BeBrokerCTA } from "@/components/BeBrokerCTA";
import { JsonLd } from "@/components/JsonLd";
import { SectionHeader } from "@/components/SectionHeader";
import { siteConfig } from "@/data/site";

type ToolsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

const defaultValues = {
  ftd: 40,
  cpa: 220,
  activeRate: 55,
  revenuePerTrader: 85,
  revShare: 35,
  months: 6,
  clicks: 5000,
  cpc: 0.42,
  signupRate: 8,
  ftdRate: 18,
  avgCommission: 180
};

const toolsDescription =
  "Calcule CPA vs RevShare, estime ROI de tráfego e use um checklist para comparar programas de afiliados de brokers.";

const checklist = [
  "Comissão publicada ou confirmada por gerente",
  "Regras de qualificação: FTD, depósito mínimo e volume",
  "Países aceitos para Brasil/LATAM",
  "Fontes permitidas: SEO, social, mídia paga, Telegram, influenciadores",
  "Política de brand bidding e uso de marca",
  "Frequência, mínimo e método de pagamento",
  "Acesso a subIDs, postback e relatórios por campanha",
  "Aviso de risco visível em páginas e criativos",
  "Termos de sub-afiliados ou master affiliate",
  "Plano alternativo se CPA cair ou RevShare não reter"
];

export const metadata: Metadata = {
  title: "Calculadoras para afiliados de brokers: CPA, RevShare e ROI",
  description: toolsDescription,
  alternates: {
    canonical: "/ferramentas"
  },
  openGraph: {
    title: "Calculadoras para afiliados de brokers: CPA, RevShare e ROI",
    description: toolsDescription,
    url: `${siteConfig.domain}/ferramentas`
  }
};

function valueOf(
  params: Record<string, string | string[] | undefined>,
  key: keyof typeof defaultValues
) {
  const raw = params[key];
  const value = Array.isArray(raw) ? raw[0] : raw;
  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= 0 ? parsed : defaultValues[key];
}

function money(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function number(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: 1
  }).format(value);
}

function CalculatorInput({
  label,
  name,
  value,
  step = "1",
  suffix
}: {
  label: string;
  name: keyof typeof defaultValues;
  value: number;
  step?: string;
  suffix?: string;
}) {
  return (
    <label className="grid min-w-0 gap-2 overflow-hidden rounded-2xl bg-cream/80 p-4">
      <span className="text-xs font-black uppercase leading-5 tracking-[0.08em] text-muted">{label}</span>
      <span className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <input
          type="number"
          min="0"
          step={step}
          name={name}
          defaultValue={value}
          className="h-12 w-full min-w-0 rounded-2xl border border-line bg-white px-4 text-base font-black text-ink outline-brand"
        />
        {suffix ? <span className="shrink-0 text-sm font-black text-muted">{suffix}</span> : null}
      </span>
    </label>
  );
}

function ResultTile({ label, value, tone = "brand" }: { label: string; value: string; tone?: "brand" | "accent" | "ink" }) {
  const toneClass = tone === "accent" ? "text-accent" : tone === "ink" ? "text-ink" : "text-brand";

  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-line bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase leading-5 tracking-[0.08em] text-muted">{label}</p>
      <p className={`mt-3 break-words text-[1.65rem] font-black leading-tight tracking-tight @3xl:text-3xl ${toneClass}`}>{value}</p>
    </div>
  );
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const params = (await searchParams) ?? {};

  const ftd = valueOf(params, "ftd");
  const cpa = valueOf(params, "cpa");
  const activeRate = valueOf(params, "activeRate");
  const revenuePerTrader = valueOf(params, "revenuePerTrader");
  const revShare = valueOf(params, "revShare");
  const months = valueOf(params, "months");
  const clicks = valueOf(params, "clicks");
  const cpc = valueOf(params, "cpc");
  const signupRate = valueOf(params, "signupRate");
  const ftdRate = valueOf(params, "ftdRate");
  const avgCommission = valueOf(params, "avgCommission");

  const cpaTotal = ftd * cpa;
  const revShareTotal = ftd * (activeRate / 100) * revenuePerTrader * (revShare / 100) * months;
  const revShareBreakEvenMonths =
    ftd * (activeRate / 100) * revenuePerTrader * (revShare / 100) > 0
      ? cpaTotal / (ftd * (activeRate / 100) * revenuePerTrader * (revShare / 100))
      : 0;

  const trafficCost = clicks * cpc;
  const signups = clicks * (signupRate / 100);
  const roiFtd = signups * (ftdRate / 100);
  const trafficRevenue = roiFtd * avgCommission;
  const profit = trafficRevenue - trafficCost;
  const roi = trafficCost > 0 ? (profit / trafficCost) * 100 : 0;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "Calculadoras para afiliados de brokers",
          applicationCategory: "BusinessApplication",
          operatingSystem: "Web",
          url: `${siteConfig.domain}/ferramentas`,
          description: toolsDescription,
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
          }
        }}
      />
      <section className="mx-auto grid max-w-7xl items-start gap-10 px-5 py-16 lg:grid-cols-[1fr_0.38fr]">
        <div>
          <div className="surface-card-strong rounded-[2rem] p-7 md:p-10">
            <SectionHeader
              eyebrow="Ferramentas"
              title="Calculadoras para afiliados de brokers"
              description="Compare CPA, RevShare, ROI de tráfego e critérios operacionais antes de enviar orçamento para uma oferta."
              titleAs="h1"
            />
          </div>

          <form className="@container surface-card mt-10 rounded-[2rem] p-5 md:p-8" method="GET">
            <div className="flex flex-col gap-4 @4xl:flex-row @4xl:items-end @4xl:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">
                  CPA vs RevShare
                </p>
                <h2 className="mt-3 text-2xl font-black tracking-tight text-ink @3xl:text-3xl">
                  Receita estimada por modelo
                </h2>
              </div>
              <button className="w-fit rounded-full bg-brand px-5 py-3 text-sm font-black text-white shadow-soft transition hover:bg-ink">
                Recalcular
              </button>
            </div>

            <div className="mt-7 grid gap-4 @2xl:grid-cols-2 @6xl:grid-cols-3">
              <CalculatorInput label="FTDs aprovados" name="ftd" value={ftd} />
              <CalculatorInput label="CPA por FTD" name="cpa" value={cpa} suffix="US$" />
              <CalculatorInput label="Traders ativos" name="activeRate" value={activeRate} suffix="%" />
              <CalculatorInput label="Receita mensal/trader" name="revenuePerTrader" value={revenuePerTrader} suffix="US$" />
              <CalculatorInput label="RevShare" name="revShare" value={revShare} suffix="%" />
              <CalculatorInput label="Meses de retenção" name="months" value={months} />
            </div>

            <div className="mt-7 grid gap-4 @3xl:grid-cols-3">
              <ResultTile label="Total CPA" value={money(cpaTotal)} />
              <ResultTile label="Total RevShare" value={money(revShareTotal)} tone="accent" />
              <ResultTile label="Break-even RevShare" value={`${number(revShareBreakEvenMonths)} meses`} tone="ink" />
            </div>

            <div className="mt-10 border-t border-line pt-8">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">
                ROI de tráfego
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-ink @3xl:text-3xl">
                Simulador de campanha
              </h2>

              <div className="mt-7 grid gap-4 @2xl:grid-cols-2 @6xl:grid-cols-3">
                <CalculatorInput label="Cliques" name="clicks" value={clicks} />
                <CalculatorInput label="CPC" name="cpc" value={cpc} step="0.01" suffix="US$" />
                <CalculatorInput label="Cadastro" name="signupRate" value={signupRate} step="0.1" suffix="%" />
                <CalculatorInput label="FTD sobre cadastro" name="ftdRate" value={ftdRate} step="0.1" suffix="%" />
                <CalculatorInput label="Comissão média" name="avgCommission" value={avgCommission} suffix="US$" />
              </div>

              <div className="mt-7 grid gap-4 @2xl:grid-cols-2 @6xl:grid-cols-4">
                <ResultTile label="Custo" value={money(trafficCost)} tone="ink" />
                <ResultTile label="FTDs estimados" value={number(roiFtd)} />
                <ResultTile label="Lucro" value={money(profit)} tone={profit >= 0 ? "accent" : "ink"} />
                <ResultTile label="ROI" value={`${number(roi)}%`} tone={roi >= 0 ? "accent" : "ink"} />
              </div>
            </div>
          </form>

          <section className="surface-card mt-10 rounded-[2rem] p-7 md:p-10">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">
              Checklist
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-ink">
              Comparador de programas
            </h2>
            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {checklist.map((item) => (
                <label key={item} className="flex min-w-0 items-start gap-3 rounded-2xl bg-cream/80 p-4">
                  <input
                    type="checkbox"
                    className="mt-1 h-5 w-5 shrink-0 accent-brand"
                    aria-label={item}
                  />
                  <span className="text-sm font-bold leading-6 text-ink">{item}</span>
                </label>
              ))}
            </div>
          </section>
        </div>
        <BeBrokerCTA compact />
      </section>
    </>
  );
}
