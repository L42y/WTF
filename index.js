'use strict';

import {Server} from 'hapi';
import {badImplementation, notFound} from 'boom';
import Inert from 'inert';
import Cookie from 'hapi-auth-cookie';
import React from 'react';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';
import {match, RouterContext} from 'react-router';
import {init, Cloud} from 'leanengine';

import {fetchUserBySessionToken} from './utils';

init({
  appId: process.env.LEANCLOUD_APP_ID,
  appKey: process.env.LEANCLOUD_APP_KEY,
  masterKey: process.env.LEANCLOUD_APP_MASTER_KEY
});

Cloud.useMasterKey();


const isProduction = process.env.NODE_ENV === 'production';

import routes from './routes.js';

const server = new Server({
  connections: {
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true
    }
  }
});

server.connection({
  host: '0.0.0.0',
  port: process.env.LEANCLOUD_APP_PORT || process.env.PORT || 4444
});

const generateTemplate = ({title, markup}) => {
  const bodyStyle = {
    margin: 0
  };

  const html = renderToStaticMarkup(
    <html>
      <head>
        <meta charSet="utf-8"/>
        <meta httpEquiv="x-ua-compatible"
              content="ie=edge"/>
        <title>{title}</title>
        <meta name="description"
              content=""/>
        <meta name="viewport"
              content="width=device-width, initial-scale=1"/>
        <link rel="stylesheet"
              href="/!/web.bundle.css"/>
      </head>

      <body style={bodyStyle}>
        <div id="react-root"
             dangerouslySetInnerHTML={{__html: markup}}>
        </div>

        <script src="/!/web.bundle.js"></script>
      </body>
    </html>
  );

  return `<!doctype html>${html}`;
};

server.register([Inert, Cookie], (err) => {
  if (err) {
    console.error('Failed to register plugins', err);
  } else {
    server.auth.strategy('leancloud', 'cookie', 'try', {
      cookie: 'leancloud',
      password: isProduction ?
        process.env.WTF_LEANCLOUD_COOKIE_PASSWORD :
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890',
      isSecure: isProduction
    });

    server.route([{
      path: '/favicon.ico',
      method: 'GET',
      handler: {
        file: {
          path: 'public/favicon.ico'
        }
      }
    }, {
      path: '/_/{param*}',
      method: 'GET',
      handler: {
        directory: {
          path: 'public'
        }
      }
    }, {
      path: '/!/{param*}',
      method: 'GET',
      handler: {
        directory: {
          path: 'tmp/web'
        }
      }
    }, {
      path: '/api/session',
      config: {
        auth: {
          mode: 'try',
          strategy: 'leancloud'
        }
      },
      method: 'POST',
      handler: require('./api/session').post
    }, {
      path: '/api/session',
      config: {
        auth: 'leancloud'
      },
      method: 'DELETE',
      handler: require('./api/session').delete
    }, {
      path: '/{params*}',
      config: {
        auth: {
          mode: 'try',
          strategy: 'leancloud'
        }
      },
      method: 'GET',
      handler: function(request, reply) {
        match({routes, location: request.url.href}, (error, redirectLocation, renderProps) => {
          if (error) {
            return reply(badImplementation(error.message));
          } else if (redirectLocation) {
            return reply.redirect(redirectLocation.pathname + redirectLocation.search);
          } else if (renderProps) {
            if (request.auth.isAuthenticated) {
              const {token} = request.auth.credentials;

              return fetchUserBySessionToken(token)
                .then((user) => {
                  const createElement = (Component, props) => {
                    return <Component {...props} user={user}/>;
                  };
                  const markup = renderToString(
                    <RouterContext {...renderProps}
                                   createElement={createElement}/>
                  );

                  reply(generateTemplate({
                    title: '前端',
                    markup
                  }));
                });
            } else {
              const markup = renderToString(<RouterContext {...renderProps}/>);

              return reply(generateTemplate({
                title: '前端',
                markup
              }));
            }
          } else {
            return reply(notFound());
          }
        });
      }
    }]);

    server.start((err) => {
      if (err) {
        console.error(err);
      } else {
        console.info(`server started at: ${server.info.uri}`);
      }
    });
  }
});
