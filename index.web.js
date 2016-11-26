'use strict';

import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';

import routes from './routes.js';

const createElement = (Component, props) => {
  const extraProps = JSON.parse(window.__wtfDataJSON);

  return <Component {...props} {...extraProps}/>;
};

render((
  <Router history={browserHistory}
          createElement={createElement}>
    {routes}
  </Router>
), document.getElementById('react-root'));
