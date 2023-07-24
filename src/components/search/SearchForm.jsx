import { useContext } from 'react';
import { Button, Col, Form, InputGroup } from 'react-bootstrap';
import GlobalAppContext from '../../context/GlobalContext';
import { findTitles } from '../../utils';

export const SearchForm = props => {

    const GlobalContext = useContext(GlobalAppContext);
    let query;
    const handleSubmit = async e => {

        e.preventDefault();
        const queryResults = await findTitles(query.value);
        if (!queryResults.length > 0) {

            alert('no results found');
            return;
        
        } else {

            let filteredResults = [];
            for (const result of queryResults) {

                if (result.show.type === 'Animation') {

                    filteredResults.push(result);
                
                }
            
            }
            GlobalContext.setSearchResults(filteredResults);
        
        }
    
    };

    return (
        <>
      <Col xs="12" md="8" className="mx-auto p-3 text-light mb-2 fade-in">
        <Form id="searchForm" onSubmit={e => handleSubmit(e)}>
          <InputGroup className="mb-3">
            <input
              className="search-input w-75"
              id="title"
              placeholder="search"
              ref={el => (query = el)}
              required
              size="lg"
              type="text"
            ></input>
            <InputGroup.Append className="w-25">
              <Button
                className="w-100 font-weight-bolder search-button"
                type="submit"
                variant="danger"
              >
                <svg
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M23.809 21.646l-6.205-6.205c1.167-1.605 1.857-3.579 1.857-5.711 0-5.365-4.365-9.73-9.731-9.73-5.365 0-9.73 4.365-9.73 9.73 0 5.366 4.365 9.73 9.73 9.73 2.034 0 3.923-.627 5.487-1.698l6.238 6.238 2.354-2.354zm-20.955-11.916c0-3.792 3.085-6.877 6.877-6.877s6.877 3.085 6.877 6.877-3.085 6.877-6.877 6.877c-3.793 0-6.877-3.085-6.877-6.877z" />
                </svg>
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Form>
      </Col>
        </>
    );

};

export default SearchForm;
