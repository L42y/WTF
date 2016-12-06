'use strict';

import React from 'react';
import {Link, Route, IndexRoute} from 'react-router';
import {init} from 'leancloud-storage';

const appId = process.env.LEANCLOUD_APP_ID;
const appKey = process.env.LEANCLOUD_APP_KEY;
const region = process.env.LEANCLOUD_REGION;

init({appId, appKey, region});

import App from './Components';
import Home from './Components/Home';
import Create from './Components/Post/Create';
import Session from './Components/Session';
import Profile from './Components/Profile';
import PostItem from './Components/Post/Item';

const routes = (
  <Route path="/"
         component={App}>
    <IndexRoute component={Home}/>
    <Route path="create"
           component={Create}/>
    <Route path="login"
           component={Session}/>
    <Route path="@:username"
           component={Profile}/>
    <Route path="@:username/:id"
           component={PostItem}/>
  </Route>
);

export default routes;
