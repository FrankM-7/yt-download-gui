import React, { Fragment, useEffect } from 'react';
import { get } from 'utils/requests';

import { Counter } from 'components/counter/Counter';
import Titlebar from 'components/titlebar/Titlebar';

import logo from 'logo.svg';
import styles from 'components/App.module.scss';
import axios from 'axios';

function App() {
  const [searchQuery, setSearchQuery] = React.useState('bad bunny');

  function searchYoutube() {
    setTimeout(() => get(
      'search?query=' + searchQuery, // Route
      (response) => console.log(response), // Response callback
      (error) => console.error(error) // Error callback
    ), 3000);
  }

  useEffect(() => {
    /**
     * Example call to Flask
     * @see /src/utils/requests.js
     * @see /app.py
     */
    setTimeout(() => get(
      'example', // Route
      (response) => alert(response), // Response callback
      (error) => console.error(error) // Error callback
    ), 3000);
  }, []);

  return (
    <Fragment>
      <Titlebar />
        <header className={ styles['app-header'] }>
          <input type="text"></input>
          <button onClick={searchYoutube}>Search</button>
        </header>
    </Fragment>
  );
}

export default App;
