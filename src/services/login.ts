import {Action as ReduxAction} from 'redux';
import {ThunkAction} from 'redux-thunk';
import * as firebase from 'firebase/app';
import 'firebase/auth';

import {Artist, ArtistRepository} from 'models/artist';
import {Art, ArtRepository} from 'models/art';

export interface State {
  user: {
    artist: Artist;
    arts: Art[];
  } | null;
}

export const InitialState = {
  user: null,
};

export type AppAction<T extends string, Extra extends {} = {}> = ReduxAction<
  T
> &
  {[K in keyof Extra]: Extra[K]};

export enum ActionType {
  setUser = 'SET_USER',
  logout = 'LOGOUT',
}

export type Action =
  | AppAction<ActionType.setUser, {artist: Artist; arts: Art[]}>
  | AppAction<ActionType.logout>;

export const setUser = (artist: Artist, arts: Art[]): Action => ({
  type: ActionType.setUser,
  artist,
  arts,
});

export const logout = (): Action => ({
  type: ActionType.logout,
});

export function startObserving(): ThunkAction<void, State, null, Action> {
  return dispatch => {
    firebase.auth().onAuthStateChanged(async fbuser => {
      if (fbuser) {
        let artist = await ArtistRepository.queryByUid(fbuser.uid);
        if (artist === null) {
          const name = fbuser.displayName;
          const email = fbuser.email;
          if (!name || !email) {
            alert('名前、またはメールアドレスを取得できませんでした');
            throw new Error("Can't get user name or email");
          }
          artist = await ArtistRepository.create(fbuser.uid, name, email);
        }

        const arts = await ArtRepository.queryListByArtist(artist);
        dispatch(setUser(artist, arts));
      } else {
        dispatch(logout());
      }
    });
  };
}

export function reducer(state: State = InitialState, action: Action): State {
  switch (action.type) {
    case ActionType.setUser:
      return {
        user: {
          artist: action.artist,
          arts: action.arts,
        },
      };
    case ActionType.logout:
      return {
        user: null,
      };
    default:
      return state;
  }
}
