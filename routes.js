'use strict';

import React from 'react';
import {Link, Route, IndexRoute} from 'react-router';
import {init} from 'leancloud-storage';

const appId = 'n6eK5jTS0fmkSTKJgUu4UDFX-gzGzoHsz';
const appKey = 'UJKmvhT1igk8PQHQjXI5xRQp';

init({appId, appKey});

import App from './Components';

const Hello = () => {
  return (
    <div>
      Hello, <Link to="/world">World!</Link>
    </div>
  );
};

const World = () => {
  return (
    <div>Hola</div>
  );
};

const routes = (
  <Route path="/"
         component={App}>
    <IndexRoute component={Hello}/>
    <Route path="world"
           component={World}/>
  </Route>
);

export default routes;
