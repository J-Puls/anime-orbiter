import { useContext, useEffect } from "react";
import { Row, Container } from "react-bootstrap";
import GlobalAppContext from "../../context/GlobalContext";
import { useSearchResults } from "../../context/hooks";
import SearchResultCard from "../content/SearchResultCard";
import SearchForm from "./SearchForm";

export const FindTitles = () => {
  const GlobalContext = useContext(GlobalAppContext);
  const searchResults = useSearchResults();
  useEffect(() => {
    GlobalContext.setSearchResults([]);
  }, []);
  return (
    <>
      <Row noGutters>
        <SearchForm></SearchForm>
      </Row>
      <Container>
        <Row noGutters className="justify-content-center">
          {searchResults &&
            searchResults.map((title) => {
              return (
                <SearchResultCard key={title.show.id} title={title.show} />
              );
            })}
        </Row>
      </Container>
    </>
  );
};

export default FindTitles;
