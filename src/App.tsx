import React from 'react';
import {createGlobalStyle} from 'styled-components';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';

import TopPage from './pages/top';
import ArtistPage from './pages/artist';
import ArtPage from './pages/art';

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
          <Route path="/" exact render={() => <TopPage />} />
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
