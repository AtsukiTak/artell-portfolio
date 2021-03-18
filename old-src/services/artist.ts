import { Action as ReduxAction } from "redux";
import { ThunkAction } from "redux-thunk";
import * as firebase from "firebase/app";

import { Art, ArtRepository } from "models/art";
import { Artist, ArtistRepository } from "models/artist";

/*
 * State
 */
export type ArtistArts = { artist: Artist; arts: Art[] };

export interface State {
  // mapping artist id and data.
  map: Map<string, ArtistArts | null>;
}

export const InitialState = {
  map: new Map(),
};

/*
 * Action
 */
type AppAction<T extends string, Extra extends {} = {}> = ReduxAction<T> &
  { [K in keyof Extra]: Extra[K] };

export enum ActionType {
  addArtist = "ADD_ARTIST",
  notFoundArtist = "NOT_FOUND_ARTIST",
}

export type Action =
  | AppAction<ActionType.addArtist, { artist: Artist; arts: Art[] }>
  | AppAction<ActionType.notFoundArtist, { artistId: string }>;

const addArtist = (artist: Artist, arts: Art[]): Action => ({
  type: ActionType.addArtist,
  artist,
  arts,
});

const notFoundArtist = (artistId: string): Action => ({
  type: ActionType.notFoundArtist,
  artistId,
});

export function getArtistById(
  id: string
): ThunkAction<Promise<void>, State, null, Action> {
  return async (dispatch) => {
    const artist = await new ArtistRepository(firebase.app()).queryByUid(id);
    if (artist === null) {
      dispatch(notFoundArtist(id));
    } else {
      const arts = await new ArtRepository(
        firebase.app()
      ).queryPublicListByArtist(artist);
      dispatch(addArtist(artist, arts));
    }
  };
}

/*
 * Reducer
 */
export function reducer(state: State = InitialState, action: Action): State {
  switch (action.type) {
    case ActionType.addArtist:
      return {
        map: cloneMap(state.map).set(action.artist.uid, {
          artist: action.artist,
          arts: action.arts,
        }),
      };
    case ActionType.notFoundArtist:
      return {
        map: cloneMap(state.map).set(action.artistId, null),
      };
    default:
      return state;
  }
}

function cloneMap<K, V>(map: Map<K, V>): Map<K, V> {
  return new Map(map.entries());
}
