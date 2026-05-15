import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { MethodologyBlock } from "@/components/MethodologyBlock";
import { ProgramCard } from "@/components/ProgramCard";
import { BeBrokerCTA } from "@/components/BeBrokerCTA";
import { SectionHeader } from "@/components/SectionHeader";
import { CategoryVisual, FunnelVisual, HeroVisual, WhiteLabelFlowVisual } from "@/components/Visuals";
import {
  guides,
  positioning,
  programs,
  rankings,
  siteConfig
} from "@/data/site";

const featuredPrograms = programs.slice(0, 3);

export const metadata: Metadata = {
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.domain
  }
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${siteConfig.domain}#website`,
          name: siteConfig.name,
          url: siteConfig.domain,
          description: siteConfig.description,
          inLanguage: "pt-BR",
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.domain
          }
        }}
      />
      <section className="relative overflow-hidden bg-cream">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/80 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24">
          <div>
            <p className="inline-flex rounded-full border border-brand/15 bg-white px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand shadow-sm">
              {positioning.eyebrow}
            </p>
            <h1 className="mt-5 max-w-4xl text-balance text-5xl font-black tracking-tight text-ink md:text-7xl">
              {positioning.headline}
            </h1>
            <p className="mt-6 max-w-2xl text-xl leading-9 text-muted">
              {positioning.subheadline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/programas/melhores-programas-afiliados-brokers"
                className="rounded-full bg-brand px-6 py-3 text-sm font-black text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-ink"
              >
                Comparar programas
              </Link>
              <Link
                href="/white-label/solucao-white-label-para-broker#lead-form"
                className="rounded-full border border-line bg-white px-6 py-3 text-sm font-black text-ink shadow-sm transition hover:-translate-y-0.5 hover:border-ink"
              >
                Ir para o próximo nível
              </Link>
            </div>
          </div>
          <HeroVisual />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20">
        <SectionHeader
          eyebrow="Comparativos"
          title="Escolha o tipo de programa antes de enviar tráfego"
          description="Compare categorias por comissão, regras de qualificação, pagamentos e adequação ao seu público."
        />
        <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {rankings.map((ranking, index) => (
            <Link
              key={ranking.slug}
              href={`/programas/${ranking.slug}`}
              className="visual-card group rounded-[1.75rem] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-soft"
            >
              <CategoryVisual
                label={ranking.category === "all" ? "Broker" : ranking.category}
                tone={index % 3 === 0 ? "brand" : index % 3 === 1 ? "accent" : "ink"}
              />
              <p className="mt-5 text-xs font-black uppercase tracking-[0.16em] text-brand">
                {ranking.keyword}
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-ink group-hover:text-brand">{ranking.title}</h2>
              <p className="mt-4 text-sm leading-7 text-muted">{ranking.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-stretch gap-8 px-5 py-10 lg:grid-cols-[1fr_0.8fr]">
        <FunnelVisual />
        <BeBrokerCTA compact />
      </section>

      <section className="bg-white/70">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <SectionHeader
            eyebrow="Destaques da redação"
            title="Programas em destaque"
            description="Análises iniciais para marcas com alta demanda de busca entre afiliados de trading e forex."
          />
          <div className="mt-9 grid gap-6 lg:grid-cols-3">
            {featuredPrograms.map((program, index) => (
              <ProgramCard key={program.slug} program={program} rank={index + 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-start gap-8 px-5 py-20 lg:grid-cols-[0.9fr_1.1fr]">
        <MethodologyBlock />
        <div className="surface-card rounded-[2rem] p-7 md:p-10">
          <p className="inline-flex rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand">
            Critérios de escolha
          </p>
          <h2 className="mt-4 text-balance text-3xl font-black tracking-tight text-ink">
            O que observar antes de enviar tráfego para uma oferta
          </h2>
          <p className="mt-4 text-sm leading-7 text-muted">
            Bons programas não são definidos só pela comissão anunciada. Antes de escalar uma campanha,
            compare qualidade do funil, regras de qualificação, reputação, pagamentos e restrições de mídia.
          </p>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            {[
              ["Modelo de comissão", "CPA, RevShare ou híbrido precisam combinar com o ciclo de compra do seu tráfego."],
              ["Regras de qualificação", "FTD, volume mínimo, países aceitos e fontes proibidas mudam o resultado real."],
              ["Pagamentos e suporte", "Frequência, métodos de saque e gerente dedicado pesam quando a campanha escala."],
              ["Risco e compliance", "Trading, forex e CFDs exigem comunicação conservadora e avisos de risco claros."]
            ].map(([title, copy]) => (
              <div key={title} className="rounded-2xl bg-cream/80 p-5">
                <p className="font-black text-ink">{title}</p>
                <p className="mt-2 text-sm leading-7 text-muted">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-20">
        <WhiteLabelFlowVisual />
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <SectionHeader
            eyebrow="Guias"
            title="Educação para afiliados financeiros"
            description="Conteúdo evergreen para aumentar confiança, interlinking e profundidade temática."
          />
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide) => (
              <Link key={guide.slug} href={`/guias/${guide.slug}`} className="surface-card group rounded-3xl p-6 transition hover:-translate-y-1 hover:shadow-soft">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-accent">
                  {guide.keyword}
                </p>
                <h2 className="mt-3 text-xl font-black tracking-tight text-ink group-hover:text-brand">{guide.title}</h2>
                <p className="mt-4 text-sm leading-7 text-muted">{guide.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
