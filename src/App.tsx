import React from 'react';
import { createGlobalStyle } from 'styled-components';

import TopPage from './pages/top';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
`;

const App: React.FC = () => {
  return (
    <>
    <GlobalStyle />
    <TopPage />
    </>
  );
}

export default App;
