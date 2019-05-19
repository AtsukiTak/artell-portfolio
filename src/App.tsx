import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import TopPage from './pages/top';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  },
  * {
    box-sizing: border-box;
  }
`;

const App: React.FC = () => {
  return (
    <>
    <GlobalStyle />
    <Router>
      <Switch>
        <Route path="/" exact component={TopPage} />
        <Redirect to="/" />
      </Switch>
    </Router>
    </>
  );
}

export default App;
