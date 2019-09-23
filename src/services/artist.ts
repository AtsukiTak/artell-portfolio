import { Action as ReduxAction } from "redux";
import { ThunkAction } from "redux-thunk";
import * as firebase from "firebase/app";

import { Art, ArtRepository } from "models/art";
import { Artist, ArtistRepository } from "models/artist";

/*
 * State
 */
export interface State {
  requesting: boolean;
  list: {
    artist: Artist;
    arts: Art[];
  }[];
}

export const InitialState = {
  requesting: false,
  list: []
};

/*
 * Action
 */
type AppAction<T extends string, Extra extends {} = {}> = ReduxAction<T> &
  { [K in keyof Extra]: Extra[K] };

export enum ActionType {
  requestGetArtistList = "REQUEST_GET_ARTIST_LIST",
  successGetArtistList = "SUCCESS_GET_ARTIST_LIST",
  failureGetArtistList = "FAILURE_GET_ARTIST_LIST",
  requestGetArtist = "REQUEST_GET_ARTIST",
  successGetArtist = "SUCCESS_GET_ARTIST",
  failureGetArtist = "FAILURE_GET_ARTIST"
}

export type Action =
  | AppAction<ActionType.requestGetArtistList>
  | AppAction<
      ActionType.successGetArtistList,
      { list: { artist: Artist; arts: Art[] }[] }
    >
  | AppAction<ActionType.failureGetArtistList, { msg: string }>
  | AppAction<ActionType.requestGetArtist>
  | AppAction<ActionType.successGetArtist, { artist: Artist; arts: Art[] }>
  | AppAction<ActionType.failureGetArtist, { msg: string }>;

const requestGetArtistList = (): Action => ({
  type: ActionType.requestGetArtistList
});

const successGetArtistList = (
  list: { artist: Artist; arts: Art[] }[]
): Action => ({
  type: ActionType.successGetArtistList,
  list
});

const failureGetArtistList = (msg: string): Action => ({
  type: ActionType.failureGetArtistList,
  msg
});

const requestGetArtist = (): Action => ({
  type: ActionType.requestGetArtist
});

const successGetArtist = (artist: Artist, arts: Art[]): Action => ({
  type: ActionType.successGetArtist,
  artist,
  arts
});

const failureGetArtist = (msg: string): Action => ({
  type: ActionType.failureGetArtist,
  msg
});

export function getArtistList(): ThunkAction<
  Promise<void>,
  State,
  null,
  Action
> {
  return async dispatch => {
    dispatch(requestGetArtistList());
    const artists = await new ArtistRepository(firebase.app()).queryList();
    const list = await Promise.all(
      artists.map(async artist => {
        const arts = await new ArtRepository(
          firebase.app()
        ).queryPublicListByArtist(artist);
        return {
          artist,
          arts
        };
      })
    );
    dispatch(successGetArtistList(list));
  };
}

export function getArtistByName(
  name: string
): ThunkAction<Promise<void>, State, null, Action> {
  return async dispatch => {
    dispatch(requestGetArtist());
    const artist = await new ArtistRepository(firebase.app()).queryByName(name);
    if (artist === null) {
      dispatch(failureGetArtist("Not Found"));
    } else {
      const arts = await new ArtRepository(
        firebase.app()
      ).queryPublicListByArtist(artist);
      dispatch(successGetArtist(artist, arts));
    }
  };
}

/*
 * Reducer
 */
export function reducer(state: State = InitialState, action: Action): State {
  switch (action.type) {
    case ActionType.requestGetArtistList:
      return {
        ...state,
        requesting: true
      };
    case ActionType.successGetArtistList:
      return {
        requesting: false,
        list: action.list
      };
    case ActionType.failureGetArtistList:
      return {
        requesting: false,
        list: []
      };
    case ActionType.requestGetArtist:
      return {
        ...state,
        requesting: true
      };
    case ActionType.successGetArtist:
      const newList = Array.from(state.list);
      const idx = newList.findIndex(
        ({ artist }) => artist.uid === action.artist.uid
      );
      if (idx === -1) {
        newList.push({ artist: action.artist, arts: action.arts });
      } else {
        newList[idx] = {
          artist: action.artist,
          arts: action.arts
        };
      }
      return {
        requesting: false,
        list: newList
      };
    case ActionType.failureGetArtist:
      return {
        requesting: false,
        list: state.list
      };
    default:
      return state;
  }
}
