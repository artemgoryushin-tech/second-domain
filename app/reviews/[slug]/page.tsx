import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "@/components/ExternalLink";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { BeBrokerCTA } from "@/components/BeBrokerCTA";
import { SourceList } from "@/components/SourceList";
import { BrandReviewVisual, CommissionVisual, TrafficSourcesVisual } from "@/components/Visuals";
import {
  brandReviewSeoContent,
  editorialProfile,
  programDeepDives,
  programs,
  rankings,
  reviewSeoEnhancements,
  siteConfig
} from "@/data/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const categoryBrazilNotes: Record<string, string[]> = {
  broker: [
    "Confirme entidade, país aceito e produto disponível antes de publicar como opção para o Brasil.",
    "Para forex/CFDs, inclua aviso de risco e evite tratar bônus, alavancagem ou copy trading como vantagem garantida.",
    "Priorize conteúdo educativo e comparativo; tráfego frio direto tende a gerar cadastro barato e FTD de baixa qualidade."
  ],
  forex: [
    "Verifique se LATAM/Brasil entram na tabela de CPA ou no acordo de IB antes de projetar ROI.",
    "Compare CPA bruto com CPA líquido após depósito mínimo, volume de negociação, hold e reprovações.",
    "Conteúdo em português, YouTube educativo e SEO de comparação costumam gerar traders mais qualificados que promessa de lucro rápido."
  ],
  trading: [
    "Opções digitais e trading de curto prazo exigem comunicação conservadora e risco muito visível.",
    "Separe campanhas por país, criativo e fonte para entender quais FTDs viram traders ativos.",
    "Antes de usar Telegram, influenciadores ou anúncios nativos, peça regras por escrito ao programa."
  ],
  cripto: [
    "Valide disponibilidade local, elegibilidade do afiliado e regras por produto: spot, futuros, margem ou campanhas específicas.",
    "Inclua risco de criptoativos e evite prometer retorno com trading, staking ou bônus.",
    "Meça volume e trader ativo; cadastro sem negociação raramente sustenta comissão recorrente."
  ],
  fintech: [
    "Confirme regras de dados, pagamentos, comunicação comercial e países aceitos antes de criar campanhas.",
    "Use conteúdo educativo para explicar produto e reduzir tráfego curioso de baixa intenção.",
    "Compare receita por usuário ativo com custo de aquisição, não apenas comissão anunciada."
  ]
};

