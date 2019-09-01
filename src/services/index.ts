import {combineReducers, Store as ReduxStore} from 'redux';

import * as artist from './artist';
import * as login from './login';

/*
 * Store
 */
export type Store = ReduxStore<RootState, RootAction>;

/*
 * Action
 */
export type RootAction = artist.Action | login.Action;

/*
 * Reducer
 */
export const rootReducer = combineReducers({
  artist: artist.reducer,
  login: login.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;
