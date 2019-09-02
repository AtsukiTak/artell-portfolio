import React from 'react';
import {createGlobalStyle} from 'styled-components';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Switch, Redirect} from 'react-router-dom';

import {Store} from 'services/index';
import {Route} from 'components/router';
import SigninPage from 'pages/signin';
import SettingProfilePage from 'pages/settings/profile';
import SettingArtsPage from 'pages/settings/arts';
import SettingArtsAddPage from 'pages/settings/arts/add';
import SettingArtsEditPage from 'pages/settings/arts/edit';
import ThanksPage from 'pages/thanks';
import ArtistPage from 'pages/artist';
import ArtPage from 'pages/art';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: Robot-Light;
  }
  * {
    box-sizing: border-box;
  }
`;

const App: React.FC<{store: Store}> = ({store}) => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <Router>
        <Switch>
          <Route path="/settings/profile" exact>
            <SettingProfilePage />
          </Route>
          <Route path="/settings/arts" exact>
            <SettingArtsPage />
          </Route>
          <Route path="/settings/arts/add" exact>
            <SettingArtsAddPage />
          </Route>
          <Route path="/settings/arts/edit/:artTitle" exact>
            {({match}) => (
              <SettingArtsEditPage artTitle={match.params.artTitle} />
            )}
          </Route>
          <Route path="/signin" exact>
            <SigninPage />
          </Route>
          <Route path="/_thanks" exact>
            <ThanksPage />
          </Route>
          <Route path="/:artistName" exact>
            {({match}) => <ArtistPage artistName={match.params.artistName} />}
          </Route>
          <Route path="/:artistName/:artTitle" exact>
            {({match}) => (
              <ArtPage
                artistName={match.params.artistName}
                artTitle={match.params.artTitle}
              />
            )}
          </Route>
          <Redirect to="/signin" />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
