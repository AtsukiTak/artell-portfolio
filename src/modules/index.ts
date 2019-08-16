import {combineReducers} from 'redux';

import {reducer as artistReducer} from './artist';

/*
 * Reducer
 */
export const rootReducer = combineReducers({
  artist: artistReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
