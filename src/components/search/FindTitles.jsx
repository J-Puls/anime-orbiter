import { Container, Row } from 'react-bootstrap';
import { SearchResultCard } from '../';
import { useSearchResults } from '../../context/hooks';
import SearchForm from './SearchForm';

export const FindTitles = () => {

    const searchResults = useSearchResults();

    return (
        <>
      <Row noGutters>
        <SearchForm></SearchForm>
      </Row>
      <Container>
        <Row noGutters className="justify-content-center">
          {searchResults &&
            searchResults.map(title => {

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
