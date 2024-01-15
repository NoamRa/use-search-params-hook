import { OptionsWithValidate, type Options, type Output } from "./types";
import { useSearchParamHook } from "./useSearchParamAdapter/reactRouter";
import { objectToSearchParams, searchParamsToObject } from "./utils";

const defaultOptions: Options = {
  useSearchParamHook: useSearchParamHook,
  parse: searchParamsToObject,
  stringify: objectToSearchParams,
};

export function useSearchParams<T extends Output>(options: OptionsWithValidate<T>) {
  const { parse, useSearchParamHook, validate, stringify } = { ...defaultOptions, ...options };
  const searchParams = useSearchParamHook();
  const params = validate(parse(searchParams))
  return { params, stringify };
}
