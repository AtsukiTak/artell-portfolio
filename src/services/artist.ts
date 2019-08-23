import {Action} from 'redux';
import {ThunkAction} from 'redux-thunk';

import {
  Artist,
  fetchArtists,
  fetchArtist,
  fetchArtistByName,
} from 'models/artist';

/*
 * State
 */
export interface State {
  requesting: boolean;
  list: Artist[];
}

export const InitialState = {
  requesting: false,
  list: [],
};

/*
 * Action
 */
export type AppAction<T extends string, Extra extends {} = {}> = Action<T> &
  {[K in keyof Extra]: Extra[K]};

export enum ArtistActionType {
  requestGetArtistList = 'REQUEST_GET_ARTIST_LIST',
  successGetArtistList = 'SUCCESS_GET_ARTIST_LIST',
  failureGetArtistList = 'FAILURE_GET_ARTIST_LIST',
  requestGetArtist = 'REQUEST_GET_ARTIST',
  successGetArtist = 'SUCCESS_GET_ARTIST',
  failureGetArtist = 'FAILURE_GET_ARTIST',
}

export type ArtistAction =
  | AppAction<ArtistActionType.requestGetArtistList>
  | AppAction<ArtistActionType.successGetArtistList, {list: Artist[]}>
  | AppAction<ArtistActionType.failureGetArtistList, {msg: string}>
  | AppAction<ArtistActionType.requestGetArtist>
  | AppAction<ArtistActionType.successGetArtist, {artist: Artist}>
  | AppAction<ArtistActionType.failureGetArtist, {msg: string}>;

const requestGetArtistList = (): ArtistAction => ({
  type: ArtistActionType.requestGetArtistList,
});

const successGetArtistList = (list: Artist[]): ArtistAction => ({
  type: ArtistActionType.successGetArtistList,
  list,
});

const failureGetArtistList = (msg: string): ArtistAction => ({
  type: ArtistActionType.failureGetArtistList,
  msg,
});

const requestGetArtist = (): ArtistAction => ({
  type: ArtistActionType.requestGetArtist,
});

const successGetArtist = (artist: Artist): ArtistAction => ({
  type: ArtistActionType.successGetArtist,
  artist,
});

const failureGetArtist = (msg: string): ArtistAction => ({
  type: ArtistActionType.failureGetArtist,
  msg,
});

export function getArtistList(): ThunkAction<
  Promise<void>,
  State,
  null,
  ArtistAction
> {
  return dispatch => {
    dispatch(requestGetArtistList());
    return fetchArtists()
      .then(artists => {
        dispatch(successGetArtistList(artists));
      })
      .catch(err => {
        dispatch(failureGetArtistList(err));
      });
  };
}

export function getArtist(
  uid: string,
): ThunkAction<Promise<void>, State, null, ArtistAction> {
  return dispatch => {
    dispatch(requestGetArtist());
    return fetchArtist(uid)
      .then(artist => {
        if (artist === null) {
          dispatch(failureGetArtist('Not Found'));
        } else {
          dispatch(successGetArtist(artist));
        }
      })
      .catch(err => {
        dispatch(failureGetArtist(err));
      });
  };
}

export function getArtistByName(
  name: string,
): ThunkAction<Promise<void>, State, null, ArtistAction> {
  return dispatch => {
    dispatch(requestGetArtist());
    return fetchArtistByName(name)
      .then(artist => {
        if (artist === null) {
          dispatch(failureGetArtist('Not Found'));
        } else {
          dispatch(successGetArtist(artist));
        }
      })
      .catch(err => {
        dispatch(failureGetArtist(err));
      });
  };
}

/*
 * Reducer
 */
export function reducer(
  state: State = InitialState,
  action: ArtistAction,
): State {
  switch (action.type) {
    case ArtistActionType.requestGetArtistList:
      return {
        requesting: true,
        ...state,
      };
    case ArtistActionType.successGetArtistList:
      return {
        requesting: false,
        list: action.list,
      };
    case ArtistActionType.failureGetArtistList:
      return {
        requesting: false,
        list: [],
      };
    case ArtistActionType.requestGetArtist:
      return {
        requesting: true,
        ...state,
      };
    case ArtistActionType.successGetArtist:
      const newList = Array.from(state.list);
      const idx = newList.findIndex(artist => artist.uid === action.artist.uid);
      if (idx === -1) {
        newList.push(action.artist);
      } else {
        newList[idx] = action.artist;
      }
      return {
        requesting: false,
        list: newList,
      };
    case ArtistActionType.failureGetArtist:
      return {
        requesting: false,
        list: state.list,
      };
    default:
      return state;
  }
}
