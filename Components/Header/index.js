'use strict';

import React, {PropTypes} from 'react';
import {Row, Block} from 'jsxstyle';
import {Link} from 'react-router';

export default class Headr extends React.Component {
  static contextTypes = {
    user: PropTypes.object
  };

  renderUserOrLogin = () => {
    const {user} = this.context;

    return user ? (
      <Link to={`/@${user.getUsername()}`}>@{user.getUsername()}</Link>
    ) : (
      <Link to="/login">Login</Link>
    );
  }

  render() {
    const {user} = this.context;

    return (
      <Row height={60}
           padding="0 15px"
           background="ivory"
           alignItems="center">
        <Block flex={1}>
          <Link to="/">Frontend</Link>
        </Block>

        <Block>
          {this.renderUserOrLogin()}
        </Block>
      </Row>
    );
  }
}
