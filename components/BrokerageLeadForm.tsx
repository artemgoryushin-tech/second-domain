"use client";

import { type FormEvent, useId, useState } from "react";
import { PhoneNumberField } from "@/components/PhoneNumberField";

type BrokerageLeadFormProps = {
  formId?: string;
  contextName?: string;
  contextSlug?: string;
  requestType?: string;
  title?: string;
  description?: string;
  compact?: boolean;
  layout?: "standard" | "sidebar" | "wide";
};

type SubmitState = "idle" | "loading" | "success" | "error";

function readFormValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function readCookie(name: string) {
  const match = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : "";
}

function getTrackingPayload() {
  const params = new URLSearchParams(window.location.search);
  const payload: Record<string, string> = {};

  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const value = params.get(key);

    if (value) {
      payload[key] = value;
    }
  }

  const roistatId = readCookie("roistat_visit");

  if (roistatId) {
    payload.roistat_id = roistatId;
  }

  payload.lang_by_browser = localStorage.getItem("form__lang") || navigator.language?.split("-")[0] || "pt";

  return payload;
}

export function BrokerageLeadForm({
  formId,
  contextName = "AfiliadosPro Brasil",
  contextSlug = "afiliadospro-brasil",
  requestType = "white-label brokerage platform",
  title = "Solicitar contato",
  description = "Compartilhe seus dados e o contexto do projeto. A solicitação será enviada ao CRM para follow-up.",
  compact = false,
  layout = compact ? "sidebar" : "standard"
}: BrokerageLeadFormProps) {
  const generatedId = useId().replace(/:/g, "");
  const idPrefix = formId ?? `lead-${generatedId}`;
  const [status, setStatus] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");
  const isSidebar = layout === "sidebar";
  const isWide = layout === "wide";
  const isCompact = compact || isSidebar;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const trackingPayload = getTrackingPayload();
    const payload = {
      first_name: readFormValue(formData, "first_name"),
      email: readFormValue(formData, "email"),
      phone: readFormValue(formData, "phone"),
      phone_country: readFormValue(formData, "phone_country"),
      tg: readFormValue(formData, "tg"),
      company_name: readFormValue(formData, "company_name"),
      comment: readFormValue(formData, "comment"),
      terms_agree: formData.get("terms_agree") === "on",
      context_name: contextName,
      context_slug: contextSlug,
      request_type: requestType,
      page_path: window.location.pathname,
      source_url: window.location.href,
      ...trackingPayload
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const result = (await response.json().catch(() => null)) as { message?: string; success?: boolean } | null;

      if (!response.ok || result?.success === false) {
        throw new Error(result?.message ?? "Não foi possível enviar a solicitação.");
      }

      const dataLayer = (window as Window & { dataLayer?: Record<string, unknown>[] }).dataLayer;

      dataLayer?.push({
        event: "lead_submit",
        form_id: "afiliadospro_brokerage_lead",
        context_slug: contextSlug,
        utm_source: trackingPayload.utm_source,
        utm_campaign: trackingPayload.utm_campaign
      });

      form.reset();
      setStatus("success");
      setMessage("Obrigado. Sua solicitação foi enviada e entraremos em contato em breve.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Não foi possível enviar a solicitação.");
    }
  }

  return (
    <section
      id={formId}
      className={`@container surface-card scroll-mt-28 rounded-[2rem] ${
        isCompact ? "p-5 md:p-6" : "p-7 md:p-10"
      }`}
    >
      <div className={isWide ? "grid gap-7 @5xl:grid-cols-[0.78fr_1.22fr] @5xl:items-start" : ""}>
        <div className="flex min-w-0 flex-col gap-3">
          <p className="w-fit rounded-full border border-brand/15 bg-brand/5 px-3 py-1 text-xs font-black uppercase leading-5 tracking-[0.12em] text-brand">
            Próximo nível
          </p>
          <h2 className={`text-balance font-black tracking-tight text-ink ${isCompact ? "text-[1.65rem] leading-tight" : "text-3xl"}`}>
            {title}
          </h2>
          <p className={`${isCompact ? "text-sm leading-6" : "max-w-3xl text-sm leading-7"} text-muted`}>
            {description}
          </p>
        </div>

        <form className={`${isWide ? "mt-0" : isCompact ? "mt-5" : "mt-7"} grid gap-4`} onSubmit={handleSubmit}>
        <div className="grid gap-4 @2xl:grid-cols-2">
          <Field label="Nome" htmlFor={`${idPrefix}-first-name`} required>
            <input
              id={`${idPrefix}-first-name`}
              name="first_name"
              autoComplete="name"
              placeholder="Seu nome"
              required
              className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm font-bold text-ink outline-brand transition focus:border-brand"
            />
          </Field>
          <Field label="Email" htmlFor={`${idPrefix}-email`} required>
            <input
              id={`${idPrefix}-email`}
              name="email"
              type="email"
              autoComplete="email"
              placeholder="nome@empresa.com"
              required
              className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm font-bold text-ink outline-brand transition focus:border-brand"
            />
          </Field>
        </div>

        <PhoneNumberField id={`${idPrefix}-phone`} name="phone" label="Telefone" required compact={isCompact} />

        <div className="grid gap-4 @2xl:grid-cols-2">
          <Field label="Empresa ou projeto" htmlFor={`${idPrefix}-company`}>
            <input
              id={`${idPrefix}-company`}
              name="company_name"
              placeholder="Empresa, time afiliado..."
              className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm font-bold text-ink outline-brand transition focus:border-brand"
            />
          </Field>
          <Field label="Telegram" htmlFor={`${idPrefix}-telegram`}>
            <input
              id={`${idPrefix}-telegram`}
              name="tg"
              placeholder="@usuario"
              className="h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm font-bold text-ink outline-brand transition focus:border-brand"
            />
          </Field>
        </div>

        <Field label="Notas do projeto" htmlFor={`${idPrefix}-notes`}>
          <textarea
            id={`${idPrefix}-notes`}
            name="comment"
            placeholder="Regiões alvo, pagamentos, CRM, apps, prazo de lançamento..."
            className={`${isCompact ? "min-h-24" : "min-h-28"} w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm font-bold text-ink outline-brand transition focus:border-brand`}
          />
        </Field>

        <label className={`flex items-start gap-3 rounded-2xl bg-cream/80 ${isCompact ? "p-3 text-xs leading-5" : "p-4 text-sm leading-6"}`}>
          <input name="terms_agree" type="checkbox" required className={`${isCompact ? "h-4 w-4" : "h-5 w-5"} mt-1 shrink-0 accent-brand`} />
          <span className="font-semibold text-muted">
            Concordo em ser contatado sobre plataforma/corretora white label e entendo que isso não é consultoria
            jurídica ou financeira.
          </span>
        </label>

        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex w-full items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-black text-white shadow-soft transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? "Enviando..." : "Ir para o próximo nível"}
        </button>

        {message ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-bold leading-7 ${
              status === "success"
                ? "border-accent/20 bg-accent/10 text-ink"
                : "border-brand/25 bg-brand/5 text-brand"
            }`}
            role="status"
            aria-live="polite"
          >
            {message}
          </div>
        ) : null}
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  htmlFor,
  required,
  children
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <label className="text-xs font-black uppercase leading-5 tracking-[0.08em] text-muted" htmlFor={htmlFor}>
        {label}
        {required ? <span className="text-brand"> *</span> : null}
      </label>
      {children}
    </div>
  );
}
