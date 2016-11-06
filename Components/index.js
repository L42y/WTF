'use strict';

import React, {PropTypes} from 'react';
import {Col} from 'jsxstyle';
import {User} from 'leancloud-storage';

import Header from './Header';

export default class App extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  static childContextTypes = {
    user: PropTypes.instanceOf(User)
  };

  getChildContext() {
    return {
      user: User.current()
    };
  }

  render() {
    const {children} = this.props;

    return (
      <Col minHeight="100vh">
        <Header/>

        {children}
      </Col>
    );
  }
}
