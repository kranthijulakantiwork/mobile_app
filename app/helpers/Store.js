/* @flow */

import { createStore, applyMiddleware, combineReducers } from 'redux';
import * as reducers from 'app/reducers/Index';
import { middleware } from 'app/screens/Index';
import ReduxThunk from 'redux-thunk';

const createStoreWithMiddleware = applyMiddleware(middleware, ReduxThunk)(createStore);
const reducer = combineReducers(reducers);
const store = createStoreWithMiddleware(reducer);

export default store;
