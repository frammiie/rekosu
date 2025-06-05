import { createHandler, StartServer } from '@solidjs/start/server';
import { serverEnv } from './env/server';

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang='en'>
        <head>
          <meta charset='utf-8' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <script
            src={serverEnv.ANALYTICS_SCRIPT_URL}
            data-website-id={serverEnv.ANALYTICS_WEBSITE_ID}
          />
          {assets}
        </head>
        <body>
          <div id='app'>{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
