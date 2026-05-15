import { NextResponse } from "next/server";
import { isSupportedCountry } from "libphonenumber-js/min";

export const dynamic = "force-dynamic";

function normalizeCountry(value: string | null) {
  const country = value?.trim().toUpperCase();

  return country && isSupportedCountry(country) ? country : "";
}

function countryFromAcceptLanguage(value: string | null) {
  if (!value) {
    return "";
  }

  const languages = value.split(",").map((item) => item.trim().split(";")[0]);

  for (const language of languages) {
    const region = language.split("-")[1];
    const country = normalizeCountry(region);

    if (country) {
      return country;
    }
  }

  return "";
}

export function GET(request: Request) {
  const headers = request.headers;
  const country =
    normalizeCountry(headers.get("x-vercel-ip-country")) ||
    normalizeCountry(headers.get("cf-ipcountry")) ||
    normalizeCountry(headers.get("x-country-code")) ||
    countryFromAcceptLanguage(headers.get("accept-language")) ||
    "BR";

  return NextResponse.json({ country });
}
