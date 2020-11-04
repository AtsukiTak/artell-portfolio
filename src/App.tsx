import React from "react";
import { createGlobalStyle } from "styled-components";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { StylesProvider } from "@material-ui/core/styles";

import { Store } from "services/index";
import { Route } from "components/router";
import SigninPage from "pages/signin";
import SettingProfilePage from "pages/settings/profile";
import SettingArtsPage from "pages/settings/arts";
import SettingArtsAddPage from "pages/settings/arts/add";
import SettingArtsEditPage from "pages/settings/arts/edit";
import ThanksPage from "pages/thanks";
import ArtistPage from "pages/artist";
import ArtPage from "pages/art";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: YuGothic, "Yu Gothic", "Hiragino Kaku Gothic ProN", Roboto, sans-serif;
  }
  * {
    box-sizing: border-box;
  }
`;

const App: React.FC<{ store: Store }> = ({ store }) => {
  return (
    <StylesProvider injectFirst>
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
            <Route path="/settings/arts/edit/:artId" exact>
              {({ match }) => (
                <SettingArtsEditPage artId={match.params.artId} />
              )}
            </Route>
            <Route path="/signin" exact>
              <SigninPage />
            </Route>
            <Route path="/_thanks" exact>
              <ThanksPage />
            </Route>
            <Route path="/:artistId" exact>
              {({ match }) => <ArtistPage artistId={match.params.artistId} />}
            </Route>
            <Route path="/:artistId/:artId" exact>
              {({ match }) => (
                <ArtPage
                  artistId={match.params.artistId}
                  artId={match.params.artId}
                />
              )}
            </Route>
            <Redirect to="/signin" />
          </Switch>
        </Router>
      </Provider>
    </StylesProvider>
  );
};

export default App;
