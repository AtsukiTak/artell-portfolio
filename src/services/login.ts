import { Action as ReduxAction } from "redux";
import { ThunkAction } from "redux-thunk";
import * as firebase from "firebase/app";
import "firebase/auth";

import { Artist, ArtistRepository } from "models/artist";
import { Art, ArtRepository } from "models/art";

const MAX_CHECKING_MILLIS = 5000;

export interface State {
  user:
    | {
        artist: Artist;
        arts: Art[];
      }
    | null
    | "checking";
}

export const InitialState = {
  user: "checking" as const,
};

export type AppAction<T extends string, Extra extends {} = {}> = ReduxAction<
  T
> &
  { [K in keyof Extra]: Extra[K] };

export enum ActionType {
  setUser = "SET_USER",
  clearUser = "CLEAR_USER",
  clearUserIfChecking = "CLEAR_USER_IF_CHECKING",
}

export type Action =
  | AppAction<ActionType.setUser, { artist: Artist; arts: Art[] }>
  | AppAction<ActionType.clearUser>
  | AppAction<ActionType.clearUserIfChecking>;

export const setUser = (artist: Artist, arts: Art[]): Action => ({
  type: ActionType.setUser,
  artist,
  arts,
});

export const clearUser = (): Action => ({
  type: ActionType.clearUser,
});

export const clearUserIfChecking = (): Action => ({
  type: ActionType.clearUserIfChecking,
});

export function startObserving(): ThunkAction<void, State, null, Action> {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(clearUserIfChecking());
    }, MAX_CHECKING_MILLIS);

    firebase.auth().onAuthStateChanged(async (fbuser) => {
      if (fbuser) {
        let artist = await new ArtistRepository(firebase.app()).queryByUid(
          fbuser.uid
        );
        if (artist === null) {
          const name = fbuser.displayName;
          const email = fbuser.email;
          if (!name || !email) {
            alert("名前、またはメールアドレスを取得できませんでした");
            throw new Error("Can't get user name or email");
          }
          artist = await new ArtistRepository(firebase.app()).create(
            fbuser.uid,
            name,
            email
          );
        }

        const arts = await new ArtRepository(
          firebase.app()
        ).queryAllListByArtist(artist);
        dispatch(setUser(artist, arts));
      } else {
        dispatch(clearUser());
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
    case ActionType.clearUser:
      return {
        user: null,
      };
    case ActionType.clearUserIfChecking:
      if (state.user === "checking") {
        return {
          user: null,
        };
      } else {
        return state;
      }
    default:
      return state;
  }
}
