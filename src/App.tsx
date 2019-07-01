import React from 'react';
import {createGlobalStyle} from 'styled-components';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import TopPage from 'pages/top';
import SigninPage from 'pages/signin';
import AccountPage from 'pages/account';
import RegisterPage from 'pages/account/register';
import ArtistPage from 'pages/artist';
import ArtPage from 'pages/art';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
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
          <Route path="/" exact render={() => <TopPage />} />
          <Route path="/signin/" exact render={() => <SigninPage />} />
          <Route
            path="/account/"
            exact
            render={({history}) => <AccountPage history={history} />}
          />
          <Route
            path="/account/register/"
            exact
            render={({history}) => <RegisterPage history={history} />}
          />
          <Route
            path="/:id/"
            exact
            render={({match}) => <ArtistPage displayId={match.params.id} />}
          />
          <Route
            path="/:artistId/:artId/"
            exact
            render={({match}) => (
              <ArtPage
                artistDisplayId={match.params.artistId}
                artId={match.params.artId}
              />
            )}
          />
          <Redirect to="/" />
        </Switch>
      </Router>
    </>
  );
};

export default App;
