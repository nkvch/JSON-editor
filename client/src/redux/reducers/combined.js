import { combineReducers } from "redux";
import user from './user';
import token from "./token";
import actualJson from "./actualJson";
import loading from "./loading";
import errors from "./errors";
import successes from "./successes";
import { savedJsons } from "./savedJsons";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['savedJsons', 'actualJson', 'token']
};

const reducers = combineReducers({
    user,
    token,
    actualJson,
    savedJsons,
    loading,
    errors,
    successes,
});

export default persistReducer(persistConfig, reducers);