export function generateStaticParams() {
  return programs.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const program = programs.find((item) => item.slug === slug);

  if (!program) {
    return {};
  }

  const brandSeo = brandReviewSeoContent[program.slug];
  const title = brandSeo?.metaTitle ?? `${program.name} análise do programa de afiliados`;
  const description = brandSeo?.metaDescription ?? program.verdict;

  return {
    title,
    description,
    alternates: {
      canonical: `/reviews/${program.slug}`
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.domain}/reviews/${program.slug}`
    }
  };
}

export default async function ReviewPage({ params }: PageProps) {
  const { slug } = await params;
  const program = programs.find((item) => item.slug === slug);

  if (!program) {
    notFound();
  }

  const alternatives = [
    ...programs.filter((item) => item.slug !== program.slug && item.category === program.category),
    ...programs.filter((item) => item.slug !== program.slug && item.category !== program.category)
  ].slice(0, 3);
  const relatedRanking = rankings.find(
    (ranking) => ranking.category === program.category || ranking.category === "all"
  );
  const deepDive = programDeepDives[program.slug];
  const seoEnhancement = reviewSeoEnhancements[program.slug];
  const brandSeo = brandReviewSeoContent[program.slug];
  const pageHeadline = brandSeo?.h1 ?? `${program.name} análise do programa de afiliados`;
  const pageDescription = brandSeo?.metaDescription ?? program.verdict;
  const pageUrl = `${siteConfig.domain}/reviews/${program.slug}`;
  const localNotes = categoryBrazilNotes[program.category] ?? categoryBrazilNotes.broker;
  const faqItems = [
    ...(brandSeo?.faq ?? []),
    ...(seoEnhancement?.faq ?? []),
    {
      question: `${program.name} é bom para afiliados brasileiros?`,
      answer:
        "Depende do mercado aceito, do canal de tráfego e dos termos atuais. Use esta análise como ponto de partida e confirme as regras no programa oficial."
    },
    {
      question: "Posso promover trading com anúncios pagos?",
      answer:
        "Somente se as políticas do programa e das plataformas de mídia permitirem. Evite promessas de lucro e promessas financeiras agressivas."
    }
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `${pageUrl}#article`,
          headline: pageHeadline,
          description: pageDescription,
          image: `${siteConfig.domain}/illustrations/stock-market-monetization.jpg`,
          inLanguage: "pt-BR",
          mainEntityOfPage: pageUrl,
          datePublished: program.lastChecked,
          dateModified: program.lastChecked,
          isPartOf: {
            "@type": "WebSite",
            "@id": `${siteConfig.domain}#website`,
            name: siteConfig.name,
            url: siteConfig.domain
          },
          author: {
            "@type": "Organization",
            name: editorialProfile.author,
            url: `${siteConfig.domain}${editorialProfile.policyUrl}`
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.domain
          },
          about: {
            "@type": "Organization",
            name: program.name,
            url: program.officialUrl
          }
        }}
      />
      {brandSeo ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: `Como funciona ${brandSeo.primaryKeyword}`,
            description: brandSeo.quickAnswer,
            totalTime: "PT10M",
            step: brandSeo.integrationSteps.map((step, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              name: step.title,
              text: step.body
            }))
          }}
        />
      ) : null}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer
            }
          }))
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: siteConfig.domain },
            { "@type": "ListItem", position: 2, name: "Análises", item: `${siteConfig.domain}/reviews` },
            {
              "@type": "ListItem",
              position: 3,
              name: `${program.name} afiliados`,
              item: `${siteConfig.domain}/reviews/${program.slug}`
            }
          ]
        }}
      />
      <article className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_0.4fr]">
          <div>
            <p className="inline-flex rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand">
              {brandSeo?.primaryKeyword ?? "Análise de programa de afiliados"}
            </p>
            <h1 className="mt-5 text-balance text-5xl font-black tracking-tight text-ink">
              {pageHeadline}
            </h1>
            <p className="mt-6 text-xl leading-9 text-muted">{program.verdict}</p>
            <p className="mt-5 text-sm font-semibold leading-7 text-muted">
              Revisado por {editorialProfile.reviewer}. Última checagem editorial: {program.lastChecked}.
            </p>
            <ExternalLink
              href={program.officialUrl}
              className="mt-7 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink"
            >
              Abrir {program.officialLabel}
            </ExternalLink>
          </div>
          <BrandReviewVisual
            slug={program.slug}
            name={program.name}
            keyword={brandSeo?.primaryKeyword ?? program.keywords[0]}
          />
        </div>

        <div className="mt-8">
          <BeBrokerCTA compact horizontal />
        </div>

        {brandSeo ? (
          <section className="surface-card mt-12 rounded-[2rem] p-7 md:p-10">
            <p className="inline-flex rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-accent">
              Resposta rápida
            </p>
            <h2 className="mt-4 text-balance text-3xl font-black tracking-tight text-ink">
              {brandSeo.primaryKeyword}: vale a pena?
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">{brandSeo.quickAnswer}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {[brandSeo.primaryKeyword, ...brandSeo.secondaryKeywords].map((keyword) => (
                <span key={keyword} className="rounded-full bg-cream px-3 py-1 text-xs font-black text-muted">
                  {keyword}
                </span>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Modelo", program.payoutModel],
            ["Comissão", program.commission],
            ["Frequência", program.payoutFrequency],
            ["Sub-afiliados", program.subAffiliate],
            ["Mercados", program.markets],
            ["Pagamentos", program.paymentMethods]
          ].map(([label, value]) => (
            <div key={label} className="surface-card rounded-3xl p-5">
              <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">{label}</p>
              <p className="mt-3 text-sm leading-7 text-muted">{value}</p>
            </div>
          ))}
        </section>

        <section className="surface-card mt-12 rounded-[2rem] p-7 md:p-10">
          <p className="inline-flex rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand">
            Dados oficiais
          </p>
          <h2 className="mt-4 text-balance text-3xl font-black tracking-tight text-ink">
            Dados oficiais para validar antes de promover
          </h2>
          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              ["Programa", program.officialLabel],
              ["Categoria", program.category],
              ["Modelo", program.payoutModel],
              ["Comissão", program.commission],
              ["Pagamentos", program.paymentMethods],
              ["Última checagem", program.lastChecked]
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-cream/80 p-4">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-brand">{label}</p>
                <p className="mt-2 text-sm font-bold leading-7 text-ink">{value}</p>
              </div>
            ))}
          </div>
        </section>

        {brandSeo ? (
          <section className="surface-card mt-12 overflow-hidden rounded-[2rem]">
            <div className="border-b border-line bg-white/70 p-7 md:p-10">
              <p className="inline-flex rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand">
                Comissão e regras
              </p>
              <h2 className="mt-4 text-balance text-3xl font-black tracking-tight text-ink">
                Comissão, payout e pontos de validação
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted">
                Use esta tabela como resumo editorial. Antes de comprar mídia ou publicar CTAs agressivos,
                confirme os termos atuais no programa oficial.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-cream text-ink">
                  <tr>
                    <th className="p-4">Critério</th>
                    <th className="p-4">Resumo</th>
                    <th className="p-4">O que validar</th>
                  </tr>
                </thead>
                <tbody>
                  {brandSeo.commissionRows.map((row) => (
                    <tr key={row.label} className="border-t border-line transition hover:bg-cream/50">
                      <td className="p-4 font-bold text-ink">{row.label}</td>
                      <td className="p-4 text-muted">{row.value}</td>
                      <td className="p-4 text-muted">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {brandSeo ? (
          <section className="surface-card mt-12 rounded-[2rem] p-7 md:p-10">
            <p className="inline-flex rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand">
              Como funciona para afiliados
            </p>
            <h2 className="mt-4 text-balance text-3xl font-black tracking-tight text-ink">
              Do cadastro ao pagamento: etapas para validar
            </h2>
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {brandSeo.integrationSteps.map((step, index) => (
                <div key={step.title} className="rounded-2xl bg-cream/80 p-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-sm font-black text-brand shadow-sm">
                      {index + 1}
                    </span>
                    <h3 className="text-lg font-black tracking-tight text-ink">{step.title}</h3>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-muted">{step.body}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_0.8fr]">
          <CommissionVisual />
          {deepDive ? <TrafficSourcesVisual sources={deepDive.bestTrafficSources} /> : null}
        </section>

        <section className="surface-card mt-12 rounded-[2rem] p-7 md:p-10">
          <h2 className="text-balance text-3xl font-black tracking-tight text-ink">
            Dados úteis para afiliados
          </h2>
          <div className="mt-7 grid gap-3 md:grid-cols-2">
            {program.facts.map((fact) => (
              <div key={fact} className="rounded-2xl bg-cream/80 p-4 text-sm font-bold text-ink">
                {fact}
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card mt-12 rounded-[2rem] p-7 md:p-10">
          <p className="inline-flex rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand">
            Brasil e LATAM
          </p>
          <h2 className="mt-4 text-balance text-3xl font-black tracking-tight text-ink">
            O que validar antes de enviar tráfego brasileiro
          </h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {localNotes.map((note) => (
              <div key={note} className="rounded-2xl bg-cream/80 p-4 text-sm font-bold leading-7 text-ink">
                {note}
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {[...program.keywords, ...(brandSeo?.secondaryKeywords ?? [])].map((keyword) => (
              <span key={keyword} className="rounded-full bg-white px-3 py-1 text-xs font-black text-muted">
                {keyword}
              </span>
            ))}
          </div>
        </section>

        {deepDive ? (
          <section className="surface-card mt-12 rounded-[2rem] p-7 md:p-10">
            <p className="inline-flex rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand">
              Análise editorial
            </p>
            <h2 className="mt-4 text-balance text-3xl font-black tracking-tight text-ink">
              O que realmente importa neste programa
            </h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div>
                <h3 className="text-xl font-black tracking-tight text-ink">Visão geral</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{deepDive.overview}</p>
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-ink">
                  Como pensar na comissão
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  {deepDive.commissionDeepDive}
                </p>
              </div>
            </div>
          </section>
        ) : null}

        {seoEnhancement ? (
          <section className="surface-card mt-12 rounded-[2rem] p-7 md:p-10">
            <p className="inline-flex rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand">
              Como monetizar
            </p>
            <h2 className="mt-4 text-balance text-3xl font-black tracking-tight text-ink">
              Como ganhar dinheiro com {program.name} como afiliado
            </h2>
            <p className="mt-4 text-base leading-8 text-muted">{seoEnhancement.moneySection}</p>
            <h3 className="mt-8 text-2xl font-black tracking-tight text-ink">
              Exemplo de funil recomendado
            </h3>
            <ol className="mt-5 grid gap-3 text-sm leading-7 text-muted">
              {seoEnhancement.funnelExample.map((item, index) => (
                <li key={item} className="rounded-2xl bg-cream/80 p-4">
                  <span className="font-black text-brand">{index + 1}. </span>
                  {item}
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section className="mt-12 grid gap-8 lg:grid-cols-2">
          <div className="surface-card rounded-[2rem] p-7">
            <h2 className="text-3xl font-black tracking-tight text-ink">Pontos fortes</h2>
            <ul className="mt-6 grid gap-3 text-sm leading-7 text-muted">
              {program.pros.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="surface-card rounded-[2rem] p-7">
            <h2 className="text-3xl font-black tracking-tight text-ink">Limitações</h2>
            <ul className="mt-6 grid gap-3 text-sm leading-7 text-muted">
              {program.cons.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </section>

        {deepDive ? (
          <section className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="surface-card rounded-[2rem] p-7">
              <h2 className="text-2xl font-black tracking-tight text-ink">
                Melhores fontes de tráfego
              </h2>
              <ul className="mt-5 grid gap-3 text-sm leading-7 text-muted">
                {deepDive.bestTrafficSources.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="surface-card rounded-[2rem] p-7">
              <h2 className="text-2xl font-black tracking-tight text-ink">
                Como montar o funil
              </h2>
              <ul className="mt-5 grid gap-3 text-sm leading-7 text-muted">
                {deepDive.funnelAdvice.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="surface-card rounded-[2rem] p-7">
              <h2 className="text-2xl font-black tracking-tight text-ink">
                O que negociar com o gerente
              </h2>
              <ul className="mt-5 grid gap-3 text-sm leading-7 text-muted">
                {deepDive.negotiationAngles.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
            <div className="surface-card rounded-[2rem] p-7">
              <h2 className="text-2xl font-black tracking-tight text-ink">
                Red flags antes de escalar
              </h2>
              <ul className="mt-5 grid gap-3 text-sm leading-7 text-muted">
                {deepDive.redFlags.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {seoEnhancement ? (
          <section className="mt-12 rounded-[2rem] border border-line bg-ink p-7 text-white shadow-soft md:p-10">
            <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white/70">
              Alternativa estratégica
            </p>
            <h2 className="mt-4 text-balance text-3xl font-black tracking-tight">
              Quando considerar white label em vez de promover terceiros
            </h2>
            <p className="mt-4 max-w-4xl text-base leading-8 text-white/75">
              {seoEnhancement.whiteLabelAlternative}
            </p>
            <div className="mt-6">
              <BeBrokerCTA compact horizontal />
            </div>
          </section>
        ) : null}

        <section className="mt-12 grid gap-8 lg:grid-cols-3">
          <div className="surface-card rounded-[2rem] p-7">
            <h2 className="text-2xl font-black tracking-tight text-ink">Ferramentas</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-7 text-muted">
              {program.affiliateTools.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="surface-card rounded-[2rem] p-7">
            <h2 className="text-2xl font-black tracking-tight text-ink">Notas de tráfego</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-7 text-muted">
              {program.trafficNotes.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="surface-card rounded-[2rem] p-7">
            <h2 className="text-2xl font-black tracking-tight text-ink">Compliance</h2>
            <ul className="mt-5 grid gap-3 text-sm leading-7 text-muted">
              {program.complianceNotes.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
        </section>

        {deepDive ? (
          <section className="mt-12 rounded-[2rem] border border-line bg-ink p-7 text-white shadow-soft md:p-10">
            <p className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-white/70">
              Checklist de otimização
            </p>
            <h2 className="mt-3 text-3xl font-black tracking-tight">
              Antes de aumentar o orçamento
            </h2>
            <div className="mt-7 grid gap-3 md:grid-cols-2">
              {deepDive.optimizationChecklist.map((item) => (
                <div key={item} className="rounded-2xl bg-white/10 p-4 text-sm font-semibold">
                  {item}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-12 rounded-[2rem] border border-line bg-cream/80 p-7 md:p-10">
          <h2 className="text-3xl font-black tracking-tight text-ink">Para quem faz sentido?</h2>
          <p className="mt-5 text-lg leading-8 text-muted">{program.bestFor}</p>
          <p className="mt-4 text-sm leading-7 text-muted">
            Antes de escalar, valide termos oficiais, países aceitos, métodos de promoção
            permitidos e regras para comunicação de risco.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-black tracking-tight text-ink">Alternativas</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {alternatives.map((alternative) => (
              <Link
                key={alternative.slug}
                href={`/reviews/${alternative.slug}`}
                className="surface-card rounded-3xl p-5 text-sm font-black text-ink transition hover:-translate-y-0.5 hover:border-brand"
              >
                {alternative.name}
              </Link>
            ))}
          </div>
          {relatedRanking ? (
            <Link
              href={`/programas/${relatedRanking.slug}`}
              className="mt-6 inline-flex text-sm font-black text-brand hover:text-ink"
            >
              Ver ranking relacionado
            </Link>
          ) : null}
        </section>

        <div className="mt-12">
          <SourceList sources={program.sources} />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Última checagem editorial: {program.lastChecked}
          </p>
        </div>

        <div className="mt-12">
          <Faq
            items={faqItems}
          />
        </div>
      </article>
    </>
  );
}
