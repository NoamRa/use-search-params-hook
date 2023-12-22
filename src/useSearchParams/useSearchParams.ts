import { useSearchParams as useReactRouterUseSearchParam } from "react-router-dom";
import { OptionsWithValidate, type Options, type Output } from "./types";
import { objectToSearchParams, searchParamsToObject } from "./utils";

const defaultOptions: Options = {
  useSearchParamHook: useReactRouterUseSearchParam,
  parse: searchParamsToObject,
  stringify: objectToSearchParams,
};

export function useSearchParams<T extends Output>(options: OptionsWithValidate<T>) {
  const { parse, useSearchParamHook, validate, stringify } = { ...defaultOptions, ...options };
  const [searchParam] = useSearchParamHook();
  const params = validate(parse(searchParam))
  return { params, stringify };
}
