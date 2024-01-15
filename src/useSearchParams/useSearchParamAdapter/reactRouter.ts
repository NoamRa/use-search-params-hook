import { useSearchParams } from "react-router-dom";

export function useSearchParamHook(): URLSearchParams {
  const [searchParams] = useSearchParams();
  return searchParams;
}
