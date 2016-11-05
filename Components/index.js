'use strict';

import React, {PropTypes} from 'react';
import {Col} from 'jsxstyle';

import Header from './Header';

export default class App extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

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
