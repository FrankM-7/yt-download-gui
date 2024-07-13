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
          <div style={{ height: '500px', overflowY: 'auto', border: '1px solid gray' }}>
            {/* Render your results here */}
            {searchResults.map((result, index) => (
              <div key={index} style={{ border: '1px red solid', height: "150px", display: 'flex' }}>
                {/* Display your result data */}
                <div style={{ border: '1px blue solid', width: '160px' }}>
                  <img src={result.thumbnail} alt={result.title} style={{ width: '100%', height: '90px' }} />
                </div>
                <div style={{ border: '1px green solid', marginLeft: '10px' }}>
                  <h3>{result.title}</h3>
                  <div style={{display: 'flex' }}>
                    <div style={{display: 'flex' }}>
                      <p>Duration: </p>
                      {result.duration}
                    </div>
                    <div style={{marginLeft: '10px', display: 'flex'}}>
                      <p>Download: </p>
                      <button onClick={download.bind(this, result.link)}>Download</button>
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
