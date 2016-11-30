'use strict';

import 'draft-js/dist/Draft.css';

import React, {Component, PropTypes} from 'react';
import {Col, Block} from 'jsxstyle';
import {Editor, EditorState} from 'draft-js';
import {Object as AVObject} from 'leancloud-storage';

const Post = AVObject.extend('Post');

export default class Create extends Component {
  static contextTypes = {
    user: PropTypes.object,
    router: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty()
    };

    this.onSubmit = () => {
      const {editorState} = this.state;
      const contentState = editorState.getCurrentContent();
      if (contentState.hasText()) {
        const post = new Post();

        const {user, router} = this.context;
        post.set('contentState', contentState);
        post.set('user', user);
        post.save()
          .then(({id}) => {
            const username = user.get('username');

            router.push(`/@${username}/${id}`);
          })
          .catch((error) => {
            // TODO: show error message to user
            console.error(error);
          });
      } else {
        // TODO: show error message to user
        console.error('Please write something before submit');
      }
    };

    this.onChange = (editorState) => {
      this.setState({editorState});
    };
  }

  componentWillMount() {
    const {user, router} = this.context;

    // redirect user to login page if user is not logged in
    if (!user) {
      router.push('/login');
    }
  }

  render() {
    const {editorState} = this.state;
    const contentState = editorState.getCurrentContent();

    return (
      <Col flex="1"
           alignItems="center"
           justifyContent="center">
        <Col flex="1"
             width="100%"
             padding="20px 0"
             maxWidth={800}>
          <Editor onChange={this.onChange}
                  editorState={editorState}
                  placeholder={`Type your content`}/>
        </Col>

        <Block props={{onClick: this.onSubmit, disabled: !contentState.hasText()}}
               component="button"
               marginBottom={10}>
          Submit
        </Block>
      </Col>
    );
  }
}
