'use strict';

import React, {Component, PropTypes} from 'react';
import {Col} from 'jsxstyle';
import {Query} from 'leancloud-storage';
import sanitizeHtml from 'sanitize-html';
import {convertFromRaw} from 'draft-js';
import {stateToHTML} from 'draft-js-export-html';

export default class Home extends Component {
  static propTypes = {
    posts: PropTypes.array.isRequired
  };

  static getInitialProps = () => {
    const query = new Query('Post');

    query.equalTo('isRecommended', true);

    return query.find()
      .then((response) => {
        const posts = response.map((_post) => {
          const {id, createdAt, updatedAt} = _post;

          return {
            id,
            createdAt,
            updatedAt,
            contentState: _post.get('contentState')
          };
        });

        return {posts};
      });
  };

  render() {
    const {posts} = this.props;

    return (
      <Col className="PostItem-content"
           flex="1"
           width="100%"
           margin="auto"
           padding="20px 0"
           maxWidth={800}>
        {posts.map((post) => {
          const {contentState} = post;
          const __html = sanitizeHtml(stateToHTML(convertFromRaw(contentState)));
          return <div key={post.id} dangerouslySetInnerHTML={{__html}}/>;
        })}
      </Col>
    );
  }
}
