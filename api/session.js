'use strict';

import {badImplementation} from 'boom';
import {fetchUserBySessionToken} from '../utils';

export const post = (request, reply) => {
  const {id, token} = request.payload;

  fetchUserBySessionToken(token)
    .then((user) => {
      if (user.id === id) {
        request.cookieAuth.set({id, token});

        reply().code(204);
      } else {
        reply(badImplementation(`User's id and session token is not matched`));
      }
    }).catch((error) => {
      reply(badImplementation('Invalid User', error));
    });
};

const remove = (request, reply) => {
  request.cookieAuth.clear();

  reply().code(204);
};

export {remove as delete};
