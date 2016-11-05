'use strict';

import React, {PropTypes} from 'react';
import {Row, Block} from 'jsxstyle';
import {Link} from 'react-router';

export default class Headr extends React.Component {
  render() {
    return (
      <Row height={60}
           padding="0 15px"
           background="ivory"
           alignItems="center">
        <Block flex={1}>
          <Link to="/">Frontend</Link>
        </Block>

        <Block>
          <Link to="/login">Login</Link>
        </Block>
      </Row>
    );
  }
}
