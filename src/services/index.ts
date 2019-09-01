import {combineReducers} from 'redux';

import {reducer as artistReducer} from './artist';
import {reducer as loginReducer} from './login';

/*
 * Reducer
 */
export const rootReducer = combineReducers({
  artist: artistReducer,
  login: loginReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
