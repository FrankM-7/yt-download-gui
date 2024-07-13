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
        console.log(response["results"]);
        setSearchResults(response["results"]);
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
        <button onClick={handleSearch}>Search</button>
        {searchResults.length > 0 ? (
          <div style={{ height: '500px', overflowY: 'auto' }}>
            {/* Render your results here */}
            {searchResults.map((result, index) => (
              <div key={index} style={{ height: "144px", display: 'flex', marginBottom: '15px', border: '1px black solid'}}>
                {/* Display your result data */}
                <div style={{ width: '256px' }}>
                  <img src={result.thumbnail} alt={result.title} style={{ width: '256px', height: '100%' }} />
                </div>
                <div style={{ marginLeft: '10px', width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ width: '100%' }}>
                    {result.title}
                  </div>
                  <div style={{ flexGrow: 1 }}></div> {/* This div takes up the remaining space */}
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        Duration:
                        {result.duration}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p>Download: </p>
                        <button style={{height: "100%"}} onClick={download.bind(this, result.link)}>Download</button>
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
