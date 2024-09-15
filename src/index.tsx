import { DesignSystemProvider } from '@aplinkosministerija/design-system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import App from './App';
import { UserProvider } from './components/UserProdiver';
import { GlobalStyle, theme } from './styles/index';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const queryClient = new QueryClient();

root.render(
  <ThemeProvider theme={theme}>
    <GlobalStyle />

    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <UserProvider>
          <ThemeProvider theme={theme}>
            <DesignSystemProvider>
              <App />
            </DesignSystemProvider>
          </ThemeProvider>
        </UserProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeProvider>,
);
