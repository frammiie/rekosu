// @refresh reload
import { MetaProvider, Title } from '@solidjs/meta';
import { Router } from '@solidjs/router';
import { FileRoutes } from '@solidjs/start/router';
import { Suspense } from 'solid-js';
import './app.css';
import { SessionProvider } from '@solid-mediakit/auth/client';
import Layout from './routes/layout';

export default function App() {
  return (
    <Router
      //explicitLinks={true}
      root={props => (
        <MetaProvider>
          <Title>Rekosu</Title>
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
