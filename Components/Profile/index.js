'use strict';

import React, {Component, PropTypes} from 'react';
import {Col, Block} from 'jsxstyle';
import {File, Query, Object as AVObject} from 'leancloud-storage';

const Avatar = ({
  url,
  ...props
}) => {
  return (
    <Block width="200"
           height="200"
           border="none"
           margin="0"
           padding="0"
           position="relative"
           background={`url(${url}) no-repeat`}
           borderRadius="50%"
           backgroundSize="cover"
           {...props}/>
  );
};

Avatar.propTypes = {
  url: PropTypes.string.isRequired
};

export default class Profile extends Component {
  static propTypes = {
    user: PropTypes.object,
    profile: PropTypes.object.isRequired
  };

  static getInitialProps = ({params}) => {
    const {username} = params;

    const query = new Query('_User');
    query.equalTo('username', username);
    return query.find()
      .then(([_user]) => {
        const {id, createdAt, updatedAt} = _user;
        const avatar = _user.get('avatar');

        const profile = {
          id,
          avatar,
          username,
          createdAt,
          updatedAt
        };

        return {profile};
      });
  };

  constructor(props) {
    super(props);

    const {user, profile} = this.props;
    this.state = {
      avatar: profile.avatar
    };

    this.onUpload = (event) => {
      const {files} = event.target;

      if (files.length > 0) {
        const {name} = files[0];
        const file = new File(name, files[0]);
        file.save().then((_file) => {
          const _user = AVObject.createWithoutData('_User', user.objectId);
          const avatar = _file.url();

          _user.set('avatar', _file.url());
          _user.save()
            .then(() => {
              this.setState({avatar});
            });
        });
      }
    };
  }

  render() {
    const {avatar} = this.state;
    const {user, profile} = this.props;
    const avatarUrl = avatar || require('./avatar.jpg');
    const isCurrentUser = user && (user.objectId === profile.id);

    return (
      <Col padding="20px 0"
           alignItems="center">
        <Avatar url={avatarUrl}
                marginBottom="10">
          <Block props={{
                   type: 'file',
                   accept: 'image/*',
                   onChange: this.onUpload
                 }}
                 component="input"
                 top="0"
                 left="0"
                 right="0"
                 bottom="0"
                 cursor="pointer"
                 display={isCurrentUser ? null : 'none'}
                 opacity="0"
                 position="absolute"
                 maxWidth="200"/>
        </Avatar>

        <Block component="h1">{profile.username}</Block>
      </Col>
    );
  }
}
