import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { BeBrokerCTA } from "@/components/BeBrokerCTA";
import { visualIllustrations, WhiteLabelFlowVisual } from "@/components/Visuals";
import { editorialProfile, siteConfig, whiteLabelPages } from "@/data/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return whiteLabelPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = whiteLabelPages.find((item) => item.slug === slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `/white-label/${page.slug}`
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${siteConfig.domain}/white-label/${page.slug}`
    }
  };
}

export default async function WhiteLabelPage({ params }: PageProps) {
  const { slug } = await params;
  const page = whiteLabelPages.find((item) => item.slug === slug);

  if (!page) {
    notFound();
  }

  const pageUrl = `${siteConfig.domain}/white-label/${page.slug}`;
  const faqItems = page.faq;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `${pageUrl}#article`,
          headline: page.title,
          description: page.description,
          url: pageUrl,
          image: `${siteConfig.domain}${visualIllustrations.platform.src}`,
          mainEntityOfPage: pageUrl,
          datePublished: editorialProfile.lastUpdated,
          dateModified: editorialProfile.lastUpdated,
          inLanguage: "pt-BR",
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
          }
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer }
          }))
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Início", item: siteConfig.domain },
            { "@type": "ListItem", position: 2, name: "White Label", item: `${siteConfig.domain}/white-label` },
            { "@type": "ListItem", position: 3, name: page.title, item: `${siteConfig.domain}/white-label/${page.slug}` }
          ]
        }}
      />
      <article className="mx-auto max-w-7xl px-5 py-16">
        <header className="surface-card-strong grid items-center gap-8 rounded-[2rem] p-7 md:p-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <p className="inline-flex rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-brand">
              {page.keyword}
            </p>
            <h1 className="mt-5 max-w-5xl text-balance text-5xl font-black tracking-tight text-ink">
              {page.title}
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-muted">{page.description}</p>
          </div>
          <div className="media-frame overflow-hidden rounded-[1.75rem] p-4">
            <Image
              src={visualIllustrations.platform.src}
              alt={visualIllustrations.platform.alt}
              width={visualIllustrations.platform.width}
              height={visualIllustrations.platform.height}
              sizes="(min-width: 1024px) 352px, 100vw"
              className="h-auto w-full mix-blend-multiply"
              priority
            />
          </div>
        </header>

        <div className="mt-10">
          <WhiteLabelFlowVisual />
        </div>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div>
            <div className="grid gap-6">
              {page.sections.map((section) => (
                <section key={section.title} className="surface-card rounded-[2rem] p-7">
                  <h2 className="text-balance text-3xl font-black tracking-tight text-ink">
                    {section.title}
                  </h2>
                  <p className="mt-4 text-lg leading-8 text-muted">{section.body}</p>
                </section>
              ))}
            </div>

            <section className="surface-card mt-12 rounded-[2rem] p-7">
              <h2 className="text-balance text-3xl font-black tracking-tight text-ink">
                Próximas leituras recomendadas
              </h2>
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {page.relatedLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-2xl bg-cream/80 p-4 text-sm font-black text-ink transition hover:bg-brand hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </section>

            <div className="mt-12">
              <Faq
                items={faqItems}
              />
            </div>
          </div>
          <div className="lg:sticky lg:top-24">
            <BeBrokerCTA compact formId="lead-form" />
          </div>
        </div>
      </article>
    </>
  );
}
