import { useState } from "react";

type SearchParamVisualizerProps = {
  searchParams: URLSearchParams;
  setSearchParams: (searchParams: URLSearchParams) => void;
};

export function SearchParamVisualizer({
  searchParams,
  setSearchParams,
}: SearchParamVisualizerProps) {
  const [currentSP, setCurrentSP] = useState(searchParams.toString());

  return (
    <div key={searchParams.toString()}>
      <p>
        Current search param:
        <br />
        <code>{searchParams.toString()}</code>
      </p>
      <p>
        <textarea
          value={currentSP}
          onChange={(e) => setCurrentSP(e.target.value)}
        />
        <br />
        <button onClick={() => setSearchParams(new URLSearchParams(currentSP))}>
          update search params
        </button>
      </p>
    </div>
  );
}
