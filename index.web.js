'use strict';

import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import {User} from 'leancloud-storage';

import routes from './routes.js';

const createElement = (Component, props) => {
  const user = User.current();

  return <Component {...props} user={user}/>;
};

render((
  <Router history={browserHistory}
          createElement={createElement}>
    {routes}
  </Router>
), document.getElementById('react-root'));
