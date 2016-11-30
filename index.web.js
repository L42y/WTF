'use strict';

import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';

import routes from './routes.js';
import prefetch from './prefetch.js';

const createElement = (Component, props) => {
  // get `serverProps` since it should always there for client to restore
  const serverProps = window.__serverDataJSON ?
    JSON.parse(window.__serverDataJSON) : {};

  if (window.__initialDataJSON) {
    const initialProps = window.__initialDataJSON ?
      JSON.parse(window.__initialDataJSON) : {};

    return <Component {...props} {...serverProps} {...initialProps}/>;
  } else {
    const Wrapped = prefetch(Component);
    return <Wrapped {...props} {...serverProps}/>;
  }
};

render((
  <Router history={browserHistory}
          createElement={createElement}>
    {routes}
  </Router>
), document.getElementById('react-root'));

// purge `initialProps` data which pass from server
// after initial client-side rendering
if (window.__initialDataJSON) {
  window.__initialDataJSON = null;
}
