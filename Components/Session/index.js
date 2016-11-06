'use strict';

import React, {PropTypes} from 'react';
import {Col, Row} from 'jsxstyle';
import {Cloud, User} from 'leancloud-storage';

export default class Session extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  state = {
    code: '',
    number: '',
    isSubmitDisabled: true,
    requestingCodePause: Infinity
  };

  componentWillUnmount() {
    if (this._interval) {
      clearInterval(this._interval);
    }
  }

  setCodeRef = (ref) => {
    this._code = ref;
  }

  setNumberRef = (ref) => {
    this._number = ref;
  }

  onRequestCode = () => {
    const {number} = this.state;

    this.setState({
      requestingCodePause: 61
    });

    Cloud.requestSmsCode(number.toString())
      .then(() => {
        this._interval = setInterval(() => {
          const {requestingCodePause} = this.state;

          this.setState({
            requestingCodePause: requestingCodePause - 1
          }, () => {
            const {requestingCodePause} = this.state;

            if (requestingCodePause <= 0) {
              clearInterval(this._interval);
            }
          });
        }, 1000);
      }, () => {
        this.setState({
          requestingCodePause: 0
        });
      });
  };

  onInputChange = (event) => {
    const {name, value} = event.target;

    this.setState({
      [name]: value,
      isSubmitDisabled: !(this._number.checkValidity() && this._code.checkValidity())
    });

    if (name === 'number') {
      this.setState({
        requestingCodePause: this._number.checkValidity() ? 0 : Infinity
      });
    }
  }

  onSubmit = (event) => {
    event.preventDefault();

    const {code, number} = this.state;

    User.signUpOrlogInWithMobilePhone(number.toString(), code.toString())
      .then(() => {
        this.context.router.push('/');
      });
  };

  render() {
    const {code, number, isSubmitDisabled, requestingCodePause} = this.state;
    const isWaitingForCode = requestingCodePause > 0 && requestingCodePause <= 60;
    const isNumberInputDisabled = requestingCodePause > 0 && requestingCodePause <= 61;

    return (
      <Col flex={1}
           margin="0 auto"
           padding="0 15px"
           maxWidth={600}
           justifyContent="center">
        <h1>Login</h1>

        <form onSubmit={this.onSubmit}>
          <Row width={250}
               marginBottom={10}
               justifyContent="space-between">
            <input ref={this.setNumberRef}
                   name="number"
                   type="text"
                   value={number}
                   pattern="^1[345678][0-9]{9}$"
                   required={true}
                   disabled={isNumberInputDisabled}
                   onChange={this.onInputChange}
                   placeholder="mobile phone number"/>

            <button disabled={requestingCodePause > 0}
                    onClick={this.onRequestCode}>
              Get code
              {isWaitingForCode ? ` in ${requestingCodePause}s` : ''}
            </button>
          </Row>

          <Row marginBottom={10}>
            <input ref={this.setCodeRef}
                   name="code"
                   type="text"
                   value={code}
                   pattern="^[0-9]{6}$"
                   required={true}
                   onChange={this.onInputChange}/>
          </Row>

          <button type="submit"
                  disabled={isSubmitDisabled}>
            Submit
          </button>
        </form>
      </Col>
    );
  }
}
