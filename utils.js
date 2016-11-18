'use strict';

import AV from 'leanengine';
import {request as AVRequest} from 'leancloud-storage/dist/node/request';

export const fetchUserBySessionToken = (token) => {
  const user = AV.Object._create('_User');

  return AVRequest(
    'users',
    'me',
    null,
    'GET', {
      session_token: token
    }
  ).then((response) => {
    const attrs = user.parse(response);
    user._finishFetch(attrs);

    return user;
  });
};
