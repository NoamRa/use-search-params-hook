import { useSearchParams } from "react-router-dom";
import { SearchParamVisualizer } from "./SearchParamVisualizer/SearchParamVisualizer";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <main>
      <SearchParamVisualizer
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
    </main>
  );
}

export default App;
