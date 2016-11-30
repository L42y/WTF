'use strict';

import React, {Component, PropTypes} from 'react';
import {Col} from 'jsxstyle';

const prefetch = (WrapComponent) => {
  return class Prefetch extends Component {
    static contextTypes = {
      router: PropTypes.object
    };

    constructor(props, context) {
      super(props, context);

      const {getInitialProps} = WrapComponent;

      if (getInitialProps) {
        this.state = {
          isReady: false,
          isFailed: false
        };

        const {router: {params}} = this.context;
        getInitialProps({params})
          .then((initialProps) => {
            this.setState({
              isReady: true,
              initialProps
            });
          })
          .catch(() => {
            this.setState({
              isFailed: true
            });
          });
      } else {
        this.state = {
          isReady: true,
          isFailed: false,
          initialProps: null
        };
      }

    }

    render() {
      const {isReady, isFailed, initialProps} = this.state;

      if (isFailed) {
        return (
          <Col height="100%"
               alignItems="center"
               justifyContent="center">
            Failed to load data, please refresh the page or try again later
          </Col>
        );
      }

      if (isReady) {
        return <WrapComponent {...this.props} {...initialProps}/>;
      } else {
        return (
          <Col height="100%"
               alignItems="center"
               justifyContent="center">
            Loading
          </Col>
        );
      }
    }
  };
};

export default prefetch;
