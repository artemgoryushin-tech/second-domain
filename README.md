# AfiliadosPro Brasil

SEO media/catalog MVP for Brazilian affiliate marketers researching broker, forex, trading and fintech affiliate programs.

## Stack

- Next.js App Router
- TypeScript
- TailwindCSS
- Static SEO pages with dynamic routes generated from `data/site.ts`
- Schema.org JSON-LD for website, article, review and item list pages

## Core Routes

- `/` - homepage with positioning, rankings, featured reviews, SEO clusters and roadmap
- `/programas` - ranking index
- `/programas/[slug]` - affiliate program ranking template
- `/reviews` - review index
- `/reviews/[slug]` - brand affiliate program review template
- `/guias` - educational guide index
- `/guias/[slug]` - evergreen guide template
- `/white-label` - B2B white label hub
- `/white-label/[slug]` - white label broker content template
- `/ferramentas` - tools/calculators hub
- `/metodologia`, `/divulgacao`, `/privacidade`, `/contato`, `/sobre` - trust and legal pages

## Content Model

All MVP content lives in `data/site.ts`:

- Positioning and navigation
- Program reviews
- Ranking pages
- Guides
- White label pages
- SEO keyword clusters
- Content roadmap

## Production Notes

Before public launch, replace `siteConfig.domain`, connect real analytics, add final legal copy, validate all affiliate program terms against official sources and review financial/compliance disclaimers for Brazil.

## Lead Forms

- `BrokerageLeadForm` in `components/BrokerageLeadForm.tsx` submits leads to `/api/leads`.
- `FORMS_API_URL` points the server route to the CRM form API. Default: `https://group.quadcode.com`.
- `FORMS_API_ENDPOINT` overrides the CRM form path. Default: `/api/notPopup`.
