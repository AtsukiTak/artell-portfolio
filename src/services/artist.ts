import {Action} from 'redux';
import {ThunkAction} from 'redux-thunk';

import {Art, ArtRepository} from 'models/art';
import {Artist, ArtistRepository} from 'models/artist';

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
  | AppAction<
      ArtistActionType.successGetArtistList,
      {list: {artist: Artist; arts: Art[]}[]}
    >
  | AppAction<ArtistActionType.failureGetArtistList, {msg: string}>
  | AppAction<ArtistActionType.requestGetArtist>
  | AppAction<ArtistActionType.successGetArtist, {artist: Artist; arts: Art[]}>
  | AppAction<ArtistActionType.failureGetArtist, {msg: string}>;

const requestGetArtistList = (): ArtistAction => ({
  type: ArtistActionType.requestGetArtistList,
});

const successGetArtistList = (
  list: {artist: Artist; arts: Art[]}[],
): ArtistAction => ({
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

const successGetArtist = (artist: Artist, arts: Art[]): ArtistAction => ({
  type: ArtistActionType.successGetArtist,
  artist,
  arts,
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
  return async dispatch => {
    dispatch(requestGetArtistList());
    const artists = await ArtistRepository.queryList();
    const list = await Promise.all(
      artists.map(async artist => {
        const arts = await ArtRepository.queryListByArtist(artist);
        return {
          artist,
          arts,
        };
      }),
    );
    dispatch(successGetArtistList(list));
  };
}

export function getArtistByName(
  name: string,
): ThunkAction<Promise<void>, State, null, ArtistAction> {
  return async dispatch => {
    dispatch(requestGetArtist());
    const artist = await ArtistRepository.queryByName(name);
    if (artist === null) {
      dispatch(failureGetArtist('Not Found'));
    } else {
      const arts = await ArtRepository.queryListByArtist(artist);
      dispatch(successGetArtist(artist, arts));
    }
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
      const idx = newList.findIndex(
        ({artist}) => artist.uid === action.artist.uid,
      );
      if (idx === -1) {
        newList.push({artist: action.artist, arts: action.arts});
      } else {
        newList[idx] = {
          artist: action.artist,
          arts: action.arts,
        };
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
