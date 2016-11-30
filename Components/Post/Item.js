'use strict';

import './Item.css';

import React, {Component, PropTypes} from 'react';
import {Col} from 'jsxstyle';
import {Query} from 'leancloud-storage';
import sanitizeHtml from 'sanitize-html';
import {convertFromRaw} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';

export default class Item extends Component {
  static propTypes = {
    post: PropTypes.object.isRequired
  };

  static getInitialProps = ({params}) => {
    const {id} = params;
    const _Post = new Query('Post');

    return _Post.get(id)
      .then((_post) => {
        const {id, createdAt, updatedAt} = _post;
        const contentState = _post.get('contentState');

        const post = {
          id,
          createdAt,
          updatedAt,
          contentState
        };

        return {post};
      });
  };

  render() {
    const {post} = this.props;
    const {contentState} = post;
    const __html = sanitizeHtml(stateToHTML(convertFromRaw(contentState)));

    return (
      <Col flex="1"
           alignItems="center"
           justifyContent="center">
        <Col props={{dangerouslySetInnerHTML: {__html}}}
             className="PostItem-content"
             flex="1"
             width="100%"
             padding="20px 0"
             maxWidth={800}>
        </Col>
      </Col>
    );
  }
}
