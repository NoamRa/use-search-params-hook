import { Output, SearchParamObject } from "./types";

export function identity<T>(a: T): T {
  return a;
}

export function valueToString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return value.toString();
  if (Array.isArray(value)) return value.join(",");
  if (value instanceof Date) return value.toISOString();
  throw new Error(`failed to stringify ${value}`);
}

/**
 * There could be many ways to parse URLSearchParams to an object.
 * For example, how should `a` be treated in `a=1&b=2&a=3`?
 * This implementation is a choice.
 * TODO extract and add tests
 */
export function searchParamsToObject(searchParam: URLSearchParams): SearchParamObject {
  return Object.fromEntries(searchParam);
}

/**
 * There could be many ways to serialize an object to URLSearchParams.
 * For example, how should `a` be treated in `a=1&b=2&a=3`?
 * This implementation is a choice.
 * TODO extract and add tests
 */
export function objectToSearchParams<T extends Output = Output>(parsed: T): string {
  return new URLSearchParams([...Object.entries(parsed).map(([k, v]) => [k, valueToString(v)])]).toString();
}
