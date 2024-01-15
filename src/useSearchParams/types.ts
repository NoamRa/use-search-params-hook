export type SearchParamObject = Record<string, string>;
export type Output = Record<string, unknown>;

export type ValidateFunction<T extends Output = Output> = (search: SearchParamObject) => T;

export type Options<T extends Output = Output> = {
  useSearchParamHook: () => URLSearchParams;
  parse: (searchParam: URLSearchParams) => SearchParamObject;
  stringify: (searchParamsObject: T) => ReturnType<URLSearchParams["toString"]>;
};

export type OptionsWithValidate<T extends Output = Output> = Partial<Options<T>> & { validate: ValidateFunction<T> };
