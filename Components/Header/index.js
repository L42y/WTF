'use strict';

import React, {PropTypes} from 'react';
import {Row, Block} from 'jsxstyle';
import {Link} from 'react-router';

export default class Header extends React.Component {
  static contextTypes = {
    user: PropTypes.object
  };

  renderUserOrLogin = () => {
    const {user} = this.context;

    return user ? (
      <Row>
        <Block marginRight={15}>
          <Link to="/create">Create</Link>
        </Block>

        <Link to={`/@${user.username}`}>@{user.username}</Link>
      </Row>
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
