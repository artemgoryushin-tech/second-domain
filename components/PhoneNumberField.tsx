"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getCountries,
  getCountryCallingCode,
  isSupportedCountry,
  parsePhoneNumber,
  type CountryCode
} from "libphonenumber-js/min";

const priorityCountries = ["BR", "US", "GB", "PT", "ES", "CY", "AE", "IN", "ZA", "DE", "FR", "IT"] as const;
const countryNameFormatter = new Intl.DisplayNames(["pt-BR"], { type: "region" });

const countryOptions = getCountries()
  .map((country) => ({
    country,
    name: countryNameFormatter.of(country) ?? country,
    callingCode: getCountryCallingCode(country)
  }))
  .sort((left, right) => {
    const leftPriority = priorityCountries.indexOf(left.country as (typeof priorityCountries)[number]);
    const rightPriority = priorityCountries.indexOf(right.country as (typeof priorityCountries)[number]);

    if (leftPriority !== -1 || rightPriority !== -1) {
      return (leftPriority === -1 ? 999 : leftPriority) - (rightPriority === -1 ? 999 : rightPriority);
    }

    return left.name.localeCompare(right.name, "pt-BR");
  });

type PhoneNumberFieldProps = {
  id: string;
  name: string;
  label: string;
  required?: boolean;
};

function getCountryFlag(country: CountryCode) {
  return country
    .split("")
    .map((letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
    .join("");
}

function normalizePhoneNumber(rawValue: string, country: CountryCode) {
  const value = rawValue.trim();

  if (!value) {
    return "";
  }

  try {
    const phoneNumber = parsePhoneNumber(value, country);

    if (phoneNumber?.number && phoneNumber.isPossible()) {
      return phoneNumber.number;
    }
  } catch {
    return "";
  }

  return "";
}

export function PhoneNumberField({ id, name, label, required }: PhoneNumberFieldProps) {
  const [country, setCountry] = useState<CountryCode>("BR");
  const [phoneInput, setPhoneInput] = useState("");
  const [touched, setTouched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const userSelectedCountryRef = useRef(false);

  const normalizedPhone = useMemo(() => normalizePhoneNumber(phoneInput, country), [country, phoneInput]);
  const isInvalid = Boolean(phoneInput.trim()) && !normalizedPhone;

  useEffect(() => {
    let isMounted = true;

    fetch("/api/geo", { cache: "no-store" })
      .then((response) => response.json())
      .then((result: { country?: string }) => {
        if (!isMounted || userSelectedCountryRef.current || !result.country || !isSupportedCountry(result.country)) {
          return;
        }

        setCountry(result.country);
      })
      .catch(() => {
        // Keep the Brazil fallback if geolocation headers are unavailable.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    inputRef.current?.setCustomValidity(isInvalid ? "Digite um telefone válido para o país selecionado." : "");
  }, [isInvalid]);

  function handleCountryChange(value: string) {
    if (!isSupportedCountry(value)) {
      return;
    }

    userSelectedCountryRef.current = true;
    setCountry(value);
  }

  return (
    <div className="grid gap-2">
      <label className="text-xs font-black uppercase tracking-[0.14em] text-muted" htmlFor={id}>
        {label}
        {required ? <span className="text-brand"> *</span> : null}
      </label>
      <div className="grid gap-2 sm:grid-cols-[12rem_1fr]">
        <select
          className="min-w-0 rounded-2xl border border-line bg-white px-4 py-3 text-sm font-black text-ink outline-brand"
          value={country}
          aria-label="País do telefone"
          onChange={(event) => handleCountryChange(event.target.value)}
        >
          {countryOptions.map((option) => (
            <option key={option.country} value={option.country}>
              {getCountryFlag(option.country)} {option.name} +{option.callingCode}
            </option>
          ))}
        </select>
        <input
          ref={inputRef}
          id={id}
          className={`min-w-0 rounded-2xl border bg-white px-4 py-3 text-base font-bold text-ink outline-brand ${
            isInvalid && touched ? "border-brand" : "border-line"
          }`}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="Telefone"
          value={phoneInput}
          required={required}
          aria-invalid={isInvalid && touched ? true : undefined}
          aria-describedby={isInvalid && touched ? `${id}-error` : `${id}-hint`}
          onBlur={() => setTouched(true)}
          onChange={(event) => setPhoneInput(event.target.value)}
        />
      </div>
      <input type="hidden" name={name} value={normalizedPhone} />
      <input type="hidden" name={`${name}_country`} value={country} />
      {isInvalid && touched ? (
        <p id={`${id}-error`} className="text-xs font-bold leading-5 text-brand">
          Digite um telefone válido para o país selecionado.
        </p>
      ) : (
        <p id={`${id}-hint`} className="text-xs font-semibold leading-5 text-muted">
          O país é detectado automaticamente, mas pode ser alterado antes do envio.
        </p>
      )}
    </div>
  );
}
