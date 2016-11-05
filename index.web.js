'use strict';

import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';

import routes from './routes.js';

render(
  <Router history={browserHistory}>{routes}</Router>,
  document.getElementById('react-root')
);
