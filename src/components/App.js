import React, { Fragment } from 'react';
import { get } from 'utils/requests';
import Titlebar from 'components/titlebar/Titlebar';
import styles from 'components/App.module.scss';

function App() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState([]);

  const handleSearch = async () => {
    get(
      'search?query=' + searchQuery, // Route
      (response) => {
        setSearchResults(response.results);
      }, // Response callback
      (error) => console.error(error) // Error callback
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const download = async (url) => {
    const encodedParam = encodeURIComponent(url);
    console.log(url);

    // encodeURI(url) is used to encode the url to make it safe to be sent as a query parameter
    get(
      `download?url=${encodedParam}`, // Route
      (response) => {
        console.log(response);
      }, // Response callback
      (error) => console.error(error) // Error callback
    );
  };

  return (
    <Fragment>
      <Titlebar />
      <header className={styles['app-header']}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button type="button" onClick={handleSearch}>Search</button>
        {searchResults.length > 0 ? (
          <div style={{ height: '500px', overflowY: 'auto' }}>
            {/* Render your results here */}
            {searchResults.map((result, index) => (
              <div key={index} style={{ border: '1px black solid', display: 'flex', height: "144px", marginBottom: '15px'}}>
                {/* Display your result data */}
                <div style={{ width: '256px' }}>
                  <img src={result.thumbnail} alt={result.title} style={{ height: '100%', width: '256px' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', marginLeft: '10px', width: '100%' }}>
                  <div style={{ width: '100%' }}>
                    {result.title}
                  </div>
                  <div style={{ flexGrow: 1 }} /> {/* This div takes up the remaining space */}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                        Duration:
                        {result.duration}
                      </div>
                      <div style={{ alignItems: 'center', display: 'flex' }}>
                        <p>Download: </p>
                        <button type="button" style={{height: "100%"}} onClick={download.bind(this, result.link)}>Download</button>
                      </div>
                  </div>
                </div>

              </div>

            ))}
          </div>
        ) : (
          <p>No results</p>
        )}
      </header>
    </Fragment>
  );
}

export default App;