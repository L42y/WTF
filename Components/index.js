'use strict';

import React, {PropTypes} from 'react';

export default class App extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  };

  render() {
    const {children} = this.props;

    return (
      <div>{children}</div>
    );
  }
}
