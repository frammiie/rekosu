// @refresh reload
import { Link, Meta, MetaProvider, Title } from '@solidjs/meta';
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import './app.css';
import { SessionProvider } from '@solid-mediakit/auth/client';
import { Layout } from './routes/layout';

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          <Link rel='icon' href='/favicon.svg' />
          <Title>Rekosu</Title>
          <Meta
            name='description'
            content='Compare your favorite beatmaps and find new ones!'
          />
          <Suspense>
            <SessionProvider>
              <Layout children={props.children} />
            </SessionProvider>
          </Suspense>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
