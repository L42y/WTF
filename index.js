'use strict';

import {Server} from 'hapi';
import {badImplementation, notFound} from 'boom';
import Inert from 'inert';
import React from 'react';
import {renderToString, renderToStaticMarkup} from 'react-dom/server';
import {match, RouterContext} from 'react-router';

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

server.route({
  path: '/{params*}',
  method: 'GET',
  handler: function(request, reply) {
    match({routes, location: request.url.href}, (error, redirectLocation, renderProps) => {
      if (error) {
        return reply(badImplementation(error.message));
      } else if (redirectLocation) {
        return reply.redirect(redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        const markup = renderToString(<RouterContext {...renderProps}/>);

        return reply(generateTemplate({
          title: '前端',
          markup
        }));
      } else {
        return reply(notFound());
      }
    });
  }
});

server.register(Inert, (err) => {
  if (err) {
    console.error('Failed to load module `inert`');
  } else {
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
