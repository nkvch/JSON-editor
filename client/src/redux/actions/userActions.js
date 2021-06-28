import UserHTTPservice from "../../services/UserHTTPservice";
import { setLoading, resetLoading } from "./loading";
import { resetJson } from "./actualJsonActions";
import { resetJsons } from "./savedJsons";
import { error } from "./error";

const setUser = (user) => {
    return {
        type: 'SET_USER',
        payload: user
    }
}

const resetUser = () => {
    return {
        type: 'RESET_USER'
    }
}

const loadUser = () => async (dispatch, getState) => {
    dispatch(setLoading());
    const token = getState().token;
    if (!token) {
        dispatch(resetJsons());
        return dispatch(resetLoading());
    };

    try {
        const res = await UserHTTPservice.loadUser(token);
        const user = res.data.user;
        dispatch(setUser(user));
    } catch (e) {
        console.log(e);
        dispatch(resetJson());
        dispatch(resetJsons());
        //dispatch(error(e));
    }
    dispatch(resetLoading());

}

export { setUser, resetUser, loadUser };