import {ThunkAction} from 'redux-thunk';

import {Artist, fetchArtists} from 'models/artist';

/*
 * State
 */
export interface State {
  requesting: boolean;
  artists: Artist[];
}

export const InitialState = {
  requesting: false,
  artists: [],
};

/*
 * Action
 */
export type Action =
  | RequestGetArtistsAction
  | SuccessGetArtistsAction
  | FailureGetArtistsAction;

const REQUEST_GET_ARTISTS = 'artell/artist/REQUEST_GET_ARTISTS';
const SUCCESS_GET_ARTISTS = 'artell/artist/SUCCESS_GET_ARTISTS';
const FAILURE_GET_ARTISTS = 'artell/artist/FAILURE_GET_ARTISTS';

interface RequestGetArtistsAction {
  type: typeof REQUEST_GET_ARTISTS;
}

interface SuccessGetArtistsAction {
  type: typeof SUCCESS_GET_ARTISTS;
  artists: Artist[];
}

interface FailureGetArtistsAction {
  type: typeof FAILURE_GET_ARTISTS;
  msg: string;
}

function createRequestGetArtistAction(): RequestGetArtistsAction {
  return {
    type: REQUEST_GET_ARTISTS,
  };
}

function createSuccessGetArtistsAction(
  artists: Artist[],
): SuccessGetArtistsAction {
  return {
    type: SUCCESS_GET_ARTISTS,
    artists,
  };
}

function createFailureGetArtistsAction(msg: string): FailureGetArtistsAction {
  return {
    type: FAILURE_GET_ARTISTS,
    msg,
  };
}

export function getArtists(): ThunkAction<Promise<void>, State, null, Action> {
  return dispatch => {
    dispatch(createRequestGetArtistAction());
    return fetchArtists()
      .then(artists => {
        dispatch(createSuccessGetArtistsAction(artists));
      })
      .catch(err => {
        dispatch(createFailureGetArtistsAction(err));
      });
  };
}

/*
 * Reducer
 */
export function reducer(state: State = InitialState, action: Action): State {
  switch (action.type) {
    case REQUEST_GET_ARTISTS: {
      return {
        requesting: true,
        ...state,
      };
    }
    case SUCCESS_GET_ARTISTS: {
      return {
        requesting: false,
        artists: action.artists,
      };
    }
    case FAILURE_GET_ARTISTS: {
      return {
        requesting: false,
        artists: [],
      };
    }
    default:
      return state;
  }
}
