import { useState, useEffect, useContext } from "react";
import GlobalAppContext from "../GlobalContext";

export const useSearchResults = () => {
  const context = useContext(GlobalAppContext);

  const [searchResults, setSearchResults] = useState(context.search_results);
  useEffect(() => {
    setSearchResults(context.search_results);
  }, [context.search_results]);
  return searchResults;
};
export default useSearchResults;
