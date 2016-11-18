'use strict';

import React, {PropTypes} from 'react';
import {Col, Row, Block} from 'jsxstyle';
import {Cloud, User} from 'leancloud-storage';

export default class Session extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  state = {
    using: 'password',
    code: '',
    number: '',
    password: '',
    isSubmitDisabled: true,
    requestingCodePause: Infinity,
    isPasswordLoginDisabled: true
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

  setPasswordRef = (ref) => {
    this._password = ref;
  }

  onUsingChange = (event) => {
    const {value} = event.target;

    this.setState({
      using: value
    });
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
      isSubmitDisabled: !(this._number.checkValidity() && this._code.checkValidity()),
      isPasswordLoginDisabled: !(this._number.checkValidity() && this._password.checkValidity())
    });

    if (name === 'number') {
      this.setState({
        requestingCodePause: this._number.checkValidity() ? 0 : Infinity
      });
    }
  }

  onLoginByCode = (event) => {
    event.preventDefault();

    const {code, number} = this.state;

    User.signUpOrlogInWithMobilePhone(number.toString(), code.toString())
      .then(this.onLoginSucceed);
  };

  onLoginByPassword = (event) => {
    event.preventDefault();

    const {number, password} = this.state;

    User.logInWithMobilePhone(number.toString(), password.toString())
      .then(this.onLoginSucceed);
  }

  onLoginSucceed = (response) => {
    const {id, _sessionToken: token} = response;

    fetch('/api/session', {
      body: JSON.stringify({id, token}),
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin'
    });

    this.context.router.push('/');
  }

  render() {
    const {
      using,
      code,
      number,
      password,
      isSubmitDisabled,
      isPasswordLoginDisabled,
      requestingCodePause
    } = this.state;

    const isWaitingForCode = requestingCodePause > 0 && requestingCodePause <= 60;
    const isNumberInputDisabled = requestingCodePause > 0 && requestingCodePause <= 61;
    const isRequestingCodeDisabled = requestingCodePause > 0;

    const isUsingCode = using === 'code';
    const isUsingPassword = using === 'password';
    const numberInput = (
      <input ref={this.setNumberRef}
             name="number"
             type="text"
             value={number}
             pattern="^1[345678][0-9]{9}$"
             required={true}
             disabled={isNumberInputDisabled}
             onChange={this.onInputChange}
             placeholder="mobile phone number"/>
    );

    return (
      <Col flex={1}
           margin="0 auto"
           padding="0 15px"
           maxWidth={600}
           justifyContent="center">
        <Row alignItems="center"
             marginBottom={10}>
          <Block margin="0"
                 component="h1">
            Login
          </Block>

          <Block margin="0 5px">with:</Block>

          <Block component="label"
                 marginRight={5}>

            <input name="using"
                   type="radio"
                   value="password"
                   checked={using === 'password'}
                   onChange={this.onUsingChange}/>

            password
          </Block>

          <Block component="label">
            <input name="using"
                   type="radio"
                   value="code"
                   checked={using === 'code'}
                   onChange={this.onUsingChange}/>

            SMS code
          </Block>
        </Row>

        <Block props={{onSubmit: this.onLoginByPassword}}
               display={isUsingPassword ? null : 'none'}
               component="form">
          <Row marginBottom={10}>
            {numberInput}
          </Row>

          <Row marginBottom={10}>
            <input ref={this.setPasswordRef}
                   name="password"
                   type="password"
                   value={password}
                   required={true}
                   onChange={this.onInputChange}
                   minLength={6}
                   maxLength={64}
                   placeholder="password"/>
          </Row>


          <button type="submit"
                  disabled={isPasswordLoginDisabled}>
            Login
          </button>
        </Block>

        <Block props={{onSubmit: this.onLoginByCode}}
               display={isUsingCode ? null : 'none'}
               component="form">
          <Row width={250}
               marginBottom={10}
               justifyContent="space-between">
            {numberInput}

            <button disabled={isRequestingCodeDisabled}
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
        </Block>
      </Col>
    );
  }
}
