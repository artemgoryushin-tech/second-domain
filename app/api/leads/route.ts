import { NextResponse } from "next/server";
import { isSupportedCountry, parsePhoneNumber } from "libphonenumber-js/min";
import { siteConfig } from "@/data/site";

const DEFAULT_FORMS_API_URL = "https://group.quadcode.com";
const DEFAULT_FORMS_API_ENDPOINT = "/api/notPopup";
const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

type LeadBody = Record<string, unknown>;

function readString(body: LeadBody, key: string, maxLength = 1200) {
  const value = body[key];

  if (typeof value !== "string") {
    return "";
  }

  return value.trim().slice(0, maxLength);
}

function readBoolean(body: LeadBody, key: string) {
  return body[key] === true || body[key] === "true" || body[key] === "on";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizePhone(phone: string, country: string) {
  try {
    const phoneNumber = isSupportedCountry(country) ? parsePhoneNumber(phone, country) : parsePhoneNumber(phone);

    if (phoneNumber?.number && phoneNumber.isPossible()) {
      return phoneNumber.number;
    }
  } catch {
    return "";
  }

  return "";
}

function appendIfPresent(payload: FormData, key: string, value: string) {
  if (value) {
    payload.set(key, value);
  }
}

function getLandingReference(sourceUrl: string, pagePath: string) {
  if (sourceUrl) {
    try {
      const url = new URL(sourceUrl);
      return `${url.host}${url.pathname}`;
    } catch {
      // Fall back to the path below.
    }
  }

  try {
    const url = new URL(siteConfig.domain);
    return pagePath ? `${url.host}${pagePath}` : url.host;
  } catch {
    return pagePath || siteConfig.domain;
  }
}

function parseCrmResponse(responseText: string) {
  if (!responseText) {
    return null;
  }

  try {
    return JSON.parse(responseText) as unknown;
  } catch {
    return responseText;
  }
}

function isCrmRejection(result: unknown) {
  return (
    typeof result === "object" &&
    result !== null &&
    "success" in result &&
    (result as { success?: unknown }).success === false
  );
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as LeadBody | null;

  if (!body || typeof body !== "object") {
    return NextResponse.json({ message: "Payload inválido." }, { status: 400 });
  }

  const firstName = readString(body, "first_name", 120);
  const email = readString(body, "email", 180);
  const phoneInput = readString(body, "phone", 80);
  const phoneCountry = readString(body, "phone_country", 10);
  const phone = normalizePhone(phoneInput, phoneCountry);
  const termsAgree = readBoolean(body, "terms_agree");

  if (!firstName || !email || !phoneInput || !termsAgree) {
    return NextResponse.json({ message: "Nome, email, telefone e consentimento são obrigatórios." }, { status: 400 });
  }

  if (!isEmail(email)) {
    return NextResponse.json({ message: "Digite um email válido." }, { status: 400 });
  }

  if (!phone) {
    return NextResponse.json({ message: "Digite um telefone válido com código do país." }, { status: 400 });
  }

  const companyName = readString(body, "company_name", 180);
  const telegram = readString(body, "tg", 120);
  const contextName = readString(body, "context_name", 160) || siteConfig.name;
  const contextSlug = readString(body, "context_slug", 120);
  const requestType = readString(body, "request_type", 180) || "brokerage / white-label platform";
  const sourceUrl = readString(body, "source_url", 500);
  const pagePath = readString(body, "page_path", 220);
  const language = readString(body, "lang_by_browser", 20) || "pt";
  const roistatId = readString(body, "roistat_id", 120);
  const comment = readString(body, "comment", 1200) || readString(body, "short_bio", 900);
  const landingReference = getLandingReference(sourceUrl, pagePath);

  const contextLines = [
    `${siteConfig.name} lead`,
    `Request type: ${requestType}`,
    comment ? `Project notes: ${comment}` : "",
    companyName ? `Company / business: ${companyName}` : "",
    contextName ? `Context: ${contextName}` : "",
    contextSlug ? `Context slug: ${contextSlug}` : "",
    phoneCountry ? `Phone country: ${phoneCountry}` : "",
    pagePath ? `Page: ${pagePath}` : "",
    sourceUrl ? `Source URL: ${sourceUrl}` : "",
    ...UTM_FIELDS.map((field) => {
      const value = readString(body, field, 180);
      return value ? `${field}: ${value}` : "";
    })
  ].filter(Boolean);

  const payload = new FormData();

  payload.set("first_name", firstName);
  payload.set("email", email);
  payload.set("phone", phone);
  payload.set("terms_agree", "on");
  payload.set("landing_url", landingReference);
  payload.set("referrer", landingReference);
  payload.set("lang_by_browser", language);
  payload.set("source_form", "afiliadospro_brokerage_lead");
  payload.set("source_site", siteConfig.name);
  appendIfPresent(payload, "tg", telegram);
  appendIfPresent(payload, "comment", contextLines.join("\n"));
  appendIfPresent(payload, "roistat_id", roistatId);

  for (const field of UTM_FIELDS) {
    appendIfPresent(payload, field, readString(body, field, 180));
  }

  const formsApiUrl = process.env.FORMS_API_URL ?? DEFAULT_FORMS_API_URL;
  const formsApiEndpoint = process.env.FORMS_API_ENDPOINT ?? DEFAULT_FORMS_API_ENDPOINT;
  const endpoint = new URL(formsApiEndpoint, formsApiUrl);

  try {
    const crmResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "X-Requested-With": "XMLHttpRequest"
      },
      body: payload,
      cache: "no-store"
    });

    const responseText = await crmResponse.text();
    const crmResult = parseCrmResponse(responseText);

    if (!crmResponse.ok || isCrmRejection(crmResult)) {
      console.error("CRM rejected lead request", {
        status: crmResponse.status,
        body: responseText.slice(0, 500)
      });

      return NextResponse.json(
        { message: "CRM recusou a solicitação. Verifique os campos e tente novamente." },
        { status: crmResponse.status === 422 ? 422 : 502 }
      );
    }

    return NextResponse.json({ success: true, message: "Solicitação enviada." });
  } catch {
    return NextResponse.json({ message: "Não foi possível enviar a solicitação agora." }, { status: 502 });
  }
}
